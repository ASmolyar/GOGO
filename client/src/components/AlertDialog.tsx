import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface AlertDialogProps {
    showAlert: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

/**
 * Alert dialog component for displaying errors or messages
 */
function AlertDialog({ showAlert, title, message, onClose }: AlertDialogProps) {
    return (
        <Dialog open={showAlert} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;

