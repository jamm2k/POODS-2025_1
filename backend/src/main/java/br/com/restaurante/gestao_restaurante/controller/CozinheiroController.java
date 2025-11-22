package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.services.CozinheiroService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/cozinheiros")
public class CozinheiroController {

    @Autowired
    CozinheiroService cozinheiroService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CozinheiroResponseDTO>> buscarTodosCozinheiros() {
        return ResponseEntity.ok(cozinheiroService.findAllCozinheiros());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CozinheiroResponseDTO> buscarCozinheiroPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cozinheiroService.findByIdCozinheiro(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CozinheiroResponseDTO> criarCozinheiro(@RequestBody CozinheiroCreateDTO cozinheiroDTO) {
        CozinheiroResponseDTO cozinheiroSalvo = cozinheiroService.criarCozinheiro(cozinheiroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(cozinheiroSalvo);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CozinheiroResponseDTO> atualizarCozinheiro(@PathVariable Long id, @RequestBody CozinheiroUpdateDTO cozinheiroDTO) {        
        CozinheiroResponseDTO cozinheiroAtualizado = cozinheiroService.atualizarCozinheiro(id, cozinheiroDTO);
        return ResponseEntity.ok(cozinheiroAtualizado);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatusCozinheiro(@PathVariable Long id, @RequestBody CozinheiroUpdateStatusDTO statusDTO) {
        cozinheiroService.alterarStatusCozinheiro(id, statusDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarCozinheiro(@PathVariable Long id){
       cozinheiroService.deletarCozinheiro(id);
       return ResponseEntity.noContent().build();
    }
}
