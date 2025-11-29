package br.com.restaurante.gestao_restaurante.dto.pedido;

import br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO;
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
    private Long barmanId;
    private Integer quantidade;
    private String obs;
    private String status;
    private Integer mesaNumero;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime dataHora;
    private ItemResponseDTO item;
}