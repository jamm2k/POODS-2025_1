package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.garcom.GarcomUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.relatorio.RelatorioGarcomDTO;
import br.com.restaurante.gestao_restaurante.security.UserDetailsImpl;
import br.com.restaurante.gestao_restaurante.services.GarcomService;
import br.com.restaurante.gestao_restaurante.services.PedidoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;





@RestController
@RequestMapping("/api/garcons")
public class GarcomController {

    @Autowired
    GarcomService garcomService;

    @Autowired
    PedidoService pedidoService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GarcomResponseDTO>> buscarTodosGarcons() {
        return ResponseEntity.ok(garcomService.findAllGarcons());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GarcomResponseDTO> buscarGarcomPorId(@PathVariable Long id) {
        return ResponseEntity.ok(garcomService.findByIdGarcom(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('GARCOM')") 
    public ResponseEntity<GarcomResponseDTO> buscarMeuPerfil(Authentication authentication) { 
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Long garcomIdLogado = userDetails.getId(); 

        GarcomResponseDTO garcomDTO = garcomService.findByIdGarcom(garcomIdLogado);
        
        return ResponseEntity.ok(garcomDTO);
    }

    @GetMapping("/me/bonus")
    public ResponseEntity<RelatorioGarcomDTO> buscarMeuBonus(
            Authentication authentication,
            @RequestParam int mes,
            @RequestParam int ano
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Long garcomIdLogado = userDetails.getId(); 

        RelatorioGarcomDTO relatorio = garcomService.gerarRelatorioBonusMensal(garcomIdLogado, ano, mes);
        
        return ResponseEntity.ok(relatorio);
        
    }

    @GetMapping("/{id}/bonus")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RelatorioGarcomDTO> buscarBonusGarcomPorId(
            @PathVariable Long id,
            @RequestParam int mes,
            @RequestParam int ano
    ) {
        RelatorioGarcomDTO relatorio = garcomService.gerarRelatorioBonusMensal(id, ano, mes);
        return ResponseEntity.ok(relatorio);
    }


    @GetMapping("/me/pedidos")
    public ResponseEntity <List<PedidoResponseDTO>> buscarMeusPratos(
            Authentication authentication
    ) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long garcomIdLogado = userDetails.getId();

        List <PedidoResponseDTO> pedidos = pedidoService.findPedidosByGarcom(garcomIdLogado);

        return ResponseEntity.ok(pedidos);
    } 

    
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GarcomResponseDTO> criarGarcom(@RequestBody GarcomCreateDTO garcomDTO) {
        GarcomResponseDTO garcomSalvo = garcomService.criarNovoGarcom(garcomDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(garcomSalvo);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GarcomResponseDTO> atualizarGarcom(@PathVariable Long id, @RequestBody GarcomUpdateDTO garcomDTO) {
        GarcomResponseDTO garcomAtualizado = garcomService.atualizarGarcom(id, garcomDTO);
        return ResponseEntity.ok(garcomAtualizado);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarGarcom(@PathVariable Long id){
        garcomService.deletarGarcom(id);
        return ResponseEntity.noContent().build();
    }
}
