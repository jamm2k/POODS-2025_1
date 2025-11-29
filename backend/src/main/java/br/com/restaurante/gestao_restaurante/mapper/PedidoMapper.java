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
        dto.setId(pedido.getId());
        dto.setGarcomId(pedido.getGarcom() != null ? pedido.getGarcom().getId() : null);
        dto.setComandaId(pedido.getComanda().getId());
        dto.setMesaNumero(pedido.getComanda().getMesa().getNumero());
        dto.setItemId(pedido.getItem() != null ? pedido.getItem().getId() : null);
        dto.setCozinheiroId(pedido.getCozinheiro() != null ? pedido.getCozinheiro().getId() : null);
        dto.setBarmanId(pedido.getBarman() != null ? pedido.getBarman().getId() : null);
        dto.setQuantidade(pedido.getQuantidade());
        dto.setObs(pedido.getObs());
        dto.setStatus(pedido.getStatus());
        dto.setDataHora(pedido.getDataHora());

        if (pedido.getItem() != null) {
            br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO itemDto = new br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO();
            itemDto.setId(pedido.getItem().getId());
            itemDto.setNome(pedido.getItem().getNome());
            itemDto.setPreco(pedido.getItem().getPreco());
            itemDto.setCategoria(pedido.getItem().getCategoria());
            itemDto.setTipo(pedido.getItem().getTipo());
            dto.setItem(itemDto);
        }

        return dto;
    }
}
