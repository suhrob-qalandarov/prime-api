package org.exp.primeapp.models.dto.responce;

import lombok.Builder;

import java.util.List;

@Builder
public record HeroCollectionRes(
        Long collectionId,
        List<String> productsMainImageKeys
) {
}
