package br.com.restaurante.gestao_restaurante.models;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "mesas")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    @Column(nullable = false)
    private Integer status;

    @OneToMany(mappedBy = "mesa")
    private List<Comanda> comandas;
}
