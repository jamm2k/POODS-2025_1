package br.com.restaurante.gestao_restaurante.dto.pedido;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PedidoResponseDTO {
    private Long id;
    private Long comandaId;
    private Long garcomId;
    private Long itemId;
    private Long cozinheiroId;
    private Integer quantidade;
    private String obs;
}