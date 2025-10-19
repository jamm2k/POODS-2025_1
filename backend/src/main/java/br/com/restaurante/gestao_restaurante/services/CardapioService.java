package br.com.restaurante.gestao_restaurante.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.restaurante.gestao_restaurante.models.Cardapio;
import br.com.restaurante.gestao_restaurante.repositories.CardapioRepository;
import jakarta.persistence.EntityNotFoundException;
import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioResponseDTO;
import br.com.restaurante.gestao_restaurante.mapper.CardapioMapper;


@Service
public class CardapioService {

    @Autowired
    CardapioRepository cardapioRepository;
    @Autowired
    CardapioMapper cardapioMapper;

    private Cardapio findById(Long id){
        return cardapioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Cardapio não encontrado: " 
        + id));
    }

    public CardapioResponseDTO findByIdCardapio(Long id){
        Cardapio cardapio = this.findById(id);
        return cardapioMapper.toResponseDTO(cardapio);
    }

    public List<CardapioResponseDTO> findAllCardapios() {
        return cardapioRepository.findAll().stream()
                .map(cardapioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CardapioResponseDTO criarCardapio(CardapioCreateDTO cardapioCreateDTO){
        cardapioRepository.findByNome(cardapioCreateDTO.getNome()).ifPresent(u -> {
            throw new RuntimeException("Já existe um cardápio com esse nome");
        });
        
        Cardapio cardapio = cardapioMapper.toEntity(cardapioCreateDTO);

        Cardapio cardapioSalvo = cardapioRepository.save(cardapio);
        return cardapioMapper.toResponseDTO(cardapioSalvo);
    }

    public CardapioResponseDTO atualizarCardapio(Long id, CardapioUpdateDTO cardapioAtualizado){
        Cardapio cardapioExistente = this.findById(id);

        if(cardapioAtualizado.getNome() != null && !cardapioAtualizado.getNome().equals(cardapioExistente.getNome())){
            
            cardapioExistente.setNome(cardapioAtualizado.getNome());
        }

        Cardapio cardapioSalvo = cardapioRepository.save(cardapioExistente);
        return cardapioMapper.toResponseDTO(cardapioSalvo);
    }

    public void deleteCardapio(Long id){
        this.findById(id);
        cardapioRepository.deleteById(id);

    }
}
