package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.models.dto.OrderItemDTO;
import org.exp.primeapp.models.entities.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, List<OrderItemDTO> orderItems);
}
