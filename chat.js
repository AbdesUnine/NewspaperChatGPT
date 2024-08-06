const my_var_here = 'c2stc3ZjYWNjdC13TG5kMHJWUkRSc0RxQXVWVXpQMDhmZXdQbnZUWXpQWUYxZERXMTdHMFNhZXB1RTdUM0JsYmtGSkhkeDYwSmhUaDFxTXdMN2RZUlJnWjJFVzVZZVJpQjVkYUFLNnZKdFZySjJEbnVBQQ==';

// Function to display the typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
}

// Function to hide the typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';
}

// Function to simulate the typing dots animation
function animateTypingDots() {
    const typingDots = document.getElementById('typing-dots');
    let dotCount = 0;
    const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3
        typingDots.innerHTML = '.'.repeat(dotCount);
    }, 500); // Update every 500ms

    // Return a function to stop the animation
    return () => clearInterval(interval);
}

// Function to send messages to ChatGPT and receive responses
async function sendMessageToChatGPT(systemPrompt, articleContent, userMessage) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${atob(my_var_here)}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Article: ${articleContent}` },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error('No response choices available');
        }
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        return `Error: ${error.message}`;
    }
}

// Function to display messages and save them to chatData
function displayMessage(role, message) {
    // Save the message to chatData
    chatData.push({ role: role, content: message });

    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<strong>${role}:</strong> <p>${message}</p>`;
    chatOutput.appendChild(messageDiv);

    // Use a small timeout to ensure the DOM is updated before scrolling
    setTimeout(() => {
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}


// Function to send a custom message
async function sendMessage() {
    // Check if it's the first message
    if (isFirstMessage) {
        // Display the initial prompt from the chatbot
        const initialMessage = "Hi there! I’m NewsChat, your reading assistant. This article contains a wealth of data and insights. You can ask me any questions you have about the data, or about the article in general.";
        displayMessage('NewsChat', initialMessage);

        // Set the flag to false after the initial message is sent
        isFirstMessage = false;
        return;
    }

    // Retrieve the user input
    const userMessage = document.getElementById('message-input').value.trim();

    // Check if the input is empty and return if it is
    if (!userMessage) {
        return; // Exit the function if input is empty
    }

    // Reset system prompt and article content to initial values
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;

    // Clear the input area
    document.getElementById('message-input').value = '';

    // Display the user's message
    displayMessage('You', userMessage);

    // Show the typing indicator
    showTypingIndicator();
    const stopTypingDots = animateTypingDots();

    // Send the message to ChatGPT and get a response
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, userMessage);

    // Hide the typing indicator
    hideTypingIndicator();
    stopTypingDots();

    // Display ChatGPT's response
    displayMessage('NewsChat', responseMessage);
}

// Add event listener for Enter key
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default newline behavior
        sendMessage();
    }
});

