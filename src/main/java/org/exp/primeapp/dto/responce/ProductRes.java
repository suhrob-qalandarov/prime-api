package org.exp.primeapp.dto.responce;

import lombok.*;


@Value
public class ProductRes {
    String name;
    String description;
    Double price;
    Integer amount;
    Long categoryId;
}
