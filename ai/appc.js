const axios = require('axios');
 
const readline = require('readline');

async function chatWithNeuralChat(content) {
  printWithAnsiColor('\nAssistant:',34); 
  try {
 
    const response = await axios.post(
      'http://localhost:11434/api/chat',
      {
        model: 'neural-chat',
        messages: [
          { role: 'user', content: content  },
        ],
        stream: true, // Enable event streaming
      },
      {
        responseType: 'stream', // This tells Axios to treat the response as a stream
      }
    );

    response.data.on('data', (chunk) => {
      // Process each chunk of the stream
      const data = chunk.toString(); // Convert the chunk to a string
      try {
        const parsedData = JSON.parse(data);
		let msg  = parsedData.message.content;
		printWithAnsiColor(`${msg}`, 32); 
      //  console.log(parsedData.message.content); // Process the streamed JSON object
      } catch (err) {
        console.error('Failed to parse chunk:', err, data);
      }
    });

    response.data.on('end', () => {
		printWithAnsiColor(`Stream complete`, 34); 
		console.log(" ");
		askQuestion();
//      console.log('Stream complete.');
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}



function printWithAnsiColor(text, colorCode) {
  process.stdout.write(`\u001b[${colorCode}m${text}\u001b[0m`);
}

function printWithAnsiColor1(text, colorCode) {
  process.stdout.write(`\r\u001b[${colorCode}m${text}\u001b[0m`);
}

// Example with ANSI color codes
//let count = 0;
//const interval = setInterval(() => {
//  printWithAnsiColor1(`Progress: ${count++}`, 32); // 32 is green
//  if (count > 10) {
//    clearInterval(interval);
//    printWithAnsiColor1('Done!\n', 34); // 34 is blue
//  }
//}, 50);
// 31: Red
// 32: Green
// 33: Yellow
// 34: Blue
// 35: Magenta
// 36: Cyan
// 0: Reset color/style


// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
printWithAnsiColor1('Enter Your Question (type "exit" to quit):',31);

function askQuestion() {
  rl.question('Enter Your Question (type "exit" to quit):', (question) => {
    if (question.trim().toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
    }  else {
	  printWithAnsiColor1('Your Question:',34);
	  printWithAnsiColor1(question,32); 
		chatWithNeuralChat(question);
      
    }
  });
}

askQuestion();
 