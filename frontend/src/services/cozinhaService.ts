import api from './api';

export interface Cozinheiro {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  dataAdmissao: string;
  salario: number;
  status: 'LIVRE' | 'OCUPADO';
}

export interface Pedido {
  id: number;
  item: {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
    tempoPreparo?: number;
  };
  quantidade: number;
  status: string;
  obs?: string;
  comanda: {
    id: number;
    nome: string;
    status: string;
    mesa: {
      id: number;
      numero: number;
    };
  };
  cozinheiro?: {
    id: number;
    nome: string;
  };
  garcom: {
    id: number;
    nome: string;
  };
}

class CozinhaService {

  async getCozinheiros(): Promise<Cozinheiro[]> {
    const response = await api.get('/api/cozinheiros');
    return response.data;
  }
  async getCozinheiroById(id: number): Promise<Cozinheiro> {
    const response = await api.get(`/api/cozinheiros/${id}`);
    return response.data;
  }

  async atualizarStatusCozinheiro(id: number, status: 'LIVRE' | 'OCUPADO'): Promise<void> {
    await api.put(`/api/cozinheiros/${id}/status`, { status });
  }

  async getPedidosByStatus(status: string): Promise<Pedido[]> {
    const response = await api.get('/api/pedidos', {
      params: { status }
    });
    return response.data;
  }


  async getPedidosSolicitados(): Promise<Pedido[]> {
    return this.getPedidosByStatus('SOLICITADO');
  }

  async getPedidosEmPreparo(): Promise<Pedido[]> {
    return this.getPedidosByStatus('EM PREPARO');
  }

  async getPedidosProntos(): Promise<Pedido[]> {
    return this.getPedidosByStatus('PRONTO');
  }


  async iniciarPreparo(pedidoId: number, cozinheiroId: number): Promise<Pedido> {
    const response = await api.put(
      `/api/pedidos/api/${pedidoId}/atribuir-cozinheiro`,
      cozinheiroId
    );
    return response.data;
  }

  async concluirPreparo(pedidoId: number, cozinheiroId: number): Promise<Pedido> {
    const response = await api.put(`/api/pedidos/api/${pedidoId}/concluir`, {
      cozinheiroId
    });
    return response.data;
  }

  async atualizarStatusPedido(pedidoId: number, status: string): Promise<Pedido> {
    const response = await api.put(`/api/pedidos/${pedidoId}/status`, {
      statusPedido: status
    });
    return response.data;
  }

  async getPedidoById(id: number): Promise<Pedido> {
    const response = await api.get(`/api/pedidos/${id}`);
    return response.data;
  }

  async getCozinheiroMaisLivre(): Promise<Cozinheiro | null> {
    const cozinheiros = await this.getCozinheiros();
    const livres = cozinheiros.filter(c => c.status === 'LIVRE');
    return livres.length > 0 ? livres[0] : null;
  }

  filtrarPedidosComida(pedidos: Pedido[]): Pedido[] {
    return pedidos.filter(
      p =>
        p.item.categoria !== 'BEBIDA' &&
        p.item.categoria !== 'DRINK' &&
        p.item.categoria !== 'DRINKS'
    );
  }

  filtrarPedidosBebidas(pedidos: Pedido[]): Pedido[] {
    return pedidos.filter(
      p =>
        p.item.categoria === 'BEBIDA' ||
        p.item.categoria === 'DRINK' ||
        p.item.categoria === 'DRINKS'
    );
  }
}

export default new CozinhaService();