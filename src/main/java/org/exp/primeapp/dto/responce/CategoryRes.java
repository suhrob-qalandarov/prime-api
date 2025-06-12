package org.exp.primeapp.dto.responce;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class CategoryRes {
    Long id;
    String name;
    Boolean _active;
}
