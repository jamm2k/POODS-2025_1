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
    Box,
    Divider,
    Chip
} from '@mui/material';
import { AddCircle, Receipt } from '@mui/icons-material';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';

interface DialogVerComandaProps {
    open: boolean;
    onClose: () => void;
    selectedMesa: MesaResponseDTO | null;
    comandaNome: string | undefined;
    comandaPedidos: PedidoResponseDTO[];
    onAdicionarPedidos: () => void;
    onFecharComanda: () => void;
}

const DialogVerComanda: React.FC<DialogVerComandaProps> = ({
    open,
    onClose,
    selectedMesa,
    comandaNome,
    comandaPedidos,
    onAdicionarPedidos,
    onFecharComanda
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ background: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)', color: 'white' }}>
                Comanda - Mesa {selectedMesa?.numero} {comandaNome ? `- ${comandaNome}` : ''}
            </DialogTitle>
            <DialogContent sx={{ mt: 2, p: 0 }}>
                {!Array.isArray(comandaPedidos) || comandaPedidos.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">Nenhum pedido realizado nesta comanda.</Typography>
                    </Box>
                ) : (
                    <List>
                        {comandaPedidos.map((pedido) => (
                            <React.Fragment key={pedido.id}>
                                <ListItem>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Box>
                                            <Typography variant="body1">{pedido.item?.nome || 'Item removido'}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {pedido.item?.categoria || ''}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">Qtd: {pedido.quantidade}</Typography>
                                            <Chip
                                                label={pedido.status}
                                                size="small"
                                                color={pedido.status === 'PRONTO' ? 'success' : 'default'}
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                    </Box>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Voltar
                </Button>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 220 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircle />}
                        onClick={onAdicionarPedidos}
                        sx={{ bgcolor: '#4CAF50', width: '100%' }}
                    >
                        Adicionar Itens
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Receipt />}
                        onClick={onFecharComanda}
                        sx={{ bgcolor: '#D32F2F', width: '100%' }}
                    >
                        Fechar Comanda
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DialogVerComanda;
