// Define the API URL and your Hugging Face API token
const apiUrl = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B";
const apiToken = "hf_token";

// Define the conversation input
const conversation = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Can you explain the theory of relativity?" },
  { role: "assistant", content: "Sure! The theory of relativity, developed by Einstein, has two main parts: special relativity and general relativity." }
];

// Format the input for the model
const inputMessage = conversation
  .map((msg) => `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msg.content}`)
  .join("\n") + "\nUser: Can you provide more details about general relativity?";

// Send a POST request to the Hugging Face API
async function fetchModelResponse() {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: inputMessage })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
 
    if (result.error && result.error.includes("loading")) {
      console.log(`Model is loading. Estimated time: ${result.estimated_time || "unknown"} seconds.`);
    } else {
      console.log(result[0].generated_text)
      // console.log("Response from the model:", result);
    }
  } catch (error) {
    console.error("Error fetching the model response:", error);
  }
}

// Call the function
fetchModelResponse();
