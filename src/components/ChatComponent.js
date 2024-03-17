import React, { useState, useRef, useEffect } from 'react';
import ReactMarkDown from 'react-markdown';
import { chat } from '../api/axios';
import styled from 'styled-components';

const Button = styled.button`
        background-color: lightgray;
        width: 80px;
        height: 30px;
        border: 1px solid gray;
        border-radius: 50px;
        z-index: 9999;
        &:hover {
            background-color: rgb(100, 100, 100, 0.3);
            color: white;
        }
`;

const ChatBox = styled.textarea`
    width: 70%;
    height: 200px;
    border-radius: 5px;
    z-index: 9999;
`;

const ButtonArea = styled.div`
    margin: 10px auto;
    margin-bottom: 20px;
`;

const TextArea = styled.div`
    text-align: left;
    background-color: white;
    width: 70%;
    margin: 5px auto;
    padding: 0 7px;
    border: 1px lightgray solid;
    border-radius: 7px;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    z-index: 9999;
`;

const Line = styled.hr`
    border: 1px dotted gray;
    width: 72%;
    z-index: 9999;
`;

const Label = styled.h3`
    margin: 3px 0px;
`;

const Sentence = styled.p`
    margin: 5px 0px;
`;

const Element = styled.div`
    margin: 50px auto;
    text-align: center;
    padding: 20px 0;
`;

const ChatComponent = () => {
    const [ message, setMessage ] = useState('');
    const [ chatHistory, setChatHistory ] = useState([]); 
    const [ isLoading, setIsLoading ] = useState(false);
    const [ warning, setWarning ] = useState('');

    const chatWindow = useRef(null);
    useEffect(() => {
        if(chatWindow.current) {
            const { scrollHeight } = chatWindow.current;
            chatWindow.current.scrollTop = scrollHeight
        }
    });

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
        try {
            const responseText = await chat(message, chatHistory);
            const newHistory = chatHistory.concat({message: message, answer: responseText});
            setChatHistory(newHistory);
            setMessage('');
            setIsLoading(false);
        } catch (error) {
            setWarning('エラーが発生しました。')
        }  
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <Element>
            <form onSubmit={handleSubmit}>
                <ChatBox
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                />
                <ButtonArea>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >質問する
                    </Button>
                </ButtonArea>
            </form>
            {warning}
            <Line />
            <div ref={chatWindow} style={{ overflowY: 'auto', height: '400px' }}>
            {chatHistory.map(({message, answer}, index) => (
                <React.Fragment key={index}>
                    <TextArea>
                        <Label>質問:</Label>
                        <Sentence>{message}</Sentence>
                    </TextArea>
                    <TextArea>
                        <Label>回答:</Label>
                        <Sentence><ReactMarkDown>{answer}</ReactMarkDown></Sentence>
                    </TextArea>
                </React.Fragment>
            ))}
            </div>
        </Element>
    );
}
 
export default ChatComponent;