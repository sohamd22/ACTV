import React from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonWithDescription from '../components/ButtonWithDescription'
import GIF from '../components/GIF'
import Logo from '../components/Logo'
import { PiStarFourFill } from "react-icons/pi";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container max-w-[1080px] mx-auto h-screen items-center justify-center text-center flex flex-col gap-16" style={{backgroundImage: `url('')`}}>
            {/* <Logo /> */}
            <h1 className='font-semibold text-4xl'>Use your AI coach for <mark>motivation</mark></h1>
            <div className="flex gap-8">
                <ButtonWithDescription 
                    label="Coach Chat" 
                    descriptionText="Your own personal AI coach to help you reach your fitness goals and generate weekly agendas all based on details of your life." 
                    onClick={() => navigate('/chat')} 
                    backgroundColor='bg-rose-600'
                    icon={<PiStarFourFill size="1.25rem" className="absolute -right-2.5 -top-2.5" />}
                />
                <ButtonWithDescription 
                    label="Weekly Agenda" 
                    descriptionText="View your weekly schedules, plan for every day with checklists, and reach your goals." 
                    onClick={() => console.log('Button 2 clicked')} 
                    backgroundColor='bg-blue-600'
                />
                <ButtonWithDescription 
                    label="My Meals" 
                    descriptionText="Get meal plans based on your nutrition requirements, health stats, and dietary restrictions." 
                    onClick={() => navigate('/meals')} 
                    backgroundColor='bg-lime-600'
                />
            </div>
        </div>
    )
}

export default LandingPage