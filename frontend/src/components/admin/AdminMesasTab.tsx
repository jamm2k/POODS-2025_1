import React from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Chip,
    IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';

interface AdminMesasTabProps {
    mesas: MesaResponseDTO[];
    onOpenDialog: (type: 'MESA', item?: any) => void;
    onDelete: (type: 'MESA', id: number) => void;
}

const AdminMesasTab: React.FC<AdminMesasTabProps> = ({ mesas, onOpenDialog, onDelete }) => {
    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => onOpenDialog('MESA')}
                sx={{ mb: 2, bgcolor: '#0B5D5E' }}
            >
                Nova Mesa
            </Button>
            <Grid container spacing={2}>
                {mesas.map((mesa) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={mesa.id}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6">Mesa {mesa.numero}</Typography>
                                <Typography variant="body2" color="text.secondary">Capacidade: {mesa.capacidade || 4}</Typography>
                                <Chip
                                    label={mesa.status}
                                    color={mesa.status === 'LIVRE' ? 'success' : 'error'}
                                    size="small"
                                />
                            </Box>
                            <Box>
                                <IconButton onClick={() => onOpenDialog('MESA', mesa)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => onDelete('MESA', mesa.id)} size="small" color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminMesasTab;
