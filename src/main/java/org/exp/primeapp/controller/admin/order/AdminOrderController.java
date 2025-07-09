package org.exp.primeapp.controller.admin.order;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.order.ChangeStatusRes;
import org.exp.primeapp.models.dto.responce.order.OrdersRes;
import org.exp.primeapp.repository.OrderRepository;
import org.exp.primeapp.service.interfaces.admin.order.AdminOrderService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + ORDERS)
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AdminOrderService adminOrderService;

    @GetMapping
    public List<OrdersRes> getAllOrders() {
        return adminOrderService.getAllOrders();
    }

    @PutMapping("{id}")
    public void updateOrder(@PathVariable Long id, @RequestBody ChangeStatusRes changeStatusDTO) {
        orderRepository.findById(id).ifPresent(order -> {
            order.setStatus(changeStatusDTO.getStatus());
            orderRepository.save(order);
        });
    }

    @MessageMapping("/stop")
    public void stopOrder(String id) {
        messagingTemplate.convertAndSend("/topic/order/stop", id);
    }

    @MessageMapping("/dropped")
    public void orderDropped(String id) {
        messagingTemplate.convertAndSend("/topic/order/dropped", id);
    }
}
