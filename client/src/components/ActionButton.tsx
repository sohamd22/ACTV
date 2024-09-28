import React from 'react'

interface ActionButtonProps {
    onClick: () => void;
    label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label }) => {
    return (
        <button 
            onClick={onClick} 
            className="bg-white text-white font-bold py-2 px-4 rounded"
        >
            { label }
        </button>
    )
}

export default ActionButton;