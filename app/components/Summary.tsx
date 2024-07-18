import React from 'react'
import { Context } from '../context'
import { Grid } from '@mui/material'

const Summary = () => {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  const { calories } = context

  return (
    <div className="mt-[2.5rem]">
      <h3 className="text-[1.5rem]">Vaše kalorické hodnoty</h3>
      <div className="bg-white w-100 px-[3rem] rounded-full mt-[1rem]">
        <Grid container spacing={0} className="justify-center content-center">
          <Grid item sm={6} md={3}>
            <p className="text-black text-m py-[1rem] px-[1rem]">
              Kalórie: {calories && calories.calories.toFixed(2)}
            </p>
          </Grid>
          <Grid item sm={6} md={3}>
            <p className="text-black text-m py-[1rem] px-[1rem]">
              Bielkoviny: {calories && calories.proteins.toFixed(2)}g
            </p>
          </Grid>
          <Grid item sm={6} md={3}>
            <p className="text-black text-m py-[1rem] px-[1rem]">
              Sacharidy: {calories && calories.carbs.toFixed(2)}g
            </p>
          </Grid>
          <Grid item sm={6} md={3}>
            <p className="text-black text-m py-[1rem] px-[1rem]">
              Tuky: {calories && calories.fats.toFixed(2)}g
            </p>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Summary
