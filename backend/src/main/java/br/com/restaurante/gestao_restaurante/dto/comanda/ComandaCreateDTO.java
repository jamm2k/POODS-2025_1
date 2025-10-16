package br.com.restaurante.gestao_restaurante.dto.comanda;

import lombok.Getter;
import lombok.Setter;


@Getter 
@Setter
public class ComandaCreateDTO {
    private Long mesaId;
    private Long garcomId;
    private String nome;
    private boolean taxaServico;
}
