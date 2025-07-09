package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Getter
@Setter
@Value
@Builder

public class OrderItemRes {
    Long productId;
    Long productSizeId;
    Integer quantity;
}
