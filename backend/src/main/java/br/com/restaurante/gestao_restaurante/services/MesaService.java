package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.MesaRepository;
import br.com.restaurante.gestao_restaurante.models.Mesa;

@Service
public class MesaService {
    @Autowired
    private MesaRepository mesaRepository;

    public Mesa findByIdMesa(Long id) {
        return mesaRepository.findById(id).orElse(null);
    }


    public Mesa criarNovaMesa(Mesa mesa) {

        mesaRepository.findByNumero(mesa.getNumero()).ifPresent(m -> {
            throw new RuntimeException("Erro: Número da mesa já cadastrado.");
        });

        mesa.setStatus("LIVRE");
        return mesaRepository.save(mesa);
    }

    public Mesa atualizarMesa(Long id, Mesa mesaAtualizada) {
        Mesa mesaExistente = this.findByIdMesa(id);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }

        if (mesaAtualizada.getNumero() != null && !mesaAtualizada.getNumero().equals(mesaExistente.getNumero())) {
            mesaRepository.findByNumero(mesaAtualizada.getNumero()).ifPresent(m -> {
                throw new IllegalStateException("Erro: Número da mesa já cadastrado em outra mesa.");
            });
            mesaExistente.setNumero(mesaAtualizada.getNumero());
        }

        if (mesaAtualizada.getNumero() != null) {
            mesaExistente.setNumero(mesaAtualizada.getNumero());
        }
        if (mesaAtualizada.getStatus() != null) {
            mesaExistente.setStatus(mesaAtualizada.getStatus());
        }

        return mesaRepository.save(mesaExistente);
    }

    public void deletarMesa(Long id) {
        Mesa mesaExistente = this.findByIdMesa(id);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }
        mesaRepository.deleteById(id);
    }
}
