package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.OrderItemDTO;
import org.exp.primeapp.models.entities.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, List<OrderItemDTO> orderItems);
}
