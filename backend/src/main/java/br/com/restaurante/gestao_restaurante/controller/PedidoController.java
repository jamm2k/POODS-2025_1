package br.com.restaurante.gestao_restaurante.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoUpdateDTO;
import br.com.restaurante.gestao_restaurante.services.PedidoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    @Autowired
    PedidoService pedidoService;
    
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> buscarTodosPedidos() {
        return ResponseEntity.ok(pedidoService.findAllPedidos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPedidoId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findByIdPedido(id));   
    }

    @PostMapping
    public ResponseEntity <PedidoResponseDTO> criarPedido(@RequestBody PedidoCreateDTO pedidoDTO) {
        PedidoResponseDTO pedidoNovo = pedidoService.criarNovoPedido(pedidoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoNovo);
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> atualizarPedido(@PathVariable Long id, @RequestBody PedidoUpdateDTO pedidoDTO) {
        PedidoResponseDTO pedidoAtualizado = pedidoService.atualizarPedido(id, pedidoDTO);
        return ResponseEntity.ok(pedidoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Long id){
        pedidoService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
