package br.com.restaurante.gestao_restaurante.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.relatorio.RelatorioGarcomDTO;
import br.com.restaurante.gestao_restaurante.services.GarcomService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/relatorios")
@PreAuthorize("hasRole('ADMIN')")
public class RelatorioController {
    
    @Autowired
    private GarcomService garcomService;
    
    
    @GetMapping("/garcons/{garcomId}/bonus")
    public ResponseEntity<RelatorioGarcomDTO> getRelatorioGarcom(
            @PathVariable Long garcomId,
            @RequestParam int mes,
            @RequestParam int ano
    ) {
        RelatorioGarcomDTO relatorio = garcomService.gerarRelatorioBonusMensal(garcomId, mes, ano);
        return ResponseEntity.ok(relatorio);
    }
    
}
