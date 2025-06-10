package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.ProductIncome;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductIncomeRepository extends JpaRepository<ProductIncome, Long> {
}