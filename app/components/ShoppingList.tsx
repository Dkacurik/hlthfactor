'use client';
import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Checkbox, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ClassNames } from '@emotion/react';

const initialItems = [
  { id: 1, text: '500 ml mlieka', completed: true },
  { id: 2, text: '1kg kuracie prsia', completed: false },
  { id: 3, text: '2 banány', completed: false },
];

const ShoppingList = () => {
  const [items, setItems] = useState(initialItems);

  const handleToggle = (id: number) => () => {
    setItems(items.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  return (
    <div className='w-100 rounded-full'>
      <Box sx={{ width: '100%' }} className="rounded-full">
        <Typography variant="h6" sx={{ color: 'white', marginBottom: '16px' }} className='mt-[2.5rem] text-[1.5rem]'>
          Váš nákupný zoznam
        </Typography>
        <Paper sx={{ padding: '16px'}} className='rounded-3xl'>
          <List>
            {items.map(item => (
              <ListItem key={item.id} disablePadding className='shadow-sm'>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.completed}
                    tabIndex={-1}
                    disableRipple
                    onChange={handleToggle(item.id)}
                    sx={{
                      color: '#6200ea',
                      '&.Mui-checked': {
                        color: '#6200ea',
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  onClick={handleToggle(item.id)}
                  sx={{
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? 'black.500' : 'text.primary',
                  }}
                  className='text-m cursor-pointer'
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default ShoppingList;