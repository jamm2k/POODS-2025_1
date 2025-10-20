package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomUpdateDTO;
import br.com.restaurante.gestao_restaurante.services.GarcomService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("api/garcons")
public class GarcomController {

    @Autowired
    GarcomService garcomService;
    
    @GetMapping
    public ResponseEntity<List<GarcomResponseDTO>> buscarTodosGarcons() {
        return ResponseEntity.ok(garcomService.findAllGarcons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GarcomResponseDTO> buscarGarcomPorId(@PathVariable Long id) {
        return ResponseEntity.ok(garcomService.findByIdGarcom(id));
    }
    
    @PostMapping
    public ResponseEntity<GarcomResponseDTO> criarGarcom(@RequestBody GarcomCreateDTO garcomDTO) {
        GarcomResponseDTO garcomSalvo = garcomService.criarNovoGarcom(garcomDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(garcomSalvo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GarcomResponseDTO> atualizarGarcom(@PathVariable Long id, @RequestBody GarcomUpdateDTO garcomDTO) {
        GarcomResponseDTO garcomAtualizado = garcomService.atualizarGarcom(id, garcomDTO);
        return ResponseEntity.ok(garcomAtualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarGarcom(@PathVariable Long id){
        garcomService.deletarGarcom(id);
        return ResponseEntity.noContent().build();
    }
}
