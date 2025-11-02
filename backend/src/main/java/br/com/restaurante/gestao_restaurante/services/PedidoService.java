package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.repositories.PedidoRepository;
import br.com.restaurante.gestao_restaurante.repositories.GarcomRepository;
import br.com.restaurante.gestao_restaurante.repositories.ComandaRepository;
import br.com.restaurante.gestao_restaurante.repositories.ItemRepository;
import br.com.restaurante.gestao_restaurante.models.Comanda;
import br.com.restaurante.gestao_restaurante.models.Cozinheiro;
import br.com.restaurante.gestao_restaurante.models.Garcom;
import br.com.restaurante.gestao_restaurante.models.Item;
import br.com.restaurante.gestao_restaurante.models.Pedido;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoUpdateDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.dto.cozinheiro.CozinheiroUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.pedido.PedidoResponseDTO;
import br.com.restaurante.gestao_restaurante.mapper.PedidoMapper;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PedidoMapper pedidoMapper;  

    @Autowired
    private GarcomRepository garcomRepository;

    @Autowired
    private ComandaRepository comandaRepository;
    
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CozinheiroService cozinheiroService;

    private Pedido findById(Long id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado com o ID: " + id));
    }

    public PedidoResponseDTO findByIdPedido(Long id) {
        Pedido pedido = this.findById(id);
        return pedidoMapper.toResponseDTO(pedido);
    }

    public List<PedidoResponseDTO> findAllPedidos() {
        return pedidoRepository.findAll()
            .stream()
            .map(pedidoMapper::toResponseDTO)
            .toList();
    }

    public List<PedidoResponseDTO> findPedidosPorComanda(Long comandaId) {
        Comanda comanda = comandaRepository.findById(comandaId)
            .orElseThrow(() -> new EntityNotFoundException("Comanda não encontrada com o ID: " + comandaId));

        List<Pedido> pedidos = pedidoRepository.findByComanda(comanda);
        return pedidos.stream()
                .map(pedidoMapper::toResponseDTO)
                .toList();
    }

    public PedidoResponseDTO criarNovoPedido(PedidoCreateDTO pedidoDTO) {
        Pedido pedido = pedidoMapper.toEntity(pedidoDTO);
        
        Garcom garcom = garcomRepository.findById(pedidoDTO.getGarcomId())
            .orElseThrow(() -> new RuntimeException("Garçom não encontrado com o ID: " + pedidoDTO.getGarcomId()));
        
        Comanda comanda = comandaRepository.findById(pedidoDTO.getComandaId())
            .orElseThrow(() -> new RuntimeException("Comanda não encontrada com o ID: " + pedidoDTO.getComandaId()));
        
        if(!"ABERTA".equals(comanda.getStatus())) {
            throw new RuntimeException("Não é possível adicionar pedidos a uma comanda fechada.");
        }
        Item item = itemRepository.findById(pedidoDTO.getItemId())
            .orElseThrow(() -> new RuntimeException("Item não encontrado com o ID: " + pedidoDTO.getItemId()));

        
        pedido.setGarcom(garcom);
        pedido.setComanda(comanda);
        pedido.setItem(item);
        pedido.setCozinheiro(null);
        pedido.setStatus("SOLICITADO");

        atualizarValorTotalComanda(comanda);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        return pedidoMapper.toResponseDTO(pedidoSalvo);
    }

    private void atualizarValorTotalComanda(Comanda comanda) {
        List<Pedido> pedidos = pedidoRepository.findByComanda(comanda);

        Double valorTotal = 0.0;
        for (Pedido p : pedidos) {
            if (p.getItem() != null && p.getQuantidade() != null) {
                valorTotal += p.getItem().getPreco() * p.getQuantidade();
            }
        }
        comanda.setValorTotal(valorTotal);
        comandaRepository.save(comanda);
    }
    
    public PedidoResponseDTO atualizarPedido (Long id, PedidoUpdateDTO pedidoDTO) {
        Pedido pedidoExistente = this.findById(id);
        Comanda comanda = pedidoExistente.getComanda();

        if("SOLICITADO".equals(pedidoExistente.getStatus())){
            if (pedidoDTO.getObs() != null) {
                pedidoExistente.setObs(pedidoDTO.getObs());
            }
            if (pedidoDTO.getQuantidade() != null) {
                pedidoExistente.setQuantidade(pedidoDTO.getQuantidade());
            }
        }
        atualizarValorTotalComanda(comanda);
        

        Pedido pedidoSalvo = pedidoRepository.save(pedidoExistente);
        return pedidoMapper.toResponseDTO(pedidoSalvo);
    }

    public PedidoResponseDTO atualizarStatusPedido(Long id, PedidoUpdateStatusDTO pedidoDTO){
        Pedido pedidoExistente = this.findById(id);
        if (pedidoDTO.getStatusPedido() != null) {
            pedidoExistente.setStatus(pedidoDTO.getStatusPedido());
        }

        Pedido pedidoSalvo = pedidoRepository.save(pedidoExistente);
        return pedidoMapper.toResponseDTO(pedidoSalvo);
    }

    public PedidoResponseDTO atribuirCozinheiro(Long pedidoId, Long cozinheiroId){
        Cozinheiro cozinheiro = cozinheiroService.findById(cozinheiroId);
        Pedido pedido = this.findById(pedidoId);

        PedidoUpdateStatusDTO statusDTO = new PedidoUpdateStatusDTO();
        CozinheiroUpdateStatusDTO cozinheiroStatusDTO = new CozinheiroUpdateStatusDTO();


        if (pedido.getCozinheiro() == null && "LIVRE".equals(cozinheiro.getStatus())) {
            pedido.setCozinheiro(cozinheiro);
            pedidoRepository.save(pedido);
            
            statusDTO.setStatusPedido("EM PREPARO");
            
            cozinheiroStatusDTO.setStatus("OCUPADO");
            cozinheiroService.alterarStatusCozinheiro(cozinheiroId, cozinheiroStatusDTO);

        }else{
            if (pedido.getCozinheiro() != null) throw new IllegalStateException("Pedido já atribuído a outro cozinheiro.");
            if (!"LIVRE".equals(cozinheiro.getStatus())) throw new IllegalStateException("Cozinheiro não está livre.");
        }       

        return this.atualizarStatusPedido(pedidoId, statusDTO);
    }

    public PedidoResponseDTO concluirPedido(Long pedidoId, Long cozinheiroId){
        Pedido pedido = this.findById(pedidoId);

        CozinheiroUpdateStatusDTO cozinheiroStatusDTO = new CozinheiroUpdateStatusDTO();
        PedidoUpdateStatusDTO pedidoStatusDTO = new PedidoUpdateStatusDTO();

        if(!"EM PREPARO".equals(pedido.getStatus())){
            throw new IllegalStateException("Não se pode concluir pedidos antes do preparo.");
        }

        cozinheiroStatusDTO.setStatus("LIVRE");
        cozinheiroService.alterarStatusCozinheiro(cozinheiroId, cozinheiroStatusDTO);

        pedidoStatusDTO.setStatusPedido("PRONTO");
        

        return this.atualizarStatusPedido(pedidoId, pedidoStatusDTO);
    }

    public PedidoResponseDTO marcarPedidoEntregue(Long id){
        Pedido pedido = this.findById(id);
        PedidoUpdateStatusDTO pedidoStatusDTO = new PedidoUpdateStatusDTO();

        if(!"PRONTO".equals(pedido.getStatus())){
            throw new IllegalStateException("Não pode entregar pedido não pronto");
        }

        pedidoStatusDTO.setStatusPedido("ENTREGUE");
        return this.atualizarStatusPedido(id, pedidoStatusDTO);        
    }

    public List<PedidoResponseDTO> buscarPedidoPorStatus(String status){
        return pedidoRepository.findByStatus(status)
            .stream()
            .map(pedidoMapper::toResponseDTO)
            .toList();
    }

    public void deletarPedido (Long id){
        Pedido pedidoExistente = this.findById(id);
        pedidoRepository.delete(pedidoExistente);

        Comanda comanda = pedidoExistente.getComanda();
        atualizarValorTotalComanda(comanda);
    }

}
