import React from "react";
import { Context } from "../context";
import {Grid} from "@mui/material";


const Summary = () => {
    const context = React.useContext(Context);

    const { calories } = context || {};
    return (
        <div className="mt-[2.5rem]">
            <h3 className="text-[1.5rem]">Vaše kalorické hodnoty</h3>
            <div className="bg-white w-100 px-[3rem] rounded-full mt-[1rem]">
                <Grid container spacing={0}>
                    <Grid item xs={6} sm={2}>
                        <p className="text-black text-m py-[1rem] px-[1rem]">Kalórie: {calories && calories.calories.toFixed(2)}</p>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <p className="text-black text-m py-[1rem] px-[1rem]">Bielkoviny: {calories && calories.proteins.toFixed(2)}g</p>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <p className="text-black text-m py-[1rem] px-[1rem]">Sacharidy: {calories && calories.carbs.toFixed(2)}g</p>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <p className="text-black text-m py-[1rem] px-[1rem]">Tuky: {calories && calories.fats.toFixed(2)}g</p>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Summary;