package org.exp.primeapp.service.impl.user.order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.order.OrderItemRes;
import org.exp.primeapp.models.dto.responce.order.UserOrderItemRes;
import org.exp.primeapp.models.dto.responce.order.UserOrderRes;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.enums.OrderStatus;
import org.exp.primeapp.repository.*;
import org.exp.primeapp.service.face.user.OrderService;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
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

    @Override
    public UserProfileOrdersRes getUserProfileOrdersById(Long id) {
        List<UserOrderRes> pendingOrderResList = orderRepository.findByUserIdAndStatus(
                id, OrderStatus.PENDING
        ).stream().map(this::convertToUserOrderRes).toList();

        List<UserOrderRes> confirmedOrderResList = orderRepository.findByUserIdAndStatus(
                id, OrderStatus.CONFIRMED
        ).stream().map(this::convertToUserOrderRes).toList();

        List<UserOrderRes> shippedOrderResList = orderRepository.findByUserIdAndStatus(
                id, OrderStatus.SHIPPED
        ).stream().map(this::convertToUserOrderRes).toList();

        return UserProfileOrdersRes.builder()
                .pendingOrders(pendingOrderResList)
                .confirmedOrders(confirmedOrderResList)
                .shippedOrders(shippedOrderResList)
                .build();
    }

    @Transactional
    public UserOrderRes convertToUserOrderRes(Order order) {
        return UserOrderRes.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .orderItems(order.getItems().stream()
                        .map(orderItem -> {
                            BigDecimal itemPrice = calculateItemPrice(orderItem.getProduct());
                            BigDecimal totalSum = itemPrice.multiply(BigDecimal.valueOf(orderItem.getQuantity()));

                            return UserOrderItemRes.builder()
                                    .name(orderItem.getProduct().getName())
                                    .imageKey(orderItem.getProduct().getAttachments().stream()
                                            .findFirst()
                                            .map(Object::toString)
                                            .orElse(null))
                                    .size(orderItem.getProductSize().getSize().name())
                                    .price(itemPrice.setScale(2, RoundingMode.HALF_UP))
                                    .discount(orderItem.getProduct().getDiscount())
                                    .count(orderItem.getQuantity())
                                    .totalSum(totalSum.setScale(2, RoundingMode.HALF_UP))
                                    .build();
                        })
                        .toList())
                .totalSum(order.getTotalPrice().setScale(2, RoundingMode.HALF_UP))
                .build();
    }

    @Transactional
    public UserOrderRes createOrder(Long userId, List<OrderItemRes> orderItems) {
        log.info("Buyurtma yaratish jarayoni boshlandi. Foydalanuvchi ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(BigDecimal.ZERO);

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItem> orderItemsList = new ArrayList<>();

        try {
            for (OrderItemRes itemDTO : orderItems) {
                log.debug("Mahsulotni qayta ishlash. ProductID: {}, ProductSizeID: {}, Quantity: {}",
                        itemDTO.getProductId(), itemDTO.getProductSizeId(), itemDTO.getQuantity());

                Product product = fetchProduct(itemDTO.getProductId());
                ProductSize productSize = fetchAndValidateProductSize(
                        itemDTO.getProductSizeId(), product.getId(), itemDTO.getQuantity());

                BigDecimal itemPrice = calculateItemPrice(product);
                BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(itemDTO.getQuantity()));

                totalPrice = totalPrice.add(itemTotal);

                OrderItem orderItem = createOrderItem(order, product, productSize, itemDTO.getQuantity(), itemPrice);
                orderItemsList.add(orderItem);

                updateStockAndLogOutcome(productSize, itemDTO.getQuantity(), user, product);
            }

            order.setItems(orderItemsList);
            order.setTotalPrice(totalPrice.setScale(2, RoundingMode.HALF_UP));
            Order savedOrder = orderRepository.save(order);

            log.info("Buyurtma muvaffaqiyatli yaratildi. UserId: {}, OrderId: {}", userId, savedOrder.getId());
            return convertToUserOrderRes(savedOrder);

        } catch (ObjectOptimisticLockingFailureException e) {
            log.error("Optimistik qulf xatosi. UserId: {}", userId, e);
            throw new RuntimeException("Mahsulot zaxirasi o'zgartirilgan. Iltimos, sahifani yangilang va qaytadan urinib ko'ring.");
        } catch (RuntimeException e) {
            log.error("Kutilmagan xato. Buyurtma yaratishda xatolik. UserId: {}", userId, e);
            throw e;
        }
    }

    private Product fetchProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Mahsulot topilmadi"));
    }

    private ProductSize fetchAndValidateProductSize(Long productSizeId, Long productId, int quantity) {
        ProductSize productSize = productSizeRepository.findById(productSizeId)
                .orElseThrow(() -> new RuntimeException("Mahsulot hajmi topilmadi"));

        if (!productSize.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Mahsulot hajmi ko'rsatilgan mahsulotga tegishli emas");
        }
        if (productSize.getAmount() < quantity) {
            throw new RuntimeException("Zaxirada mahsulot yetarli emas: " + productSize.getSize());
        }
        return productSize;
    }

    private BigDecimal calculateItemPrice(Product product) {
        BigDecimal price = product.getPrice();
        Integer discount = product.getDiscount();

        if (discount != null && discount > 0) {
            BigDecimal discountPercent = BigDecimal.valueOf(discount)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            price = price.subtract(price.multiply(discountPercent));
        }

        return price.setScale(2, RoundingMode.HALF_UP);
    }

    private OrderItem createOrderItem(Order order, Product product, ProductSize productSize, int quantity, BigDecimal price) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setProductSize(productSize);
        orderItem.setQuantity(quantity);
        orderItem.setPrice(price);
        return orderItem;
    }

    private void updateStockAndLogOutcome(ProductSize productSize, int quantity, User user, Product product) {
        productSize.setAmount(productSize.getAmount() - quantity);
        productSizeRepository.save(productSize);

        ProductOutcome outcome = new ProductOutcome();
        outcome.setUser(user);
        outcome.setProduct(product);
        outcome.setAmount(quantity);
        outcome.setProductSize(productSize);
        productOutcomeRepository.save(outcome);
    }
}