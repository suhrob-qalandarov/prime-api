package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findALlByNameIn(List<String> roleUser);

    List<Role> findAllByIdIn(Collection<Long> ids);
}