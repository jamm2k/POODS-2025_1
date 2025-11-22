package br.com.restaurante.gestao_restaurante.mapper;

import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Garcom;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class GarcomMapper {
    
    public Garcom toEntity(GarcomCreateDTO garcomDTO) {
        Garcom garcom = new Garcom();
        garcom.setNome(garcomDTO.getNome());
        garcom.setEmail(garcomDTO.getEmail());
        garcom.setCpf(garcomDTO.getCpf());
        garcom.setSenha(garcomDTO.getSenha());
        garcom.setSalario(garcomDTO.getSalario());
        garcom.setTipoUsuario("GARCOM");
        garcom.setMatricula(garcomDTO.getMatricula());
        if(garcom.getDataAdmissao() == null){
            garcom.setDataAdmissao(LocalDate.now());
        }
        garcom.setBonus(null);

        return garcom;
    }

    public GarcomResponseDTO toResponseDTO(Garcom garcom) {
        if (garcom == null) {
            return null;
        }

        GarcomResponseDTO dto = new GarcomResponseDTO();
        
                dto.setId(garcom.getId());
                dto.setNome(garcom.getNome());
                dto.setCpf(garcom.getCpf());
                dto.setDataAdmissao(garcom.getDataAdmissao());
                dto.setMatricula(garcom.getMatricula());
                dto.setSalario(garcom.getSalario());
                dto.setBonus(garcom.getBonus() != null ? garcom.getBonus() : 0.0);
                dto.setEmail(garcom.getEmail());
        return dto;
        
    }
}
