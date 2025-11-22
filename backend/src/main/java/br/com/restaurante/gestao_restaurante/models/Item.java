package br.com.restaurante.gestao_restaurante.models;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "itens")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Double preco;

    @ManyToOne
    @JoinColumn(name = "cardapio_id", nullable = true)
    private Cardapio cardapio;
}
