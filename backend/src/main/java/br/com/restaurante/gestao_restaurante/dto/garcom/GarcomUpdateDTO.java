package br.com.restaurante.gestao_restaurante.dto.garcom;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GarcomUpdateDTO {
    private String nome;
    private String email;
    private Double salario;
}
