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
  Restaurant,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import cozinhaService from '../../services/cozinhaService';
import { CozinheiroResponseDTO } from '../../dto/cozinheiro/CozinheiroResponseDTO';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';
import DashboardHeader from '../../components/DashboardHeader';
import SecaoStatus from '../../components/SecaoStatus';
import CardPedido from '../../components/CardPedido';

const DashboardCozinha: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pedidosSolicitados, setPedidosSolicitados] = useState<PedidoResponseDTO[]>([]);
  const [pedidosEmPreparo, setPedidosEmPreparo] = useState<PedidoResponseDTO[]>([]);
  const [cozinheiros, setCozinheiros] = useState<CozinheiroResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      await buscarPedidos();
      await buscarCozinheiros();
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

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <DashboardHeader
        title="Dashboard - Cozinha"
        icon={<Restaurant sx={{ fontSize: 32 }} />}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        user={user}
      />

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <SecaoStatus
          titulo="Status dos Cozinheiros"
          itens={cozinheiros}
        />

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
              <Grid item xs={12} sm={6} md={3} key={pedido.id}>
                <CardPedido
                  pedido={pedido}
                  tipo="PENDENTE"
                  aoMudarStatus={handleIniciarPreparo}
                />
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
              <Grid item xs={12} sm={6} md={3} key={pedido.id}>
                <CardPedido
                  pedido={pedido}
                  tipo="EM_PREPARO"
                  aoMudarStatus={(id) => handleConcluirPreparo(id, pedido.cozinheiroId || 0)}
                  nomeResponsavel={cozinheiros.find(c => c.id === pedido.cozinheiroId)?.nome || String(pedido.cozinheiroId)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DashboardCozinha;