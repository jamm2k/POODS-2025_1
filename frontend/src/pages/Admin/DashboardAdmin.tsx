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
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Avatar,
    Grid,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    TableRestaurant,
    People,
    RestaurantMenu,
    Menu as MenuIcon,
    AdminPanelSettings,
    Person,
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';
import { MesaCreateDTO } from '../../dto/mesa/MesaCreateDTO';
import { MesaUpdateNumeroDTO } from '../../dto/mesa/MesaUpdateNumeroDTO';
import { MesaUpdateCapacidadeDTO } from '../../dto/mesa/MesaUpdateCapacidadeDTO';
import { ItemResponseDTO } from '../../dto/item/ItemResponseDTO';
import { ItemCreateDTO } from '../../dto/item/ItemCreateDTO';
import { ItemUpdateDTO } from '../../dto/item/ItemUpdateDTO';
import { GarcomResponseDTO } from '../../dto/garcom/GarcomResponseDTO';
import { CozinheiroResponseDTO } from '../../dto/cozinheiro/CozinheiroResponseDTO';
import { BarmanResponseDTO } from '../../dto/barman/BarmanResponseDTO';

import AdminMesasTab from '../../components/admin/AdminMesasTab';
import AdminFuncionariosTab from '../../components/admin/AdminFuncionariosTab';
import AdminItensTab from '../../components/admin/AdminItensTab';

const drawerWidth = 240;

type FuncionarioWithTipo = (GarcomResponseDTO | CozinheiroResponseDTO | BarmanResponseDTO) & { tipo: string };

