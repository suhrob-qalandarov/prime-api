package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record UserOrderRes(
        Long id,
        String status,
        LocalDateTime createdAt,
        List<UserOrderItemRes> orderItems,
        BigDecimal totalSum
) {
}
