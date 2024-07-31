async function sendMessageToChatGPT(systemPrompt, articleContent, userMessage) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-svcacct-rS9UPl1476p8kYX7uXsNT3BlbkFJwYZ47DwAMONme0lfvLzm`
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
	const chatPrompt = "Please summarize this article."

    displayMessage('User', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);
    displayMessage('ChatGPT', responseMessage);
}

async function getKeyTakeaways() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = "Please give me the keytaways from this article.";
	const chatPrompt = "Give me the main key takeaways from this article in numbered bullet points."

    displayMessage('User', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, chatPrompt);
    displayMessage('ChatGPT', responseMessage);
}

async function sendMessage() {
    systemPrompt = initialSystemPrompt;
    articleContent = initialArticleContent;
    const userMessage = document.getElementById('message-input').value;

    displayMessage('User', userMessage);
    const responseMessage = await sendMessageToChatGPT(systemPrompt, articleContent, userMessage);
    displayMessage('ChatGPT', responseMessage);
}
