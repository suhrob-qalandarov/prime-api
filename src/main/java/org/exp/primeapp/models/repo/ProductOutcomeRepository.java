package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.ProductOutcome;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOutcomeRepository extends JpaRepository<ProductOutcome, Long> {
}