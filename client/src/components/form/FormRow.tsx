import React from 'react';
import { Grid } from '@mui/material';

interface FormRowProps {
    children: React.ReactNode;
}

/**
 * Grid row for form layouts
 */
function FormRow({ children }: FormRowProps) {
    return (
        <Grid item xs={12}>
            {children}
        </Grid>
    );
}

export default FormRow;

