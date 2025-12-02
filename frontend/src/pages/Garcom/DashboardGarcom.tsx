import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress,
  Badge,
  Grid,
} from '@mui/material';
import {
  Notifications,
  AccountCircle,
  Restaurant,
  Receipt,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import garcomService from '../../services/garcomService';
import { MesaResponseDTO } from '../../dto/mesa/MesaResponseDTO';
import { PedidoResponseDTO } from '../../dto/pedido/PedidoResponseDTO';
import { ItemResponseDTO } from '../../dto/item/ItemResponseDTO';
import { ComandaResponseDTO } from '../../dto/comanda/ComandaResponseDTO';
import { GarcomResponseDTO } from '../../dto/garcom/GarcomResponseDTO';
import { RelatorioGarcomDTO } from '../../dto/relatorio/RelatorioGarcomDTO';

import DashboardHeader from '../../components/DashboardHeader';
import CardMesa from '../../components/CardMesa';
import LegendaStatus from '../../components/LegendaStatus';

import DialogAbrirComanda from '../../components/garcom/DialogAbrirComanda';
import DialogOpcoesMesa from '../../components/garcom/DialogOpcoesMesa';
import DialogVerComanda from '../../components/garcom/DialogVerComanda';
import DialogAdicionarPedidos from '../../components/garcom/DialogAdicionarPedidos';
import DialogPedidosProntos from '../../components/garcom/DialogPedidosProntos';
import DialogPerfil from '../../components/garcom/DialogPerfil';
import DialogMeusPedidos from '../../components/garcom/DialogMeusPedidos';
import DialogBonus from '../../components/garcom/DialogBonus';
import DialogPagarComanda from '../../components/garcom/DialogPagarComanda';

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

  const [dialogPedidosOpen, setDialogPedidosOpen] = useState(false);
  const [dialogAbrirComandaOpen, setDialogAbrirComandaOpen] = useState(false);

  const [selectedMesa, setSelectedMesa] = useState<MesaResponseDTO | null>(null);
  const [nomeCliente, setNomeCliente] = useState('');

  const [dialogOpcoesMesaOpen, setDialogOpcoesMesaOpen] = useState(false);

  const [dialogVerComandaAberta, setDialogVerComandaAberta] = useState(false);
  const [dialogAdicionarPedidosAberta, setDialogAdicionarPedidosAberta] = useState(false);
  const [selectedComandaId, setSelectedComandaId] = useState<number | null>(null);
  const [openComandas, setOpenComandas] = useState<ComandaResponseDTO[]>([]);
  const [comandaPedidos, setComandaPedidos] = useState<PedidoResponseDTO[]>([]);
  const [dialogPagarComandaOpen, setDialogPagarComandaOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<ItemResponseDTO[]>([]);
  const [novosItensPedido, setNovosItensPedido] = useState<{ [key: number]: PedidoCreate }>({});
  const [dialogPerfilOpen, setDialogPerfilOpen] = useState(false);
  const [dadosPerfil, setDadosPerfil] = useState<GarcomResponseDTO | null>(null);

  const [dialogMeusPedidosOpen, setDialogMeusPedidosOpen] = useState(false);
  const [meusPedidos, setMeusPedidos] = useState<PedidoResponseDTO[]>([]);
  const [meusPedidosMes, setMeusPedidosMes] = useState(new Date().getMonth() + 1);
  const [meusPedidosAno, setMeusPedidosAno] = useState(new Date().getFullYear());

  const [dialogBonusOpen, setDialogBonusOpen] = useState(false);
  const [meuBonus, setMeuBonus] = useState<RelatorioGarcomDTO | null>(null);
  const [bonusMes, setBonusMes] = useState(new Date().getMonth() + 1);
  const [bonusAno, setBonusAno] = useState(new Date().getFullYear());

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

  const buscarComandasDaMesa = async (mesaId: number) => {
    try {
      const comandas = await garcomService.getComandasByMesa(mesaId);
      const abertas = comandas.filter((c: any) => c.status && c.status.toUpperCase() === 'ABERTA');
      setOpenComandas(abertas);
    } catch (error) {
      console.error('Erro ao buscar comandas da mesa:', error);
    }
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([buscarMesas(), buscarPedidosProntos(), buscarItens()]);
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAbrirPerfil = async () => {
    try {
      const dados = await garcomService.getMeuPerfil();
      setDadosPerfil(dados);

      const hoje = new Date();
      try {
        const bonus = await garcomService.getMeuBonus(hoje.getMonth() + 1, hoje.getFullYear());
        setMeuBonus(bonus);
      } catch (e) {
        console.error("Erro ao buscar bonus para perfil", e);
        setMeuBonus(null);
      }

      setDialogPerfilOpen(true);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      alert('Erro ao buscar perfil. Tente novamente.');
    };
  };

  const handleAbrirMeusPedidos = async () => {
    try {
      const pedidos = await garcomService.getMeusPedidos(meusPedidosMes, meusPedidosAno);
      setMeusPedidos(pedidos);
      setDialogMeusPedidosOpen(true);
    } catch (error) {
      console.error('Erro ao buscar meus pedidos:', error);
      alert('Erro ao buscar pedidos.');
    }
  };

  const handleBuscarMeusPedidos = async () => {
    try {
      const pedidos = await garcomService.getMeusPedidos(meusPedidosMes, meusPedidosAno);
      setMeusPedidos(pedidos);
    } catch (error) {
      console.error('Erro ao buscar meus pedidos filtrados:', error);
      alert('Erro ao buscar pedidos.');
    }
  };

  const handleAbrirBonus = async () => {
    try {
      const bonus = await garcomService.getMeuBonus(bonusMes, bonusAno);
      setMeuBonus(bonus);
      setDialogBonusOpen(true);
    } catch (error) {
      console.error('Erro ao buscar bônus:', error);
      setMeuBonus(null);
      setDialogBonusOpen(true);
    }
  };

  const handleBuscarBonus = async () => {
    try {
      const bonus = await garcomService.getMeuBonus(bonusMes, bonusAno);
      setMeuBonus(bonus);
    } catch (error) {
      console.error('Erro ao buscar bônus:', error);
      setMeuBonus(null);
    }
  };

  const handleMesaClick = async (mesa: MesaResponseDTO) => {
    setSelectedMesa(mesa);

    if (mesa.status === 'OCUPADA') {
      await buscarComandasDaMesa(mesa.id);
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
    if (!selectedComandaId || !selectedMesa) return;

    if (!window.confirm('Tem certeza que deseja fechar esta comanda?')) {
      return;
    }

    try {
      await garcomService.atualizarStatusComanda(selectedComandaId, 'PAGA');

      const comandas = await garcomService.getComandasByMesa(selectedMesa.id);
      const abertas = comandas.filter((c: any) => c.status && c.status.toUpperCase() === 'ABERTA');

      if (abertas.length === 0) {
        await garcomService.atualizarStatusMesa(selectedMesa.id, 'LIVRE');
      }

      setDialogVerComandaAberta(false);
      setDialogOpcoesMesaOpen(false);
      await buscarMesas();
      alert('Comanda fechada com sucesso!');
    } catch (error) {
      console.error('Erro ao fechar comanda:', error);
      alert('Erro ao fechar comanda.');
    }
  };

  const handleAbrirPagarComanda = () => {
    setDialogVerComandaAberta(false);
    setDialogPagarComandaOpen(true);
  };

  const handlePagarComanda = async (comandaId: number, incluirTaxa: boolean) => {
    if (!selectedMesa) return;

    try {
      await garcomService.atualizarTaxaServico(comandaId, incluirTaxa);

      await garcomService.atualizarStatusComanda(comandaId, 'PAGA');
      const comandas = await garcomService.getComandasByMesa(selectedMesa.id);
      const abertas = comandas.filter((c: any) => c.status && c.status.toUpperCase() === 'ABERTA');

      if (abertas.length === 0) {
        await garcomService.atualizarStatusMesa(selectedMesa.id, 'LIVRE');
      }

      setDialogPagarComandaOpen(false);
      setDialogOpcoesMesaOpen(false);
      await buscarMesas();
      alert('Pagamento realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao realizar pagamento:', error);
      const errorMessage =
        (typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message) ||
        error.message ||
        'Erro ao realizar pagamento. Tente novamente.';
      alert(errorMessage);
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

  const handleAbrirVerComanda = (comandaId: number) => {
    setSelectedComandaId(comandaId);
    buscarPedidosDaComanda(comandaId);
    setDialogVerComandaAberta(true);
  };

  const handleAbrirAdicionarPedidos = () => {
    setNovosItensPedido({});
    setDialogOpcoesMesaOpen(false);
    setDialogVerComandaAberta(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #0d6869ff 0%, #0e4775ff 100%)' }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" color="white">Carregando...</Typography>
      </Box>
    );
  }

  const additionalMenuItems = (
    <>
      <MenuItem onClick={handleAbrirPerfil}>
        <AccountCircle sx={{ mr: 1 }} fontSize="small" /> Perfil
      </MenuItem>
      <MenuItem onClick={handleAbrirMeusPedidos}>
        <Receipt sx={{ mr: 1 }} fontSize="small" /> Meus Pedidos
      </MenuItem>
      <MenuItem onClick={handleAbrirBonus}>
        <CheckCircle sx={{ mr: 1 }} fontSize="small" /> Meu Bônus
      </MenuItem>
    </>
  );

  const additionalToolbarItems = (
    <IconButton color="inherit" onClick={() => setDialogPedidosOpen(true)}>
      <Badge badgeContent={pedidosProntos.length} color="error">
        <Notifications />
      </Badge>
    </IconButton>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <DashboardHeader
        title="Garçom"
        icon={<Restaurant sx={{ mr: 1 }} />}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        user={user}
        additionalMenuItems={additionalMenuItems}
        additionalToolbarItems={additionalToolbarItems}
        gradient="linear-gradient(135deg, #004D40 0%, #00695C 100%)"
      />

      <Box sx={{ p: 3 }}>
        <LegendaStatus />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {mesas.map((mesa) => (
            <CardMesa key={mesa.id} mesa={mesa} aoClicar={handleMesaClick} />
          ))}
        </Grid>
      </Box>

      <DialogAbrirComanda
        open={dialogAbrirComandaOpen}
        onClose={() => setDialogAbrirComandaOpen(false)}
        selectedMesa={selectedMesa}
        nomeCliente={nomeCliente}
        setNomeCliente={setNomeCliente}
        onAbrirComanda={handleAbrirComanda}
      />

      <DialogOpcoesMesa
        open={dialogOpcoesMesaOpen}
        onClose={() => setDialogOpcoesMesaOpen(false)}
        selectedMesa={selectedMesa}
        openComandas={openComandas}
        onAbrirComanda={() => {
          setDialogOpcoesMesaOpen(false);
          setNomeCliente('');
          setDialogAbrirComandaOpen(true);
        }}
        onReservarMesa={handleReservarMesa}
        onLiberarMesa={handleLiberarMesa}
        onVerComanda={handleAbrirVerComanda}
        onAbrirNovaComanda={() => {
          setDialogOpcoesMesaOpen(false);
          setNomeCliente('');
          setDialogAbrirComandaOpen(true);
        }}
      />

      <DialogVerComanda
        open={dialogVerComandaAberta}
        onClose={() => setDialogVerComandaAberta(false)}
        selectedMesa={selectedMesa}
        comandaNome={selectedComandaId ? openComandas.find(c => c.id === selectedComandaId)?.nome : undefined}
        comandaPedidos={comandaPedidos}
        onAdicionarPedidos={handleAbrirAdicionarPedidos}
        onFecharComanda={handleFecharComanda}
        onPagarComanda={handleAbrirPagarComanda}
      />

      <DialogPagarComanda
        open={dialogPagarComandaOpen}
        onClose={() => setDialogPagarComandaOpen(false)}
        comandaId={selectedComandaId}
        pedidos={comandaPedidos}
        onConfirmarPagamento={handlePagarComanda}
      />

      <DialogAdicionarPedidos
        open={dialogAdicionarPedidosAberta}
        onClose={() => setDialogAdicionarPedidosAberta(false)}
        selectedMesa={selectedMesa}
        menuItems={menuItems}
        novosItensPedido={novosItensPedido}
        onAlterarQuantidade={handleAlterarQuantidade}
        onAlterarObs={handleAlterarObs}
        onEnviarPedidos={handleEnviarPedidos}
      />

      <DialogPedidosProntos
        open={dialogPedidosOpen}
        onClose={() => setDialogPedidosOpen(false)}
        pedidosProntos={pedidosProntos}
        onMarcarEntregue={handleMarcarEntregue}
      />

      <DialogPerfil
        open={dialogPerfilOpen}
        onClose={() => setDialogPerfilOpen(false)}
        dadosPerfil={dadosPerfil}
        meuBonus={meuBonus}
      />

      <DialogMeusPedidos
        open={dialogMeusPedidosOpen}
        onClose={() => setDialogMeusPedidosOpen(false)}
        meusPedidos={meusPedidos}
        mes={meusPedidosMes}
        setMes={setMeusPedidosMes}
        ano={meusPedidosAno}
        setAno={setMeusPedidosAno}
        onBuscar={handleBuscarMeusPedidos}
      />

      <DialogBonus
        open={dialogBonusOpen}
        onClose={() => setDialogBonusOpen(false)}
        bonusMes={bonusMes}
        setBonusMes={setBonusMes}
        bonusAno={bonusAno}
        setBonusAno={setBonusAno}
        onBuscarBonus={handleBuscarBonus}
        meuBonus={meuBonus}
      />

    </Box >
  );
};

export default DashboardGarcom;