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
import { ItemResponseDTO } from '../../dto/item/ItemResponseDTO';

interface AdminItensTabProps {
    itens: ItemResponseDTO[];
    onOpenDialog: (type: 'ITEM', item?: any) => void;
    onDelete: (type: 'ITEM', id: number) => void;
}

const AdminItensTab: React.FC<AdminItensTabProps> = ({ itens, onOpenDialog, onDelete }) => {
    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => onOpenDialog('ITEM')}
                sx={{ mb: 2, bgcolor: '#0B5D5E' }}
            >
                Novo Item
            </Button>
            <Grid container spacing={2}>
                {itens.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">{item.nome}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Chip label={item.categoria} size="small" />
                                <Chip label={item.tipo} size="small" color="primary" variant="outlined" />
                                <Chip label={`R$ ${item.preco.toFixed(2)}`} size="small" variant="outlined" />
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => onOpenDialog('ITEM', item)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => onDelete('ITEM', item.id)} size="small" color="error">
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

export default AdminItensTab;
