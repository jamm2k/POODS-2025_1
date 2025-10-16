package br.com.restaurante.gestao_restaurante.mapper;

import org.springframework.stereotype.Component;

import br.com.restaurante.gestao_restaurante.dto.item.ItemCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO;
import br.com.restaurante.gestao_restaurante.models.Item;

@Component
public class ItemMapper {
    
    public Item toEntity(ItemCreateDTO itemDTO) {
        Item item = new Item();
        item.setNome(itemDTO.getNome());
        item.setPreco(itemDTO.getPreco());
        item.setCategoria(itemDTO.getCategoria());
        return item;
    }

    public ItemResponseDTO toResponseDTO(Item item) {
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(item.getId());
        dto.setNome(item.getNome());
        dto.setPreco(item.getPreco());
        dto.setCategoria(item.getCategoria());
        if (item.getCardapio() != null) {
            dto.setCardapioId(item.getCardapio().getId());
        }
        return dto;
    }
}
