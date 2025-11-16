import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Badge,
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
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import {
  TableRestaurant,
  AddCircle,
  CheckCircle,
  Notifications,
  AccountCircle,
  Logout,
  Restaurant,
  AccessTime,
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
  const [dialogPedidosOpen, setDialogPedidosOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarMesas = async () => {
    try {
      const response = await api.get('/api/mesas');
      setMesas(response.data);
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

    // atualizar pedidos prontos a cada 15 segundos
    const interval = setInterval(() => {
      buscarPedidosProntos();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // refresh manual
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([buscarMesas(), buscarPedidosProntos()]);
    setRefreshing(false);
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
    if (mesa.status === 'LIVRE') {
      // redirecionar para abrir comanda
      navigate(`/garcom/mesa/${mesa.id}/abrir-comanda`);
    } else if (mesa.status === 'OCUPADA') {
      //redirecionar para ver/fazer pedidos
      navigate(`/garcom/mesa/${mesa.id}/pedidos`);
    }
  };

  const handleMarcarEntregue = async (pedidoId: number) => {
    try {
      await api.put(`/api/pedidos/api/${pedidoId}/entregar`);
      await buscarPedidosProntos();
    } catch (error) {
      console.error('Erro ao marcar pedido como entregue:', error);
      alert('Erro ao marcar pedido como entregue. Tente novamente.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVRE':
        return '#4CAF50';
      case 'OCUPADA':
        return '#FFA726';
      case 'RESERVADA':
        return '#EF5350';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LIVRE':
        return 'Disponível';
      case 'OCUPADA':
        return 'Ocupada';
      case 'RESERVADA':
        return 'Reservada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0d6869ff 0%, #0e4775ff 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" color="white">
          Carregando dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
          boxShadow: '0 4px 15px rgba(11, 93, 94, 0.3)',
        }}
      >
        <Toolbar>
          <Restaurant sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Dashboard - Garçom
          </Typography>

          {/* botão de notificações */}
          <IconButton
            color="inherit"
            onClick={() => setDialogPedidosOpen(true)}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={pedidosProntos.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* menu do usuario */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user?.nome || 'Garçom'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleRefresh}>
              <AccessTime sx={{ mr: 1 }} fontSize="small" />
              Atualizar
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} fontSize="small" />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Bem-vindo, {user?.nome}!
          </Typography>
          <Typography variant="body1">
            Selecione uma mesa para gerenciar comandas e pedidos
          </Typography>
          {pedidosProntos.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Notifications />
              <Typography variant="body2" fontWeight="bold">
                Você tem {pedidosProntos.length} pedido(s) pronto(s) para
                entregar!
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Legenda de Status:
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  border: '2px solid #388E3C',
                }}
              />
              <Typography variant="body2">Disponível</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#FFA726',
                  border: '2px solid #F57C00',
                }}
              />
              <Typography variant="body2">Ocupada</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#EF5350',
                  border: '2px solid #C62828',
                }}
              />
              <Typography variant="body2">Reservada</Typography>
            </Box>
          </Box>
        </Paper>

        {/* grid de mesas */}
        <Grid container spacing={3}>
          {mesas.map((mesa) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mesa.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '3px solid',
                  borderColor: getStatusColor(mesa.status),
                  borderRadius: 3,
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 30px ${getStatusColor(mesa.status)}60`,
                  },
                }}
                onClick={() => handleMesaClick(mesa)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableRestaurant
                        sx={{
                          fontSize: 48,
                          color: getStatusColor(mesa.status),
                        }}
                      />
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ color: getStatusColor(mesa.status) }}
                      >
                        {mesa.numero}
                      </Typography>
                    </Box>

                    <Chip
                      label={getStatusLabel(mesa.status)}
                      sx={{
                        bgcolor: getStatusColor(mesa.status),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Capacidade:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {mesa.capacidade} pessoas
                    </Typography>
                  </Box>

                  {mesa.status === 'LIVRE' && (
                    <Button
                      variant="contained"
                      startIcon={<AddCircle />}
                      fullWidth
                      sx={{
                        mt: 1,
                        py: 1.2,
                        background:
                          'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #094d4e 0%, #0c6464 100%)',
                        },
                      }}
                    >
                      Abrir Comanda
                    </Button>
                  )}

                  {mesa.status === 'OCUPADA' && (
                    <Button
                      variant="outlined"
                      startIcon={<Restaurant />}
                      fullWidth
                      sx={{
                        mt: 1,
                        py: 1.2,
                        borderColor: '#0E7575',
                        color: '#0E7575',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#0B5D5E',
                          bgcolor: '#0B5D5E10',
                          borderWidth: 2,
                        },
                      }}
                    >
                      Fazer Pedidos
                    </Button>
                  )}

                  {mesa.status === 'RESERVADA' && (
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled
                      sx={{
                        mt: 1,
                        py: 1.2,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        borderRadius: 2,
                      }}
                    >
                      Reservada
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {mesas.length === 0 && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma mesa cadastrada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aguarde o administrador cadastrar as mesas do restaurante.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* dialog d pedidos prontos */}
      <Dialog
        open={dialogPedidosOpen}
        onClose={() => setDialogPedidosOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications />
            <Typography variant="h6" fontWeight="bold">
              Pedidos Prontos ({pedidosProntos.length})
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {pedidosProntos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tudo em dia!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nenhum pedido pronto aguardando entrega no momento.
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {pedidosProntos.map((pedido, index) => (
                <React.Fragment key={pedido.id}>
                  <ListItem
                    sx={{
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                      mb: 2,
                      p: 2,
                      border: '2px solid #e0e0e0',
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Mesa {pedido.comanda.mesa.numero}
                        </Typography>
                        <Chip
                          label="PRONTO"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>

                      <Typography variant="body1" color="text.primary">
                        {pedido.item.nome}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip
                          label={pedido.item.categoria}
                          size="small"
                          sx={{
                            bgcolor: '#0B5D5E',
                            color: 'white',
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Quantidade: <strong>{pedido.quantidade}</strong>
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleMarcarEntregue(pedido.id)}
                        fullWidth
                        sx={{
                          mt: 2,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          py: 1,
                        }}
                      >
                        Marcar como Servido
                      </Button>
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDialogPedidosOpen(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardGarcom;