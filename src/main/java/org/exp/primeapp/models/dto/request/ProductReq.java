package org.exp.primeapp.models.dto.request;

import lombok.Builder;
import lombok.Value;
import org.exp.primeapp.models.enums.ProductStatus;

import java.util.List;
@Builder
@Value
public class ProductReq {
    String name;
    String description;
    Double price;
    Boolean active;
    ProductStatus status;
    Long categoryId;
    List<Long> attachmentIds;
    List<ProductSizeReq> productSizes;
}
