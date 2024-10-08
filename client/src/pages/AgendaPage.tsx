import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import WorkoutCard from '../components/Cards/DayCard';

interface Workout {
    task: string;
    recommendations: string[];
    checklist: string[];
}

interface DayAgenda {
    day: string;
    amWorkout: Workout;
    pmWorkout: Workout;
}

const AgendaPage: React.FC = () => {
    const [agenda, setAgenda] = useState<any>(JSON.parse(localStorage.getItem('training') || '[]'));

    const navigate = useNavigate();

    return (
        <div className="container max-w-[1080px] mx-auto py-20 flex flex-col gap-20">
            <div className="flex flex-col gap-8">
                <button className='flex gap-2 w-fit items-center opacity-75' onClick={() => navigate('/')}><IoMdArrowBack size="1rem" /> Go Back</button>
                <h1 className='font-semibold text-3xl'>Your weekly <span><mark className='bg-blue-500'>agenda</mark></span></h1>
            </div>

            <div className='grid grid-cols-3 gap-8'>
                {agenda.map((day: DayAgenda, index: number) => (
                    <WorkoutCard key={index} day={day.day} amWorkout={day.amWorkout} pmWorkout={day.pmWorkout} />
                ))}
            </div>       
        </div>
    );
};

export default AgendaPage;