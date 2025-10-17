package br.com.restaurante.gestao_restaurante.dto.cozinheiro;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CozinheiroResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String matricula;
    private Double salario;
    private String status;
    private String tipoUsuario;
    private LocalDate dataAdmissao;
}
