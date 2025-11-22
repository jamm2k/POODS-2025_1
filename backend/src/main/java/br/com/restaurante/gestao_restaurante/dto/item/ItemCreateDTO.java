package br.com.restaurante.gestao_restaurante.dto.item;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemCreateDTO {
    private String nome;
    private Double preco;
    private Long cardapioId;
    private String categoria;
    private String tipo;
}
