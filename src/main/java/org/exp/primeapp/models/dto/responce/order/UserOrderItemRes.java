package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record UserOrderItemRes(
        String name,
        String imageKey,
        String size,
        BigDecimal price,
        Integer discount,
        Integer count,
        BigDecimal totalSum
) {
}
