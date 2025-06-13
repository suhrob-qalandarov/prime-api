package org.exp.primeapp.dto.responce;

import lombok.*;
import org.exp.primeapp.models.enums.ProductStatus;

import java.util.List;


@Value
public class ProductRes {
    Long id;
    String name;
    String description;
    Double price;
    Integer amount;
    ProductStatus status;
    Long categoryId;
    List<Long> attachmentIds;
}
