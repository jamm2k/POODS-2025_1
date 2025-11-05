package br.com.restaurante.gestao_restaurante.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "admins")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true, of = {})
@PrimaryKeyJoinColumn(name = "funcionario_id")
public class Admin extends Funcionario{

    @Column(name = "nivel_acesso", nullable = false)
    private Integer nivelAcesso;

}
