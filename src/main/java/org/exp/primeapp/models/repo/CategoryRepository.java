package org.exp.primeapp.models.repo;

import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("select c from Category c where c._active = ?1")
    List<CategoryRes> findBy_active(boolean active);

}