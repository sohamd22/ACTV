import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import MealCard from '../components/Cards/MealCard';

const MealsPage: React.FC = () => {
    const [meals, setMeals] = useState<any>(JSON.parse(localStorage.getItem('meals') || '[]'));

    const navigate = useNavigate();

    return (
        <div className="container max-w-[1080px] mx-auto py-20 flex flex-col gap-20">
            <div className="flex flex-col gap-8">
                <button className='flex gap-2 w-fit items-center opacity-75' onClick={() => navigate('/')}><IoMdArrowBack size="1rem" /> Go Back</button>
                <h1 className='font-semibold text-3xl'>Your saved <span><mark className='bg-lime-500'>meals</mark></span></h1>
            </div>

            <div className='grid grid-cols-3 gap-8'>
                {meals.map((meal: any, index: number) => (
                    <MealCard key={index} name={meal.name} recipe={meal.recipe} macros={meal.macros} imageUrl={meal.imageUrl} ingredients={meal.ingredients} />
                ))}
            </div>       
        </div>
    );
};

export default MealsPage;