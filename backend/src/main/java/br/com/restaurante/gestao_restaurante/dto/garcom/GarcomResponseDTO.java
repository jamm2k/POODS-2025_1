package br.com.restaurante.gestao_restaurante.dto.garcom;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GarcomResponseDTO {
    private String nome;
    private String email;
    private String cpf;
    private LocalDate dataAdmissao;
    private String matricula;
    private double salario;
    private double bonus;
}
