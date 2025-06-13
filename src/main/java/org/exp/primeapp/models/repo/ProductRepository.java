package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByCategory(Category category);

    List<Product> findAllBy_active(boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p._active = :active WHERE p.id = :productId")
    int updateActive(@Param("active") boolean active, @Param("productId") Long productId);

    List<Product> findAllBy_activeAndCategory_Id(Boolean active, Long categoryId);
}