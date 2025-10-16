package br.com.restaurante.gestao_restaurante.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.*;

@Data
@Entity
@Table(name = "funcionarios")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Funcionario extends Usuario {

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false, unique = false, name = "data_admissao")
    private LocalDate dataAdmissao;

    @Column(nullable = true, unique = false)
    private Double salario;
    
}
