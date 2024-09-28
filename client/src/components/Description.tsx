import React from 'react'

interface DescriptionProps {
    text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
    return (
        <p>{text}</p>
    )
}

export default Description;