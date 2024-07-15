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
import { ConfirmedMeals } from '../types';

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

enum MealCategory {
  Raňajky = 'BREAKFAST',
  Desiata = 'SNACK',
  Olovrant = 'SNACK',
  Obed = 'LUNCH',
  Večera = 'DINNER',

}


export default function CustomizedAccordions({day}: MealSelectorProps) {
    const meals = ['Raňajky', 'Desiata', 'Obed', 'Olovrant', 'Večera']
  const [expanded, setExpanded] = React.useState<string | false>('');
  // const {confirmedMeals} = React.useContext(Context);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
    const context = React.useContext(Context);
    if (!context) {
      throw new Error('MealSelector must be used within a Context.Provider');
    }

    const {confirmedMeals} = context

  return (
    <div className='mt-[2.5rem]'>
      
        {meals.map((meal, idx) => (
            <Accordion expanded={expanded === 'panel' + idx} onChange={handleChange('panel' + idx)} className='bg-transparent border-0' key={idx}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className={expanded === `panel${idx}` ? 'text-black' : 'text-white'}/>}  aria-controls="panel1d-content" id="panel1d-header" className={expanded === 'panel' + idx ? 'bg-primary text-black rounded-t-3xl' : 'bg-secondary text-white rounded-3xl'}>
              <Typography className='text-[1.250rem]'>{meal}</Typography>
            </AccordionSummary>
            <AccordionDetails className={expanded === `panel${idx}` ? `bg-white text-black rounded-b-3xl mb-[1rem]`: 'bg-white'}>
              <MealOption day={day} mealCategory={MealCategory[meal as keyof typeof MealCategory]}/>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}