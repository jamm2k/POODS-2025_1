package br.com.restaurante.gestao_restaurante.mapper;

import org.springframework.stereotype.Component;

import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Comanda;

@Component
public class ComandaMapper {
    public ComandaResponseDTO toResponseDTO(Comanda comanda) {
        ComandaResponseDTO dto = new ComandaResponseDTO();
        dto.setId(comanda.getId());
        dto.setNome(comanda.getNome());
        dto.setStatus(comanda.getStatus());
        dto.setDataAbertura(comanda.getDataAbertura());
        dto.setDataFechamento(comanda.getDataFechamento());
        dto.setValorTotal(comanda.getValorTotal());
        if (comanda.getMesa() != null) {
            dto.setMesaId(comanda.getMesa().getId());
        }
        if (comanda.getGarcom() != null) {
            dto.setGarcomId(comanda.getGarcom().getId());
        }
        return dto;
    }

    public Comanda toEntity(ComandaCreateDTO dto) {
        Comanda comanda = new Comanda();
        comanda.setNome(dto.getNome());
        comanda.setTaxaServico(dto.isTaxaServico());
        return comanda;
    }
}
