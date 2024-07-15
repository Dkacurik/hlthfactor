'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import Typography from '@mui/material/Typography';
import MealOption from './MealOption';
import { Context } from '../context';
import { ConfirmedMeals, MealCategory } from '../types';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

interface MealSelectorProps {
  day: string
}

export default function CustomizedAccordions({day}: MealSelectorProps) {
  const meals = ['Raňajky', 'Desiata', 'Obed', 'Olovrant', 'Večera']
  const [expanded, setExpanded] = React.useState<string | false>('');
  const [confirmed, setConfirmed] = React.useState<string[]>([]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
      setConfirmed([])
    };
    const context = React.useContext(Context);
    if (!context) {
      throw new Error('MealSelector must be used within a Context.Provider');
    }

    const {confirmedMeals} = context

    React.useEffect(() => {
      confirmedMeals.meals.forEach((meal) => {
        setExpanded(`panel-${meal.day}-${meal.mealCategory}`);
        setConfirmed((prev) => [...prev, `panel-${meal.day}-${meal.mealCategory}`]);
      });
    }, [confirmedMeals]);
  return (
    <div className='mt-[2.5rem]'>
        <h1>{confirmed}</h1>
        {meals.map((meal, idx) => (
            <Accordion expanded={expanded === `panel-${day}-${meal}`} onChange={handleChange(`panel-${day}-${meal}`)} className='bg-transparent border-0' key={`panel-${day}-${meal}`}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className={expanded === `panel-${day}-${meal}` ? 'text-black' : 'text-white'}/>}  aria-controls="panel1d-content" id="panel1d-header" className={expanded === `panel-${day}-${meal}` ? 'bg-primary text-black rounded-t-3xl' : confirmed.some((panel) => panel === `panel-${day}-${meal}`) ? 'bg-white text-black' : 'bg-secondary text-white rounded-3xl'}>
              <Typography className='text-[1.250rem]'>{meal}</Typography>
            </AccordionSummary>
            <AccordionDetails className={expanded === `panel-${day}-${meal}` ? `bg-white text-black rounded-b-3xl mb-[1rem]`: 'bg-white'}>
              <MealOption day={day} mealCategory={MealCategory[meal as keyof typeof MealCategory]} expanded={expanded}/>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}