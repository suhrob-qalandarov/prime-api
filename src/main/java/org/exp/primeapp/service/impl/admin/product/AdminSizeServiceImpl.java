package org.exp.primeapp.service.impl.admin.product;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.AdminSizeRes;
import org.exp.primeapp.models.enums.Size;
import org.exp.primeapp.service.interfaces.admin.product.AdminSizeService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSizeServiceImpl implements AdminSizeService {

    @Override
    public List<AdminSizeRes> getSizeList() {
        return Arrays.stream(Size.values())
                .map(size -> AdminSizeRes.builder()
                        .value(size.name())
                        .label(size.getLabel())
                        .build())
                .toList();
    }
}
