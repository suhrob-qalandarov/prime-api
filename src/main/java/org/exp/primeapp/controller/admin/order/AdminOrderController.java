package org.exp.primeapp.controller.admin.order;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.order.ChangeStatusRes;
import org.exp.primeapp.models.dto.responce.order.OrderRes;
import org.exp.primeapp.repository.OrderRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ORDERS)
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;

    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public List<OrderRes> getAllOrders() {

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
