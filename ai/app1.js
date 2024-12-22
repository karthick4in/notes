const fetch = require("node-fetch");

const url = "http://localhost:11434/api/chat";
const payload = {
  model: "neural-chat",
  messages: [
    {
      role: "user",
      content: "Can you help me draft an email to my team?",
    },
  ],
  stream: true, // Enable event streaming
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
};

async function interactWithModel() {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    console.log("Streaming response:");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      processChunk(chunk); // Process each chunk of data
    }

    console.log("Stream complete.");
  } catch (error) {
    console.error("Error:", error);
  }
}

function processChunk(chunk) {
  // Parse and display the chunk data
  try {
    const parsedData = JSON.parse(chunk);
    console.log(parsedData); // Handle streamed JSON objects
  } catch (err) {
    console.error("Failed to parse chunk:", err, chunk);
  }
}

// Invoke the function
interactWithModel();
