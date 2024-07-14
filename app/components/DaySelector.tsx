'use client'
import React, {useState, MouseEvent} from 'react';
import Stack from '@mui/material/Stack';
import ButtonPill from './ButtonPill';

interface DaySelectorProps {
    activeDay: string;
    activeDayHandler: (day: string) => void;
}

const DaySelector = ({activeDay, activeDayHandler}: DaySelectorProps) => {
    const days = ['1', '2', '3', '4', '5']

    const handleClick = (day: string) => (event: MouseEvent<HTMLButtonElement>) => {
        activeDayHandler(day);
      };
    return (
        <div>
            <h2 className='mt-[2.5rem] text-l'>Naplánujte si jednotlivé dni</h2>
            <Stack direction={{sm: 'row', xs: 'column'}} spacing={2} className='mt-[1.5rem]'>
                {days.map((day) => (
                    <ButtonPill state={day === activeDay ? 'active' : 'inactive'} key={day} onClick={handleClick(day)}>{day}. DEŇ</ButtonPill>
                ))}
            </Stack>
        </div>
  );

}

export default DaySelector;