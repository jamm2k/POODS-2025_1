import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  LocalBar,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import barService from '../../services/barService';
import { BarmanResponseDTO } from '../../dto/barman/BarmanResponseDTO';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';
import DashboardHeader from '../../components/DashboardHeader';
import SecaoStatus from '../../components/SecaoStatus';
import CardPedido from '../../components/CardPedido';

const DashboardBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pedidosSolicitados, setPedidosSolicitados] = useState<PedidoResponseDTO[]>([]);
  const [pedidosEmPreparo, setPedidosEmPreparo] = useState<PedidoResponseDTO[]>([]);
  const [barmen, setBarmen] = useState<BarmanResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const buscarBarmen = async () => {
    try {
      const data = await barService.getBarmen();
      setBarmen(data);
    } catch (error) {
      console.error('Erro ao buscar barmen:', error);
    }
  };

  const buscarPedidos = async () => {
    try {
      const [solicitados, preparo] = await Promise.all([
        barService.getPedidosSolicitados(),
        barService.getPedidosEmPreparo(),
      ]);

      setPedidosSolicitados(barService.filtrarPedidosBebidas(solicitados));
      setPedidosEmPreparo(barService.filtrarPedidosBebidas(preparo));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      await Promise.all([buscarBarmen(), buscarPedidos()]);
      setLoading(false);
    };
    carregarDados();

    const interval = setInterval(() => {
      buscarPedidos();
      buscarBarmen();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = async () => {
    await Promise.all([buscarBarmen(), buscarPedidos()]);
  };

  const getBarmanMaisLivre = () => {
    const barmenLivres = barmen.filter((b) => b.status === 'LIVRE');
    if (barmenLivres.length > 0) {
      return barmenLivres[0];
    }
    return null;
  };

  const handleIniciarPreparo = async (pedidoId: number) => {
    try {
      const barman = getBarmanMaisLivre();
      if (!barman) {
        alert('Nenhum barman disponível no momento.');
        return;
      }

      await barService.iniciarPreparo(pedidoId, barman.id);
      await buscarPedidos();
      await buscarBarmen();
    } catch (error) {
      console.error('Erro ao iniciar preparo:', error);
      alert('Erro ao iniciar preparo. Tente novamente.');
    }
  };

  const handleConcluirPreparo = async (pedidoId: number, barmanId: number) => {
    try {
      await barService.concluirPreparo(pedidoId, barmanId);
      await buscarPedidos();
      await buscarBarmen();
    } catch (error) {
      console.error('Erro ao concluir preparo:', error);
      alert('Erro ao concluir preparo. Tente novamente.');
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

  const barGradient = 'linear-gradient(135deg, #006064 0%, #00838F 100%)';

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <DashboardHeader
        title="Dashboard - Bar"
        icon={<LocalBar sx={{ fontSize: 32 }} />}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        user={user}
        gradient={barGradient}
      />

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <SecaoStatus
          titulo="Status dos Barmen"
          itens={barmen}
          gradient={barGradient}
        />

        {/* pedidos solicitados */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2, color: '#006064' }}>
          Pedidos Pendentes ({pedidosSolicitados.length})
        </Typography>

        {pedidosSolicitados.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', mb: 4, borderRadius: 3 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6">Nenhum pedido pendente!</Typography>
            <Typography variant="body2" color="text.secondary">
              Todos os drinks estão em preparo ou concluídos.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {pedidosSolicitados.map((pedido) => (
              <Grid item xs={12} sm={6} md={3} key={pedido.id}>
                <CardPedido
                  pedido={pedido}
                  tipo="PENDENTE"
                  aoMudarStatus={handleIniciarPreparo}
                  ehBar={true}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2, color: '#006064' }}>
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
              <Grid item xs={12} sm={6} md={3} key={pedido.id}>
                <CardPedido
                  pedido={pedido}
                  tipo="EM_PREPARO"
                  aoMudarStatus={(id) => handleConcluirPreparo(id, pedido.barmanId || 0)}
                  nomeResponsavel={barmen.find(b => b.id === pedido.barmanId)?.nome || String(pedido.barmanId)}
                  ehBar={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DashboardBar;