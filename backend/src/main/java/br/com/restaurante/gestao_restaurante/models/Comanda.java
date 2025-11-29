package br.com.restaurante.gestao_restaurante.models;

import java.util.List;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "comandas")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Comanda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mesa_id", nullable = true)
    private Mesa mesa;

    @ManyToOne
    @JoinColumn(name = "garcom_id", nullable = false)
    private Garcom garcom;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "comanda")
    private List<Pedido> pedidos;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, name = "valortotal")
    private Double valorTotal;

    @Column(nullable = false, name = "data_abertura")
    private LocalDateTime dataAbertura;

    @Column(nullable = true, name = "data_fechamento")
    private LocalDateTime dataFechamento;

    @Column(nullable = true, name = "taxaservico")
    private boolean taxaServico;

}
