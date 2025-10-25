package org.exp.primeapp.service.face.admin.product;

import org.exp.primeapp.models.dto.responce.admin.AdminSizeRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminSizeService {
    List<AdminSizeRes> getSizeList();
}
