import React from 'react';
import { Grid } from '@mui/material';

interface FormGridProps {
    children: React.ReactNode;
}

/**
 * Grid container for forms
 */
function FormGrid({ children }: FormGridProps) {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            {children}
        </Grid>
    );
}

export default FormGrid;

