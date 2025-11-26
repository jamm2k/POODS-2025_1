package br.com.restaurante.gestao_restaurante.services;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaCreateDTO;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaResponseDTO;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaUpdateStatusDTO;
import br.com.restaurante.gestao_restaurante.dto.comanda.ComandaUpdateTaxaDTO;
import br.com.restaurante.gestao_restaurante.models.Comanda;
import br.com.restaurante.gestao_restaurante.models.Garcom;
import br.com.restaurante.gestao_restaurante.models.Mesa;
import br.com.restaurante.gestao_restaurante.models.Pedido;
import br.com.restaurante.gestao_restaurante.repositories.MesaRepository;
import br.com.restaurante.gestao_restaurante.repositories.PedidoRepository;
import jakarta.persistence.EntityNotFoundException;
import br.com.restaurante.gestao_restaurante.mapper.ComandaMapper;
import br.com.restaurante.gestao_restaurante.repositories.ComandaRepository;
import br.com.restaurante.gestao_restaurante.repositories.GarcomRepository;

@Service
public class ComandaService {
    @Autowired
    private ComandaRepository comandaRepository;

    @Autowired
    private ComandaMapper comandaMapper;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private GarcomRepository garcomRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    private Comanda findById(Long id) {
        return comandaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comanda não encontrada com o ID: " + id));
    }

    public ComandaResponseDTO findByIdComanda(Long id) {
        Comanda comanda = this.findById(id);
        return comandaMapper.toResponseDTO(comanda);
    }

    public List<ComandaResponseDTO> findAllComandas() {
        return comandaRepository.findAll()
                .stream()
                .map(comandaMapper::toResponseDTO)
                .toList();
    }

    public List<ComandaResponseDTO> findComandasByMesa(Long mesaId) {
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada"));
        return comandaRepository.findByMesa(mesa).stream()
                .map(comandaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public ComandaResponseDTO criarNovaComanda(ComandaCreateDTO comandaDTO) {

        Mesa mesa = mesaRepository.findById(comandaDTO.getMesaId())
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada com o ID: " + comandaDTO.getMesaId()));

        comandaRepository.findByMesaAndNome(mesa, comandaDTO.getNome()).ifPresent(m -> {
            throw new RuntimeException("Erro: Nome da comanda já cadastrado.");
        });

        Garcom garcom = garcomRepository.findById(comandaDTO.getGarcomId())
                .orElseThrow(() -> new RuntimeException("Garçom não encontrado com o ID: " + comandaDTO.getGarcomId()));

        Comanda comanda = comandaMapper.toEntity(comandaDTO);
        comanda.setMesa(mesa);
        comanda.setGarcom(garcom);
        comanda.setStatus("ABERTA");
        comanda.setDataAbertura(java.time.LocalDateTime.now());
        comanda.setValorTotal(0.0);
        comanda.setTaxaServico(true);

        if (mesa.getStatus().equals("LIVRE")) {
            mesa.setStatus("OCUPADA");
        }

        mesaRepository.save(mesa);

        Comanda comandaSalva = comandaRepository.save(comanda);
        return comandaMapper.toResponseDTO(comandaSalva);
    }

    public ComandaResponseDTO atualizarStatusComanda(Long id, ComandaUpdateStatusDTO statusDTO) {
        Comanda comandaExistente = this.findById(id);

        if (statusDTO.getStatus() == null || statusDTO.getStatus().isBlank()) {
            throw new IllegalArgumentException("Status inválido.");
        }

        comandaExistente.setStatus(statusDTO.getStatus());

        Comanda comandaAtualizada = comandaRepository.save(comandaExistente);

        if ("FECHADA".equalsIgnoreCase(statusDTO.getStatus()) || "PAGA".equalsIgnoreCase(statusDTO.getStatus())) {
            Mesa mesa = comandaExistente.getMesa();
            Long comandasAbertas = comandaRepository.countByMesaAndStatus(mesa, "ABERTA");

            if (comandasAbertas == 0) {
                mesa.setStatus("LIVRE");
                mesaRepository.save(mesa);
            }
        }

        return comandaMapper.toResponseDTO(comandaAtualizada);
    }

    protected void atualizarValorTotalComanda(Comanda comanda) {
        List<Pedido> pedidos = pedidoRepository.findByComanda(comanda);

        Double subTotal = 0.0;
        for (Pedido p : pedidos) {
            if (p.getItem() != null && p.getQuantidade() != null) {
                subTotal += p.getItem().getPreco() * p.getQuantidade();
            }
        }

        Double valorTotalFinal;
        if (comanda.isTaxaServico()) {
            valorTotalFinal = subTotal * 1.10;
        } else {
            valorTotalFinal = subTotal;
        }
        comanda.setValorTotal(valorTotalFinal);
        comandaRepository.save(comanda);
    }

    public ComandaResponseDTO atualizarTaxaServico(Long id, ComandaUpdateTaxaDTO updateTaxaDTO) {
        Comanda comanda = this.findById(id);

        if (comanda.isTaxaServico() == updateTaxaDTO.isTaxaServico()) {
            return comandaMapper.toResponseDTO(comanda);
        }

        comanda.setTaxaServico(updateTaxaDTO.isTaxaServico());

        this.atualizarValorTotalComanda(comanda);
        return comandaMapper.toResponseDTO(comanda);
    }

    public void deletarComanda(Long id) {
        Comanda comandaExistente = this.findById(id);

        if ("ABERTA".equals(comandaExistente.getStatus())) {
            throw new RuntimeException("Não é possível deletar uma comanda aberta.");
        }

        comandaRepository.deleteById(id);

        Mesa mesa = comandaExistente.getMesa();
        Long comandasAbertas = comandaRepository.countByMesaAndStatus(mesa, "ABERTA");

        if (comandasAbertas == 0) {
            mesa.setStatus("LIVRE");
            mesaRepository.save(mesa);
        }
    }

}
