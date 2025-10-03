package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.order.OrderItemRes;
import org.exp.primeapp.models.dto.responce.order.UserOrderRes;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;

import java.util.List;

public interface OrderService {
    UserOrderRes createOrder(Long userId, List<OrderItemRes> orderItems);
    UserProfileOrdersRes getUserProfileOrdersById(Long id);
}
