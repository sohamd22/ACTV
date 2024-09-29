import React from 'react'

interface DescriptionProps {
    text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
    return (
        <p className='font-light opacity-90'>{text}</p>
    )
}

export default Description;