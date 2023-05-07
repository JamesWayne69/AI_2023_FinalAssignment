const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const accountSid = 'YOUR_TWILIO_SID';
const authToken = 'YOUR_TWILIO_API_KEY';
const client = require('twilio')(accountSid, authToken);

const { Configuration, OpenAIApi } = require("openai");
const scheduler = require('node-schedule');

const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
  });
  
  const openai = new OpenAIApi(configuration);
  
  const pool = mysql.createPool({
	host:"localhost",
	user:"root",
	password:"ayano@104",
	database:"AI_assignment"
  });

const app = express();
const PORT = 3000;

async function generate_prompts() {
	try {
	  var prompt = null;
	  var gen = null;
	  if (age > 60) {
		  gen = "Boomer"
	  }
	  else if (age > 30 && age < 60) {
		  gen = "Millennials ";
	  }
	  else if (age >20 && age < 30) {
		gen = "Gen Z";
	  } 
	  else {
		gen = "Gen Z Teenager"
	  }
	  prompt = "Tell me an interesting fact regarding India";
	  const response = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [{"role": "assistant", "content": prompt}],
		max_tokens: 200,
		temperature: 0.6,
	  });
  
	  const message = response.data.choices[0].message.content;
	  console.log(message);
	  return message;
	} catch (error) {
	  //return "There was an issue on the server",
	  return Promise.reject(error);
	}
  }

  app.post('/send-whatsapp-message',async (req,res)=>{
  
	const prompt = await generate_prompts();
	console.log(prompt);
	const message = await client.messages.create({
	  body: prompt,
	  from: 'whatsapp:+14155238886',
	  to: 'whatsapp:+919445528537'
	})
	.then(message => console.log(message.sid))
	.catch((error) => console.error(error))
	.finally(() => {
	  res.send('Message sent successfully!');
	});
  });
  

app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running,and App is listening on port "+ PORT)
	else
		console.log("Error occurred, server can't start", error);
	}
);
