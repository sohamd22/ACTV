import React from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonWithDescription from '../components/ButtonWithDescription'
// import Logo from '../components/Logo'
import { PiStarFourFill } from "react-icons/pi";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-no-repeat bg-cover" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/images/bg.gif')`}}>
            <div className="container max-w-[1080px] mx-auto h-screen items-center justify-center text-center flex flex-col gap-16">
                {/* <Logo /> */}
                <h1 className='font-semibold text-4xl'>Your own personal AI <mark>coach</mark></h1>
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
                        onClick={() => navigate('/agenda')} 
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
        </div>
        
    )
}

export default LandingPage