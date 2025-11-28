import { ItemResponseDTO } from '../item';

export interface CardapioResponseDTO {
    id: number;
    nome: string;
    itens: ItemResponseDTO[];
}
