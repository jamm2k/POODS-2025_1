package br.com.restaurante.gestao_restaurante.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "cozinheiros")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "funcionario_id")
public class Cozinheiro extends Funcionario {

    @Column(nullable = false, unique = false)
    private String status;
    
}