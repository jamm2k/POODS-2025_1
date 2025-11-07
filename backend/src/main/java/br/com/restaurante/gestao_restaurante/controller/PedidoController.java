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
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.services.PedidoService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;





@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    @Autowired
    PedidoService pedidoService;
    
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> buscarTodosPedidos(
        @RequestParam(required = false) String status, 
        @RequestParam(required = false) Long comandaId,
        @RequestParam(required = false) Long garcomId
    ) {
            
        List<PedidoResponseDTO> pedidos;

        if (status != null && !status.isEmpty()){
            pedidos = pedidoService.buscarPedidoPorStatus(status);
        }else{
            pedidos = pedidoService.findAllPedidos();
        }

        if (comandaId != null){
            pedidos = pedidoService.findPedidosByComanda(comandaId);
        }else{
            pedidos = pedidoService.findAllPedidos();
        }

        if(garcomId != null){
            pedidos = pedidoService.findPedidosByGarcom(garcomId);
        }else{
            pedidos = pedidoService.findAllPedidos();
        }
        
        return ResponseEntity.ok(pedidos);
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

    @PutMapping("/{id}/status")
    public ResponseEntity<PedidoResponseDTO> AtualizarStatusPedido(@PathVariable Long id, @RequestParam PedidoUpdateStatusDTO status) {
        PedidoResponseDTO pedidoAtualizado = pedidoService.atualizarStatusPedido(id, status);        
        return ResponseEntity.ok(pedidoAtualizado);
    }

    @PutMapping("/api/{id}/atribuir-cozinheiro")
    public ResponseEntity<PedidoResponseDTO> atribuirCozinheiro(
            @PathVariable Long id, 
            @RequestBody Long cozinheiroId
    ) {
        PedidoResponseDTO pedido = pedidoService.atribuirCozinheiro(id, cozinheiroId);        
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("api/{id}/concluir")
    public ResponseEntity<PedidoResponseDTO> concluirPedido(
        @PathVariable Long id,
        @PathVariable Long cozinheiroId
        ) {

        PedidoResponseDTO pedido = pedidoService.concluirPedido(id, cozinheiroId);        
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("api/{id}/entregar")
    public ResponseEntity<PedidoResponseDTO> entregarPedido(@PathVariable Long id) {
        PedidoResponseDTO pedido = pedidoService.marcarPedidoEntregue(id);        
        return ResponseEntity.ok(pedido);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Long id){
        pedidoService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
