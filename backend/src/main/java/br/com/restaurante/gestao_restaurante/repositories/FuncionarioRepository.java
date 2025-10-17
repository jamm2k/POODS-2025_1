package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.restaurante.gestao_restaurante.models.Funcionario;
import br.com.restaurante.gestao_restaurante.models.Garcom;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Garcom> findByMatricula(String matricula);
    
}
