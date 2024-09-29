import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import ChatInput from '../components/Chat/ChatInput';
import DayCard from '../components/Cards/DayCard';
import MealCard from '../components/Cards/MealCard';
import { IoMdSend, IoMdArrowBack } from "react-icons/io";
import { IoMdCheckmark } from 'react-icons/io';


const Chat: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<any[]>([]);
    const [approved, setApproved] = useState<boolean | null>(null);

    const navigate = useNavigate();
    
    const functions: any = {
        createTrainingPlan: (args: any): any => {
            setApproved(false);
            const trainingPlan = args.trainingPlan;
            const message = args.message;
            setResponse([<div key={0} className='grid grid-cols-3 gap-8'>
                { trainingPlan.map((day: any, index: number) => <DayCard key={index} day={day.day} amWorkout={day.am} pmWorkout={day.pm} />) }
            </div>, <p className="text-lg" key={1}>{message}</p>, 'training', trainingPlan.map((day: any) => ({day: day.day, amWorkout: day.am, pmWorkout: day.pm}))]);
        },
        createMealPlan: (args: any): any => {
            setApproved(false);
            console.log(args);
            const mealPlans = args.mealPlans;
            const message = args.message;
            setResponse([
                <div key={0} className='grid grid-cols-3 gap-8'>
                    {mealPlans.map((meal: any, index: number) => <MealCard key={index} name={meal.mealName} ingredients={meal.ingredients} recipe={meal.recipe} macros={meal.macros} imageUrl={meal.imageUrl} />)}
                </div>
                , <p className="text-lg" key={1}>{message}</p>, "meals", mealPlans.map((meal: any) => ({name: meal.mealName, ingredients: meal.ingredients, recipe: meal.recipe, macros: meal.macros, imageUrl: meal.imageUrl}))]);
        }
    }

    const handleSend = async () => {
        if (prompt.trim()) {
            const username = localStorage.getItem('username');
            let data = (await axios.post('http://localhost:3003/chat', {username, message: prompt})).data;
            
            if(data.length) {
                data = data[0];
            }
            if (data?.name in functions) {
                functions[data.name](data.args);
            }
            else if (data) {
                setResponse([<p key={0}>{data.args.message}</p>]);
            }
            setPrompt('');
        }
    };

    const approve = async (name: string, data: any) => {
        setApproved(true);
        if(name==="meals") {
            localStorage.setItem("meals", JSON.stringify(data));
        }
        else if (name==="training") {
            localStorage.setItem("training", JSON.stringify(data));
        }
    }

    return (
        <div className="container max-w-[1080px] mx-auto min-h-screen py-20 flex flex-col gap-20">
            <div className="flex flex-col gap-8">
                <button className='flex gap-2 w-fit items-center opacity-75' onClick={() => navigate('/')}><IoMdArrowBack size="1rem" /> Go Back</button>
                <h1 className='font-semibold text-3xl'>Ask for <span><mark className='bg-rose-500'>guidance</mark></span></h1>
            </div>
            
            <div className="flex flex-col gap-8 mt-auto w-full">
                <div className='flex flex-col gap-8'>
                    { response.slice(0,2) }
                    { approved !== null && (!approved ? <button onClick={() => approve(response[2], response[3])} className='w-fit text-lime-500 flex gap-2 justify-center items-center'>Save {response[2]} <IoMdCheckmark /></button> : <p className='text-lime-500'>Saved!</p>) }
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