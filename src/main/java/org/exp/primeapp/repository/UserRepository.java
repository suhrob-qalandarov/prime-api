package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findOneByVerifyCode(Integer verifyCode);

    User findByTelegramId(Long telegramId);

    User findByTgUsername(String tgUsername);

    User findByPhone(String phone);

    @Query("SELECT u FROM User u WHERE u.phone = :phone")
    Optional<User> findByPhoneOptional(@Param("phone") String phone);

    List<User> findAllByActive(boolean b);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.active = :active WHERE u.telegramId = :telegramId")
    int updateActive(@Param("active")boolean active, @Param("telegramId") Long telegramId);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.active = CASE WHEN u.active = true THEN false ELSE true END WHERE u.telegramId = :telegramId")
    void toggleUserActiveStatus(@Param("telegramId") Long telegramId);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.phone = :phone WHERE u.telegramId = :telegramId")
    void updatePhoneByUserId(@Param("telegramId") Long telegramId, @Param("phone") String phone);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verifyCode = :code, u.verifyCodeExpiration = :expiration WHERE u.telegramId = :telegramId")
    void updateVerifyCodeAndExpiration(@Param("telegramId") Long telegramId, @Param("code") Integer oneTimeCode, @Param("expiration") LocalDateTime expirationTime);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.messageId = :messageId WHERE u.telegramId = :telegramId")
    void updateMessageId(@Param("telegramId") Long telegramId, @Param("messageId") Integer messageId);
}