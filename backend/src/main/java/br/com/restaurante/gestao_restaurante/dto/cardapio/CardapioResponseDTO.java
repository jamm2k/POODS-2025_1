package br.com.restaurante.gestao_restaurante.dto.cardapio;

import java.util.List;

import br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardapioResponseDTO {
    private Long id;
    private String nome;
    private List<ItemResponseDTO> itens;
}
