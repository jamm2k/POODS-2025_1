package br.com.restaurante.gestao_restaurante.services;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.restaurante.gestao_restaurante.repositories.AdminRepository;
import br.com.restaurante.gestao_restaurante.repositories.FuncionarioRepository;
import br.com.restaurante.gestao_restaurante.models.Admin;
import br.com.restaurante.gestao_restaurante.dto.admin.AdminCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.admin.AdminResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.admin.AdminUpdateDTO;
import br.com.restaurante.gestao_restaurante.mapper.AdminMapper;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;


@Service
public class AdminService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    AdminService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<AdminResponseDTO> findAllAdmins() {
        return adminRepository.findAll().stream()
            .map(adminMapper::toResponseDTO)
            .toList();
    }
    
    protected Admin findById(Long id) {
        return adminRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("admin não encontrado com o ID: " + id));
    }

    public AdminResponseDTO findByIdAdmin(Long id) {
        Admin admin = this.findById(id);
        return adminMapper.toResponseDTO(admin);
    }

    public AdminResponseDTO criarAdmin(AdminCreateDTO adminCreateDTO) {
        usuarioRepository.findByEmail(adminCreateDTO.getEmail()).ifPresent(u ->{
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        });
        usuarioRepository.findByCpf(adminCreateDTO.getCpf()).ifPresent(u ->{
            throw new RuntimeException("Erro: CPF já cadastrado.");
        });
        funcionarioRepository.findByMatricula(adminCreateDTO.getMatricula()).ifPresent(f ->{
            throw new RuntimeException("Erro: Matricula já cadastrado.");
        });

        Admin novoAdmin = adminMapper.toEntity(adminCreateDTO);

        novoAdmin.setDataAdmissao(java.time.LocalDate.now());
        novoAdmin.setTipoUsuario("ADMIN");

        novoAdmin.setSenha(passwordEncoder.encode(adminCreateDTO.getSenha()));

        Admin adminSalvo = adminRepository.save(novoAdmin);
        return adminMapper.toResponseDTO(adminSalvo);
    }

    public AdminResponseDTO atualizarAdmin(Long id, AdminUpdateDTO adminAtualizado) {
        Admin adminExistente = this.findById(id);
        
        if (adminAtualizado.getEmail() != null) {
            usuarioRepository.findByEmail(adminAtualizado.getEmail())
                .filter(u -> !u.getId().equals(id))
                .ifPresent(u ->{throw new RuntimeException("Erro: E-mail já cadastrado.");});
            adminExistente.setEmail(adminAtualizado.getEmail());
        }
        if(adminAtualizado.getNome() != null) {
            adminExistente.setNome(adminAtualizado.getNome());
        }
        if (adminAtualizado.getSalario() != 0.0) {
            adminExistente.setSalario(adminAtualizado.getSalario());
        }
        if (adminAtualizado.getNivelAcesso() != null) {
            adminExistente.setNivelAcesso(adminAtualizado.getNivelAcesso());
        }

        Admin adminSalvo = adminRepository.save(adminExistente);
        return adminMapper.toResponseDTO(adminSalvo);
    }

    public void deletarAdmin(Long id) {
        Admin adminExistente = adminRepository.findById(id).orElse(null);
        if (adminExistente == null) {
            throw new RuntimeException("Admin não encontrado com o ID: " + id);
        }
        adminRepository.deleteById(id);
    }

}
