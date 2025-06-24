package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Spotlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotlightRepository extends JpaRepository<Spotlight, Long> {


}
