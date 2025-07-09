package org.exp.primeapp.models.dto.responce.order;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.user.ProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;

@Builder
public record OrdersItemRes(ProductRes productRes,
                            ProductSizeRes productSize,
                            Integer quantity) {
}

