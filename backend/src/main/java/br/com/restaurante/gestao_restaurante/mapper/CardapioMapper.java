package br.com.restaurante.gestao_restaurante.mapper;

import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Cardapio;

public class CardapioMapper {
    
    @Autowired
    private ItemMapper itemMapper;

    public Cardapio toEntity(CardapioCreateDTO cardapioCreateDTO){
        Cardapio cardapio = new Cardapio();
        cardapio.setNome(cardapioCreateDTO.getNome());
        return cardapio;
    }

    public CardapioResponseDTO toResponseDTO(Cardapio cardapio){
        if (cardapio == null){
            return null;
        }

        CardapioResponseDTO responseDTO = new CardapioResponseDTO();
        responseDTO.setId(cardapio.getId());
        responseDTO.setNome(cardapio.getNome());

        if (cardapio.getItens() != null) { 
            responseDTO.setItens(
                cardapio.getItens().stream()
                    .map(itemMapper::toResponseDTO) 
                    .collect(Collectors.toList())
            );
        } else {
            responseDTO.setItens(Collections.emptyList()); 
        }

        return responseDTO;
    }
}
