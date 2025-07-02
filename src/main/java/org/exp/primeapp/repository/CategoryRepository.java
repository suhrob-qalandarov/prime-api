package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByActive(boolean active);

    List<Category> findAllBySpotlightId(Long spotlightId);

    @Transactional
    @Modifying
    @Query("UPDATE Category c SET c.active = CASE WHEN c.active = true THEN false ELSE true END WHERE c.id = :categoryId")
    void toggleCategoryActiveStatus(@Param("categoryId") Long categoryId);
}