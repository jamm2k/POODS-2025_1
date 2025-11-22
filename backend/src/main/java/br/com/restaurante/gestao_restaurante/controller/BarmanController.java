package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.barman.BarmanCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.barman.BarmanUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.services.BarmanService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/barmen")
public class BarmanController {

    @Autowired
    BarmanService barmanService;

    @GetMapping
    public ResponseEntity<List<BarmanResponseDTO>> buscarTodosBarmen() {
        return ResponseEntity.ok(barmanService.findAllBarmen());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BarmanResponseDTO> buscarBarmanPorId(@PathVariable Long id) {
        return ResponseEntity.ok(barmanService.findByIdBarman(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BarmanResponseDTO> criarBarman(@RequestBody BarmanCreateDTO barmanDTO) {
        BarmanResponseDTO barmanSalvo = barmanService.criarBarman(barmanDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(barmanSalvo);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BarmanResponseDTO> atualizarBarman(@PathVariable Long id, @RequestBody BarmanUpdateDTO barmanDTO) {        
        BarmanResponseDTO barmanAtualizado = barmanService.atualizarBarman(id, barmanDTO);
        return ResponseEntity.ok(barmanAtualizado);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatusBarman(@PathVariable Long id, @RequestBody BarmanUpdateStatusDTO statusDTO) {
        barmanService.alterarStatusBarman(id, statusDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarBarman(@PathVariable Long id){
       barmanService.deletarBarman(id);
       return ResponseEntity.noContent().build();
    }
}
