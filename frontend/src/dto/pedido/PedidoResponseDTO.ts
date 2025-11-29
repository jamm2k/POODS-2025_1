import { ItemResponseDTO } from '../item/ItemResponseDTO';

export interface PedidoResponseDTO {
    id: number;
    comandaId: number;
    garcomId: number;
    itemId: number;
    cozinheiroId?: number;
    barmanId?: number;
    quantidade: number;
    obs?: string;
    status: string;
    mesaNumero?: number;
    dataHora: string;
    item: ItemResponseDTO;
}
