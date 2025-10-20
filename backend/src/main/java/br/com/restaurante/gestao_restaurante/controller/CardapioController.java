package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.cardapio.CardapioUpdateDTO;
import br.com.restaurante.gestao_restaurante.services.CardapioService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("api/cardapios")
public class CardapioController {
    @Autowired
    CardapioService cardapioService;

    @GetMapping
    public ResponseEntity<List<CardapioResponseDTO>> buscarTodosCardapios() {
        return ResponseEntity.ok(cardapioService.findAllCardapios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardapioResponseDTO> buscarCardapioId(@PathVariable Long id) {
        return ResponseEntity.ok(cardapioService.findByIdCardapio(id));
    }

    @PostMapping
    public ResponseEntity <CardapioResponseDTO> criarCardapio(@RequestBody CardapioCreateDTO cardapioDTO) {
        CardapioResponseDTO cardapioNovo = cardapioService.criarCardapio(cardapioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(cardapioNovo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity <CardapioResponseDTO> atualizarCardapio(@PathVariable Long id, @RequestBody CardapioUpdateDTO cardapioDTO) {
        CardapioResponseDTO cardapioAtualizado = cardapioService.atualizarCardapio(id, cardapioDTO);        
        return ResponseEntity.ok(cardapioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCardapio(@PathVariable Long id){
        cardapioService.deleteCardapio(id);
        return ResponseEntity.noContent().build();
    }
    
}
