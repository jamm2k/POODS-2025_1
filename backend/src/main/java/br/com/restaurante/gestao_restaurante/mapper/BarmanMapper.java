package br.com.restaurante.gestao_restaurante.mapper;

import br.com.restaurante.gestao_restaurante.dto.barman.BarmanCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Barman;
import org.springframework.stereotype.Component;

@Component
public class BarmanMapper {
    public Barman toEntity(BarmanCreateDTO dto) {
        Barman barman = new Barman();
        barman.setNome(dto.getNome());
        barman.setEmail(dto.getEmail());
        barman.setCpf(dto.getCpf());
        barman.setSenha(dto.getSenha());
        barman.setSalario(dto.getSalario());
        barman.setMatricula(dto.getMatricula());
        return barman;
    }

    public BarmanResponseDTO toResponseDTO(Barman barman) {
        if (barman == null) {
            return null;
        }
        BarmanResponseDTO dto = new BarmanResponseDTO();
        dto.setId(barman.getId());
        dto.setNome(barman.getNome());
        dto.setMatricula(barman.getMatricula());
        dto.setSalario(barman.getSalario());
        dto.setEmail(barman.getEmail());
        dto.setStatus(barman.getStatus());
        dto.setTipoUsuario(barman.getTipoUsuario());
        dto.setDataAdmissao(barman.getDataAdmissao());
        dto.setCpf(barman.getCpf());
        return dto;
    }
}
