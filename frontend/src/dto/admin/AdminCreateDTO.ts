export interface AdminCreateDTO {
    nome: string;
    email: string;
    senha?: string;
    cpf: string;
    matricula: string;
    salario: number;
    nivelAcesso: number;
}
