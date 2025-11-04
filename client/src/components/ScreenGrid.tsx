import React from 'react';
import { Grid, Container } from '@mui/material';

interface ScreenGridProps {
    children: React.ReactNode;
}

/**
 * A full-screen grid container for page layouts
 */
function ScreenGrid({ children }: ScreenGridProps) {
    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                backgroundColor: '#121212',
            }}
        >
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                {children}
            </Grid>
        </Container>
    );
}

export default ScreenGrid;

