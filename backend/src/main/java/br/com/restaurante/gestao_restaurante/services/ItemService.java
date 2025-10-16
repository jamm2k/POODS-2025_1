package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import br.com.restaurante.gestao_restaurante.repositories.CardapioRepository;
import br.com.restaurante.gestao_restaurante.repositories.ItemRepository;
import br.com.restaurante.gestao_restaurante.dto.item.ItemCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.item.ItemUpdateDTO;
import br.com.restaurante.gestao_restaurante.mapper.ItemMapper;
import br.com.restaurante.gestao_restaurante.models.Cardapio;
import br.com.restaurante.gestao_restaurante.models.Item;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CardapioRepository cardapioRepository;

    @Autowired
    private ItemMapper itemMapper;

    public ItemResponseDTO findByIdItem(Long id) {
        Item item = itemRepository.findById(id).orElse(null);
        return itemMapper.toResponseDTO(item);
    }

    public List<ItemResponseDTO> findAllItems() {
        return itemRepository.findAll().stream()
            .map(itemMapper::toResponseDTO)
            .toList();
    }

    public ItemResponseDTO criarNovoItem(ItemCreateDTO itemDTO) {

        Cardapio cardapio = cardapioRepository.findById(itemDTO.getCardapioId())
            .orElseThrow(() -> new RuntimeException("Cardápio não encontrado com o ID: " + itemDTO.getCardapioId()));
        
        
        itemRepository.findByNome(itemDTO.getNome()).ifPresent(i -> {
            throw new RuntimeException("Erro: Nome do item já cadastrado.");
        }); 

        Item item = itemMapper.toEntity(itemDTO);
        item.setCardapio(cardapio);

        Item itemSalvo = itemRepository.save(item);
        return itemMapper.toResponseDTO(itemSalvo);
    }

    public ItemResponseDTO atualizarItem(Long id, ItemUpdateDTO itemUpdateDTO) {
        Item itemExistente = itemRepository.findById(id).orElse(null);
        
        if (itemExistente == null) {
            throw new RuntimeException("Item não encontrado com o ID: " + id);
        }

        if (itemUpdateDTO.getNome() != null && !itemUpdateDTO.getNome().equals(itemExistente.getNome())) {
            itemRepository.findByNome(itemUpdateDTO.getNome()).ifPresent(i -> {
                throw new IllegalStateException("Erro: Nome do item já cadastrado em outro item.");
            });
            itemExistente.setNome(itemUpdateDTO.getNome());
        }

        if (itemUpdateDTO.getPreco() != null) {
            itemExistente.setPreco(itemUpdateDTO.getPreco());
        }
        if (itemUpdateDTO.getCategoria() != null) {
            itemExistente.setCategoria(itemUpdateDTO.getCategoria());
        }
        if (itemUpdateDTO.getCardapioId() != null) {
            Cardapio cardapio = cardapioRepository.findById(itemUpdateDTO.getCardapioId())
                .orElseThrow(() -> new RuntimeException("Cardápio não encontrado com o ID: " + itemUpdateDTO.getCardapioId()));
            itemExistente.setCardapio(cardapio);
        }

        Item itemSalvo = itemRepository.save(itemExistente);
        return itemMapper.toResponseDTO(itemSalvo);
    }

    public void deletarItem(Long id) {
        Item itemExistente = itemRepository.findById(id).orElse(null);
        if (itemExistente == null) {
            throw new RuntimeException("Item não encontrado com o ID: " + id);
        }
        itemRepository.deleteById(id);
    }
}
