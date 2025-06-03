package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findALlByNameIn(List<String> roleUser);
}