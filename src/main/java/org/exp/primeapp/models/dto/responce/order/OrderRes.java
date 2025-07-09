package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;
import lombok.Value;
import org.exp.primeapp.models.dto.responce.user.UserRes;

import java.util.List;

@Value
@Builder
public class OrderRes {
    Long id;
    UserRes user;
    Integer totalPrice;
    List<OrderItemRes> orderItems;
}
