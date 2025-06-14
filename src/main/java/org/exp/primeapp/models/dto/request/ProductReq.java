package org.exp.primeapp.models.dto.request;

import lombok.Value;
import org.exp.primeapp.models.enums.ProductStatus;

import java.util.List;

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
