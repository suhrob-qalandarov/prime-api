package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;

import java.util.List;

@Builder
public record UserRes(
        Long id,
        String firstName,
        String phone,
        List<String> roles,
        UserProfileOrdersRes ordersRes
) {
}
