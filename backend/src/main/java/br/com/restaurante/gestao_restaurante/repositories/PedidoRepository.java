package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.restaurante.gestao_restaurante.models.Comanda;
import br.com.restaurante.gestao_restaurante.models.Garcom;
import br.com.restaurante.gestao_restaurante.models.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByComanda(Comanda comanda);

    List<Pedido> findByStatus(String status);

    List<Pedido> findByGarcom(Garcom garcom);

    @Query("SELECT SUM(p.item.preco * p.quantidade) " +
<<<<<<< HEAD
            "FROM Pedido p " +
            "WHERE p.garcom = :garcom " +
            "AND p.item.categoria = 'PREMIUM' " +
            "AND p.comanda.dataAbertura BETWEEN :inicioMes AND :fimMes")
=======
           "FROM Pedido p " + 
           "WHERE p.garcom = :garcom " +
           "AND UPPER(p.item.tipo) = 'PREMIUM' " +
           "AND p.comanda.dataAbertura BETWEEN :inicioMes AND :fimMes")
>>>>>>> 151a95477380c94795844b86d02609315eb8ac7c
    Double sumVendasPremiumByGarcomAndData(
            @Param("garcom") Garcom garcom,
            @Param("inicioMes") LocalDateTime inicioMes,
            @Param("fimMes") LocalDateTime fimMes);
}