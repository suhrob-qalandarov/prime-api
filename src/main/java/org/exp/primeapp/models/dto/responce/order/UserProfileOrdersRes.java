package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;

import java.util.List;

@Builder
public record UserProfileOrdersRes(
        List<UserOrderRes> pendingOrders,
        List<UserOrderRes> confirmedOrders,
        List<UserOrderRes> shippedOrders
) {
}
