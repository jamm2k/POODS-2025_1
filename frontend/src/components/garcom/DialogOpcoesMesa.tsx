import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    Box
} from '@mui/material';
import { AddCircle, AccessTime, CheckCircle, Visibility } from '@mui/icons-material';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';
import { ComandaResponseDTO } from '../../dto/comanda/ComandaResponseDTO';

interface DialogOpcoesMesaProps {
    open: boolean;
    onClose: () => void;
    selectedMesa: MesaResponseDTO | null;
    openComandas: ComandaResponseDTO[];
    onAbrirComanda: () => void;
    onReservarMesa: () => void;
    onLiberarMesa: () => void;
    onVerComanda: (id: number) => void;
    onAbrirNovaComanda: () => void;
}

const DialogOpcoesMesa: React.FC<DialogOpcoesMesaProps> = ({
    open,
    onClose,
    selectedMesa,
    openComandas,
    onAbrirComanda,
    onReservarMesa,
    onLiberarMesa,
    onVerComanda,
    onAbrirNovaComanda
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ background: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)', color: 'white' }}>
                Mesa {selectedMesa?.numero}
            </DialogTitle>
            <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, py: 4 }}>

                {/* CASO 1: MESA LIVRE */}
                {selectedMesa?.status === 'LIVRE' && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<AddCircle />}
                            onClick={onAbrirComanda}
                            sx={{ bgcolor: '#1B5E20', py: 1.5 }}
                        >
                            Abrir Comanda
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AccessTime />}
                            onClick={onReservarMesa}
                            sx={{ bgcolor: '#F57F17', py: 1.5 }}
                        >
                            Reservar Mesa
                        </Button>
                    </>
                )}

                {/* CASO 2: MESA OCUPADA */}
                {selectedMesa?.status === 'OCUPADA' && (
                    <>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Comandas Abertas:
                        </Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2, maxHeight: 200, overflow: 'auto' }}>
                            {openComandas.map((comanda) => (
                                <React.Fragment key={comanda.id}>
                                    <ListItem
                                        onClick={() => onVerComanda(comanda.id)}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            mb: 1,
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: '#f5f5f5' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">{comanda.nome}</Typography>
                                                <Typography variant="caption" color="text.secondary">#{comanda.id}</Typography>
                                            </Box>
                                            <Visibility color="primary" />
                                        </Box>
                                    </ListItem>
                                </React.Fragment>
                            ))}
                            {openComandas.length === 0 && (
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Nenhuma comanda aberta encontrada.
                                </Typography>
                            )}
                        </List>

                        <Button
                            variant="contained"
                            startIcon={<AddCircle />}
                            onClick={onAbrirNovaComanda}
                            sx={{ bgcolor: '#4CAF50', py: 1.5 }}
                        >
                            Abrir Nova Comanda
                        </Button>
                    </>
                )}

                {/* CASO 3: MESA RESERVADA */}
                {selectedMesa?.status === 'RESERVADA' && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<AddCircle />}
                            onClick={onAbrirComanda}
                            sx={{ bgcolor: '#1B5E20', py: 1.5 }}
                        >
                            Abrir Comanda
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={onLiberarMesa}
                            sx={{ bgcolor: '#1B5E20', py: 1.5 }}
                        >
                            Liberar Mesa
                        </Button>
                    </>
                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogOpcoesMesa;
