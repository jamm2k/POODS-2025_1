import api from './api';

export interface Mesa {
  id: number;
  numero: number;
  status: 'LIVRE' | 'OCUPADA' | 'RESERVADA';
  capacidade: number;
}

export interface Item {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  tempoPreparo: number;
  premium: boolean;
}

export interface Pedido {
  id: number;
  item: Item;
  quantidade: number;
  status: string;
  obs?: string;
  comanda: {
    id: number;
    nome: string;
    mesa: {
      id: number;
      numero: number;
    };
  };
  garcom: {
    id: number;
    nome: string;
  };
}

export interface Comanda {
  id: number;
  nome: string;
  status: string;
  valorTotal: number;
  taxaServico: boolean;
  dataAbertura: string;
  mesa: Mesa;
  garcom: {
    id: number;
    nome: string;
  };
}

export interface ComandaCreateDTO {
  nome: string;
  mesaId: number;
  garcomId: number;
}

export interface PedidoCreateDTO {
  itemId: number;
  quantidade: number;
  obs?: string;
  comandaId: number;
  garcomId: number;
}

export interface RelatorioBonus {
  idGarcom: number;
  nomeGarcom: string;
  matricula: string;
  mes: number;
  ano: number;
  totalVendasPremium: number;
  bonusCalculado: number;
}

class GarcomService {
  async getMesas(): Promise<Mesa[]> {
    const response = await api.get('/api/mesas');
    return response.data;
  }

  async getMesaById(id: number): Promise<Mesa> {
    const response = await api.get(`/api/mesas/${id}`);
    return response.data;
  }

  async getMeuPerfil() {
    const response = await api.get('/api/garcons/me');
    return response.data;
  }

  async getMeusPedidos(): Promise<Pedido[]> {
    const response = await api.get('/api/garcons/me/pedidos');
    return response.data;
  }

  async getPedidosProntos(): Promise<Pedido[]> {
    const pedidos = await this.getMeusPedidos();
    return pedidos.filter(p => p.status === 'PRONTO');
  }

  async getMeuBonus(mes: number, ano: number): Promise<RelatorioBonus> {
    const response = await api.get('/api/garcons/me/bonus', {
      params: { mes, ano }
    });
    return response.data;
  }

  async getComandasByMesa(mesaId: number): Promise<Comanda[]> {
    const response = await api.get('/api/comandas', {
      params: { mesaId }
    });
    return response.data;
  }

  async getComandaById(id: number): Promise<Comanda> {
    const response = await api.get(`/api/comandas/${id}`);
    return response.data;
  }

  async criarComanda(data: ComandaCreateDTO): Promise<Comanda> {
    const response = await api.post('/api/comandas', data);
    return response.data;
  }


  async atualizarStatusComanda(id: number, status: string): Promise<Comanda> {
    const response = await api.put(`/api/comandas/${id}/status`, { status });
    return response.data;
  }

  async getPedidosByComanda(comandaId: number): Promise<Pedido[]> {
    const response = await api.get(`/api/comandas/${comandaId}/pedidos`);
    return response.data;
  }

  async getItensCardapio(): Promise<Item[]> {
    const response = await api.get('/api/itens');
    return response.data;
  }


  async criarPedido(data: PedidoCreateDTO): Promise<Pedido> {
    const response = await api.post('/api/pedidos', data);
    return response.data;
  }

  async atualizarPedido(
    id: number, 
    data: { quantidade?: number; obs?: string }
  ): Promise<Pedido> {
    const response = await api.put(`/api/pedidos/${id}`, data);
    return response.data;
  }

  async marcarPedidoEntregue(id: number): Promise<Pedido> {
    const response = await api.put(`/api/pedidos/api/${id}/entregar`);
    return response.data;
  }

  async cancelarPedido(id: number): Promise<void> {
    await api.delete(`/api/pedidos/${id}`);
  }

  async atualizarStatusMesa(id: number, status: string): Promise<Mesa> {
    const response = await api.put(`/api/mesas/${id}/status`, { status });
    return response.data;
  }
}

export default new GarcomService();