package org.exp.primeapp.models.dto.request;

import lombok.Builder;

import java.util.List;

@Builder
public record CollectionReq(
        String name,
        String description,
        Long mainImageId,
        List<Long> productIds
) {
}
