import api from './api';
import { BarmanResponseDTO } from '../dto/barman/BarmanResponseDTO';
import { PedidoResponseDTO } from '../dto/pedido/PedidoResponseDTO';
import { BarmanUpdateStatusDTO } from '../dto/barman/BarmanUpdateStatusDTO';
import { PedidoUpdateStatusDTO } from '../dto/pedido/PedidoUpdateStatusDTO';



class BarService {

    async getBarmen(): Promise<BarmanResponseDTO[]> {
        const response = await api.get('/api/barmen');
        return response.data;
    }
    async getBarmanById(id: number): Promise<BarmanResponseDTO> {
        const response = await api.get(`/api/barmen/${id}`);
        return response.data;
    }

    async atualizarStatusBarman(id: number, status: string): Promise<void> {
        const dto: BarmanUpdateStatusDTO = { status };
        await api.put(`/api/barmen/${id}/status`, dto);
    }

    async getPedidosByStatus(status: string): Promise<PedidoResponseDTO[]> {
        const response = await api.get('/api/pedidos', {
            params: { status }
        });
        return response.data;
    }


    async getPedidosSolicitados(): Promise<PedidoResponseDTO[]> {
        return this.getPedidosByStatus('SOLICITADO');
    }

    async getPedidosEmPreparo(): Promise<PedidoResponseDTO[]> {
        return this.getPedidosByStatus('EM PREPARO');
    }

    async getPedidosProntos(): Promise<PedidoResponseDTO[]> {
        return this.getPedidosByStatus('PRONTO');
    }


    async iniciarPreparo(pedidoId: number, barmanId: number): Promise<PedidoResponseDTO> {
        const response = await api.put(
            `/api/pedidos/${pedidoId}/atribuir-barman`,
            { barmanId }
        );
        return response.data;
    }

    async concluirPreparo(pedidoId: number, barmanId: number): Promise<PedidoResponseDTO> {
        const response = await api.put(`/api/pedidos/${pedidoId}/concluir-barman`, {
            barmanId
        });
        return response.data;
    }

    async atualizarStatusPedido(pedidoId: number, status: string): Promise<PedidoResponseDTO> {
        const dto: PedidoUpdateStatusDTO = { statusPedido: status };
        const response = await api.put(`/api/pedidos/${pedidoId}/status`, null, {
            params: dto
        });
        return response.data;
    }

    async getPedidoById(id: number): Promise<PedidoResponseDTO> {
        const response = await api.get(`/api/pedidos/${id}`);
        return response.data;
    }

    async getBarmanMaisLivre(): Promise<BarmanResponseDTO | null> {
        const barmen = await this.getBarmen();
        const livres = barmen.filter(c => c.status === 'LIVRE');
        return livres.length > 0 ? livres[0] : null;
    }

    filtrarPedidosBebidas(pedidos: PedidoResponseDTO[]): PedidoResponseDTO[] {
        return pedidos.filter(
            p => p.item && (p.item.categoria === 'DRINK')
        );
    }
}

export default new BarService();
