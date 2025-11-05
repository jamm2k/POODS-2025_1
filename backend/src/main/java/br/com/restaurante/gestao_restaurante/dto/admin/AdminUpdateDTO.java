package br.com.restaurante.gestao_restaurante.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateDTO {
    private String nome;
    private String email;
    private double salario;
    private Integer nivelAcesso;
}
