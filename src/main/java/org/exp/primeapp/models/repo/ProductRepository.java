package org.exp.primeapp.models.repo;

import jakarta.transaction.Transactional;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(Category category);

    List<Product> findBy_active(boolean active);

    Product findBy_activeTrueAndId(Long id);

    @Modifying
    @Transactional
    @Query("update Product p set p._active = false where p.id = :id")
    void updateActive(@Param("id") Long id);

    List<ProductRes> findAllByCategory_Id(Long categoryId);
}