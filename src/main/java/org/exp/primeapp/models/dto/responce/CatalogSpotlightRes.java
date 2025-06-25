package org.exp.primeapp.models.dto.responce;

import lombok.Builder;

import java.util.List;

@Builder
public record CatalogSpotlightRes(
        Long id,
        String name,
        List<CategoryRes> categories
) {
}