package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.restaurante.gestao_restaurante.models.Cardapio;

@Repository
public interface CardapioRepository  extends JpaRepository<Cardapio, Long> {
    
}
