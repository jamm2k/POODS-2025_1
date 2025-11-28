export interface GarcomResponseDTO {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    dataAdmissao: string;
    matricula: string;
    salario: number;
    bonus: number;
    tipoUsuario?: string;
}
