package org.exp.primeapp.controller.user.order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.request.CreateOrderReq;
import org.exp.primeapp.service.interfaces.user.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequestMapping(API + V1 + ORDER)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderReq request) {
        log.info("Yangi buyurtma yaratilmoqda: userId={}, itemCount={}",
                request.getUserId(), request.getOrderItems().size());

        orderService.createOrder(request.getUserId(), request.getOrderItems());

        log.info("Buyurtma muvaffaqiyatli yaratildi: userId={}", request.getUserId());
        return ResponseEntity.ok().build();
    }
}