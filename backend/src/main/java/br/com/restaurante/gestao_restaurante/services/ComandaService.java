package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaResponseDTO;
//import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaUpdateDTO;
import br.com.restaurante.gestao_restaurante.models.Comanda;
import br.com.restaurante.gestao_restaurante.models.Garcom;
import br.com.restaurante.gestao_restaurante.models.Mesa;
import br.com.restaurante.gestao_restaurante.repositories.MesaRepository;
import jakarta.persistence.EntityNotFoundException;
import br.com.restaurante.gestao_restaurante.mapper.ComandaMapper;
import br.com.restaurante.gestao_restaurante.repositories.ComandaRepository;
import br.com.restaurante.gestao_restaurante.repositories.GarcomRepository;


@Service
public class ComandaService {
    @Autowired
    private ComandaRepository comandaRepository;

    @Autowired
    private ComandaMapper comandaMapper;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private GarcomRepository garcomRepository;

    private Comanda findById(Long id) {
        return comandaRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Comanda não encontrada com o ID: " + id));
    }

    
    public ComandaResponseDTO findByIdComanda(Long id) {
        Comanda comanda = this.findById(id);
        return comandaMapper.toResponseDTO(comanda);
    }

    public List<ComandaResponseDTO> findAllComandas() {
        return comandaRepository.findAll()
            .stream()
            .map(comandaMapper::toResponseDTO)
            .toList();
    }
    public ComandaResponseDTO criarNovaComanda(ComandaCreateDTO comandaDTO) {
       
        Mesa mesa = mesaRepository.findById(comandaDTO.getMesaId())
            .orElseThrow(() -> new RuntimeException("Mesa não encontrada com o ID: " + comandaDTO.getMesaId()));

        comandaRepository.findByMesaAndNome(mesa,comandaDTO.getNome()).ifPresent(m -> {
            throw new RuntimeException("Erro: Nome da comanda já cadastrado.");
        });
        

        Garcom garcom = garcomRepository.findById(comandaDTO.getGarcomId())
            .orElseThrow(() -> new RuntimeException("Garçom não encontrado com o ID: " + comandaDTO.getGarcomId()));
        
        Comanda comanda = comandaMapper.toEntity(comandaDTO);
        comanda.setMesa(mesa);
        comanda.setGarcom(garcom);
        comanda.setStatus("Aberta");
        comanda.setDataAbertura(java.time.LocalDateTime.now());
        comanda.setValorTotal(0.0);

        if (mesa.getStatus().equals("LIVRE")) {
            mesa.setStatus("Ocupada");
        }

        mesaRepository.save(mesa);
        
        Comanda comandaSalva = comandaRepository.save(comanda);
        return comandaMapper.toResponseDTO(comandaSalva);
    }

   

    public void deletarComanda(Long id) {
        Comanda comandaExistente = this.findById(id);
    
        if("ABERTA".equals(comandaExistente.getStatus())){
            throw new RuntimeException("Não é possível deletar uma comanda aberta.");
        }

        comandaRepository.deleteById(id);

        Mesa mesa = comandaExistente.getMesa();
        Long comandasAbertas = comandaRepository.countByMesaAndStatus(mesa, "Aberta");
        
        if (comandasAbertas == 0) {
            mesa.setStatus("Livre");
            mesaRepository.save(mesa);
        }
    }

}
