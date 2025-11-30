import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Divider,
    CircularProgress,
    Button
} from '@mui/material';
import { GarcomResponseDTO } from '../../dto/garcom/GarcomResponseDTO';
import { RelatorioGarcomDTO } from '../../dto/relatorio/RelatorioGarcomDTO';

interface DialogPerfilProps {
    open: boolean;
    onClose: () => void;
    dadosPerfil: GarcomResponseDTO | null;
    meuBonus: RelatorioGarcomDTO | null;
}

const DialogPerfil: React.FC<DialogPerfilProps> = ({
    open,
    onClose,
    dadosPerfil,
    meuBonus
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Meu Perfil</DialogTitle>
            <DialogContent>
                {dadosPerfil ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography><strong>Nome:</strong> {dadosPerfil.nome}</Typography>
                        <Typography><strong>Email:</strong> {dadosPerfil.email}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Bônus Atual</Typography>
                        {meuBonus ? (
                            <Box>
                                <Typography>Mês: {meuBonus.mes}/{meuBonus.ano}</Typography>
                                <Typography><strong>Total de Vendas:</strong> R$ {meuBonus.totalVendasPremium.toFixed(2)}</Typography>
                                <Typography variant="h5" color="success.main" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    Bônus: R$ {meuBonus.bonusCalculado.toFixed(2)}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography>Sem dados de bônus para este mês.</Typography>
                        )}
                    </Box>
                ) : (
                    <CircularProgress />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogPerfil;
