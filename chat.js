// Function to send messages to ChatGPT and receive responses
async function sendMessageToChatGPT(systemPrompt, articleContent, userMessage) {
    if (!openAiApiKey) {
        console.error('API key not available');
        return 'Error: API key not available';
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Article: ${articleContent}` },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 150
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
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = document.getElementById('message-input').value;
    
    // Clear the input area
    document.getElementById('message-input').value = '';

    displayMessage('You', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, userMessage);
    displayMessage('NewsChat', responseMessage);
}

// Add event listener for Enter key
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default newline behavior
        sendMessage();
    }
});

