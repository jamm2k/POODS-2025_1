import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

interface StaffMember {
    id: number;
    nome: string;
    status: string;
}

interface SecaoStatusProps {
    titulo: string;
    itens: StaffMember[];
    gradient?: string;
}

const SecaoStatus: React.FC<SecaoStatusProps> = ({
    titulo,
    itens,
    gradient = 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)'
}) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 3,
                background: gradient,
                color: 'white',
                borderRadius: 3,
            }}
        >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {titulo}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {itens.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        <Avatar sx={{ bgcolor: item.status === 'LIVRE' ? '#4CAF50' : '#FFA726' }}>
                            <Person />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {item.nome}
                            </Typography>
                            <Typography variant="caption">
                                {item.status === 'LIVRE' ? '🟢 Livre' : '🟠 Ocupado'}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default SecaoStatus;
