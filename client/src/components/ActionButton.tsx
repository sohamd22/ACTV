import React from 'react'

interface ActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    backgroundColor: string;
    textColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick, backgroundColor, textColor }) => {
    return (
        <button onClick={onClick} className={`${backgroundColor || "bg-neutral-800"} ${textColor || "text-white"} font-medium w-fit h-fit py-2 px-4 flex gap-2 rounded-md items-center`}>
            { children }
        </button>
    )
}

export default ActionButton;