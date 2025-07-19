package org.exp.primeapp.repository;

import jakarta.transaction.Transactional;
import org.exp.primeapp.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.active = CASE WHEN u.active = true THEN false ELSE true END WHERE u.id = :userId")
    void toggleUserActiveStatus(@Param("userId") Long userId);


    List<User> findAllByActive(boolean b);

    long countByActive(Boolean active);

    User findByTelegramId(Long telegramId);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.phone = :phone WHERE u.id = :userId")
    void updatePhoneByUserId(@Param("userId") Long userId, @Param("phone") String phone);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verifyCode = :code, u.verifyCodeExpiration = :expiration WHERE u.id = :userId")
    void updateVerifyCodeAndExpiration(@Param("userId") Long userId,
                                       @Param("code") Integer oneTimeCode,
                                       @Param("expiration") LocalDateTime expirationTime);
}