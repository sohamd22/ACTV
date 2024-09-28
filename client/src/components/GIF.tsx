import React from 'react';

interface GIFProps {
    url: string;
}

const GIF: React.FC<GIFProps> = ({ url }) => {
    return (
        <img className='h-96 w-56 bg-neutral-400' src={url} alt="GIF" />
    );
}

export default GIF;