package org.exp.primeapp.models.dto.request;

import lombok.Builder;

@Builder
public record SpotlightReq (String name, Long imageId){
}
