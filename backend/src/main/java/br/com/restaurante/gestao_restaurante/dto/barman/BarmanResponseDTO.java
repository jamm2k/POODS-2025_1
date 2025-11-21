package br.com.restaurante.gestao_restaurante.dto.barman;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BarmanResponseDTO {
    private Long id;
    private String nome;
    private String matricula;
    private BigDecimal salario;
    private String email;
    private String status;
    private String tipoUsuario;
    private LocalDate dataAdmissao;
}
