package br.com.restaurante.gestao_restaurante.dto.cozinheiro;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CozinheiroUpdateDTO {
    private String nome;
    private String email;
    private Double salario;
}
