import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    Box,
    Typography,
    Chip,
    Button
} from '@mui/material';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';

interface DialogMeusPedidosProps {
    open: boolean;
    onClose: () => void;
    meusPedidos: PedidoResponseDTO[];
}

const DialogMeusPedidos: React.FC<DialogMeusPedidosProps> = ({
    open,
    onClose,
    meusPedidos
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Meus Pedidos</DialogTitle>
            <DialogContent>
                <List>
                    {meusPedidos.map((p) => (
                        <ListItem key={p.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Box>
                                    <Typography fontWeight="bold">{p.item.nome}</Typography>
                                    <Typography variant="caption">Mesa {p.mesaNumero}</Typography>
                                </Box>
                                <Chip label={p.status} size="small" />
                            </Box>
                        </ListItem>
                    ))}
                    {meusPedidos.length === 0 && (
                        <Typography align="center" sx={{ mt: 2 }}>Nenhum pedido encontrado.</Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogMeusPedidos;
