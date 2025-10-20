package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.CozinheiroRepository;
import br.com.restaurante.gestao_restaurante.repositories.FuncionarioRepository;
import br.com.restaurante.gestao_restaurante.models.Cozinheiro;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroUpdateStatus;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroResponseDTO;
import br.com.restaurante.gestao_restaurante.mapper.CozinheiroMapper;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;


@Service
public class CozinheiroService {
    
    @Autowired
    private CozinheiroRepository cozinheiroRepository;

    @Autowired
    private CozinheiroMapper cozinheiroMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    
    public List<CozinheiroResponseDTO> findAllCozinheiros() {
        return cozinheiroRepository.findAll().stream()
            .map(cozinheiroMapper::toResponseDTO)
            .toList();
    }
    
    private Cozinheiro findById(Long id) {
        return cozinheiroRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Cozinheiro não encontrado com o ID: " + id));
    }

    public CozinheiroResponseDTO findByIdCozinheiro(Long id) {
        Cozinheiro cozinheiro = this.findById(id);
        return cozinheiroMapper.toResponseDTO(cozinheiro);
    }

    public CozinheiroResponseDTO criarCozinheiro(CozinheiroCreateDTO cozinheiroCreateDTO) {
        usuarioRepository.findByEmail(cozinheiroCreateDTO.getEmail()).ifPresent(u ->{
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        });
        usuarioRepository.findByCpf(cozinheiroCreateDTO.getCpf()).ifPresent(u ->{
            throw new RuntimeException("Erro: CPF já cadastrado.");
        });
        funcionarioRepository.findByMatricula(cozinheiroCreateDTO.getMatricula()).ifPresent(f ->{
            throw new RuntimeException("Erro: Matricula já cadastrado.");
        });

        Cozinheiro novoCozinheiro = cozinheiroMapper.toEntity(cozinheiroCreateDTO);

        novoCozinheiro.setDataAdmissao(java.time.LocalDate.now());
        novoCozinheiro.setTipoUsuario("COZINHEIRO");
        novoCozinheiro.setStatus("LIVRE");

        Cozinheiro cozinheiroSalvo = cozinheiroRepository.save(novoCozinheiro);
        return cozinheiroMapper.toResponseDTO(cozinheiroSalvo);
    }

    public CozinheiroResponseDTO atualizarCozinheiro(Long id, CozinheiroUpdateDTO cozinheiroAtualizado) {
        Cozinheiro cozinheiroExistente = this.findById(id);
        
        if (cozinheiroAtualizado.getEmail() != null) {
            usuarioRepository.findByEmail(cozinheiroAtualizado.getEmail())
                .filter(u -> !u.getId().equals(id))
                .ifPresent(u ->{throw new RuntimeException("Erro: E-mail já cadastrado.");});
            cozinheiroExistente.setEmail(cozinheiroAtualizado.getEmail());
        }
        if(cozinheiroAtualizado.getNome() != null) {
            cozinheiroExistente.setNome(cozinheiroAtualizado.getNome());
        }
        if (cozinheiroAtualizado.getSalario() != null) {
            cozinheiroExistente.setSalario(cozinheiroAtualizado.getSalario());
        }

        Cozinheiro cozinheiroSalvo = cozinheiroRepository.save(cozinheiroExistente);
        return cozinheiroMapper.toResponseDTO(cozinheiroSalvo);
    }

    public CozinheiroResponseDTO alterarStatusCozinheiro(Long id, CozinheiroUpdateStatus statusDTO) {
        if(!statusDTO.getStatus().equals("LIVRE") && !statusDTO.getStatus().equals("OCUPADO") || statusDTO.getStatus() == null ) {
            throw new RuntimeException("Erro: Status inválido. Use 'LIVRE' ou 'OCUPADO'.");
        }
        
        Cozinheiro cozinheiroExistente = this.findById(id);
        cozinheiroExistente.setStatus(statusDTO.getStatus());
        Cozinheiro cozinheiroSalvo = cozinheiroRepository.save(cozinheiroExistente);
        return cozinheiroMapper.toResponseDTO(cozinheiroSalvo);
        
    }

    public void deletarCozinheiro(Long id) {
        Cozinheiro cozinheiroExistente = cozinheiroRepository.findById(id).orElse(null);
        if (cozinheiroExistente == null) {
            throw new RuntimeException("Cozinheiro não encontrado com o ID: " + id);
        }
        cozinheiroRepository.deleteById(id);
    }

}
