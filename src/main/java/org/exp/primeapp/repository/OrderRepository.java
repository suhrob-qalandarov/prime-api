package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Order;
import org.exp.primeapp.models.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserTelegramId(Long userTelegramId);

    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    List<Order> findByUser_TelegramIdAndStatus(Long userTelegramId, OrderStatus status);

    List<Order> findByUserPhoneAndStatus(String userPhone, OrderStatus status);

    default List<Order> findPendingOrdersByTelegramId(Long userTelegramId) {
        return findByUser_TelegramIdAndStatus(userTelegramId, OrderStatus.PENDING);
    }

    default List<Order> findAcceptedOrdersByTelegramId(Long userTelegramId) {
        return findByUser_TelegramIdAndStatus(userTelegramId, OrderStatus.CONFIRMED);
    }

    default List<Order> findShippedOrdersByTelegramId(Long userTelegramId) {
        return findByUser_TelegramIdAndStatus(userTelegramId, OrderStatus.SHIPPED);
    }
}