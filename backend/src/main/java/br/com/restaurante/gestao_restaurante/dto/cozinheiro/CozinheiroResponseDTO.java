package br.com.restaurante.gestao_restaurante.dto.cozinheiro;

import java.time.LocalDate;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CozinheiroResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String matricula;
    private String cpf;
    private Double salario;
    private String status;
    private String tipoUsuario;
    private LocalDate dataAdmissao;
}
