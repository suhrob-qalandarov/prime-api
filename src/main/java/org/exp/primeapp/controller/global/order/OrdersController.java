package org.exp.primeapp.controller.global.order;


import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.order.OrdersRes;
import org.exp.primeapp.service.interfaces.admin.order.AdminOrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ORDERS)
public class OrdersController {


}
