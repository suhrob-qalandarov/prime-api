package org.exp.primeapp.dto.responce;

import lombok.Value;

@Value
public class CategoryRes {
    Long id;
    String name;
    Boolean active;
    Long attachmentId;
}
