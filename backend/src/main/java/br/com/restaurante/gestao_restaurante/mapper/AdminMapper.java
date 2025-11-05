package br.com.restaurante.gestao_restaurante.mapper;

import org.springframework.stereotype.Component;

import br.com.restaurante.gestao_restaurante.dto.admin.AdminCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.admin.AdminResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Admin;

@Component
public class AdminMapper {
    
    public Admin toEntity(AdminCreateDTO adminDTO){
       
        Admin admin = new Admin();
        admin.setNome(adminDTO.getNome());
        admin.setEmail(adminDTO.getEmail());
        admin.setCpf(adminDTO.getCpf());
        admin.setSenha(adminDTO.getSenha());
        admin.setTipoUsuario("ADMIN");

        return admin;
    }

    public AdminResponseDTO toResponseDTO(Admin admin){
        
        if(admin == null){
            return null;
        }

        AdminResponseDTO adminDTO = new AdminResponseDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setNome(admin.getNome());
        adminDTO.setCpf(admin.getCpf());
        adminDTO.setEmail(admin.getEmail());
        adminDTO.setTipoUsuario(admin.getTipoUsuario());
        adminDTO.setDataAdmissao(admin.getDataAdmissao());
        adminDTO.setNivelAcesso(admin.getNivelAcesso());
        adminDTO.setMatricula(admin.getMatricula());

        return adminDTO;
    }
}
