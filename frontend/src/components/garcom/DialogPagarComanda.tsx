import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    FormControlLabel,
    Switch,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';

interface DialogPagarComandaProps {
    open: boolean;
    onClose: () => void;
    comandaId: number | null;
    pedidos: PedidoResponseDTO[];
    onConfirmarPagamento: (comandaId: number, incluirTaxa: boolean) => void;
}

const DialogPagarComanda: React.FC<DialogPagarComandaProps> = ({
    open,
    onClose,
    comandaId,
    pedidos,
    onConfirmarPagamento
}) => {
    const [incluirTaxa, setIncluirTaxa] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (open) {
            const novoSubtotal = pedidos.reduce((acc, pedido) => {
                return acc + (pedido.item?.preco || 0) * pedido.quantidade;
            }, 0);
            setSubtotal(novoSubtotal);
            setIncluirTaxa(true); // Reset to true when opening
        }
    }, [open, pedidos]);

    useEffect(() => {
        const taxa = incluirTaxa ? subtotal * 0.1 : 0;
        setTotal(subtotal + taxa);
    }, [subtotal, incluirTaxa]);

    const handleConfirmar = () => {
        if (comandaId) {
            onConfirmarPagamento(comandaId, incluirTaxa);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ bgcolor: '#004D40', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney /> Pagamento da Comanda
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Resumo do Consumo</Typography>
                <List dense>
                    {pedidos.map((pedido) => (
                        <ListItem key={pedido.id}>
                            <ListItemText
                                primary={`${pedido.quantidade}x ${pedido.item?.nome}`}
                                secondary={`R$ ${(pedido.item?.preco || 0).toFixed(2)} un.`}
                            />
                            <Typography variant="body2">
                                R$ {((pedido.item?.preco || 0) * pedido.quantidade).toFixed(2)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">Subtotal:</Typography>
                    <Typography variant="subtitle1">R$ {subtotal.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={incluirTaxa}
                                onChange={(e) => setIncluirTaxa(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Taxa de Serviço (10%)"
                    />
                    <Typography variant="body1" color={incluirTaxa ? 'text.primary' : 'text.disabled'}>
                        R$ {(subtotal * 0.1).toFixed(2)}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="h5" fontWeight="bold">Total:</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        R$ {total.toFixed(2)}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button
                    onClick={handleConfirmar}
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<AttachMoney />}
                >
                    Confirmar Pagamento
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogPagarComanda;
