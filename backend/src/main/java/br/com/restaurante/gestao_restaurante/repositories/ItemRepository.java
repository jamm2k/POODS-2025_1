package br.com.restaurante.gestao_restaurante.repositories;

import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.restaurante.gestao_restaurante.models.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>{

    Optional<Item> findByNome(String nome);

} 
