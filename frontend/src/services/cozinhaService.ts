import api from './api';
import { CozinheiroResponseDTO } from '../dto/cozinheiro/CozinheiroResponseDTO';
import { PedidoResponseDTO } from '../dto/pedido/PedidoResponseDTO';
import { CozinheiroUpdateStatusDTO } from '../dto/cozinheiro/CozinheiroUpdateStatusDTO';
import { PedidoUpdateStatusDTO } from '../dto/pedido/PedidoUpdateStatusDTO';



class CozinhaService {

  async getCozinheiros(): Promise<CozinheiroResponseDTO[]> {
    const response = await api.get('/api/cozinheiros');
    return response.data;
  }
  async getCozinheiroById(id: number): Promise<CozinheiroResponseDTO> {
    const response = await api.get(`/api/cozinheiros/${id}`);
    return response.data;
  }

  async atualizarStatusCozinheiro(id: number, status: string): Promise<void> {
    const dto: CozinheiroUpdateStatusDTO = { status };
    await api.put(`/api/cozinheiros/${id}/status`, dto);
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


  async iniciarPreparo(pedidoId: number, cozinheiroId: number): Promise<PedidoResponseDTO> {
    const response = await api.put(
      `/api/pedidos/${pedidoId}/atribuir-cozinheiro`,
      { cozinheiroId }
    );
    return response.data;
  }

  async concluirPreparo(pedidoId: number, cozinheiroId: number): Promise<PedidoResponseDTO> {
    const response = await api.put(`/api/pedidos/${pedidoId}/concluir`, {
      cozinheiroId
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

  async getCozinheiroMaisLivre(): Promise<CozinheiroResponseDTO | null> {
    const cozinheiros = await this.getCozinheiros();
    const livres = cozinheiros.filter(c => c.status === 'LIVRE');
    return livres.length > 0 ? livres[0] : null;
  }

  filtrarPedidosComida(pedidos: PedidoResponseDTO[]): PedidoResponseDTO[] {
    return pedidos.filter(
      p =>
        p.item &&
        (p.item.categoria === 'COMIDA' ||
          p.item.categoria === 'SOBREMESA')
    );
  }
}

export default new CozinhaService();