const DashboardAdmin: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    const [mesas, setMesas] = useState<MesaResponseDTO[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [itens, setItens] = useState<ItemResponseDTO[]>([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'MESA' | 'FUNCIONARIO' | 'ITEM'>('MESA');

    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    const [viewingFuncionario, setViewingFuncionario] = useState<FuncionarioWithTipo | null>(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 0) {
                const data = await adminService.getMesas();
                setMesas(data.sort((a, b) => a.numero - b.numero));
            } else if (activeTab === 1) {
                const [garcons, cozinheiros, barmen] = await Promise.all([
                    adminService.getGarcons(),
                    adminService.getCozinheiros(),
                    adminService.getBarmen(),
                ]);

                const funcionariosMapped = [
                    ...garcons.map(g => ({ ...g, tipo: 'GARCOM' })),
                    ...cozinheiros.map(c => ({ ...c, tipo: 'COZINHEIRO' })),
                    ...barmen.map(b => ({ ...b, tipo: 'BARMAN' }))
                ];
                setFuncionarios(funcionariosMapped);
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

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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

    const handleOpenViewDialog = async (funcionario: any) => {
        setViewingFuncionario(funcionario);

        if (funcionario.tipo === 'GARCOM') {
            try {
                const hoje = new Date();
                const bonusData = await adminService.getBonusGarcom(funcionario.id, hoje.getMonth() + 1, hoje.getFullYear());
                setViewingFuncionario({ ...funcionario, bonus: bonusData.bonusCalculado });
            } catch (error) {
                console.error("Erro ao buscar bonus do garçom", error);
            }
        }

        setOpenViewDialog(true);
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setViewingFuncionario(null);
    };

    const handleSave = async () => {
        try {
            if (dialogType === 'MESA') {
                if (editingItem) {

                    if (formData.numero !== editingItem.numero) {
                        const updateMesaNumeroDTO: MesaUpdateNumeroDTO = { numero: formData.numero };
                        await adminService.updateMesaNumero(editingItem.id, updateMesaNumeroDTO);
                    }

                    if (formData.capacidade !== editingItem.capacidade) {
                        const updateMesaCapacidadeDTO: MesaUpdateCapacidadeDTO = { capacidade: formData.capacidade };
                        await adminService.updateMesaCapacidade(editingItem.id, updateMesaCapacidadeDTO);
                    }

                } else {
                    const createMesaDTO: MesaCreateDTO = { numero: formData.numero, capacidade: formData.capacidade };
                    await adminService.createMesa(createMesaDTO);
                }
            } else if (dialogType === 'FUNCIONARIO') {
                if (editingItem) {
                    await adminService.updateFuncionario(formData.tipo, editingItem.id, formData);
                } else {
                    await adminService.createFuncionario(formData.tipo, formData);
                }
            } else if (dialogType === 'ITEM') {
                if (editingItem) {
                    await adminService.updateItem(editingItem.id, formData as ItemUpdateDTO);
                } else {
                    await adminService.createItem(formData as ItemCreateDTO);
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

    const drawerContent = (
        <Box>
            <Toolbar />
            <List>
                <ListItemButton selected={activeTab === 0} onClick={() => { setActiveTab(0); setMobileOpen(false); }}>
                    <ListItemIcon><TableRestaurant /></ListItemIcon>
                    <ListItemText primary="Mesas" />
                </ListItemButton>
                <ListItemButton selected={activeTab === 1} onClick={() => { setActiveTab(1); setMobileOpen(false); }}>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary="Funcionários" />
                </ListItemButton>
                <ListItemButton selected={activeTab === 2} onClick={() => { setActiveTab(2); setMobileOpen(false); }}>
                    <ListItemIcon><RestaurantMenu /></ListItemIcon>
                    <ListItemText primary="Cardápio" />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <AdminPanelSettings sx={{ mr: 2, fontSize: 32, display: { xs: 'none', sm: 'block' } }} />
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

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, mt: 8 },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {activeTab === 0 && (
                            <AdminMesasTab
                                mesas={mesas}
                                onOpenDialog={handleOpenDialog}
                                onDelete={handleDelete}
                            />
                        )}
                        {activeTab === 1 && (
                            <AdminFuncionariosTab
                                funcionarios={funcionarios}
                                onOpenDialog={handleOpenDialog}
                                onDelete={handleDelete}
                                setFormData={setFormData}
                                onViewProfile={handleOpenViewDialog}
                            />
                        )}
                        {activeTab === 2 && (
                            <AdminItensTab
                                itens={itens}
                                onOpenDialog={handleOpenDialog}
                                onDelete={handleDelete}
                            />
                        )}
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
                            <>
                                <TextField
                                    label="Número da Mesa"
                                    type="number"
                                    value={formData.numero || ''}
                                    onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) })}
                                    fullWidth
                                />
                                <TextField
                                    label="Capacidade"
                                    type="number"
                                    value={formData.capacidade || ''}
                                    onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value) })}
                                    fullWidth
                                />
                            </>
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
                                    disabled={!!editingItem}
                                />
                                {(!editingItem || formData.tipo === 'GARCOM') && (
                                    <TextField
                                        label="Senha"
                                        type="password"
                                        value={formData.senha || ''}
                                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                        fullWidth
                                        helperText={editingItem ? "Deixe em branco para manter a atual" : ""}
                                    />
                                )}
                                <TextField
                                    label="Matrícula"
                                    value={formData.matricula || ''}
                                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                                    fullWidth
                                    disabled={!!editingItem}
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
                                    disabled={!!editingItem}
                                />
                                {formData.tipo === 'GARCOM' && (
                                    <TextField
                                        label="Bônus"
                                        type="number"
                                        value={formData.bonus || ''}
                                        onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })}
                                        fullWidth
                                        disabled={!!editingItem}
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

            <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#0B5D5E', color: 'white' }}>
                    Detalhes do Funcionário
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {viewingFuncionario && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#0B5D5E', width: 56, height: 56 }}><Person fontSize="large" /></Avatar>
                                <Box>
                                    <Typography variant="h6">{viewingFuncionario.nome}</Typography>
                                    <Chip label={viewingFuncionario.tipo} color="primary" size="small" />
                                </Box>
                            </Box>

                            <Divider />

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1">{viewingFuncionario.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">CPF</Typography>
                                    <Typography variant="body1">{viewingFuncionario.cpf}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Matrícula</Typography>
                                    <Typography variant="body1">{viewingFuncionario.matricula}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Data de Admissão</Typography>
                                    <Typography variant="body1">{viewingFuncionario.dataAdmissao}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Salário</Typography>
                                    <Typography variant="body1">R$ {viewingFuncionario.salario?.toFixed(2)}</Typography>
                                </Grid>
                                {viewingFuncionario.tipo === 'GARCOM' && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Bônus Acumulado</Typography>
                                        <Typography variant="body1">R$ {(viewingFuncionario as GarcomResponseDTO).bonus?.toFixed(2)}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseViewDialog}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardAdmin;