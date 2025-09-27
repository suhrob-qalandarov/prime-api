package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.order.OrderItemRes;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;
import org.exp.primeapp.models.entities.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, List<OrderItemRes> orderItems);

    UserProfileOrdersRes getUserProfileOrdersByTelegramId(Long telegramId);

    UserProfileOrdersRes getUserProfileOrdersByPhoneNumber(String phoneNumber);

    UserProfileOrdersRes getUserProfileOrdersById(Long id);
}
