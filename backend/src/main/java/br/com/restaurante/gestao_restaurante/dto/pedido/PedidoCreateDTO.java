package br.com.restaurante.gestao_restaurante.dto.pedido;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PedidoCreateDTO {
    private Long garcomId;
    private Long comandaId;
    private Long itemId;
    private Integer quantidade;
    private String obs;
}