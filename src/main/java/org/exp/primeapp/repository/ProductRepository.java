package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByCategory(Category category);

    List<Product> findAllByActive(boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.active = :active WHERE p.id = :productId")
    int updateActive(@Param("active") boolean active, @Param("productId") Long productId);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.active = :active")
    List<Product> findByActiveAndCategoryId(@Param("categoryId") Long categoryId, @Param("active") Boolean active);

}