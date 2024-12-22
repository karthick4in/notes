const axios = require('axios');

async function handleUserRequest(userMessage) {
  const response = await interactWithNeuralChat(userMessage);
  const content = response?.choices[0]?.message?.content;

  console.log('Model Response:', content);

  if (content.includes('create a book')) {
    const bookDetails = await collectMissingData(content);
    if (bookDetails) {
      await createBook(bookDetails);
    }
  } else if (content.includes('search for a book')) {
    const query = extractSearchQuery(content);
    const searchResults = await searchBooks(query);
    console.log('Search Results:', searchResults);
  } else {
    console.log('No actionable command found.');
  }
}

async function collectMissingData(content) {
  const requiredFields = ['title', 'author', 'content'];
  const bookDetails = extractBookDetails(content);

  for (const field of requiredFields) {
    if (!bookDetails[field]) {
      bookDetails[field] = await askUserForData(`Missing ${field}. Please provide:`);
    }
  }

  return bookDetails;
}

function extractBookDetails(content) {
  const titleMatch = content.match(/titled '(.*?)'/);
  const authorMatch = content.match(/by '(.*?)'/);
  const contentMatch = content.match(/content '(.*?)'/);

  return {
    title: titleMatch ? titleMatch[1] : null,
    author: authorMatch ? authorMatch[1] : null,
    content: contentMatch ? contentMatch[1] : null,
  };
}

async function askUserForData(prompt) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
async function createBook(bookDetails) {
  try {
    const response = await axios.post('http://localhost:3002/api/books', bookDetails);
    console.log('Book Created:', response.data);
  } catch (error) {
    console.error('Error creating book:', error.response?.data || error.message);
  }
}

async function searchBooks(query) {
  try {
    const response = await axios.get('http://localhost:3002/api/books/search', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error.response?.data || error.message);
    return [];
  }
}
async function interactWithNeuralChat(userMessage) {
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'neural-chat',
      messages: [{ role: 'user', content: userMessage }],
    });
    return response.data;
  } catch (error) {
    console.error('Error interacting with neural-chat:', error.response?.data || error.message);
    return null;
  }
}

handleUserRequest("Create a book titled 'Focus' by 'John Maxwell'")
