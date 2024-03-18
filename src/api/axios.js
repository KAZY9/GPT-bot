import axios from "axios";
 
export const chat = async ( message, chatHistory ) => {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const MODEL = 'gpt-3.5-turbo';
  const API_KEY = require('../apikey');
  
  try {
    const response = await axios.post(API_URL, {
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
    }, {
      // 送信する HTTP ヘッダー(認証情報)
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ API_KEY }`
      }
    });
    // 回答の取得
    // console.log(response.data)
    return response.data.choices[0].message.content;

  } catch ( error ) {
    console.error( error );
    return null;
  }
}