package org.exp.primeapp.models.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Getter
@Setter
@Value
@Builder

public class OrderItemDTO {
    Long productId;
    Long productSizeId;
    Integer quantity;
}
