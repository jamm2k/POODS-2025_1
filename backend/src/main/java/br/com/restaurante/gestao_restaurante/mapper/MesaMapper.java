package br.com.restaurante.gestao_restaurante.mapper;

import org.springframework.stereotype.Component;

import br.com.restaurante.gestao_restaurante.dto.mesa.MesaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Mesa;

@Component
public class MesaMapper {
    
    public Mesa toEntity(MesaCreateDTO mesaDTO) {
        Mesa mesa = new Mesa();
        mesa.setNumero(mesaDTO.getNumero());
        return mesa;
    }

    public MesaResponseDTO toResponseDTO(Mesa mesa) {
        if (mesa == null) {
            return null;
        }

        MesaResponseDTO dto = new MesaResponseDTO();
        dto.setId(mesa.getId());
        dto.setNumero(mesa.getNumero());
        dto.setStatus(mesa.getStatus());

        return dto;
    }
}
