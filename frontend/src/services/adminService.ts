import api from './api';

export interface Mesa {
    id: number;
    numero: number;
    status: 'LIVRE' | 'OCUPADA';
    capacidade: number;
}

export interface Funcionario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    matricula: string;
    dataAdmissao: string;
    salario: number;
    tipo: 'GARCOM' | 'COZINHEIRO' | 'BARMAN';
    status?: string;
}

export interface Item {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    tipo: string;
    disponivel: boolean;
    tempoPreparo?: number;
}

class AdminService {
    async getMesas(): Promise<Mesa[]> {
        const response = await api.get('/api/mesas');
        return response.data;
    }

    async createMesa(numero: number, capacidade: number): Promise<Mesa> {
        const response = await api.post('/api/mesas', { numero, capacidade });
        return response.data;
    }

    async updateMesaNumero(id: number, numero: number): Promise<Mesa> {
        const response = await api.put(`/api/mesas/${id}/numero`, { numero });
        return response.data;
    }

    async deleteMesa(id: number): Promise<void> {
        await api.delete(`/api/mesas/${id}`);
    }

    async getGarcons(): Promise<Funcionario[]> {
        const response = await api.get('/api/garcons');
        return response.data.map((f: any) => ({ ...f, tipo: 'GARCOM' }));
    }

    async getCozinheiros(): Promise<Funcionario[]> {
        const response = await api.get('/api/cozinheiros');
        return response.data.map((f: any) => ({ ...f, tipo: 'COZINHEIRO' }));
    }

    async getBarmen(): Promise<Funcionario[]> {
        const response = await api.get('/api/barmen');
        return response.data.map((f: any) => ({ ...f, tipo: 'BARMAN' }));
    }

    async createFuncionario(tipo: string, data: any): Promise<Funcionario> {
        let endpoint = '';
        switch (tipo) {
            case 'GARCOM': endpoint = '/api/garcons'; break;
            case 'COZINHEIRO': endpoint = '/api/cozinheiros'; break;
            case 'BARMAN': endpoint = '/api/barmen'; break;
            default: throw new Error('Tipo de funcionário inválido');
        }
        const response = await api.post(endpoint, data);
        return { ...response.data, tipo };
    }

    async updateFuncionario(tipo: string, id: number, data: any): Promise<Funcionario> {
        let endpoint = '';
        switch (tipo) {
            case 'GARCOM': endpoint = `/api/garcons/${id}`; break;
            case 'COZINHEIRO': endpoint = `/api/cozinheiros/${id}`; break;
            case 'BARMAN': endpoint = `/api/barmen/${id}`; break;
            default: throw new Error('Tipo de funcionário inválido');
        }
        const response = await api.put(endpoint, data);
        return { ...response.data, tipo };
    }

    async deleteFuncionario(tipo: string, id: number): Promise<void> {
        let endpoint = '';
        switch (tipo) {
            case 'GARCOM': endpoint = `/api/garcons/${id}`; break;
            case 'COZINHEIRO': endpoint = `/api/cozinheiros/${id}`; break;
            case 'BARMAN': endpoint = `/api/barmen/${id}`; break;
            default: throw new Error('Tipo de funcionário inválido');
        }
        await api.delete(endpoint);
    }

    async getItens(): Promise<Item[]> {
        const response = await api.get('/api/itens');
        return response.data;
    }

    async createItem(data: any): Promise<Item> {
        const response = await api.post('/api/itens', data);
        return response.data;
    }

    async updateItem(id: number, data: any): Promise<Item> {
        const response = await api.put(`/api/itens/${id}`, data);
        return response.data;
    }

    async deleteItem(id: number): Promise<void> {
        await api.delete(`/api/itens/${id}`);
    }
}

export default new AdminService();
