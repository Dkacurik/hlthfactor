import React from "react";
import { Button } from "@mui/material";

interface PrimaryButtonProps {
    title: string;
    type: string;
    handleSave: () => void;
}

const PrimaryButton = ({title, type, handleSave}: PrimaryButtonProps) => {
    return <Button
    className={"bg-primary text-black text-m font-semibold rounded-full "+ `btn-${type}` + (type === 'lg' ? ' py-[1.5rem] px-[4rem] hover:bg-white' : type === 'md' ? ' py-[1rem] px-[3rem] hover:bg-secondary hover:text-white' : 'py-[1rem] px-[2rem]')} onClick={handleSave}>
        {title}
    </Button>
}

export default PrimaryButton;