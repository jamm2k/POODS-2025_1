package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.restaurante.gestao_restaurante.models.Comanda;
import br.com.restaurante.gestao_restaurante.models.Garcom;
import br.com.restaurante.gestao_restaurante.models.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByComanda(Comanda comanda);

    Optional<Pedido> findByStatus(String status);

    List<Pedido> findByGarcom(Garcom garcom);
    
}
