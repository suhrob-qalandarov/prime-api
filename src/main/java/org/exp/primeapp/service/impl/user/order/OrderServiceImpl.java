package org.exp.primeapp.service.impl.user.order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.OrderItemDTO;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.enums.OrderStatus;
import org.exp.primeapp.repository.*;
import org.exp.primeapp.service.interfaces.user.OrderService;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final ProductSizeRepository productSizeRepository;

    private final ProductOutcomeRepository productOutcomeRepository;


    @Transactional
    public Order createOrder(Long userId, List<OrderItemDTO> orderItems) {
        log.info("Order creation started for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(0);

        double totalPrice = 0.0;

        try {
            for (OrderItemDTO itemDTO : orderItems) {
                log.debug("Processing productId: {}, productSizeId: {}, quantity: {}",
                        itemDTO.getProductId(), itemDTO.getProductSizeId(), itemDTO.getQuantity());

                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                ProductSize productSize = productSizeRepository.findById(itemDTO.getProductSizeId())
                        .orElseThrow(() -> new RuntimeException("Product size not found"));

                if (!productSize.getProduct().getId().equals(product.getId())) {
                    throw new RuntimeException("Product size does not belong to the specified product");
                }

                if (productSize.getAmount() < itemDTO.getQuantity()) {
                    log.warn("Insufficient stock for product: {}, size: {}, requested: {}, available: {}",
                            product.getName(), productSize.getSize(), itemDTO.getQuantity(), productSize.getAmount());
                    throw new RuntimeException("Insufficient stock for product: " + product.getName() + ", size: " + productSize.getSize());
                }

                double itemPrice = calculateItemPrice(product);
                totalPrice += itemPrice * itemDTO.getQuantity();

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setProductSize(productSize);
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setPrice(itemPrice);

                order.getItems().add(orderItem);

                productSize.setAmount(productSize.getAmount() - itemDTO.getQuantity());
                productSizeRepository.save(productSize);

                ProductOutcome outcome = new ProductOutcome();
                outcome.setUser(user);
                outcome.setProduct(product);
                outcome.setAmount(itemDTO.getQuantity());
                outcome.setProductSize(productSize);
                productOutcomeRepository.save(outcome);
            }

            order.setTotalPrice((int) totalPrice);
            Order savedOrder = orderRepository.save(order);

            log.info("Order created successfully for userId: {}, orderId: {}", userId, savedOrder.getId());
            return savedOrder;

        } catch (ObjectOptimisticLockingFailureException e) {
            log.error("Optimistic lock error while creating order for userId: {}", userId, e);
            throw new RuntimeException("Mahsulot zaxirasi o'zgartirilgan. Iltimos, sahifani yangilang va qaytadan urinib ko'ring.");
        } catch (RuntimeException e) {
            log.error("Unexpected error during order creation for userId: {}", userId, e);
            throw e;
        }
    }


    private double calculateItemPrice(Product product) {
        double price = product.getPrice();
        Integer discount = product.getDiscount();
        if (discount != null && discount > 0) {
            price = price * (1 - discount / 100.0);
        }
        return price;
    }
}

