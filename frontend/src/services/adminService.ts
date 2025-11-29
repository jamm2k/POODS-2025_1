import api from './api';
import { MesaResponseDTO } from '../dto/mesa/MesaResponseDTO';
import { MesaCreateDTO } from '../dto/mesa/MesaCreateDTO';
import { MesaUpdateNumeroDTO } from '../dto/mesa/MesaUpdateNumeroDTO';
import { MesaUpdateCapacidadeDTO } from '../dto/mesa/MesaUpdateCapacidadeDTO';
import { ItemResponseDTO } from '../dto/item/ItemResponseDTO';
import { ItemCreateDTO } from '../dto/item/ItemCreateDTO';
import { ItemUpdateDTO } from '../dto/item/ItemUpdateDTO';
import { GarcomResponseDTO } from '../dto/garcom/GarcomResponseDTO';
import { CozinheiroResponseDTO } from '../dto/cozinheiro/CozinheiroResponseDTO';
import { BarmanResponseDTO } from '../dto/barman/BarmanResponseDTO';
import { GarcomCreateDTO } from '../dto/garcom/GarcomCreateDTO';
import { CozinheiroCreateDTO } from '../dto/cozinheiro/CozinheiroCreateDTO';
import { BarmanCreateDTO } from '../dto/barman/BarmanCreateDTO';
import { GarcomUpdateDTO } from '../dto/garcom/GarcomUpdateDTO';
import { CozinheiroUpdateDTO } from '../dto/cozinheiro/CozinheiroUpdateDTO';
import { BarmanUpdateDTO } from '../dto/barman/BarmanUpdateDTO';

export type FuncionarioResponseDTO = GarcomResponseDTO | CozinheiroResponseDTO | BarmanResponseDTO;





class AdminService {

    //mesas
    async getMesas(): Promise<MesaResponseDTO[]> {
        const response = await api.get('/api/mesas');
        return response.data;
    }

    async createMesa(dados: MesaCreateDTO): Promise<MesaResponseDTO> {
        const response = await api.post('/api/mesas', dados);
        return response.data;
    }

    async updateMesaNumero(id: number, dados: MesaUpdateNumeroDTO): Promise<MesaUpdateNumeroDTO> {
        const response = await api.put(`/api/mesas/${id}/numero`, dados);
        return response.data;
    }

    async updateMesaCapacidade(id: number, dados: MesaUpdateCapacidadeDTO): Promise<MesaResponseDTO> {
        const response = await api.put(`/api/mesas/${id}/capacidade`, dados);
        return response.data;
    }

    async deleteMesa(id: number): Promise<void> {
        await api.delete(`/api/mesas/${id}`);
    }


    //funcionarios
    async getGarcons(): Promise<GarcomResponseDTO[]> {
        const response = await api.get('/api/garcons');
        return response.data;
    }

    async getCozinheiros(): Promise<CozinheiroResponseDTO[]> {
        const response = await api.get('/api/cozinheiros');
        return response.data;
    }

    async getBarmen(): Promise<BarmanResponseDTO[]> {
        const response = await api.get('/api/barmen');
        return response.data;
    }

    async createFuncionario(tipo: string, data: GarcomCreateDTO | CozinheiroCreateDTO | BarmanCreateDTO): Promise<FuncionarioResponseDTO> {
        let endpoint = '';
        switch (tipo) {
            case 'GARCOM': endpoint = '/api/garcons'; break;
            case 'COZINHEIRO': endpoint = '/api/cozinheiros'; break;
            case 'BARMAN': endpoint = '/api/barmen'; break;
            default: throw new Error('Tipo de funcionário inválido');
        }
        const response = await api.post(endpoint, data);
        return response.data;
    }

    async updateFuncionario(tipo: string, id: number, data: GarcomUpdateDTO | CozinheiroUpdateDTO | BarmanUpdateDTO): Promise<FuncionarioResponseDTO> {
        let endpoint = '';
        switch (tipo) {
            case 'GARCOM': endpoint = `/api/garcons/${id}`; break;
            case 'COZINHEIRO': endpoint = `/api/cozinheiros/${id}`; break;
            case 'BARMAN': endpoint = `/api/barmen/${id}`; break;
            default: throw new Error('Tipo de funcionário inválido');
        }
        const response = await api.put(endpoint, data);
        return response.data;
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


    //itens
    async getItens(): Promise<ItemResponseDTO[]> {
        const response = await api.get('/api/itens');
        return response.data;
    }

    async createItem(data: ItemCreateDTO): Promise<ItemResponseDTO> {
        const response = await api.post('/api/itens', data);
        return response.data;
    }

    async updateItem(id: number, data: ItemUpdateDTO): Promise<ItemResponseDTO> {
        const response = await api.put(`/api/itens/${id}`, data);
        return response.data;
    }

    async deleteItem(id: number): Promise<void> {
        await api.delete(`/api/itens/${id}`);
    }
}

export default new AdminService();
