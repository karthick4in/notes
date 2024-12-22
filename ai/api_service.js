const fetch = require('node-fetch');
const axios = require('axios');

const ollamaUrl = 'http://localhost:11434/api/chat';
const userApiUrl = 'http://localhost:3000/api/users';

// Function to interact with Ollama neural-chat
async function askOllama(query) {
  const response = await fetch(ollamaUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'neural-chat',
      messages: [{ role: 'user', content: query }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text;
}

// Function to create a user via your API
async function createUser(name, email) {
  try {
    const response = await axios.post(userApiUrl, { name, email });
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Failed to create user:', error.response?.data || error.message);
  }
}

// Main flow: Get user details from neural-chat and create a user
async function main() {
  try {
    const userPrompt = 'Create a new user with the name Alice and email alice@example.com.';
    const apiPayload = await askOllama(userPrompt);

    console.log('Ollama response:', apiPayload); // Should contain user details

    // Parse the response (example assumes a simple structured response)
    const { name, email } = JSON.parse(apiPayload); // Adjust based on Ollama's response structure
    await createUser(name, email);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
