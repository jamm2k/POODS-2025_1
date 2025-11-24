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
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Mesa {
  id: number;
  numero: number;
  status: 'LIVRE' | 'OCUPADA' | 'RESERVADA';
  capacidade: number;
}

interface Pedido {
  id: number;
  item: {
    nome: string;
    categoria: string;
  };
  quantidade: number;
  status: string;
  comanda: {
    id: number;
    mesa: {
      numero: number;
    };
  };
  garcom: {
    id: number;
    nome: string;
  };
}

const DashboardGarcom: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [pedidosProntos, setPedidosProntos] = useState<Pedido[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Dialogs
  const [dialogPedidosOpen, setDialogPedidosOpen] = useState(false);
  const [dialogAbrirComandaOpen, setDialogAbrirComandaOpen] = useState(false);
  const [dialogMesaOcupadaOpen, setDialogMesaOcupadaOpen] = useState(false);

  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [nomeCliente, setNomeCliente] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarMesas = async () => {
    try {
      const response = await api.get('/api/mesas');
      const sortedMesas = response.data.sort((a: Mesa, b: Mesa) => a.numero - b.numero);
      setMesas(sortedMesas);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
    }
  };

  const buscarPedidosProntos = async () => {
    try {
      const response = await api.get('/api/garcons/me/pedidos');
      const prontos = response.data.filter((p: Pedido) => p.status === 'PRONTO');
      setPedidosProntos(prontos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      await Promise.all([buscarMesas(), buscarPedidosProntos()]);
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
    await Promise.all([buscarMesas(), buscarPedidosProntos()]);
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

  const handleMesaClick = (mesa: Mesa) => {
    setSelectedMesa(mesa);
    if (mesa.status === 'LIVRE') {
      setNomeCliente('');
      setDialogAbrirComandaOpen(true);
    } else if (mesa.status === 'OCUPADA') {
      setDialogMesaOcupadaOpen(true);
    }
  };

  const handleAbrirComanda = async () => {
    if (!selectedMesa || !user) return;

    try {
      await api.post('/api/comandas', {
        nome: nomeCliente || `Mesa ${selectedMesa.numero}`,
        mesaId: selectedMesa.id,
        garcomId: user.id
      });

      setDialogAbrirComandaOpen(false);
      await buscarMesas(); // Refresh status
      alert('Comanda aberta com sucesso!');
    } catch (error: any) {
      console.error('Erro ao abrir comanda:', error);
      if (error.response?.status === 403) {
        alert('Erro 403: Sem permissão. Verifique se seu usuário é um Garçom e se o backend permite conexões externas (CORS).');
      } else if (error.response?.status === 400) {
        alert(`Erro: ${error.response.data}`);
      } else {
        alert('Erro ao abrir comanda. Tente novamente.');
      }
    }
  };

  const handleMarcarEntregue = async (pedidoId: number) => {
    try {
      await api.put(`/api/pedidos/api/${pedidoId}/entregar`);
      await buscarPedidosProntos();
    } catch (error) {
      console.error('Erro ao marcar pedido como entregue:', error);
      alert('Erro ao marcar pedido como entregue.');
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
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
                    paddingTop: '100%', // Aspect Ratio 1:1
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

      <Dialog open={dialogMesaOcupadaOpen} onClose={() => setDialogMesaOcupadaOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ bgcolor: '#B71C1C', color: 'white' }}>
          Mesa {selectedMesa?.numero} (Ocupada)
        </DialogTitle>
        <DialogContent sx={{ mt: 2, textAlign: 'center', py: 4 }}>
          <Receipt sx={{ fontSize: 60, color: '#B71C1C', mb: 2 }} />
          <Typography variant="h6">Gerenciar Pedidos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Esta funcionalidade será implementada em breve.
          </Typography>
          <Button variant="outlined" color="error" onClick={() => setDialogMesaOcupadaOpen(false)}>
            Fechar
          </Button>
        </DialogContent>
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
                      <Typography fontWeight="bold">Mesa {pedido.comanda.mesa.numero}</Typography>
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