package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.GarcomRepository;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomUpdateDTO;
import br.com.restaurante.gestao_restaurante.models.Garcom;

@Service
public class GarcomService {
   
    @Autowired
    private GarcomRepository garcomRepository;

    @Autowired
    private UsuarioRepository  usuarioRepository;
    
    public Garcom findByIdGarcom(Long id) {
        return garcomRepository.findById(id).orElse(null);

    }

    public List<Garcom> findAllGarcons() {
        return garcomRepository.findAll();
    }

    public Garcom criarNovoGarcom(GarcomCreateDTO garcomDTO) {
        
        usuarioRepository.findByEmail(garcomDTO.getEmail()).ifPresent(u ->{
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        });

        usuarioRepository.findByCpf(garcomDTO.getCpf()).ifPresent(u ->{
            throw new RuntimeException("Erro: CPF já cadastrado.");
        });

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

        return garcomRepository.save(garcom);
    }

    public Garcom atualizarGarcom(Long id, GarcomUpdateDTO garcomAtualizado) {
        Garcom garcomExistente = this.findByIdGarcom(id);
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
        if (garcomAtualizado.getSenha() != null) {
            garcomExistente.setSenha(garcomAtualizado.getSenha());
        }
        if (garcomAtualizado.getSalario() != null) { 
            garcomExistente.setSalario(garcomAtualizado.getSalario());
        }
        

        return garcomRepository.save(garcomExistente);
        }
    

    public void deletarGarcom(Long id) {
        Garcom garcomExistente = this.findByIdGarcom(id);
        if (garcomExistente == null) {
            throw new RuntimeException("Garçom não encontrado com o ID: " + id);
        }
        garcomRepository.deleteById(id);
    }

}
