package br.com.restaurante.gestao_restaurante.dto.admin;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


@Getter
@Setter
public class AdminResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private LocalDate dataAdmissao;
    private String Matricula;
    private double Salario;
    private Integer nivelAcesso;
    private String tipoUsuario;
}
