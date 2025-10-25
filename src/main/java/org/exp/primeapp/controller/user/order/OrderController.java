package org.exp.primeapp.controller.user.order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.request.CreateOrderReq;
import org.exp.primeapp.models.dto.responce.order.UserOrderRes;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;
import org.exp.primeapp.service.face.user.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequestMapping(API + V1 + ORDER)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileOrdersRes> getUserOrdersById(@PathVariable Long id) {
        UserProfileOrdersRes profileOrderRes = orderService.getUserProfileOrdersById(id);
        return new ResponseEntity<>(profileOrderRes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserOrderRes> createOrder(@RequestBody CreateOrderReq request) {
        UserOrderRes orderRes = orderService.createOrder(request.getUserId(), request.getOrderItems());
        return new ResponseEntity<>(orderRes, HttpStatus.OK);
    }
}