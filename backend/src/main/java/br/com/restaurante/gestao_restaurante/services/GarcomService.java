package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.GarcomRepository;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomUpdateDTO;
import br.com.restaurante.gestao_restaurante.mapper.GarcomMapper;
import br.com.restaurante.gestao_restaurante.models.Garcom;

@Service
public class GarcomService {
   
    @Autowired
    private GarcomRepository garcomRepository;

    @Autowired
    private UsuarioRepository  usuarioRepository;
    
    @Autowired
    private GarcomMapper garcomMapper;
    
    public GarcomResponseDTO findByIdGarcom(Long id) {
        Garcom garcom = garcomRepository.findById(id).orElse(null);
        
        return garcomMapper.toResponseDTO(garcom);
    }

    public List<Garcom> findAllGarcons() {
        return garcomRepository.findAll();
    }

    public GarcomResponseDTO criarNovoGarcom(GarcomCreateDTO garcomDTO) {
        
        usuarioRepository.findByEmail(garcomDTO.getEmail()).ifPresent(u ->{
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        });

        usuarioRepository.findByCpf(garcomDTO.getCpf()).ifPresent(u ->{
            throw new RuntimeException("Erro: CPF já cadastrado.");
        });

        Garcom novoGarcom = garcomMapper.toEntity(garcomDTO);
        if(novoGarcom.getDataAdmissao() == null){
            novoGarcom.setDataAdmissao(LocalDate.now());
        }
        Garcom garcomSalvo = garcomRepository.save(novoGarcom);
        return garcomMapper.toResponseDTO(garcomSalvo);
    }

    public GarcomResponseDTO atualizarGarcom(Long id, GarcomUpdateDTO garcomAtualizado) {
        Garcom garcomExistente = garcomRepository.findById(id).orElse(null);
        if (garcomExistente == null) {
            throw new RuntimeException("Garçom não encontrado com o ID: " + id);
        }

        usuarioRepository.findByEmail(garcomAtualizado.getEmail()).ifPresent(u ->{
            if(!u.getId().equals(id)){
                throw new RuntimeException("Erro: E-mail já cadastrado.");  }
        });


        if (garcomAtualizado.getNome() != null) {
            garcomExistente.setNome(garcomAtualizado.getNome());
        }
        if (garcomAtualizado.getEmail() != null) {
            garcomExistente.setEmail(garcomAtualizado.getEmail());
        }
        if (garcomAtualizado.getSalario() != null) { 
            garcomExistente.setSalario(garcomAtualizado.getSalario());
        }
        
        Garcom garcomSalvo = garcomRepository.save(garcomExistente);
        return garcomMapper.toResponseDTO(garcomSalvo);
        }
    

    public void deletarGarcom(Long id) {
        Garcom garcomExistente = garcomRepository.findById(id).orElse(null);
        if (garcomExistente == null) {
            throw new RuntimeException("Garçom não encontrado com o ID: " + id);
        }
        garcomRepository.deleteById(id);
    }

}
