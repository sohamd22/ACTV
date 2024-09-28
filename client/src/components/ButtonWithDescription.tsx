import React from 'react';
import ActionButton from './ActionButton';
import Description from './Description';

interface ButtonWithDescriptionProps {
    buttonLabel: string;
    descriptionText: string;
    onButtonClick: () => void;
}

const ButtonWithDescription: React.FC<ButtonWithDescriptionProps> = ({ buttonLabel, descriptionText, onButtonClick }) => {
    return (
        <div className='flex flex-col'>
            <ActionButton onClick={onButtonClick} label={buttonLabel} />
            <Description text={descriptionText} />
        </div>
    );
};

export default ButtonWithDescription;