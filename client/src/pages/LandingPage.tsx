import React from 'react'
import ButtonWithDescription from '../components/ButtonWithDescription'
import GIF from '../components/GIF'
import Logo from '../components/Logo'

const LandingPage = () => {
    return (
        <div className="grid grid-cols-3">
            <div className="flex flex-col items-start p-8 col-span-2">
                <Logo />
                <ButtonWithDescription 
                    buttonLabel="Button 1" 
                    descriptionText="Description 1" 
                    onButtonClick={() => console.log('Button 1 clicked')} 
                />
                <ButtonWithDescription 
                    buttonLabel="Button 2" 
                    descriptionText="Description 2" 
                    onButtonClick={() => console.log('Button 2 clicked')} 
                />
                <ButtonWithDescription 
                    buttonLabel="Button 3" 
                    descriptionText="Description 3" 
                    onButtonClick={() => console.log('Button 3 clicked')} 
                />
            </div>
            <div className="flex items-center justify-center col-span-1">
                <GIF url="" />
            </div>
        </div>
    )
}

export default LandingPage