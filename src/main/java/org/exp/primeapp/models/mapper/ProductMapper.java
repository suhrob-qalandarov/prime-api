package org.exp.primeapp.models.mapper;

import org.exp.primeapp.models.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {ProductSizeMapper.class})
public interface ProductMapper {
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "attachments", target = "attachmentKeys", qualifiedByName = "toAttachmentKeys")
    @Mapping(source = "sizes", target = "productSizes")
    ProductRes toProductResponse(Product product);

    List<ProductRes> toProductResponseList(Set<Product> products);

    @org.mapstruct.Named("toAttachmentKeys")
    default List<String> toAttachmentKeys(Set<Attachment> attachments) {
        return attachments.stream()
                .map(Attachment::getKey)
                .toList();
    }
}