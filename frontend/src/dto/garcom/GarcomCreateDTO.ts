export interface GarcomCreateDTO {
    nome: string;
    email: string;
    cpf: string;
    senha?: string;
    salario: number;
    dataAdmissao?: string;
    matricula: string;
    bonus?: number;
}
