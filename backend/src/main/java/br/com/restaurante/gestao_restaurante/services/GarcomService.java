package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.GarcomRepository;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
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

    public Garcom criarNovoGarcom(Garcom garcom) {
        
        usuarioRepository.findByEmail(garcom.getEmail()).ifPresent(u ->{
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        });

        usuarioRepository.findByCpf(garcom.getCpf()).ifPresent(u ->{
            throw new RuntimeException("Erro: CPF já cadastrado.");
        });

        garcom.setTipoUsuario("GARCOM");
        if(garcom.getDataAdmissao() == null){
            garcom.setDataAdmissao(LocalDate.now());
        }

        return garcomRepository.save(garcom);
    }

    public Garcom atualizarGarcom(Long id, Garcom garcomAtualizado) {
        Garcom garcomExistente = this.findByIdGarcom(id);
        if (garcomExistente == null) {
            throw new RuntimeException("Garçom não encontrado com o ID: " + id);
        }

        usuarioRepository.findByEmail(garcomAtualizado.getEmail()).ifPresent(u ->{
            if(!u.getId().equals(id)){
                throw new RuntimeException("Erro: E-mail já cadastrado.");  }
        });
        usuarioRepository.findByCpf(garcomAtualizado.getCpf()).ifPresent(u ->{
            if(!u.getId().equals(id)){
                throw new RuntimeException("Erro: CPF já cadastrado.");                }
        });

        if (garcomAtualizado.getNome() != null) {
            garcomExistente.setNome(garcomAtualizado.getNome());
        }
        if (garcomAtualizado.getCpf() != null) {
            garcomExistente.setCpf(garcomAtualizado.getCpf()); 
        }
        if (garcomAtualizado.getEmail() != null) {
            garcomExistente.setEmail(garcomAtualizado.getEmail());
        }
        if(garcomAtualizado.getDataAdmissao() != null){
            garcomExistente.setDataAdmissao(garcomAtualizado.getDataAdmissao());
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
