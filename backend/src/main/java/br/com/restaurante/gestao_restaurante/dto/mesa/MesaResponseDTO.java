package br.com.restaurante.gestao_restaurante.dto.mesa;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MesaResponseDTO {
    private Long id;
    private Integer numero;
    private String status;
}
