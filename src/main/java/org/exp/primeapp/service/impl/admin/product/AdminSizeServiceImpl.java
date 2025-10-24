package org.exp.primeapp.service.impl.admin.product;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.enums.Size;
import org.exp.primeapp.service.interfaces.admin.product.AdminSizeService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminSizeServiceImpl implements AdminSizeService {

    @Override
    public List<Map<String, String>> getSizeList() {
        return Arrays.stream(Size.values())
                .map(size -> Map.of(
                        "value", size.name(),
                        "label", size.getLabel()
                ))
                .toList();
    }
}
