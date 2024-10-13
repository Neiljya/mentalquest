import google.generativeai as genai
import os
import json
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Set API Key
genai.configure(api_key=os.environ["API_KEY"])
# Set model to 1.5-flash
model = genai.GenerativeModel("gemini-1.5-flash")

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client['mentalquest']
collection = db['recommendations']

@app.route('/')
def home():
    return {"message": "Hello World"}  #TODO: get rid of this

# Test Message
@app.route("/members", methods=["GET", "POST", "OPTIONS"])
@cross_origin()  # CORS only for this route
def members():
    return jsonify({"members": ["member1", "member2", "member3"]})

@app.route('/insert', methods=['GET'])
def insert_data():
    data = request.json 
    collection.insert_one(data)
    return jsonify({"message": "Data inserted successfully!"})

@app.route('/test_mongo', methods=['GET'])
def test_mongo():
    try:
        # Try inserting a simple document to MongoDB
        result = collection.insert_one({"test": "connection"})
        return jsonify({"message": "Test document inserted", "id": str(result.inserted_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to generate mental health tasks and save the response to MongoDB
@app.route('/generate_tasks', methods=['GET'])
def generate_mental_health_tasks():
    try:
        # Use a fixed prompt to generate mental health tasks
        prompt = "Give me a list of small, everyday tasks that can help improve mental health."
        
        # Generate content using Gemini AI
        response = model.generate_content(prompt)
        # print(response)
        # print(f"Gemini AI Response: {response.text}")

        # Gemini response is saved under the text header
        generated_content = response.text
        
        # Save the prompt and the generated content to MongoDB
        output_data = {"prompt": prompt, "generated_content": generated_content}
        collection.insert_one(output_data)

        # with open("mental_health_tasks.json", "w") as output_file:
        #     json.dump(output_data, output_file, indent=4)
        
        # Return the generated content to the user
        return jsonify(output_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)