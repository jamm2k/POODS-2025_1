package br.com.restaurante.gestao_restaurante.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "barmen")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "funcionario_id")
public class Barman extends Funcionario {

    @Column(nullable = false)
    private String status; //livre ou ocupado

}
