package br.com.restaurante.gestao_restaurante.models;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "garcons")
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "funcionario_id")
public class Garcom extends Funcionario {

    @Column(nullable = true, unique = false)
    private Double bonus;

    @OneToMany(mappedBy = "garcom")
    private List<Comanda> comandas;
    
}
