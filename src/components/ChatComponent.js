import React, { useState } from 'react';
import { chat } from '../api/axios';
import styled from 'styled-components';

const Button = styled.button`
        background-color: lightgray;
        width: 80px;
        height: 30px;
        border: 1px solid gray;
        border-radius: 50px;
    `;

const TextArea = styled.textarea`
    width: 500px;
    height: 200px;
    border-radius: 5px;
`;

const ButtonArea = styled.div`
    margin: 5px auto;
`;

const Element = styled.div`
    margin: 50px auto;
    text-align: center;
    padding: 20px 0;
`;

const ChatComponent = () => {
    const [ message, setMessage ] = useState('');
    const [ answer, setAnswer ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ warning, setWarning ] = useState('');

    // メッセージを更新
    const handleMessageChange = (e)  => {
        setMessage(e.target.value);
    }

    // 「質問」ボタンを押したときの処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(message === '') {
            setWarning('質問を入力してください。');
            return;
        }
        setIsLoading(true);
        setWarning('');
    
        // chat.js にメッセージを渡して API から回答を取得
        const responseText = await chat(message);
        if (responseText){
            setAnswer(responseText);
            setIsLoading(false);
        } 
        setMessage('');
    }

    return (
        <Element>
            <form onSubmit={handleSubmit}>
                <label>
                <TextArea
                    value={message}
                    onChange={handleMessageChange}
                />
                </label>
                <ButtonArea>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >質問する
                    </Button>
                </ButtonArea>
            </form>
            {warning}
            {answer && (
                <div>
                    <h2>回答:</h2>
                    <p>{answer}</p>
                </div>
            )}
        </Element>
    );
}
 
export default ChatComponent;