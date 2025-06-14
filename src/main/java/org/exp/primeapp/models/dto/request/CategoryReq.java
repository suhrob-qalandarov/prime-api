package org.exp.primeapp.models.dto.request;

import lombok.Value;

@Value
public class CategoryReq {
    String name;
    Long attachmentId;
    Boolean active;
}
