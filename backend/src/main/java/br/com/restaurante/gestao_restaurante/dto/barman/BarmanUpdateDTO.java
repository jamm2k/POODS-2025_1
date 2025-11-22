package br.com.restaurante.gestao_restaurante.dto.barman;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BarmanUpdateDTO {
    private String nome;
    private String email;
    private Double salario;
}
