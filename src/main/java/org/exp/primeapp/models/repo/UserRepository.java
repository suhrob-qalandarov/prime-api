package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}