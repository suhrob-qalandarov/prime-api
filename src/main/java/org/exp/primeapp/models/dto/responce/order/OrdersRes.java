package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;
import lombok.Value;
import org.exp.primeapp.models.dto.responce.order.OrderItemRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;

import java.util.List;

@Builder
public record OrdersRes(
        Long id,
        UserRes user,
        Integer totalPrice,
        List<OrdersItemRes> ordersItems) {

}