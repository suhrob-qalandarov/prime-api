package org.exp.primeapp.controller.order;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CreateOrderReq;
import org.exp.primeapp.service.interfaces.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderReq request) throws InterruptedException {
        orderService.createOrder(request.getUserId(), request.getOrderItems());
        return ResponseEntity.ok().build();
    }
}