export interface BarmanResponseDTO {
    id: number;
    nome: string;
    matricula: string;
    salario: number;
    email: string;
    status: string;
    tipoUsuario: string;
    dataAdmissao: string;
    cpf?: string;
}
