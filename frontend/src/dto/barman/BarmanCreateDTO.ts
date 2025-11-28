export interface BarmanCreateDTO {
    barmanId?: number;
    nome: string;
    email: string;
    cpf: string;
    senha?: string;
    salario: number;
    matricula: string;
}
