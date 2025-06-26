package org.exp.primeapp.models.mapper;

import org.exp.primeapp.models.dto.responce.ProductSizeRes;
import org.exp.primeapp.models.entities.ProductSize;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductSizeMapper {
    ProductSizeRes toProductSizeResponse(ProductSize productSize);

    List<ProductSizeRes> toProductSizeResponseList(List<ProductSize> productSizes);
}
