import React from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Avatar,
    IconButton
} from '@mui/material';
import { Add, Person, Edit, Delete } from '@mui/icons-material';

interface AdminFuncionariosTabProps {
    funcionarios: any[];
    onOpenDialog: (type: 'FUNCIONARIO', item?: any) => void;
    onDelete: (type: 'FUNCIONARIO', id: number, subType?: string) => void;
    setFormData: (data: any) => void;
}

const AdminFuncionariosTab: React.FC<AdminFuncionariosTabProps> = ({ funcionarios, onOpenDialog, onDelete, setFormData }) => {
    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                    onOpenDialog('FUNCIONARIO');
                    setFormData({ tipo: 'GARCOM' });
                }}
                sx={{ mb: 2, bgcolor: '#0B5D5E' }}
            >
                Novo Funcionário
            </Button>
            <Grid container spacing={2}>
                {funcionarios.map((func) => (
                    <Grid item xs={12} sm={6} md={4} key={func.id}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#0B5D5E' }}><Person /></Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">{func.nome}</Typography>
                                    <Typography variant="caption" color="text.secondary">{func.tipo}</Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2">Email: {func.email}</Typography>
                            <Typography variant="body2">CPF: {func.cpf}</Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => onOpenDialog('FUNCIONARIO', func)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => onDelete('FUNCIONARIO', func.id, func.tipo)} size="small" color="error">
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

export default AdminFuncionariosTab;
