import api from './api';
import { MesaResponseDTO } from '../dto/mesa/MesaResponseDTO';
import { MesaUpdateStatusDTO } from '../dto/mesa/MesaUpdateStatusDTO';
import { ItemResponseDTO } from '../dto/item/ItemResponseDTO';
import { PedidoResponseDTO } from '../dto/pedido/PedidoResponseDTO';
import { PedidoCreateDTO } from '../dto/pedido/PedidoCreateDTO';
import { PedidoUpdateDTO } from '../dto/pedido/PedidoUpdateDTO';
import { ComandaResponseDTO } from '../dto/comanda/ComandaResponseDTO';
import { ComandaCreateDTO } from '../dto/comanda/ComandaCreateDTO';
import { ComandaUpdateStatusDTO } from '../dto/comanda/ComandaUpdateStatusDTO';
import { RelatorioGarcomDTO } from '../dto/relatorio/RelatorioGarcomDTO';



class GarcomService {

  //mesas
  async getMesas(): Promise<MesaResponseDTO[]> {
    const response = await api.get('/api/mesas');
    return response.data;
  }

  async getMesaById(id: number): Promise<MesaResponseDTO> {
    const response = await api.get(`/api/mesas/${id}`);
    return response.data;
  }

  //perfil
  async getMeuPerfil() {
    const response = await api.get('/api/garcons/me');
    return response.data;
  }

  //pedidos
  async getMeusPedidos(mes: number, ano: number): Promise<PedidoResponseDTO[]> {
    const response = await api.get('/api/garcons/me/pedidos', {
      params: { mes, ano }
    });
    return response.data;
  }

  async getPedidosProntos(): Promise<PedidoResponseDTO[]> {
    const hoje = new Date();
    const pedidos = await this.getMeusPedidos(hoje.getMonth() + 1, hoje.getFullYear());
    return pedidos.filter(p => p.status === 'PRONTO');
  }


  async criarPedido(data: PedidoCreateDTO): Promise<PedidoResponseDTO> {
    const response = await api.post('/api/pedidos', data);
    return response.data;
  }

  async atualizarPedido(
    id: number,
    data: PedidoUpdateDTO
  ): Promise<PedidoResponseDTO> {
    const response = await api.put(`/api/pedidos/${id}`, data);
    return response.data;
  }

  async marcarPedidoEntregue(id: number): Promise<PedidoResponseDTO> {
    const response = await api.put(`/api/pedidos/${id}/entregar`);
    return response.data;
  }

  async cancelarPedido(id: number): Promise<void> {
    await api.delete(`/api/pedidos/${id}`);
  }

  //bonus
  async getMeuBonus(mes: number, ano: number): Promise<RelatorioGarcomDTO> {
    const response = await api.get('/api/garcons/me/bonus', {
      params: { mes, ano }
    });
    return response.data;
  }

  //comandas
  async getComandasByMesa(mesaId: number): Promise<ComandaResponseDTO[]> {
    const response = await api.get('/api/comandas', {
      params: { mesaId }
    });
    return response.data;
  }

  async getComandaById(id: number): Promise<ComandaResponseDTO> {
    const response = await api.get(`/api/comandas/${id}`);
    return response.data;
  }

  async criarComanda(data: ComandaCreateDTO): Promise<ComandaResponseDTO> {
    const response = await api.post('/api/comandas', data);
    return response.data;
  }


  async atualizarStatusComanda(id: number, status: string): Promise<ComandaResponseDTO> {
    const dto: ComandaUpdateStatusDTO = { status };
    const response = await api.put(`/api/comandas/${id}/status`, dto);
    return response.data;
  }

  async getPedidosByComanda(comandaId: number): Promise<PedidoResponseDTO[]> {
    const response = await api.get(`/api/comandas/${comandaId}/pedidos`);
    return response.data;
  }

  //itens
  async getItensCardapio(): Promise<ItemResponseDTO[]> {
    const response = await api.get('/api/itens');
    return response.data;
  }

  async atualizarTaxaServico(id: number, taxaServico: boolean): Promise<ComandaResponseDTO> {
    const response = await api.put(`/api/comandas/${id}/taxa-servico`, { taxaServico });
    return response.data;
  }

  async atualizarStatusMesa(id: number, status: string): Promise<MesaResponseDTO> {
    const dto: MesaUpdateStatusDTO = { status };
    const response = await api.put(`/api/mesas/${id}/status`, dto);
    return response.data;
  }
}

export default new GarcomService();