package br.com.restaurante.gestao_restaurante.dto.cozinheiro;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CozinheiroCreateDTO {
    private String nome;
    private String email;
    private String cpf;
    private String matricula;
    private String senha;
    private Double salario;
}
