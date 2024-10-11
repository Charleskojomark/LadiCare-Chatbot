document.getElementById("send-button").addEventListener("click", async function() {
    const userInput = document.getElementById("user-input").value;
    const chatbox = document.getElementById("messages");
    const chatbotResponseUrl = "{% url 'chatbot_response' %}"
    if (userInput) {
        // Append user message to chatbox
        chatbox.innerHTML += `<div><strong>You:</strong> ${userInput}</div>`;
        document.getElementById("user-input").value = ""; // Clear input

        try {
            // Send the message to the Django server
            const response = await fetch("chatbotResponseUrl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: `message=${encodeURIComponent(userInput)}`
            });

            if (!response.ok) {
                // Handle non-200 responses
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.message;

            // Append bot message to chatbox
            chatbox.innerHTML += `<div><strong>FeminaCare AI:</strong> ${botMessage}</div>`;

        } catch (error) {
            // Handle network or other errors
            console.error("Error:", error);
            chatbox.innerHTML += `<div><strong>Error:</strong> Unable to reach FeminaCare AI. Please check your network connection or try again later.</div>`;
        }

        // Scroll to the bottom of the chatbox
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});
