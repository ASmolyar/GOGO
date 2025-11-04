import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import COLORS from '../../assets/colors';

interface PrimaryButtonProps extends ButtonProps {
    children: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * Primary styled button component
 */
function PrimaryButton({ children, fullWidth, ...props }: PrimaryButtonProps) {
    return (
        <Button
            variant="contained"
            fullWidth={fullWidth}
            sx={{
                bgcolor: COLORS.gogo_blue,
                '&:hover': {
                    bgcolor: '#0066cc',
                },
                ...props.sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
}

export default PrimaryButton;

