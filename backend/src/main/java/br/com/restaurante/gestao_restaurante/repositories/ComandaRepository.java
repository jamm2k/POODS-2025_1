package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.restaurante.gestao_restaurante.models.Comanda;
import br.com.restaurante.gestao_restaurante.models.Mesa;

@Repository
public interface ComandaRepository  extends JpaRepository<Comanda, Long> {

    Optional<Comanda> findByNome(String nome);
    Optional<Comanda> findByMesaAndNome(Mesa mesa, String nome);
    long countbyMesaAndStatus(Mesa mesa, String string);
    
}
