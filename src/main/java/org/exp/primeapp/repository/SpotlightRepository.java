package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Spotlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotlightRepository extends JpaRepository<Spotlight, Long> {

    List<Spotlight> findAllByOrderByOrderNumberAsc();
}
