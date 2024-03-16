export const fetch = async () => {
    const API_URL = 'https://api.openai.com/v1/';
    const MODEL = 'gpt-3.5-turbo';
    const API_KEY='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';    

    try {
        const response = await fetch(API_URL + 'chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`
            },
            method: 'POST',
            body: JSON.stringify({
                messages: [],
                model: MODEL,
                stream: true
            })
        });

        const reader = response.body.getReader();
        const textDecoder = new TextDecoder();
        let buffer = "";

        while(true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += textDecoder.decode(value, { stream: true });

            while (true) {
                const newlineIndex = buffer.indexOf("\n");
                if (newlineIndex === -1) break;
    
                const line = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 1);
    
                if (line.startsWith("data:")) {
                  const jsonData = JSON.parse(line.slice(5));
                  if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                    const assistantMessage = jsonData.choices[0].delta.content;
                    setChatHistory((prevHistory) => [...prevHistory, assistantMessage]);
                    if (line.includes("[DONE]")) {
                      setIsLoading(false);
                      return;
                    }
                  }
                }
            }

        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
    
};