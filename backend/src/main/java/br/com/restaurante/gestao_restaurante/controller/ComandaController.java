package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaResponseDTO;
import br.com.restaurante.gestao_restaurante.services.ComandaService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("api/comandas")
public class ComandaController {
    @Autowired
    ComandaService comandaService;

    @GetMapping
    public ResponseEntity<List<ComandaResponseDTO>> buscarTodasComandas() {
        return ResponseEntity.ok(comandaService.findAllComandas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ComandaResponseDTO> buscarComandaId(@PathVariable Long id) {
        return ResponseEntity.ok(comandaService.findByIdComanda(id));
    }

    @PostMapping
    public ResponseEntity<ComandaResponseDTO> criarComanda(@RequestBody ComandaCreateDTO comandaDTO) {
        ComandaResponseDTO comandaCriada = comandaService.criarNovaComanda(comandaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(comandaCriada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarComanda(@PathVariable Long id){
        comandaService.deletarComanda(id);
        return ResponseEntity.noContent().build();
    }
}
