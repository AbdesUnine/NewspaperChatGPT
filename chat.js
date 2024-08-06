const my_var_here = 'c2stc3ZjYWNjdC13TG5kMHJWUkRSc0RxQXVWVXpQMDhmZXdQbnZUWXpQWUYxZERXMTdHMFNhZXB1RTdUM0JsYmtGSkhkeDYwSmhUaDFxTXdMN2RZUlJnWjJFVzVZZVJpQjVkYUFLNnZKdFZySjJEbnVBQQ==';

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
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to summarize the article
async function summarizeArticle() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = "Please summarize this article.";
    const chatPrompt = "Summarize the article in your own style, focusing on these points: 60% have received at least one dose of the COVID-19 vaccine. No differences across genders or linguistics regions. Opinions are almost evenly split about vaccinating health workers, with nearly as many respondents opposing the mandate as supporting it. Solidarity has decreased and selfishness increased since the beginning of the crisis. Trust in the government has increased to over 54% after a low in January. Please do not use formatting characters such as **";

    displayMessage('You', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);
    displayMessage('NewsChat', responseMessage);
}

// Function to get key takeaways from the article
async function getKeyTakeaways() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = "Please give me the key takeaways from this article.";
    const chatPrompt = "Give the main key takeaways in numbered bullet points in your own style, focusing on these points: 60% have received at least one dose of the COVID-19 vaccine. No differences across genders or linguistics regions. Opinions are almost evenly split about vaccinating health workers, with nearly as many respondents opposing the mandate as supporting it. Solidarity has decreased and selfishness increased since the beginning of the crisis. Trust in the government has increased to over 54% after a low in January. Please do not use formatting characters such as **";

    displayMessage('You', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);
    displayMessage('NewsChat', responseMessage);
}

// Function to send a custom message
async function sendMessage() {
	
	// Check if it's the first message
    if (isFirstMessage) {
        // Display the initial prompt from the chatbot
        const initialMessage = "Hi there! I’m NewsChat, your reading assistant. This article contains a wealth of data and insights. Don't hesitate to ask me any questions you have about the data. I'm here to help you understand and navigate the information presented!";
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

    // Send the message to ChatGPT and get a response
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, userMessage);

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

