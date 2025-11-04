import React from 'react';
import { Grid } from '@mui/material';

interface FormColProps {
    children: React.ReactNode;
    xs?: number | 'auto';
    sm?: number | 'auto';
    md?: number | 'auto';
}

/**
 * Grid column for form layouts
 */
function FormCol({ children, xs = 12, sm = 8, md = 6 }: FormColProps) {
    return (
        <Grid item xs={xs} sm={sm} md={md}>
            {children}
        </Grid>
    );
}

export default FormCol;

