package org.exp.primeapp.service.interfaces.admin.product;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface AdminSizeService {
    List<Map<String, String>> getSizeList();
}
