import React from 'react';

interface MealCardProps {
    name: string;
    recipe: string[];
    macros: object;
    ingredients: string[];
    imageUrl: string;
}

const MealCard: React.FC<MealCardProps> = ({ name, recipe, macros, imageUrl, ingredients }) => {
    return (
        <div className='h-full rounded-md overflow-hidden'>
            <img src={imageUrl} alt={name} className="h-52 w-full object-cover bg-neutral-800" />

            <div className="p-4 bg-neutral-900 flex flex-col gap-4">
                <h2 className="font-semibold text-lg">{name}</h2>

                <ul className='flex flex-col gap-1'>
                    {Object.entries(macros).map(([key, value]) => (
                        <li key={key}>
                            - <strong>{key}</strong>: {value} 
                        </li>
                    ))}
                </ul>
                <hr className="opacity-60"/>
                <ul className='flex flex-col gap-1'>
                    <h3>Recipe</h3>
                    {recipe.map((step, index) => (
                        <li key={index}>
                            - {step}
                        </li>
                    ))}
                </ul>
                <hr className="opacity-60"/>
                <ul className='flex flex-col gap-1'>
                    {ingredients.map((item, index) => (
                    <li key={index} className='flex items-center'>
                        <input type="checkbox" className='mr-2' />
                        {item}
                    </li>
                    ))}
                </ul>
            </div>
        </div>        
    );
}

export default MealCard;