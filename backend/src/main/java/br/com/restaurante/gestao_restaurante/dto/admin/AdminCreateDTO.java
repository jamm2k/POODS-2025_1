package br.com.restaurante.gestao_restaurante.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCreateDTO {
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String Matricula;
    private double Salario;
    private Integer nivelAcesso;
}
