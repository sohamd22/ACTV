import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import ChatInput from '../components/Chat/ChatInput';
import { IoMdSend, IoMdArrowBack } from "react-icons/io";


const Chat: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<any[]>([]);

    const navigate = useNavigate();

    const handleSend = async () => {
        if (prompt.trim()) {
            const token = localStorage.getItem('token');
            const data = await axios.get('http://localhost:3003/strava/activities', {headers: {Authorization: token}});
            setResponse([JSON.stringify(data)]);
            setPrompt('');
        }
    };

    return (
        <div className="container max-w-[1080px] h-screen mx-auto py-20 flex flex-col gap-20">
            <div className="flex flex-col gap-8">
                <button className='flex gap-2 w-fit items-center opacity-75' onClick={() => navigate('/')}><IoMdArrowBack size="1rem" /> Go Back</button>
                <h1 className='font-semibold text-3xl'>Ask for <span><mark className='bg-rose-500'>motivation</mark></span></h1>
            </div>
            
            <div className="flex flex-col gap-20 mt-auto w-full">
                <div>
                    { response }
                </div>

                <div className="flex w-full gap-4">
                    <ChatInput value={prompt} setValue={setPrompt} placeholder="What do you need help with?" />
                    <div className='self-end'>
                        <ActionButton onClick={handleSend} backgroundColor='bg-gradient-to-br from-blue-600 to-purple-600'>Send <IoMdSend size="1rem" /></ActionButton>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default Chat;