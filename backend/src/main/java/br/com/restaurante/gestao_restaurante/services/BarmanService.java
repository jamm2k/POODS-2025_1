package br.com.restaurante.gestao_restaurante.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.BarmanRepository;
import br.com.restaurante.gestao_restaurante.repositories.FuncionarioRepository;
import br.com.restaurante.gestao_restaurante.models.Barman;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanResponseDTO;
import br.com.restaurante.gestao_restaurante.mapper.BarmanMapper;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;


@Service
public class BarmanService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private BarmanRepository barmanRepository;

    @Autowired
    private BarmanMapper barmanMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    BarmanService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<BarmanResponseDTO> findAllBarmen() {
        return barmanRepository.findAll().stream()
            .map(barmanMapper::toResponseDTO)
            .toList();
    }
    
    protected Barman findById(Long id) {
        return barmanRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Barman não encontrado com o ID: " + id));
    }

    public BarmanResponseDTO findByIdBarman(Long id) {
        Barman barman = this.findById(id);
        return barmanMapper.toResponseDTO(barman);
    }

    public BarmanResponseDTO criarBarman(BarmanCreateDTO barmanCreateDTO) {
        usuarioRepository.findByEmail(barmanCreateDTO.getEmail()).ifPresent(u ->{
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        });
        usuarioRepository.findByCpf(barmanCreateDTO.getCpf()).ifPresent(u ->{
            throw new RuntimeException("Erro: CPF já cadastrado.");
        });
        funcionarioRepository.findByMatricula(barmanCreateDTO.getMatricula()).ifPresent(f ->{
            throw new RuntimeException("Erro: Matricula já cadastrado.");
        });

        Barman novoBarman = barmanMapper.toEntity(barmanCreateDTO);

        novoBarman.setDataAdmissao(java.time.LocalDate.now());
        novoBarman.setTipoUsuario("BARMAN");
        novoBarman.setStatus("LIVRE");

        novoBarman.setSenha(passwordEncoder.encode(barmanCreateDTO.getSenha()));

        Barman barmanSalvo = barmanRepository.save(novoBarman);
        return barmanMapper.toResponseDTO(barmanSalvo);
    }

    public BarmanResponseDTO atualizarBarman(Long id, BarmanUpdateDTO barmanAtualizado) {
        Barman barmanExistente = this.findById(id);
        
        if (barmanAtualizado.getEmail() != null) {
            usuarioRepository.findByEmail(barmanAtualizado.getEmail())
                .filter(u -> !u.getId().equals(id))
                .ifPresent(u ->{throw new RuntimeException("Erro: E-mail já cadastrado.");});
            barmanExistente.setEmail(barmanAtualizado.getEmail());
        }
        if(barmanAtualizado.getNome() != null) {
            barmanExistente.setNome(barmanAtualizado.getNome());
        }
        if (barmanAtualizado.getSalario() != null) {
            barmanExistente.setSalario(barmanAtualizado.getSalario());
        }

        Barman barmanSalvo = barmanRepository.save(barmanExistente);
        return barmanMapper.toResponseDTO(barmanSalvo);
    }

    public BarmanResponseDTO alterarStatusBarman(Long id, BarmanUpdateStatusDTO statusDTO) {
        if(!statusDTO.getStatus().equals("LIVRE") && !statusDTO.getStatus().equals("OCUPADO") || statusDTO.getStatus() == null ) {
            throw new RuntimeException("Erro: Status inválido. Use 'LIVRE' ou 'OCUPADO'.");
        }
        
        Barman barmanExistente = this.findById(id);
        barmanExistente.setStatus(statusDTO.getStatus());
        
        Barman barmanSalvo = barmanRepository.save(barmanExistente);
        return barmanMapper.toResponseDTO(barmanSalvo);
        
    }

    public void deletarBarman(Long id) {
        Barman barmanExistente = barmanRepository.findById(id).orElse(null);
        if (barmanExistente == null) {
            throw new RuntimeException("Barman não encontrado com o ID: " + id);
        }
        barmanRepository.deleteById(id);
    }

}
