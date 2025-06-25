package org.exp.primeapp.service.impl.order;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.OrderItemDTO;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.enums.OrderStatus;
import org.exp.primeapp.models.repo.*;
import org.exp.primeapp.service.interfaces.OrderService;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        // 1. Foydalanuvchini topish
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Yangi Order yaratish
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(0); // Hozircha 0, keyin hisoblanadi

        double totalPrice = 0.0;

        // 3. OrderItemlarni qayta ishlash
        try {

            for (OrderItemDTO itemDTO : orderItems) {
                // Mahsulotni topish
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                // ProductSize ni topish
                ProductSize productSize = productSizeRepository.findById(itemDTO.getProductSizeId())
                        .orElseThrow(() -> new RuntimeException("Product size not found"));

                // Mahsulot va o'lcham mosligini tekshirish
                if (!productSize.getProduct().getId().equals(product.getId())) {
                    throw new RuntimeException("Product size does not belong to the specified product");
                }

                // Miqdor yetarliligini tekshirish
                if (productSize.getAmount() < itemDTO.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName() + ", size: " + productSize.getSize());
                }

                // Narxni hisoblash (discountni hisobga olgan holda)
                double itemPrice = calculateItemPrice(product);
                totalPrice += itemPrice * itemDTO.getQuantity();

                // OrderItem yaratish
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setProductSize(productSize);
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setPrice(itemPrice);

                order.getItems().add(orderItem);

                // ProductSize miqdorini yangilash
                productSize.setAmount(productSize.getAmount() - itemDTO.getQuantity());
                productSizeRepository.save(productSize);

                // ProductOutcome qaydini yaratish
                ProductOutcome outcome = new ProductOutcome();
                outcome.setUser(user);
                outcome.setProduct(product);
                outcome.setAmount(itemDTO.getQuantity());
                productOutcomeRepository.save(outcome);
            }
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("Another user updated product stock. Please refresh and try again.");
        }

        // 4. Umumiy narxni yangilash
        order.setTotalPrice((int) totalPrice); // Integer ga aylantirish (agar kerak bo'lsa)

        // 5. Orderni saqlash
        return orderRepository.save(order);
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

