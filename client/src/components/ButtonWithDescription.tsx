import React from 'react';

interface ButtonWithDescriptionProps {
    label: string;
    descriptionText: string;
    onClick: () => void;
    backgroundColor: string;
    icon?: React.ReactNode;
}

const ButtonWithDescription: React.FC<ButtonWithDescriptionProps> = ({ label, descriptionText, onClick, backgroundColor, icon }) => {
    return (
        <button onClick={onClick} className={`relative flex gap-3 justify-center items-center ${backgroundColor} px-4 py-3 rounded-md transition-all hover:-translate-y-0.5`}>
            {icon ? icon : <></>}
            {label}
        </button>
    );
};

export default ButtonWithDescription;