import React from 'react';

interface ChatInputProps {
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, setValue, placeholder }) => {
    return (
        <textarea
            className='p-4 bg-neutral-800 flex-grow rounded-md focus:outline-none focus:border border-blue-500 resize-none h-fit'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default ChatInput;