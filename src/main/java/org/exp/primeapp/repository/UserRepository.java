package org.exp.primeapp.repository;

import jakarta.transaction.Transactional;
import org.exp.primeapp.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> getByEmailOptional(@Param("email") String email);


    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.active = :active WHERE u.id = :productId")
    int updateActive(@Param("active")boolean active, @Param("userId") Long userId);

    List<User> findAllByActive(boolean b);

    long countByActive(Boolean active);
}