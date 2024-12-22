import fetch from 'node-fetch';

async function askOllama(query) {
	console.log({query});
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'neural-chat',
      messages: [{ role: 'user', content: query }],
    }),
  });

  const data = await response.json();
  console.log(data);
}

askOllama('Create a new user with the name Alice and email alice@example.com.');
