package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.item.ItemCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.item.ItemResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.item.ItemUpdateDTO;
import br.com.restaurante.gestao_restaurante.services.ItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/itens")
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemResponseDTO>> buscarTodosItens() {
        return ResponseEntity.ok(itemService.findAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> buscarItemPorId(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.findByIdItem(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemResponseDTO> criarItem(@RequestBody ItemCreateDTO itemDTO) {
        ItemResponseDTO itemSalvo = itemService.criarNovoItem(itemDTO);        
        return ResponseEntity.status(HttpStatus.CREATED).body(itemSalvo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemResponseDTO> atualizarItem (@PathVariable Long id, @RequestBody ItemUpdateDTO itemDTO) {
        ItemResponseDTO itemAtualizado = itemService.atualizarItem(id, itemDTO);
        return ResponseEntity.ok(itemAtualizado);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarItem(@PathVariable Long id){
        itemService.deletarItem(id);
        return ResponseEntity.noContent().build();
    }

}
