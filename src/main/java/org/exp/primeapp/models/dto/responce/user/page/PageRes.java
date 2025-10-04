package org.exp.primeapp.models.dto.responce.user.page;

import lombok.Builder;

import java.util.List;

@Builder
public record PageRes<T> (
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
}
