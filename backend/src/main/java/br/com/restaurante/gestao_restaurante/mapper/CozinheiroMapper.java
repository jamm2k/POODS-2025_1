package br.com.restaurante.gestao_restaurante.mapper;

import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Cozinheiro;
import org.springframework.stereotype.Component;

@Component
public class CozinheiroMapper {
    public Cozinheiro toEntity(CozinheiroCreateDTO dto) {
        Cozinheiro cozinheiro = new Cozinheiro();
        cozinheiro.setNome(dto.getNome());
        cozinheiro.setEmail(dto.getEmail());
        cozinheiro.setCpf(dto.getCpf());
        cozinheiro.setSenha(dto.getSenha());
        cozinheiro.setSalario(dto.getSalario());
        cozinheiro.setMatricula(dto.getMatricula());
        return cozinheiro;
    }

    public CozinheiroResponseDTO toResponseDTO(Cozinheiro cozinheiro) {
        if (cozinheiro == null) {
            return null;
        }
        CozinheiroResponseDTO dto = new CozinheiroResponseDTO();
        dto.setId(cozinheiro.getId());
        dto.setNome(cozinheiro.getNome());
        dto.setMatricula(cozinheiro.getMatricula());
        dto.setSalario(cozinheiro.getSalario());
        dto.setEmail(cozinheiro.getEmail());
        dto.setStatus(cozinheiro.getStatus());
        dto.setTipoUsuario(cozinheiro.getTipoUsuario());
        dto.setDataAdmissao(cozinheiro.getDataAdmissao());
        dto.setCpf(cozinheiro.getCpf());
        return dto;
    }
}
