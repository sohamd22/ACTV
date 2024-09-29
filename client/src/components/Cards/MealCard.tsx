import React from 'react';

interface MealCardProps {
    name: string;
    recipe: string[];
    nutrition: string[];
    imageUrl: string;
}

const MealCard: React.FC<MealCardProps> = ({ name, recipe, nutrition, imageUrl }) => {
    return (
        <div className='h-full rounded-md overflow-hidden'>
            <img src={imageUrl} alt={name} className="h-24 bg-neutral-800" />

            <div className="p-4 bg-neutral-900 flex flex-col gap-4">
                <h2 className="font-semibold text-lg">{name}</h2>

                <ul className='flex flex-col gap-1'>
                    {nutrition.map((item, index) => (
                        <li key={index}>- {item}</li>
                    ))}
                </ul>
            </div>
        </div>        
    );
}

export default MealCard;