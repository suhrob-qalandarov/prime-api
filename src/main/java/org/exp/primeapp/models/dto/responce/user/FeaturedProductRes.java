package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;

import java.util.List;

@Builder
public record FeaturedProductRes(
        List<ProductRes> saleStatusProducts,
        List<ProductRes> newStatusProducts,
        List<ProductRes> hotStatusProducts
) {
}
