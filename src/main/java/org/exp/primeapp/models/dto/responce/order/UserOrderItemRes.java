package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;

@Builder
public record UserOrderItemRes(
        String name,
        String imageKey,
        String size,
        Double price,
        Integer discount,
        Integer count,
        Long totalSum
) {
}
