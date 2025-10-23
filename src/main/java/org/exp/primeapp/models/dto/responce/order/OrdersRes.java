package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.enums.OrderStatus;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record OrdersRes(
        Long id,
        UserRes user,
        BigDecimal totalPrice,
        OrderStatus status,
        List<OrdersItemRes> ordersItems) {

}