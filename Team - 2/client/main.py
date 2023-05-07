import openai
import streamlit as st
import requests
# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import db

#url sent by the admin
goal = "user opinion on super market"
created_at = "28.04.2023"
url = "https://surveysparrowtechnocrats.web.app/form?theme=${goal}&created_at=${created_at}"


def get_location():
    try:
        # Get IP address
        ip_request = requests.get('https://get.geojs.io/v1/ip.json')
        my_ip = ip_request.json()['ip']
        # Get location
        geo_request_url = f'https://get.geojs.io/v1/ip/geo/{my_ip}.json'
        geo_request = requests.get(geo_request_url)
        geo_data = geo_request.json()
        return geo_data['city']
    except:
        return None

# # Initialize Firebase app and database
# cred = credentials.Certificate("C:\\Users\\sharo\\Downloads\\surveysparrowtechnocrats-firebase-adminsdk-aiho2-340c511650.json")
# firebase_admin.initialize_app(cred, {
#     'databaseURL': 'https://surveysparrowtechnocrats-default-rtdb.firebaseio.com/'
# })
# ref = db.reference()


# Define function to generate questions from OpenAI
def generate_question(prompt, temperature=0.5):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        temperature=1.0,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    question = response.choices[0].text.strip()
    return question


# # Define function to ask a question and collect user response
# def ask_question(question):
#     st.write(question)
#     response=""
#     response = st.text_input("Your answer:")
#     return response



def ask_question(question):
    st.write(question)
    response=""
    response = st.text_input("Your answer:", key=question)
    if st.button("next"):
        response = response.strip()
        st.empty()
    return response


# Set up OpenAI API key
openai.api_key = "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"
response=""
question=""
prompt=""
num_questions=1

# Set up Streamlit app
st.title(f"SurveySparrow \n {goal}")

# Collect user's name, age, location, and goal for the survey
name = st.text_input("Name:")
age = st.text_input("Age:")
location = get_location()
if location:
    st.write(f"Detected location: {location}")

# Ask first question based on user's responses
if name and age:
    prompt += f"Give one personalized question based on {goal} and should not have similar meaning to previous question (no repetitive question)"
    question = generate_question(prompt)
    response = ask_question(question)

