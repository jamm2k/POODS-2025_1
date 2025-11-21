package br.com.restaurante.gestao_restaurante.repositories;

import br.com.restaurante.gestao_restaurante.models.Barman;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarmanRepository extends JpaRepository<Barman, Long> {
}
