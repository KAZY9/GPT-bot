import React, { useState } from 'react';
import { chat } from '../api/axios';

const ChatComponent = () => {
    const [ message, setMessage ] = useState( '' );
    const [ answer, setAnswer ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState(false); 
    
    // メッセージを更新
    const handleMessageChange = (e)  => {
        setMessage(e.target.value);
    }

    // 「質問」ボタンを押したときの処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        // chat.js にメッセージを渡して API から回答を取得
        const responseText = await chat(message);
        if (responseText){
            setAnswer(responseText);
            setIsLoading(false);
        } 
        setMessage('');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                <textarea
                    rows='5'
                    cols='50'
                    value={message}
                    onChange={handleMessageChange}
                />
                </label>
                <div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                    >質問する</button>
                </div>
            </form>
            {answer && (
                <div>
                    <h2>回答:</h2>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}
 
export default ChatComponent;