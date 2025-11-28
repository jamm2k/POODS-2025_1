export interface ComandaResponseDTO {
    id: number;
    mesaId: number;
    garcomId: number;
    status: string;
    nome: string;
    valorTotal: number;
    dataAbertura: string;
    dataFechamento?: string;
    taxaServico: boolean;
}
