package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findBy_active(boolean active);
}