import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { People } from '@mui/icons-material';
import { MesaResponseDTO } from '../dto/mesa/MesaResponseDTO';

interface CardMesaProps {
    mesa: MesaResponseDTO;
    aoClicar: (mesa: MesaResponseDTO) => void;
}

const CardMesa: React.FC<CardMesaProps> = ({ mesa, aoClicar }) => {
    const getStatusStyles = (status: string) => {
        const s = status ? status.toUpperCase() : '';
        switch (s) {
            case 'LIVRE': return { bgcolor: '#C8E6C9', color: '#1B5E20' };
            case 'OCUPADA': return { bgcolor: '#FFCDD2', color: '#B71C1C' };
            case 'RESERVADA': return { bgcolor: '#FFF9C4', color: '#F57F17' };
            default: return { bgcolor: '#E0E0E0', color: '#616161' };
        }
    };

    const styles = getStatusStyles(mesa.status);

    return (
        <Grid item xs={4} sm={3} md={2}>
            <Paper
                elevation={3}
                onClick={() => aoClicar(mesa)}
                sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    bgcolor: styles.bgcolor,
                    color: styles.color,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    '&:active': { transform: 'scale(0.96)' },
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.1)'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        {mesa.numero}
                    </Typography>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.9,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            borderRadius: 1,
                            px: 0.5,
                            py: 0.2
                        }}
                    >
                        <People sx={{ fontSize: 12, mr: 0.5 }} />
                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                            {mesa.capacidade || 4}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
};

export default CardMesa;
