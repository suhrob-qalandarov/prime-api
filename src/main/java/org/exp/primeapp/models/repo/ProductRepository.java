package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(Category category);
}