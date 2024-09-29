import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import ChatInput from '../components/Chat/ChatInput';
import DayCard from '../components/Cards/DayCard';
import MealCard from '../components/Cards/MealCard';
import { IoMdSend, IoMdArrowBack } from "react-icons/io";


const Chat: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<any[]>([]);

    const navigate = useNavigate();
    
    const functions: any = {
        createTrainingPlan: (args: any): any => {
            const trainingPlan = args.trainingPlan;
            const message = args.message;
            setResponse([<div>
                { trainingPlan.map((day: any, index: number) => <DayCard key={index} day={day.day} amWorkout={day.am} pmWorkout={day.pm} />) }
            </div>, message]);
        },
        createMealPlan: (args: any): any => {
            console.log(args);
            const mealPlans = args.mealPlans;
            const message = args.message;
            setResponse([
                <div>
                    {mealPlans.map((meal: any, index: number) => <MealCard key={index} name={meal.mealName} ingredients={meal.ingredients} recipe={meal.recipe} macros={meal.macros} imageUrl={meal.imageUrl} />)}
                </div>
                , message]);
        }
    }

    const handleSend = async () => {
        if (prompt.trim()) {
            const username = localStorage.getItem('username');
            let data = (await axios.post('http://localhost:3003/chat', {username, message: prompt})).data;
            
            if(data.length) {
                data = data[0];
            }
            console.log(data);
            if (data?.name in functions) {
                functions[data.name](data.args);
            }
            else if (data) {
                setResponse([<p key={0}>{data.args.message}</p>]);
            }
            setPrompt('');
        }
    };

    return (
        <div className="container max-w-[1080px] h-screen mx-auto py-20 flex flex-col gap-20">
            <div className="flex flex-col gap-8">
                <button className='flex gap-2 w-fit items-center opacity-75' onClick={() => navigate('/')}><IoMdArrowBack size="1rem" /> Go Back</button>
                <h1 className='font-semibold text-3xl'>Ask for <span><mark className='bg-rose-500'>motivation</mark></span></h1>
            </div>
            
            <div className="flex flex-col gap-8 mt-auto w-full">
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