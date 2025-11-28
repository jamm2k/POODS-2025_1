import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  Paper,
  CircularProgress,
  Badge,
  Button,
  Chip,
  Grid,
  TextField,
} from '@mui/material';
import {
  Notifications,
  AccountCircle,
  Logout,
  Restaurant,
  AccessTime,
  CheckCircle,
  People,
  AddCircle,
  Receipt,
  Add,
  Remove,
  Visibility,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import garcomService from '../../services/garcomService';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';
import { ItemResponseDTO } from '../../dto/item/ItemResponseDTO';
import { PedidoCreateDTO } from '../../dto/pedido/PedidoCreateDTO';

interface PedidoCreate {
  itemId: number;
  quantidade: number;
  obs: string;
}

const DashboardGarcom: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mesas, setMesas] = useState<MesaResponseDTO[]>([]);
  const [pedidosProntos, setPedidosProntos] = useState<PedidoResponseDTO[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [dialogPedidosOpen, setDialogPedidosOpen] = useState(false);
  const [dialogAbrirComandaOpen, setDialogAbrirComandaOpen] = useState(false);

  const [selectedMesa, setSelectedMesa] = useState<MesaResponseDTO | null>(null);
  const [nomeCliente, setNomeCliente] = useState('');

  const [dialogOpcoesMesaOpen, setDialogOpcoesMesaOpen] = useState(false);

  const [dialogVerComandaAberta, setDialogVerComandaAberta] = useState(false);
  const [dialogAdicionarPedidosAberta, setDialogAdicionarPedidosAberta] = useState(false);
  const [selectedComandaId, setSelectedComandaId] = useState<number | null>(null);
  const [comandaPedidos, setComandaPedidos] = useState<PedidoResponseDTO[]>([]);
  const [menuItems, setMenuItems] = useState<ItemResponseDTO[]>([]);
  const [novosItensPedido, setNovosItensPedido] = useState<{ [key: number]: PedidoCreate }>({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarMesas = async () => {
    try {
      const data = await garcomService.getMesas();
      const sortedMesas = data.sort((a, b) => a.numero - b.numero);
      setMesas(sortedMesas);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
    }
  };

  const buscarPedidosProntos = async () => {
    try {
      const prontos = await garcomService.getPedidosProntos();
      setPedidosProntos(prontos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const buscarItens = async () => {
    try {
      const itens = await garcomService.getItensCardapio();
      setMenuItems(itens);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  const buscarComandaDaMesa = async (mesaId: number) => {
    try {
      const comandas = await garcomService.getComandasByMesa(mesaId);
      const ativa = comandas.find((c: any) => c.status && c.status.toUpperCase() === 'ABERTA');
      if (ativa) {
        setSelectedComandaId(ativa.id);
        return ativa.id;
      }
    } catch (error) {
      console.error('Erro ao buscar comanda da mesa:', error);
    }
    return null;
  };

  const buscarPedidosDaComanda = async (comandaId: number) => {
    try {
      const pedidos = await garcomService.getPedidosByComanda(comandaId);
      setComandaPedidos(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos da comanda:', error);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      await Promise.all([buscarMesas(), buscarPedidosProntos(), buscarItens()]);
      setLoading(false);
    };
    carregarDados();

    const interval = setInterval(() => {
      buscarPedidosProntos();
      buscarMesas();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([buscarMesas(), buscarPedidosProntos(), buscarItens()]);
    setRefreshing(false);
    handleMenuClose();
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

  const handleMesaClick = async (mesa: MesaResponseDTO) => {
    setSelectedMesa(mesa);

    if (mesa.status === 'OCUPADA') {
      await buscarComandaDaMesa(mesa.id);
    }

    setDialogOpcoesMesaOpen(true);
  };

  const handleAbrirComanda = async () => {
    if (!selectedMesa || !user) return;

    try {
      await garcomService.criarComanda({
        nome: nomeCliente || `Mesa ${selectedMesa.numero}`,
        mesaId: selectedMesa.id,
        garcomId: user.id
      });

      setDialogAbrirComandaOpen(false);
      await buscarMesas();
    } catch (error: any) {
      console.error('Erro ao abrir comanda:', error);
      alert('Erro ao abrir comanda. Tente novamente.');
    }
  };

  const handleReservarMesa = async () => {
    if (!selectedMesa) return;
    try {
      await garcomService.atualizarStatusMesa(selectedMesa.id, 'RESERVADA');
      setDialogOpcoesMesaOpen(false);
      await buscarMesas();
    } catch (error) {
      console.error('Erro ao reservar mesa:', error);
      alert('Erro ao reservar mesa.');
    }
  };

  const handleLiberarMesa = async () => {
    if (!selectedMesa) return;
    try {
      await garcomService.atualizarStatusMesa(selectedMesa.id, 'LIVRE');
      setDialogOpcoesMesaOpen(false);
      await buscarMesas();
    } catch (error) {
      console.error('Erro ao liberar mesa:', error);
      alert('Erro ao liberar mesa.');
    }
  };

  const handleFecharComanda = async () => {
    if (!selectedComandaId) {
      alert('Nenhuma comanda ativa encontrada para fechar.');
      return;
    }
    if (!window.confirm('Tem certeza que deseja fechar esta comanda? A mesa será liberada.')) {
      return;
    }

    try {

      await garcomService.atualizarStatusComanda(selectedComandaId, 'PAGA');
      setDialogOpcoesMesaOpen(false);
      await buscarMesas();
      alert('Comanda fechada com sucesso!');
    } catch (error) {
      console.error('Erro ao fechar comanda:', error);
      alert('Erro ao fechar comanda.');
    }
  };

  const handleMarcarEntregue = async (pedidoId: number) => {
    try {
      await garcomService.marcarPedidoEntregue(pedidoId);
      await buscarPedidosProntos();
    } catch (error) {
      console.error('Erro ao marcar pedido como entregue:', error);
      alert('Erro ao marcar pedido como entregue.');
    }
  };

  const handleAbrirVerComanda = () => {
    if (selectedComandaId) {
      buscarPedidosDaComanda(selectedComandaId);
      setDialogOpcoesMesaOpen(false);
      setDialogVerComandaAberta(true);
    } else {
      alert('Erro: Comanda não encontrada.');
    }
  };

  const handleAbrirAdicionarPedidos = () => {
    setNovosItensPedido({});
    setDialogOpcoesMesaOpen(false);
    setDialogAdicionarPedidosAberta(true);
  };

  const handleAlterarQuantidade = (itemId: number, delta: number) => {
    setNovosItensPedido((prev) => {
      const current = prev[itemId] || { itemId, quantidade: 0, obs: '' };
      const newQty = Math.max(0, current.quantidade + delta);

      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [itemId]: { ...current, quantidade: newQty } };
    });
  };

  const handleAlterarObs = (itemId: number, obs: string) => {
    setNovosItensPedido((prev) => {
      const current = prev[itemId] || { itemId, quantidade: 0, obs: '' };
      return { ...prev, [itemId]: { ...current, obs } };
    });
  };

  const handleEnviarPedidos = async () => {
    if (!selectedComandaId || !user) return;

    const pedidosParaEnviar = Object.values(novosItensPedido);
    if (pedidosParaEnviar.length === 0) return;

    try {
      await Promise.all(pedidosParaEnviar.map(p =>
        garcomService.criarPedido({
          garcomId: user.id,
          comandaId: selectedComandaId,
          itemId: p.itemId,
          quantidade: p.quantidade,
          obs: p.obs
        })
      ));

      setDialogAdicionarPedidosAberta(false);
      setNovosItensPedido({});
    } catch (error) {
      console.error('Erro ao enviar pedidos:', error);
      alert('Erro ao enviar alguns pedidos. Tente novamente.');
    }
  };

  const getStatusStyles = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'LIVRE': return { bgcolor: '#C8E6C9', color: '#1B5E20' };
      case 'OCUPADA': return { bgcolor: '#FFCDD2', color: '#B71C1C' };
      case 'RESERVADA': return { bgcolor: '#FFF9C4', color: '#F57F17' };
      default: return { bgcolor: '#E0E0E0', color: '#616161' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #0d6869ff 0%, #0e4775ff 100%)' }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" color="white">Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)', boxShadow: 3 }}>
        <Toolbar>
          <Restaurant sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
            Garçom
          </Typography>

          <IconButton color="inherit" onClick={() => setDialogPedidosOpen(true)}>
            <Badge badgeContent={pedidosProntos.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.nome}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleRefresh}>
              <AccessTime sx={{ mr: 1 }} fontSize="small" /> Atualizar
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} fontSize="small" /> Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#C8E6C9', border: '1px solid #1B5E20' }} />
            <Typography variant="caption" fontWeight="bold" color="#1B5E20">Livre</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#FFCDD2', border: '1px solid #B71C1C' }} />
            <Typography variant="caption" fontWeight="bold" color="#B71C1C">Ocupada</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#FFF9C4', border: '1px solid #F57F17' }} />
            <Typography variant="caption" fontWeight="bold" color="#F57F17">Reservada</Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {mesas.map((mesa) => {
            const styles = getStatusStyles(mesa.status);
            return (
              <Grid item xs={4} sm={3} md={2} key={mesa.id}>
                <Paper
                  elevation={3}
                  onClick={() => handleMesaClick(mesa)}
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
          })}
        </Grid>

        {mesas.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            <Typography>Nenhuma mesa encontrada.</Typography>
          </Box>
        )}
      </Box>

      <Dialog open={dialogAbrirComandaOpen} onClose={() => setDialogAbrirComandaOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ bgcolor: '#1B5E20', color: 'white' }}>
          Abrir Mesa {selectedMesa?.numero}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
            Informe o nome do cliente (opcional) para abrir a comanda.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Cliente"
            fullWidth
            variant="outlined"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogAbrirComandaOpen(false)} color="inherit">Cancelar</Button>
          <Button
            onClick={handleAbrirComanda}
            variant="contained"
            sx={{ bgcolor: '#1B5E20', '&:hover': { bgcolor: '#003300' } }}
            startIcon={<AddCircle />}
          >
            Abrir Comanda
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpcoesMesaOpen} onClose={() => setDialogOpcoesMesaOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)', color: 'white' }}>
          Mesa {selectedMesa?.numero} - {selectedMesa?.status}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, py: 4 }}>

          {/* CASO 1: MESA LIVRE */}
          {selectedMesa?.status === 'LIVRE' && (
            <>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => {
                  setDialogOpcoesMesaOpen(false);
                  setNomeCliente('');
                  setDialogAbrirComandaOpen(true);
                }}
                sx={{ bgcolor: '#1B5E20', py: 1.5 }}
              >
                Abrir Comanda
              </Button>
              <Button
                variant="contained"
                startIcon={<AccessTime />}
                onClick={handleReservarMesa}
                sx={{ bgcolor: '#F57F17', py: 1.5 }}
              >
                Reservar Mesa
              </Button>
            </>
          )}

          {/* CASO 2: MESA OCUPADA */}
          {selectedMesa?.status === 'OCUPADA' && (
            <>
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={handleAbrirVerComanda}
                sx={{ bgcolor: '#1976D2', py: 1.5 }}
              >
                Ver Comanda
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={handleAbrirAdicionarPedidos}
                sx={{ bgcolor: '#4CAF50', py: 1.5 }}
              >
                Adicionar Pedidos
              </Button>
              <Button
                variant="contained"
                startIcon={<Receipt />}
                onClick={handleFecharComanda}
                sx={{ bgcolor: '#D32F2F', py: 1.5 }}
              >
                Fechar Comanda
              </Button>
            </>
          )}

          {/* CASO 3: MESA RESERVADA */}
          {selectedMesa?.status === 'RESERVADA' && (
            <>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => {
                  setDialogOpcoesMesaOpen(false);
                  setNomeCliente('');
                  setDialogAbrirComandaOpen(true);
                }}
                sx={{ bgcolor: '#1B5E20', py: 1.5 }}
              >
                Abrir Comanda
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={handleLiberarMesa}
                sx={{ bgcolor: '#1B5E20', py: 1.5 }}
              >
                Liberar Mesa
              </Button>
            </>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpcoesMesaOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogVerComandaAberta} onClose={() => setDialogVerComandaAberta(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#1976D2', color: 'white' }}>
          Comanda - Mesa {selectedMesa?.numero}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 0 }}>
          {!Array.isArray(comandaPedidos) || comandaPedidos.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Nenhum pedido realizado nesta comanda.</Typography>
            </Box>
          ) : (
            <List>
              {comandaPedidos.map((pedido) => (
                <React.Fragment key={pedido.id}>
                  <ListItem>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <Typography variant="body1">{pedido.item?.nome || 'Item removido'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pedido.item?.categoria || ''}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">Qtd: {pedido.quantidade}</Typography>
                        <Chip
                          label={pedido.status}
                          size="small"
                          color={pedido.status === 'PRONTO' ? 'success' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogVerComandaAberta(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogAdicionarPedidosAberta} onClose={() => setDialogAdicionarPedidosAberta(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: '#4CAF50', color: 'white' }}>
          Adicionar Pedidos - Mesa {selectedMesa?.numero}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {menuItems.map((item) => {
              const currentQty = novosItensPedido[item.id]?.quantidade || 0;
              return (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography fontWeight="bold">{item.nome}</Typography>
                      <Typography color="primary" fontWeight="bold">R$ {item.preco.toFixed(2)}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{item.categoria}</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleAlterarQuantidade(item.id, -1)} disabled={currentQty === 0}>
                          <Remove />
                        </IconButton>
                        <Typography fontWeight="bold">{currentQty}</Typography>
                        <IconButton size="small" onClick={() => handleAlterarQuantidade(item.id, 1)}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>

                    {currentQty > 0 && (
                      <TextField
                        size="small"
                        placeholder="Observações:"
                        fullWidth
                        value={novosItensPedido[item.id]?.obs || ''}
                        onChange={(e) => handleAlterarObs(item.id, e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogAdicionarPedidosAberta(false)} color="inherit">Cancelar</Button>
          <Button
            onClick={handleEnviarPedidos}
            variant="contained"
            color="success"
            startIcon={<Send />}
            disabled={Object.keys(novosItensPedido).length === 0}
          >
            Enviar Pedidos
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogPedidosOpen}
        onClose={() => setDialogPedidosOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: '#004D40', color: 'white' }}>
          Pedidos Prontos
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 0 }}>
          {pedidosProntos.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
              <Typography>Todos os pedidos foram entregues!</Typography>
            </Box>
          ) : (
            <List>
              {pedidosProntos.map((pedido) => (
                <React.Fragment key={pedido.id}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography fontWeight="bold">Comanda #{pedido.comandaId}</Typography>
                      <Chip label="PRONTO" color="success" size="small" />
                    </Box>
                    <Typography variant="body1">{pedido.item.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">Qtd: {pedido.quantidade}</Typography>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleMarcarEntregue(pedido.id)}
                    >
                      Entregar
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogPedidosOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardGarcom;