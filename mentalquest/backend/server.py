import google.generativeai as genai
import os
import json
import re
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set API Key
genai.configure(api_key=os.environ["GEMINI_KEY"])

# MongoDB Connection
mongo_uri = os.getenv("DB_URI")
client = MongoClient(mongo_uri)
db = client['mentalquest']
conversations_collection = db['conversations']

# Separate database or collection for tasks
# or use client['mentalquest'] if you prefer the same database
tasks_db = client['mentalquest_tasks']
tasks_collection = tasks_db['tasks']

defaultSysInstructions = r"You are a personal therapist whose goal is to talk to a user suffering with mental health issues to diagnose their needs. You will be diagnosing them after an initial conversation. Do not overwhelm the user."
default_safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE",
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
]

default_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

##########################################################
################### THERAPIST BOT ########################
##########################################################


class TherapistBot:
    def __init__(self, history=None, system_instruction=defaultSysInstructions, safety_settings=default_safety_settings, generation_config=default_config):
        if history is None:
            history = []
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            safety_settings=safety_settings,
            generation_config=generation_config,
            system_instruction=system_instruction
        )
        self.chat_session = self.model.start_chat(history=history)

    def generate_content(self, user_input, update_history=True):
        response = self.chat_session.send_message(user_input)
        model_response = response.text
        if update_history:
            self.chat_session.history.append(
                {"role": "user", "parts": [user_input]})
            self.chat_session.history.append(
                {"role": "model", "parts": [model_response]})
        return model_response

    def generate_tasks(self):
        prompt = r"Generate both interactive and achievable tasks as well as slightly more difficult, proactive tasks for relatively more experience points. These tasks will be used in a web app where the patient earns XP for completing tasks daily and levels up. Return the tasks in a JSON array with the format [{\"title\": String, \"xp_reward\": Int, \"completed\": Boolean (default false)}] and say nothing else. Generate an amount such that all of them can be completed in a day. Make sure the experience point rewards are multiples of 5. These tasks should be specific to the situation of the user."
        return self.generate_content(prompt, update_history=False)

##########################################################
##########################################################
###########################################################


bot = TherapistBot()


@app.route('/')
def home():
    return jsonify({"message": "Server is running"})

# Handle conversations with the bot


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get('user_input', '')

        # generate response
        bot_response = bot.generate_content(user_input)

        # save the conversation to MongoDB
        conversation_entry = {
            "user_input": user_input,
            "bot_response": bot_response
        }
        conversations_collection.insert_one(conversation_entry)

        # return the bot response to the frontend
        return jsonify({"bot_response": bot_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate_tasks', methods=['POST'])
def generate_mental_health_tasks():
    try:
        # eenerate tasks using the bot's method
        generated_tasks_str = bot.generate_tasks()

        # extract JSON from the AI's response
        json_pattern = r'\[.*\]'
        match = re.search(json_pattern, generated_tasks_str, re.DOTALL)
        if match:
            tasks_json_str = match.group()
            tasks_list = json.loads(tasks_json_str)
        else:
            return jsonify({"error": "Failed to extract JSON from AI response"}), 500

        # add default 'completed' field if missing and assign unique IDs
        for index, task in enumerate(tasks_list):
            task.setdefault('completed', False)
            task['id'] = index  # Assign a unique ID

        # save the generated tasks to the separate database or collection
        result = tasks_collection.insert_many(tasks_list)

        # update tasks_list with '_id' fields as strings
        for task, oid in zip(tasks_list, result.inserted_ids):
            task['_id'] = str(oid)

        # return the generated tasks to the frontend
        return jsonify({"generated_tasks": tasks_list})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
