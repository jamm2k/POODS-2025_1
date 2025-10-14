package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.restaurante.gestao_restaurante.models.Comanda;

@Repository
public interface ComandaRepository  extends JpaRepository<Comanda, Long> {
    
}
