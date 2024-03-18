export const chat_fetch = async ( message, chatHistory, setChatHistory, setIsLoading ) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const MODEL = 'gpt-3.5-turbo';
    const API_KEY = require('../apikey');

    const requestBody = {
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
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
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
                const newlineIndex = buffer.indexOf("\n"); //改行コードの位置を取得
                if (newlineIndex === -1) break;

                const line = buffer.slice(0, newlineIndex); //改行コードの位置までの要素を取り出す。
                buffer = buffer.slice(newlineIndex + 1); //line要素以降の要素だけ取り出す。

                if (line.startsWith("data:") && !line.includes("[DONE]")) {
                    try {
                        const jsonData = JSON.parse(line.slice(5)); // 5文字目（インデックス4の文字）以降の文章をオブジェクト化
                        if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                            completeAnswer += jsonData.choices[0].delta.content;
                            const newChatHistory = chatHistory.concat({message: message, answer: completeAnswer});
                            setChatHistory(newChatHistory);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }
        setIsLoading(false);
    } catch (error) {
        console.log('Error fetching data:', error);
        setIsLoading(false);
    }
};