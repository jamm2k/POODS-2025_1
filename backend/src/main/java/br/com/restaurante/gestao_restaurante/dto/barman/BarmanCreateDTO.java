package br.com.restaurante.gestao_restaurante.dto.barman;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BarmanCreateDTO {
    private Long barmanId;
    private String nome;
    private String email;
    private String cpf;
    private String senha;
    private Double salario;
    private String matricula;
}
