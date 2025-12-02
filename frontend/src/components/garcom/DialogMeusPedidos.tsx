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
    Button,
    TextField,
    Grid
} from '@mui/material';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';

interface DialogMeusPedidosProps {
    open: boolean;
    onClose: () => void;
    meusPedidos: PedidoResponseDTO[];
    mes: number;
    setMes: (mes: number) => void;
    ano: number;
    setAno: (ano: number) => void;
    onBuscar: () => void;
}

const DialogMeusPedidos: React.FC<DialogMeusPedidosProps> = ({
    open,
    onClose,
    meusPedidos,
    mes,
    setMes,
    ano,
    setAno,
    onBuscar
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Meus Pedidos</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                            <TextField
                                label="Mês"
                                type="number"
                                fullWidth
                                value={mes}
                                onChange={(e) => setMes(parseInt(e.target.value))}
                                InputProps={{ inputProps: { min: 1, max: 12 } }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Ano"
                                type="number"
                                fullWidth
                                value={ano}
                                onChange={(e) => setAno(parseInt(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={onBuscar} fullWidth>
                                Filtrar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <List>
                    {meusPedidos.map((p) => (
                        <ListItem key={p.id} divider>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Box>
                                    <Typography fontWeight="bold">{p.item.nome} (x{p.quantidade})</Typography>
                                    <Typography variant="body2">Mesa {p.mesaNumero}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(p.dataHora).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={p.status}
                                    size="small"
                                    color={p.status === 'ENTREGUE' ? 'success' : 'default'}
                                />
                            </Box>
                        </ListItem>
                    ))}
                    {meusPedidos.length === 0 && (
                        <Typography align="center" sx={{ mt: 2 }}>Nenhum pedido encontrado para este período.</Typography>
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
