import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Paper,
    Box,
    Typography,
    IconButton,
    TextField,
    Button
} from '@mui/material';
import { Remove, Add, Send } from '@mui/icons-material';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';
import { ItemResponseDTO } from '../../dto/item/ItemResponseDTO';

interface PedidoCreate {
    itemId: number;
    quantidade: number;
    obs: string;
}

interface DialogAdicionarPedidosProps {
    open: boolean;
    onClose: () => void;
    selectedMesa: MesaResponseDTO | null;
    menuItems: ItemResponseDTO[];
    novosItensPedido: { [key: number]: PedidoCreate };
    onAlterarQuantidade: (itemId: number, delta: number) => void;
    onAlterarObs: (itemId: number, obs: string) => void;
    onEnviarPedidos: () => void;
}

const DialogAdicionarPedidos: React.FC<DialogAdicionarPedidosProps> = ({
    open,
    onClose,
    selectedMesa,
    menuItems,
    novosItensPedido,
    onAlterarQuantidade,
    onAlterarObs,
    onEnviarPedidos
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ bgcolor: '#4CAF50', color: 'white' }}>
                Adicionar Pedidos - Mesa {selectedMesa?.numero}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    {menuItems.map((item) => {
                        const currentQty = novosItensPedido[item.id]?.quantidade || 0;
                        return (
                            <Grid item xs={12} sm={6} key={item.id}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography fontWeight="bold">{item.nome}</Typography>
                                        <Typography color="primary" fontWeight="bold">R$ {item.preco.toFixed(2)}</Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">{item.categoria}</Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton size="small" onClick={() => onAlterarQuantidade(item.id, -1)} disabled={currentQty === 0}>
                                                <Remove />
                                            </IconButton>
                                            <Typography fontWeight="bold">{currentQty}</Typography>
                                            <IconButton size="small" onClick={() => onAlterarQuantidade(item.id, 1)}>
                                                <Add />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {currentQty > 0 && (
                                        <TextField
                                            size="small"
                                            placeholder="Observações:"
                                            fullWidth
                                            value={novosItensPedido[item.id]?.obs || ''}
                                            onChange={(e) => onAlterarObs(item.id, e.target.value)}
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button
                    onClick={onEnviarPedidos}
                    variant="contained"
                    color="success"
                    startIcon={<Send />}
                >
                    Enviar Pedidos
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogAdicionarPedidos;
