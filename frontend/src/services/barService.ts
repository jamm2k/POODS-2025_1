import api from './api';

export interface Barman {
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
    barman?: {
        id: number;
        nome: string;
    };
    garcom: {
        id: number;
        nome: string;
    };
}

class BarService {

    async getBarmen(): Promise<Barman[]> {
        const response = await api.get('/api/barmen');
        return response.data;
    }
    async getBarmanById(id: number): Promise<Barman> {
        const response = await api.get(`/api/barmen/${id}`);
        return response.data;
    }

    async atualizarStatusBarman(id: number, status: 'LIVRE' | 'OCUPADO'): Promise<void> {
        await api.put(`/api/barmen/${id}/status`, { status });
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


    async iniciarPreparo(pedidoId: number, barmanId: number): Promise<Pedido> {
        const response = await api.put(
            `/api/pedidos/${pedidoId}/atribuir-barman`,
            { barmanId }
        );
        return response.data;
    }

    async concluirPreparo(pedidoId: number, barmanId: number): Promise<Pedido> {
        const response = await api.put(`/api/pedidos/${pedidoId}/concluir-barman`, {
            barmanId
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

    async getBarmanMaisLivre(): Promise<Barman | null> {
        const barmen = await this.getBarmen();
        const livres = barmen.filter(c => c.status === 'LIVRE');
        return livres.length > 0 ? livres[0] : null;
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

export default new BarService();
