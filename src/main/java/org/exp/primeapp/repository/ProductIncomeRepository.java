package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.ProductIncome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductIncomeRepository extends JpaRepository<ProductIncome, Long> {
}