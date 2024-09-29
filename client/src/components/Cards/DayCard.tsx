import React from 'react';

interface Workout {
  task: string;
  recommendations: string[];
  checklist: string[];
}

interface DayCardProps {
  day: string;
  amWorkout: Workout;
  pmWorkout: Workout;
}

const DayCard: React.FC<DayCardProps> = ({ day, amWorkout, pmWorkout }) => {
  const renderWorkout = (workout: Workout, timeOfDay: string) => (
    <div className='p-4 bg-neutral-900 flex flex-col gap-4 rounded-md'>
      <h2 className="font-semibold text-lg">{timeOfDay} Workout: {workout.task}</h2>
      <ul className='flex flex-col gap-1'>
        {workout.recommendations.map((item, index) => (
          <li key={index}>- {item}</li>
        ))}
      </ul>
      <h3 className="font-semibold">Checklist:</h3>
      <ul className='flex flex-col gap-1'>
        {workout.checklist.map((item, index) => (
          <li key={index} className='flex items-center'>
            <input type="checkbox" className='mr-2' />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className='h-full rounded-md overflow-hidden flex flex-col gap-4'>
      <h1 className='text-2xl font-bold p-4'>{day}</h1>
      {renderWorkout(amWorkout, 'AM')}
      {renderWorkout(pmWorkout, 'PM')}
    </div>
  );
}

export default DayCard;