/*
package org.exp.primeapp.models.mapper;

import org.exp.primeapp.models.dto.responce.user.CollectionProductRes;
import org.exp.primeapp.models.entities.Collection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CollectionMapper {
    @Mapping(source = "mainImage.key", target = "imageKey")
    @Mapping(source = "products", target = "productRes")
    CollectionProductRes toCollectionProductResponse(Collection collection);

    List<CollectionProductRes> toCollectionProductResponseList(List<Collection> collections);
}*/
