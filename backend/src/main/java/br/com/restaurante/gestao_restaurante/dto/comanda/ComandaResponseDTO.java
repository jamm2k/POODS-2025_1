package br.com.restaurante.gestao_restaurante.dto.comanda;

import java.time.LocalDateTime;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComandaResponseDTO {
    private Long id;
    private Long mesaId;
    private Long garcomId;
    private String status;
    private String nome;
    private Double valorTotal;
    private LocalDateTime dataAbertura;
    private LocalDateTime dataFechamento;
    private boolean taxaServico;
}
