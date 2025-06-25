package org.exp.primeapp.service.impl;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.CategoryRes;

import java.util.List;

@Builder
public record CatalogSpotlightRes(
        Long id,
        String name,
        List<CategoryRes> categories
) {
}