import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Avatar,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    TableRestaurant,
    People,
    RestaurantMenu,
    Add,
    Edit,
    Delete,
    Person,
    AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService, { Mesa, Funcionario, Item } from '../../services/adminService';

const drawerWidth = 240;

const DashboardAdmin: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [itens, setItens] = useState<Item[]>([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'MESA' | 'FUNCIONARIO' | 'ITEM'>('MESA');
    const [editingItem, setEditingItem] = useState<any>(null);

    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 0) {
                const data = await adminService.getMesas();
                setMesas(data);
            } else if (activeTab === 1) {
                const [garcons, cozinheiros, barmen] = await Promise.all([
                    adminService.getGarcons(),
                    adminService.getCozinheiros(),
                    adminService.getBarmen(),
                ]);
                setFuncionarios([...garcons, ...cozinheiros, ...barmen]);
            } else if (activeTab === 2) {
                const data = await adminService.getItens();
                setItens(data);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenDialog = (type: 'MESA' | 'FUNCIONARIO' | 'ITEM', item?: any) => {
        setDialogType(type);
        setEditingItem(item);
        setFormData(item || {});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleSave = async () => {
        try {
            if (dialogType === 'MESA') {
                if (editingItem) {
                    await adminService.updateMesaNumero(editingItem.id, formData.numero);
                } else {
                    await adminService.createMesa(formData.numero);
                }
            } else if (dialogType === 'FUNCIONARIO') {
                if (editingItem) {
                    await adminService.updateFuncionario(formData.tipo, editingItem.id, formData);
                } else {
                    await adminService.createFuncionario(formData.tipo, formData);
                }
            } else if (dialogType === 'ITEM') {
                if (editingItem) {
                    await adminService.updateItem(editingItem.id, formData);
                } else {
                    await adminService.createItem(formData);
                }
            }
            handleCloseDialog();
            loadData();
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Erro ao salvar. Verifique os dados.';
            alert(errorMessage);
        }
    };

    const handleDelete = async (type: 'MESA' | 'FUNCIONARIO' | 'ITEM', id: number, subType?: string) => {
        if (!window.confirm('Tem certeza que deseja excluir?')) return;
        try {
            if (type === 'MESA') await adminService.deleteMesa(id);
            else if (type === 'FUNCIONARIO') await adminService.deleteFuncionario(subType!, id);
            else if (type === 'ITEM') await adminService.deleteItem(id);
            loadData();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir.');
        }
    };

    const renderMesas = () => (
        <Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog('MESA')}
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
                                <Chip
                                    label={mesa.status}
                                    color={mesa.status === 'LIVRE' ? 'success' : 'error'}
                                    size="small"
                                />
                            </Box>
                            <Box>
                                <IconButton onClick={() => handleOpenDialog('MESA', mesa)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete('MESA', mesa.id)} size="small" color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderFuncionarios = () => (
        <Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                    handleOpenDialog('FUNCIONARIO');
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
                                <IconButton onClick={() => handleOpenDialog('FUNCIONARIO', func)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete('FUNCIONARIO', func.id, func.tipo)} size="small" color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderItens = () => (
        <Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog('ITEM')}
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
                                <IconButton onClick={() => handleOpenDialog('ITEM', item)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete('ITEM', item.id)} size="small" color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)' }}>
                <Toolbar>
                    <AdminPanelSettings sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Administração
                    </Typography>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem disabled>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">
                                    {user?.nome || 'Admin'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} fontSize="small" />
                            Sair
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', mt: 8 },
                }}
            >
                <List>
                    <ListItem button selected={activeTab === 0} onClick={() => setActiveTab(0)}>
                        <ListItemIcon><TableRestaurant /></ListItemIcon>
                        <ListItemText primary="Mesas" />
                    </ListItem>
                    <ListItem button selected={activeTab === 1} onClick={() => setActiveTab(1)}>
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="Funcionários" />
                    </ListItem>
                    <ListItem button selected={activeTab === 2} onClick={() => setActiveTab(2)}>
                        <ListItemIcon><RestaurantMenu /></ListItemIcon>
                        <ListItemText primary="Cardápio" />
                    </ListItem>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {activeTab === 0 && renderMesas()}
                        {activeTab === 1 && renderFuncionarios()}
                        {activeTab === 2 && renderItens()}
                    </>
                )}
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingItem ? 'Editar' : 'Novo'} {dialogType === 'MESA' ? 'Mesa' : dialogType === 'FUNCIONARIO' ? 'Funcionário' : 'Item'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {dialogType === 'MESA' && (
                            <TextField
                                label="Número da Mesa"
                                type="number"
                                value={formData.numero || ''}
                                onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) })}
                                fullWidth
                            />
                        )}
                        {dialogType === 'FUNCIONARIO' && (
                            <>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={formData.tipo || 'GARCOM'}
                                        label="Tipo"
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                        disabled={!!editingItem}
                                    >
                                        <MenuItem value="GARCOM">Garçom</MenuItem>
                                        <MenuItem value="COZINHEIRO">Cozinheiro</MenuItem>
                                        <MenuItem value="BARMAN">Barman</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Nome"
                                    value={formData.nome || ''}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="CPF"
                                    value={formData.cpf || ''}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    fullWidth
                                />
                                {!editingItem && (
                                    <TextField
                                        label="Senha"
                                        type="password"
                                        value={formData.senha || ''}
                                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                        fullWidth
                                    />
                                )}
                                <TextField
                                    label="Matrícula"
                                    value={formData.matricula || ''}
                                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Salário"
                                    type="number"
                                    value={formData.salario || ''}
                                    onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) })}
                                    fullWidth
                                />
                                <TextField
                                    label="Data de Admissão"
                                    type="date"
                                    value={formData.dataAdmissao || ''}
                                    onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                {formData.tipo === 'GARCOM' && (
                                    <TextField
                                        label="Bônus"
                                        type="number"
                                        value={formData.bonus || ''}
                                        onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })}
                                        fullWidth
                                    />
                                )}
                            </>
                        )}
                        {dialogType === 'ITEM' && (
                            <>
                                <TextField
                                    label="Nome"
                                    value={formData.nome || ''}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Preço"
                                    type="number"
                                    value={formData.preco || ''}
                                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                                    fullWidth
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Categoria</InputLabel>
                                    <Select
                                        value={formData.categoria || 'COMIDA'}
                                        label="Categoria"
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    >
                                        <MenuItem value="COMIDA">Comida</MenuItem>
                                        <MenuItem value="BEBIDA">Bebida</MenuItem>
                                        <MenuItem value="DRINK">Drink</MenuItem>
                                        <MenuItem value="SOBREMESA">Sobremesa</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={formData.tipo || 'NORMAL'}
                                        label="Tipo"
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    >
                                        <MenuItem value="NORMAL">Normal</MenuItem>
                                        <MenuItem value="PREMIUM">Premium</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#0B5D5E' }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardAdmin;