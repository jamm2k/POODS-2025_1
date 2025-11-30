import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';

interface DialogAbrirComandaProps {
    open: boolean;
    onClose: () => void;
    selectedMesa: MesaResponseDTO | null;
    nomeCliente: string;
    setNomeCliente: (nome: string) => void;
    onAbrirComanda: () => void;
}

const DialogAbrirComanda: React.FC<DialogAbrirComandaProps> = ({
    open,
    onClose,
    selectedMesa,
    nomeCliente,
    setNomeCliente,
    onAbrirComanda
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ bgcolor: '#1B5E20', color: 'white' }}>
                Abrir Mesa {selectedMesa?.numero}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
                    Informe o nome do cliente (opcional) para abrir a comanda.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome do Cliente"
                    fullWidth
                    variant="outlined"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button
                    onClick={onAbrirComanda}
                    variant="contained"
                    sx={{ bgcolor: '#1B5E20', '&:hover': { bgcolor: '#003300' } }}
                    startIcon={<AddCircle />}
                >
                    Abrir Comanda
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogAbrirComanda;
