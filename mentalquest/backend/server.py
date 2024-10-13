import google.generativeai as genai
import os
import json
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set API Key
genai.configure(api_key=os.environ["GEMINI_KEY"])
# Set model to 1.5-flash
model = genai.GenerativeModel("gemini-1.5-flash")

# MongoDB Connection
mongo_uri = os.getenv("DB_URI")
client = MongoClient(mongo_uri)
db = client['mentalquest']
goals = db['goals']

@app.route('/')
def home():
    return {"message": "Hello World"}  #TODO: get rid of this

@app.route('/insert', methods=['GET', 'POST'])
def insert_data():
    if request.method == 'POST':
        # Get prompt from JSON body
        data = request.json
        user_input = data.get('user_input')  # Extract prompt from request JSON
        prompt = data.get('prompt')

        if user_input:
            # Create the data structure
            user_data = {"Prompt": prompt,"User Input": user_input}
            goals.insert_one(user_data)
            return jsonify({"message": "Data inserted successfully!"})
        else:
            return jsonify({"error": "No prompt provided!"}), 400
    else:
        return jsonify({"message": "Use POST method to insert data."}), 405

@app.route('/test_mongo', methods=['GET'])
def test_mongo():
    try:
        # Try inserting a simple document to MongoDB
        result = goals.insert_one({"test": "connection"})
        return jsonify({"message": "Test document inserted", "id": str(result.inserted_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to generate mental health tasks and save the response to MongoDB
@app.route('/generate_tasks', methods=['GET', 'POST'])
def generate_mental_health_tasks(prompt):
    try:
        # Use a fixed prompt to generate mental health tasks
        # prompt = "Give me a list of small, everyday tasks that can help improve mental health."
        
        # Generate content using Gemini AI
        response = model.generate_content(prompt)

        # Gemini response is saved under the text header
        generated_content = response.text
        
        # Save the prompt and the generated content to MongoDB
        output_data = {"prompt": prompt, "generated_content": generated_content}
        goals.insert_one(output_data)

        # Optionally save it to a local JSON file
        with open("mental_health_tasks.json", "w") as output_file:
            json.dump(output_data, output_file, indent=4)
        
        # Return the generated content to the user
        return jsonify(output_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
