import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    IconButton,
    Box,
    Typography,
    Button
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';

interface DialogPedidosProntosProps {
    open: boolean;
    onClose: () => void;
    pedidosProntos: PedidoResponseDTO[];
    onMarcarEntregue: (id: number) => void;
}

const DialogPedidosProntos: React.FC<DialogPedidosProntosProps> = ({
    open,
    onClose,
    pedidosProntos,
    onMarcarEntregue
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Pedidos Prontos</DialogTitle>
            <DialogContent>
                <List>
                    {pedidosProntos.map((pedido) => (
                        <ListItem key={pedido.id} secondaryAction={
                            <IconButton edge="end" color="success" onClick={() => onMarcarEntregue(pedido.id)}>
                                <CheckCircle />
                            </IconButton>
                        }>
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    Mesa {pedido.mesaNumero} - {pedido.item.nome}
                                </Typography>
                                <Typography variant="caption">
                                    {pedido.quantidade}x - {pedido.obs || 'Sem obs'}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                    {pedidosProntos.length === 0 && (
                        <Typography align="center" sx={{ mt: 2 }}>Nenhum pedido pronto.</Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogPedidosProntos;
