package org.exp.primeapp.dto.responce;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Builder
@AllArgsConstructor
public class CategoryRes {
    Long id;
    String name;
    Boolean _active;
    Long attachmentId;
}
