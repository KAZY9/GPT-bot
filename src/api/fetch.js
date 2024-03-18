export const chat_fetch = async ( message, chatHistory, setChatHistory, setIsLoading ) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const MODEL = 'gpt-3.5-turbo';
    const API_KEY = require('../apikey');    

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        'role': 'system',
                        'content': '次の会話の文脈でユーザーからの質問に回答してください。' 
                      },
                      ...chatHistory.flatMap(({ message, answer }) => [
                        { 'role': 'user', 'content': message },
                        { 'role': 'assistant', 'content': answer }
                    ]),
                    {
                      'role': 'user',
                      'content': message,
                    }
                ],
                stream: true
            })
        });

        const reader = response.body.getReader();
        const textDecoder = new TextDecoder('utf-8');
        let buffer = "";
        let completeAnswer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += textDecoder.decode(value, { stream: true });

            while (true) {
                const newlineIndex = buffer.indexOf("\n");
                if (newlineIndex === -1) break;

                const line = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 1);

                if (line.startsWith("data:") && !line.includes("[DONE]")) {
                    try {
                        const jsonData = JSON.parse(line.slice(5));
                        if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                            completeAnswer += jsonData.choices[0].delta.content;
                            const newHistory = chatHistory.concat({message: message, answer: completeAnswer});
                            setChatHistory(newHistory);
                        }
                        setIsLoading(false);
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
};