package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.MesaRepository;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaUpdateNumeroDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.mapper.MesaMapper;
import br.com.restaurante.gestao_restaurante.models.Mesa;

@Service
public class MesaService {
    
    @Autowired
    private MesaRepository mesaRepository;
    
    @Autowired
    private MesaMapper mesaMapper;

    public MesaResponseDTO findByIdMesa(Long id) {
        Mesa mesa = mesaRepository.findById(id).orElse(null);
        return mesaMapper.toResponseDTO(mesa);
    }
    
    public List<MesaResponseDTO> findAllMesas() {
        return mesaRepository.findAll()
            .stream()
            .map(mesaMapper::toResponseDTO)
            .toList();    
    }
    
    public MesaResponseDTO criarNovaMesa(MesaCreateDTO mesaDTO) {
        
        mesaRepository.findByNumero(mesaDTO.getNumero()).ifPresent(m -> {
            throw new RuntimeException("Erro: Número da mesa já cadastrado.");
        });
        
        Mesa mesa = mesaMapper.toEntity(mesaDTO);
        mesa.setStatus("LIVRE");

        Mesa mesaSalva = mesaRepository.save(mesa);
        return mesaMapper.toResponseDTO(mesaSalva);
    }

    public MesaResponseDTO atualizarStatusMesa(Long id, MesaUpdateStatusDTO mesaAtualizada) {
        Mesa mesaExistente = mesaRepository.findById(id).orElse(null);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }

        if (mesaAtualizada.getStatus() != null) {
            mesaExistente.setStatus(mesaAtualizada.getStatus());
        }
        
        Mesa mesaSalva = mesaRepository.save(mesaExistente);
        return mesaMapper.toResponseDTO(mesaSalva);
    }

    public MesaResponseDTO atualizarNumeroMesa(Long id, MesaUpdateNumeroDTO mesaAtualizada) {
        Mesa mesaExistente = mesaRepository.findById(id).orElse(null);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }

        mesaRepository.findByNumero(mesaAtualizada.getNumero()).ifPresent(m -> {
            if (!m.getId().equals(id)) {
                throw new RuntimeException("Erro: Número da mesa já cadastrado.");
            }
            mesaExistente.setNumero(mesaAtualizada.getNumero());
        });

        Mesa mesaSalva = mesaRepository.save(mesaExistente);
        return mesaMapper.toResponseDTO(mesaSalva);
    }

    public void deletarMesa(Long id) {
        Mesa mesaExistente = mesaRepository.findById(id).orElse(null);
        if (mesaExistente == null) {
            throw new RuntimeException("Mesa não encontrada com o ID: " + id);
        }
        if (!"LIVRE".equals(mesaExistente.getStatus())) {
            throw new RuntimeException("Erro: Apenas mesas com status 'LIVRE' podem ser deletadas.");
        }
        mesaRepository.deleteById(id);
    }


}
