import React from 'react';

interface GIFProps {
    url: string;
}

const GIF: React.FC<GIFProps> = ({ url }) => {
    return (
        <img className='h-full w-full bg-neutral-800' src={url} alt="GIF" />
    );
}

export default GIF;