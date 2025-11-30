import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LegendaStatus: React.FC = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                bgcolor: 'transparent'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#C8E6C9', border: '1px solid #1B5E20' }} />
                <Typography variant="body2" fontWeight="bold" color="text.secondary">Livre</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#FFCDD2', border: '1px solid #B71C1C' }} />
                <Typography variant="body2" fontWeight="bold" color="text.secondary">Ocupada</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#FFF9C4', border: '1px solid #F57F17' }} />
                <Typography variant="body2" fontWeight="bold" color="text.secondary">Reservada</Typography>
            </Box>
        </Paper>
    );
};

export default LegendaStatus;
