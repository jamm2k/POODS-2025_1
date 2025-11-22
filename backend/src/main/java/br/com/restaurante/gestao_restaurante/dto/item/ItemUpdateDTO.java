package br.com.restaurante.gestao_restaurante.dto.item;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemUpdateDTO {
    private Integer cardapioId;
    private String nome;
    private Double preco;
    private String categoria;
    private String tipo;
}
