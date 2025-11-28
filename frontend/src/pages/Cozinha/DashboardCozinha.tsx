import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Paper,
  CircularProgress,
  Avatar,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Restaurant,
  Timer,
  CheckCircle,
  PlayArrow,
  AccessTime,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import cozinhaService from '../../services/cozinhaService';
import { CozinheiroResponseDTO } from '../../dto/cozinheiro/CozinheiroResponseDTO';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';

interface PedidoWithTimer extends PedidoResponseDTO {
  tempoDecorrido?: number;
  dataInicio?: Date;
}

const DashboardCozinha: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pedidosSolicitados, setPedidosSolicitados] = useState<PedidoWithTimer[]>([]);
  const [pedidosEmPreparo, setPedidosEmPreparo] = useState<PedidoWithTimer[]>([]);
  const [cozinheiros, setCozinheiros] = useState<CozinheiroResponseDTO[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<{ [key: number]: number }>({});

  const buscarCozinheiros = async () => {
    try {
      const data = await cozinhaService.getCozinheiros();
      setCozinheiros(data);
    } catch (error) {
      console.error('Erro ao buscar cozinheiros:', error);
    }
  };

  const buscarPedidos = async () => {
    try {
      const [solicitados, preparo] = await Promise.all([
        cozinhaService.getPedidosSolicitados(),
        cozinhaService.getPedidosEmPreparo(),
      ]);

      setPedidosSolicitados(cozinhaService.filtrarPedidosComida(solicitados));
      setPedidosEmPreparo(cozinhaService.filtrarPedidosComida(preparo));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      await Promise.all([buscarCozinheiros(), buscarPedidos()]);
      setLoading(false);
    };
    carregarDados();
    const interval = setInterval(() => {
      buscarPedidos();
      buscarCozinheiros();
    }, 10000); //atualiza a cada 10s

    return () => clearInterval(interval);
  }, []);

  //timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const newTimers = { ...prev };
        pedidosEmPreparo.forEach((pedido) => {
          if (!newTimers[pedido.id]) {
            newTimers[pedido.id] = 0;
          }
          newTimers[pedido.id] += 1;
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pedidosEmPreparo]);

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

  const handleRefresh = async () => {
    await Promise.all([buscarCozinheiros(), buscarPedidos()]);
  };

  const getCozinheiroMaisLivre = () => {
    const cozinheirosLivres = cozinheiros.filter((c) => c.status === 'LIVRE');
    if (cozinheirosLivres.length > 0) {
      return cozinheirosLivres[0];
    }
    return null;
  };

  const handleIniciarPreparo = async (pedidoId: number) => {
    try {
      const cozinheiro = getCozinheiroMaisLivre();
      if (!cozinheiro) {
        alert('Nenhum cozinheiro disponível no momento.');
        return;
      }

      await cozinhaService.iniciarPreparo(pedidoId, cozinheiro.id);

      setTimers((prev) => ({ ...prev, [pedidoId]: 0 })); //inicia o timer

      await buscarPedidos();
      await buscarCozinheiros();
    } catch (error) {
      console.error('Erro ao iniciar preparo:', error);
      alert('Erro ao iniciar preparo. Tente novamente.');
    }
  };

  const handleConcluirPreparo = async (pedidoId: number, cozinheiroId: number) => {
    try {
      await cozinhaService.concluirPreparo(pedidoId, cozinheiroId);

      setTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[pedidoId]; //tira o timer
        return newTimers;
      });

      await buscarPedidos();
      await buscarCozinheiros();
    } catch (error) {
      console.error('Erro ao concluir preparo:', error);
      alert('Erro ao concluir preparo. Tente novamente.');
    }
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCorTempo = (segundos: number, tempoEsperado?: number) => {
    if (!tempoEsperado) return '#2196F3';

    const porcentagem = (segundos / (tempoEsperado * 60)) * 100;

    if (porcentagem < 70) return '#4CAF50';
    if (porcentagem < 100) return '#FFA726';
    return '#EF5350';
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
            Dashboard - Cozinha
          </Typography>

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
                  {user?.nome || 'Cozinheiro'}
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
        {/* status cozinheiros */}
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
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Status dos Cozinheiros
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {cozinheiros.map((coz) => (
              <Box
                key={coz.id}
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
                <Avatar sx={{ bgcolor: coz.status === 'LIVRE' ? '#4CAF50' : '#FFA726' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {coz.nome}
                  </Typography>
                  <Typography variant="caption">
                    {coz.status === 'LIVRE' ? '🟢 Livre' : '🟠 Ocupado'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* pedidos solicitados */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2, color: '#0E7575' }}>
          Pedidos Pendentes ({pedidosSolicitados.length})
        </Typography>

        {pedidosSolicitados.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', mb: 4, borderRadius: 3 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6">Nenhum pedido pendente!</Typography>
            <Typography variant="body2" color="text.secondary">
              Todos os pedidos estão em preparo ou concluídos.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {pedidosSolicitados.map((pedido) => (
              <Grid item xs={12} sm={6} md={4} key={pedido.id}>
                <Card
                  sx={{
                    border: '3px solid #EF5350',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(239, 83, 80, 0.4)',
                    },
                  }}
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
                      <Typography variant="h6" fontWeight="bold">
                        Comanda #{pedido.comandaId}
                      </Typography>
                      <Chip label="PENDENTE" color="error" size="small" sx={{ fontWeight: 'bold' }} />
                    </Box>

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {pedido.item.nome}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={pedido.item.categoria} size="small" color="primary" />
                      <Chip label={`Qtd: ${pedido.quantidade}`} size="small" variant="outlined" />

                    </Box>

                    {pedido.obs && (
                      <Paper
                        sx={{
                          p: 1.5,
                          mb: 2,
                          bgcolor: '#FFF3E0',
                          borderLeft: '4px solid #FFA726',
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold" display="block">
                          Observação:
                        </Typography>
                        <Typography variant="body2">{pedido.obs}</Typography>
                      </Paper>
                    )}

                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                      Garçom ID: {pedido.garcomId}
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      fullWidth
                      onClick={() => handleIniciarPreparo(pedido.id)}
                      sx={{
                        background: 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
                        fontWeight: 'bold',
                        py: 1.2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #094d4e 0%, #0c6464 100%)',
                        },
                      }}
                    >
                      Iniciar Preparo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2, color: '#0E7575' }}>
          Em Preparo ({pedidosEmPreparo.length})
        </Typography>

        {pedidosEmPreparo.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum pedido em preparo
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {pedidosEmPreparo.map((pedido) => (
              <Grid item xs={12} sm={6} md={4} key={pedido.id}>
                <Card
                  sx={{
                    border: '3px solid #FFA726',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(255, 167, 38, 0.4)',
                    },
                  }}
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
                      <Typography variant="h6" fontWeight="bold">
                        Mesa {pedido.comandaId}
                      </Typography>
                      <Chip
                        label="EM PREPARO"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {pedido.item.nome}
                    </Typography>

                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: getCorTempo(timers[pedido.id] || 0),
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: 2,
                      }}
                    >
                      <Timer sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {formatarTempo(timers[pedido.id] || 0)}
                      </Typography>

                    </Paper>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={pedido.item.categoria} size="small" color="primary" />
                      <Chip label={`Qtd: ${pedido.quantidade}`} size="small" variant="outlined" />
                    </Box>

                    {pedido.obs && (
                      <Paper
                        sx={{
                          p: 1.5,
                          mb: 2,
                          bgcolor: '#FFF3E0',
                          borderLeft: '4px solid #FFA726',
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold" display="block">
                          Observação:
                        </Typography>
                        <Typography variant="body2">{pedido.obs}</Typography>
                      </Paper>
                    )}

                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Cozinheiro: {cozinheiros.find(c => c.id === pedido.cozinheiroId)?.nome || pedido.cozinheiroId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                      Garçom ID: {pedido.garcomId}
                    </Typography>

                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      fullWidth
                      onClick={() =>
                        handleConcluirPreparo(pedido.id, pedido.cozinheiroId || 0)
                      }
                      sx={{
                        fontWeight: 'bold',
                        py: 1.2,
                      }}
                    >
                      Marcar como Pronto
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DashboardCozinha;