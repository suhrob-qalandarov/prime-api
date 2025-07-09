package org.exp.primeapp.models.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;
import org.exp.primeapp.models.dto.responce.order.OrderItemRes;

import java.util.List;

@Getter
@Setter
@Value
@Builder
public class CreateOrderReq {
    Long userId;
    List<OrderItemRes> orderItems;
}
