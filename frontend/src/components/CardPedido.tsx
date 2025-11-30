import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Button,
    Paper,
} from '@mui/material';
import {
    Restaurant,
    LocalBar,
    PlayArrow,
    CheckCircle,
    Icecream,
} from '@mui/icons-material';
import { PedidoResponseDTO } from '../dto/pedido/PedidoResponseDTO';
import Timer from './Timer';

interface CardPedidoProps {
    pedido: PedidoResponseDTO;
    tipo: 'PENDENTE' | 'EM_PREPARO';
    aoMudarStatus: (id: number) => void;
    nomeResponsavel?: string;
    ehBar?: boolean;
}

const CardPedido: React.FC<CardPedidoProps> = ({
    pedido,
    tipo,
    aoMudarStatus,
    nomeResponsavel,
    ehBar = false,
}) => {
    let Icon = ehBar ? LocalBar : Restaurant;
    if (pedido.item.categoria === 'SOBREMESA') {
        Icon = Icecream;
    }

    const mainColor = ehBar ? '#006064' : '#0E7575';
    const secondaryColor = ehBar ? '#00838F' : '#0B5D5E';
    const warningColor = '#FFA726';
    const errorColor = '#EF5350';

    const borderColor = tipo === 'PENDENTE' ? errorColor : warningColor;
    const iconColor = tipo === 'PENDENTE' ? mainColor : warningColor;

    return (
        <Card
            sx={{
                border: `3px solid ${borderColor}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 25px ${tipo === 'PENDENTE' ? 'rgba(239, 83, 80, 0.4)' : 'rgba(255, 167, 38, 0.4)'}`,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Mesa {pedido.mesaNumero}, Comanda #{pedido.comandaId}
                    </Typography>
                    <Chip
                        label={tipo.replace('_', ' ')}
                        color={tipo === 'PENDENTE' ? 'error' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Icon sx={{ fontSize: 40, color: iconColor }} />
                    <Typography variant="h5" fontWeight="bold">
                        {pedido.item.nome}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Timer dataHora={pedido.dataHora} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                        label={pedido.item.categoria}
                        size="small"
                        sx={{
                            bgcolor: secondaryColor,
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    />
                    <Chip label={`Qtd: ${pedido.quantidade}`} size="small" variant="outlined" />
                </Box>

                {pedido.obs && (
                    <Paper
                        sx={{
                            p: 1.5,
                            mb: 2,
                            bgcolor: '#FFF3E0',
                            borderLeft: '4px solid #FFA726',
                        }}
                    >
                        <Typography variant="caption" fontWeight="bold" display="block">
                            Observação:
                        </Typography>
                        <Typography variant="body2">{pedido.obs}</Typography>
                    </Paper>
                )}

                <Box sx={{ mt: 'auto' }}>
                    {tipo === 'EM_PREPARO' && nomeResponsavel && (
                        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                            Responsável: {nomeResponsavel}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color={tipo === 'PENDENTE' ? 'primary' : 'success'}
                        startIcon={tipo === 'PENDENTE' ? <PlayArrow /> : <CheckCircle />}
                        fullWidth
                        onClick={() => aoMudarStatus(pedido.id)}
                        sx={{
                            background: tipo === 'PENDENTE'
                                ? `linear-gradient(135deg, ${secondaryColor} 0%, ${mainColor} 100%)`
                                : undefined,
                            fontWeight: 'bold',
                            py: 1.2,
                            '&:hover': tipo === 'PENDENTE' ? {
                                background: `linear-gradient(135deg, #094d4e 0%, #0c6464 100%)`,
                            } : undefined,
                        }}
                    >
                        {tipo === 'PENDENTE' ? 'Iniciar Preparo' : 'Marcar como Pronto'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CardPedido;
