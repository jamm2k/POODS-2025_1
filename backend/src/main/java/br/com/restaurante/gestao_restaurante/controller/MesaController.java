package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.restaurante.gestao_restaurante.dto.mesa.MesaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaUpdateNumeroDTO;
import br.com.restaurante.gestao_restaurante.dto.mesa.MesaUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.services.MesaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/mesas")
public class MesaController {
    @Autowired
    private MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaResponseDTO>> buscarMesas(){
        List<MesaResponseDTO> mesas = mesaService.findAllMesas();
        return ResponseEntity.ok(mesas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MesaResponseDTO> buscarMesaPorId(@PathVariable Long id) {
        MesaResponseDTO mesa = mesaService.findByIdMesa(id);
        return ResponseEntity.ok(mesa);
    }
    

    @PostMapping
    public ResponseEntity<MesaResponseDTO> criarMesa(@RequestBody MesaCreateDTO mesaDTO) {
        MesaResponseDTO mesaSalva = mesaService.criarNovaMesa(mesaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(mesaSalva);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<MesaResponseDTO> atualizarStatusMesa(@PathVariable Long id, @RequestBody MesaUpdateStatusDTO statusDTO) {
        MesaResponseDTO mesaAtualizada = mesaService.atualizarStatusMesa(id, statusDTO);

        return ResponseEntity.ok(mesaAtualizada);
    }
    
    @PutMapping("/{id}/numero")
    public ResponseEntity<MesaResponseDTO> atualizarNumeroMesa(@PathVariable Long id, @RequestBody MesaUpdateNumeroDTO numeroDTO) {
        MesaResponseDTO mesaAtualizada = mesaService.atualizarNumeroMesa(id, numeroDTO);        
        return ResponseEntity.ok(mesaAtualizada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMesa(@PathVariable Long id){
        mesaService.deletarMesa(id);
        return ResponseEntity.noContent().build();
    }
}
