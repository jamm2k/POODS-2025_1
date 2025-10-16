package br.com.restaurante.gestao_restaurante.dto.item;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemResponseDTO {
    private Long id;
    private String nome;
    private Double preco;
    private String categoria;
    private Long cardapioId;
}
