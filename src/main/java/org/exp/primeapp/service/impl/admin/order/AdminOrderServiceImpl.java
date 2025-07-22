package org.exp.primeapp.service.impl.admin.order;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.order.OrdersItemRes;
import org.exp.primeapp.models.dto.responce.order.OrdersRes;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.Order;
import org.exp.primeapp.models.entities.OrderItem;
import org.exp.primeapp.repository.OrderItemRepository;
import org.exp.primeapp.repository.OrderRepository;
import org.exp.primeapp.service.impl.user.ProductServiceImpl;
import org.exp.primeapp.service.interfaces.admin.order.AdminOrderService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductServiceImpl productServiceImpl;

    @Transactional
    @Override
    public List<OrdersRes> getAllOrders() {
        List<Order> all = orderRepository.findAll();
        List<OrdersRes> orderAllRes = new ArrayList<>();
        for (Order order : all) {
            List<OrdersItemRes> ordersItemRes = getAllOrderItemsById(order.getId());
            OrdersRes ordersRes = OrdersRes.builder()
                    .id(order.getId())
                    .user(UserRes.builder()
                            .telegramId(order.getUser().getTelegramId())
                            .firstName(order.getUser().getFirstName())
                            .lastName(order.getUser().getLastName())
                            .username(order.getUser().getUsername())
                            .phone(order.getUser().getPhone())
                            .build())
                    .totalPrice(order.getTotalPrice())
                    .status(order.getStatus())
                    .ordersItems(ordersItemRes)
                    .build();
            orderAllRes.add(ordersRes);
        }
        return orderAllRes;
    }

    @Transactional
    public List<OrdersItemRes> getAllOrderItemsById(Long id) {
        List<OrderItem> orderItems = orderItemRepository.findByOrder_Id(id);
        List<OrdersItemRes> ordersItemRes = new ArrayList<>();
        for (OrderItem orderItem : orderItems) {

            OrdersItemRes ordersItemResponse = OrdersItemRes.builder()
                    .productRes(productServiceImpl.convertToProductRes(orderItem.getProduct()))
                    .productSize(ProductSizeRes.builder()
                            .size(orderItem.getProductSize().getSize())
                            .amount(orderItem.getProductSize().getAmount())
                            .build())
                    .quantity(orderItem.getQuantity())
                    .build();
            ordersItemRes.add(ordersItemResponse);
        }
        return ordersItemRes;
    }
}
