package org.exp.primeapp.service.face.admin.order;

import org.exp.primeapp.models.dto.responce.order.OrdersRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminOrderService {
    List<OrdersRes> getAllOrders();
}
