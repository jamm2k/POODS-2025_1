package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.admin.AdminCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.admin.AdminResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.admin.AdminUpdateDTO;
import br.com.restaurante.gestao_restaurante.services.AdminService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/admins")
public class AdminController {
    
    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminResponseDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminService.findAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findByIdAdmin(id));
    }
    
    @PostMapping
    public ResponseEntity<AdminResponseDTO> criarAdmin(@RequestBody AdminCreateDTO adminDTO) {
        AdminResponseDTO adminSalvo = adminService.criarAdmin(adminDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminSalvo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> atualizarAdmin(@PathVariable Long id, @RequestBody AdminUpdateDTO adminDTO) {
        AdminResponseDTO adminAtualizado = adminService.atualizarAdmin(id, adminDTO);
        return ResponseEntity.ok(adminAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAdmin(@PathVariable Long id) {
        adminService.deletarAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
