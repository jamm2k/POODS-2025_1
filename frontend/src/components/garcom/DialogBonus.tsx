import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    Typography,
    Divider
} from '@mui/material';
import { RelatorioGarcomDTO } from '../../dto/relatorio/RelatorioGarcomDTO';

interface DialogBonusProps {
    open: boolean;
    onClose: () => void;
    bonusMes: number;
    setBonusMes: (mes: number) => void;
    bonusAno: number;
    setBonusAno: (ano: number) => void;
    onBuscarBonus: () => void;
    meuBonus: RelatorioGarcomDTO | null;
}

const DialogBonus: React.FC<DialogBonusProps> = ({
    open,
    onClose,
    bonusMes,
    setBonusMes,
    bonusAno,
    setBonusAno,
    onBuscarBonus,
    meuBonus
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Consultar Bônus</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
                    <TextField
                        label="Mês"
                        type="number"
                        value={bonusMes}
                        onChange={(e) => setBonusMes(Number(e.target.value))}
                        sx={{ width: 100 }}
                    />
                    <TextField
                        label="Ano"
                        type="number"
                        value={bonusAno}
                        onChange={(e) => setBonusAno(Number(e.target.value))}
                        sx={{ width: 100 }}
                    />
                    <Button variant="contained" onClick={onBuscarBonus}>
                        Buscar
                    </Button>
                </Box>
                {meuBonus ? (
                    <Box sx={{ mt: 4, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                        <Typography variant="h6" color="success.dark">Resumo do Bônus</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography><strong>Total de Vendas:</strong> R$ {meuBonus.totalVendasPremium.toFixed(2)}</Typography>
                        <Typography variant="h5" color="success.main" sx={{ mt: 2, fontWeight: 'bold' }}>
                            Bônus: R$ {meuBonus.bonusCalculado.toFixed(2)}
                        </Typography>
                    </Box>
                ) : (
                    <Typography sx={{ mt: 4 }} color="text.secondary">
                        Nenhum bônus encontrado para o período selecionado.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogBonus;
