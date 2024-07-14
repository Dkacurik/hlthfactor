import React from "react";
import { Context } from "../context";


const Summary = () => {
    const calories = React.useContext(Context);
    return (
        <div className="mt-[2.5rem]">
            <h3 className="text-[1.5rem]">Vaše kalorické hodnoty</h3>
            <div className="bg-white w-100 rounded-full mt-[1rem]">
                <p className="text-black text-m py-[1rem] px-[1rem]">Kcal = {calories && calories.calories.calories.toFixed(2)}, {calories && calories.calories.proteins.toFixed(2)}g bielkoviny, {calories && calories.calories.carbs.toFixed(2)}g sacharidy, {calories && calories.calories.fats.toFixed(2)}g tuky
                </p>
            </div>
        </div>
    )
}

export default Summary;