package org.exp.primeapp.controller.admin.product;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.service.interfaces.user.ProductService;
import org.exp.primeapp.utils.Const;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(Const.API + V1 + ADMIN + DASHBOARD)
@RequiredArgsConstructor
public class AdminProductDashboardController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<AdminProductDashboardRes> adminProductDashboard() {
        AdminProductDashboardRes adminProductDashboardRes = productService.getProductDashboarRes();
        return ResponseEntity.ok(adminProductDashboardRes);
    }
}
