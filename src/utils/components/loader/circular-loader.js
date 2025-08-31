import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function (props) {
    return (
        <CircularProgress
            sx={{ color: "#FFFFFF" }} // Directly setting color here
            {...props}
        />
    );
}
