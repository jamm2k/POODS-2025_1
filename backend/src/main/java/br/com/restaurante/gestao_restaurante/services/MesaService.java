package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.MesaRepository;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaUpdateNumeroDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.models.Mesa;

@Service
public class MesaService {
    @Autowired
    private MesaRepository mesaRepository;

    public Mesa findByIdMesa(Long id) {
        return mesaRepository.findById(id).orElse(null);
    }


    public Mesa criarNovaMesa(MesaCreateDTO mesaDTO) {

        mesaRepository.findByNumero(mesaDTO.getNumero()).ifPresent(m -> {
            throw new RuntimeException("Erro: Número da mesa já cadastrado.");
        });

        Mesa mesa = new Mesa();
        mesa.setNumero(mesaDTO.getNumero());
        mesa.setStatus("LIVRE");
        return mesaRepository.save(mesa);
    }

    public Mesa atualizarStatusMesa(Long id, MesaUpdateStatusDTO mesaAtualizada) {
        Mesa mesaExistente = this.findByIdMesa(id);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }

        if (mesaAtualizada.getStatus() != null) {
            mesaExistente.setStatus(mesaAtualizada.getStatus());
        }

        return mesaRepository.save(mesaExistente);
    }

    public Mesa atualizarNumeroMesa(Long id, MesaUpdateNumeroDTO mesaAtualizada) {
        Mesa mesaExistente = this.findByIdMesa(id);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }

        mesaRepository.findByNumero(mesaAtualizada.getNumero()).ifPresent(m -> {
            if (!m.getId().equals(id)) {
                throw new RuntimeException("Erro: Número da mesa já cadastrado.");
            }
        });

        mesaExistente.setNumero(mesaAtualizada.getNumero());
        return mesaRepository.save(mesaExistente);
    }

    public void deletarMesa(Long id) {
        Mesa mesaExistente = this.findByIdMesa(id);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }
        if (!"LIVRE".equals(mesaExistente.getStatus())) {
            throw new RuntimeException("Erro: Apenas mesas com status 'LIVRE' podem ser deletadas.");
        }
        mesaRepository.deleteById(id);
    }
}
