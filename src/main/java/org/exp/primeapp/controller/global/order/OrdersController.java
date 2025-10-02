/*
package org.exp.primeapp.controller.global.order;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;
import org.exp.primeapp.service.interfaces.user.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ORDERS)
public class OrdersController {

    private final OrderService orderService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileOrdersRes> getUserOrdersById(@PathVariable Long id) {
        UserProfileOrdersRes profileOrderRes = orderService.getUserProfileOrdersById(id);
        return new ResponseEntity<>(profileOrderRes, HttpStatus.OK);
    }

    @GetMapping("/bytelegram/{telegramId}")
    public ResponseEntity<UserProfileOrdersRes> getUserOrdersByTelegramId(@PathVariable Long telegramId) {
        UserProfileOrdersRes profileOrderRes = orderService.getUserProfileOrdersByTelegramId(telegramId);
        return new ResponseEntity<>(profileOrderRes, HttpStatus.OK);
    }

    @GetMapping("/byphone/{phoneNumber}")
    public ResponseEntity<UserProfileOrdersRes> getUserOrdersByPhoneNumber(@PathVariable String phoneNumber) {
        UserProfileOrdersRes profileOrderRes = orderService.getUserProfileOrdersByPhoneNumber(phoneNumber);
        return new ResponseEntity<>(profileOrderRes, HttpStatus.OK);
    }


}
*/
