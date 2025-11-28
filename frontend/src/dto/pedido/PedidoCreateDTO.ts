export interface PedidoCreateDTO {
    garcomId: number;
    comandaId: number;
    itemId: number;
    quantidade: number;
    obs?: string;
}
