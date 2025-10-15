package br.com.restaurante.gestao_restaurante.dto.garcom;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class GarcomCreateDTO {
    private String nome;
    private String email;
    private String cpf;
    private String senha;
    private Double salario;
    private LocalDate dataAdmissao;
    private String matricula;
}
