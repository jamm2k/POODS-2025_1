package br.com.restaurante.gestao_restaurante.mapper;

import org.springframework.stereotype.Component;

import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Pedido;

@Component
public class PedidoMapper {
    public Pedido toEntity(PedidoCreateDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setQuantidade(dto.getQuantidade());
        pedido.setObs(dto.getObs());
        return pedido;
    }

    public PedidoResponseDTO toResponseDTO(Pedido pedido) {
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setGarcomId(pedido.getGarcom().getId());
        dto.setComandaId(pedido.getComanda().getId());
        dto.setItemId(pedido.getItem().getId());
        dto.setQuantidade(pedido.getQuantidade());
        dto.setObs(pedido.getObs());
        return dto;
    }
}
