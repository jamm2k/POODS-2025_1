package br.com.restaurante.gestao_restaurante.models;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "pedidos")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comanda_id", nullable = false)
    private Comanda comanda;

    @ManyToOne
    @JoinColumn(name = "garcom_id", nullable = true)
    private Garcom garcom;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = true)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "cozinheiro_id", nullable = true)
    private Cozinheiro cozinheiro;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = true)
    private String obs;

    @Column(nullable = false)
    private String status;

}
