package br.com.restaurante.gestao_restaurante.dto.relatorio;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RelatorioGarcomDTO {
    private Long idGarcom;
    private String nomeGarcom;
    private String matricula;
    private int mes;
    private int ano;
    private Double totalVendasPremium;
    private Double bonusCalculado;
}
