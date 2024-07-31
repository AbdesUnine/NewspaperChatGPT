async function sendMessageToChatGPT(systemPrompt, articleContent, userMessage) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-None-3AzkkmqhiqCL8Gn7m3bGT3BlbkFJqvj5P2OMTeAp3QyuLW6w`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
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

function displayMessage(role, message) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<strong>${role}:</strong> <p>${message}</p>`;
    chatOutput.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

async function summarizeArticle() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = "Please summarize this article.";
    const chatPrompt = "Please summarize this article.";

    displayMessage('You', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);
    displayMessage('NewsChat', responseMessage);
}

async function getKeyTakeaways() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = "Please give me the key takeaways from this article.";
    const chatPrompt = "Give me the main key takeaways from this article in numbered bullet points.";

    displayMessage('You', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);
    displayMessage('NewsChat', responseMessage);
}

async function sendMessage() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = document.getElementById('message-input').value;

    displayMessage('You', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, userMessage);
    displayMessage('NewsChat', responseMessage);

    // Clear the input area
    document.getElementById('message-input').value = '';
}

// Add event listener for Enter key
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
