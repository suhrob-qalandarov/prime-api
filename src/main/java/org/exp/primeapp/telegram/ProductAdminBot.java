package org.exp.primeapp.telegram;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
import org.exp.primeapp.models.enums.ProductStatus;
import org.exp.primeapp.service.interfaces.AdminProductService;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ProductAdminBot extends TelegramLongPollingBot {

    private final AdminProductService adminProductService;

    private final List<Long> adminChatIds = List.of(1199855419L); // <-- Admin Telegram chatId ni yozing

    private enum Step {
        NAME, DESCRIPTION, PRICE, CATEGORY_ID
    }

    @Data
    static class ProductDraft {
        String name;
        String description;
        Double price;
        Long categoryId;
    }

    private final Map<Long, Step> userStep = new HashMap<>();
    private final Map<Long, ProductDraft> userDraft = new HashMap<>();

    @Override
    public void onUpdateReceived(Update update) {
        if (!update.hasMessage()) return;

        Message msg = update.getMessage();
        Long chatId = msg.getChatId();

        if (!adminChatIds.contains(chatId)) {
            send(chatId, "❌ Sizda ruxsat yo‘q.");
            return;
        }

        if (msg.hasText()) {
            String text = msg.getText();

            if (text.equals("/addproduct")) {
                userStep.put(chatId, Step.NAME);
                userDraft.put(chatId, new ProductDraft());
                send(chatId, "Mahsulot nomini kiriting:");
                return;
            }

            Step step = userStep.get(chatId);
            ProductDraft draft = userDraft.get(chatId);

            if (step == null || draft == null) return;

            switch (step) {
                case NAME -> {
                    draft.setName(text);
                    userStep.put(chatId, Step.DESCRIPTION);
                    send(chatId, "Tavsifni kiriting:");
                }
                case DESCRIPTION -> {
                    draft.setDescription(text);
                    userStep.put(chatId, Step.PRICE);
                    send(chatId, "Narxni kiriting:");
                }
                case PRICE -> {
                    try {
                        draft.setPrice(Double.parseDouble(text));
                        userStep.put(chatId, Step.CATEGORY_ID);
                        send(chatId, "Kategoriya ID ni kiriting:");
                    } catch (NumberFormatException e) {
                        send(chatId, "❗ Narx noto‘g‘ri formatda.");
                    }
                }
                case CATEGORY_ID -> {
                    try {
                        draft.setCategoryId(Long.parseLong(text));

                        // Mahsulotni saqlash
                        ProductReq req = ProductReq.builder()
                                .name(draft.getName())
                                .description(draft.getDescription())
                                .price(draft.getPrice())
                                .categoryId(draft.getCategoryId())
                                .attachmentIds(List.of(1L)) // fallback
                                .active(true)
                                .status(ProductStatus.NEW)
                                .productSizes(new ArrayList<>()) // bo‘sh bo‘lsa
                                .build();
                        ; // fallback attachment ID

                        ApiResponse response = adminProductService.saveProduct(req);

                        send(chatId, "✅ " + response.getMessage());
                        userStep.remove(chatId);
                        userDraft.remove(chatId);
                    } catch (Exception e) {
                        send(chatId, "❗ Xatolik: " + e.getMessage());
                    }
                }
            }
        }
    }

    private void send(Long chatId, String text) {
        SendMessage message = SendMessage.builder()
                .chatId(chatId.toString())
                .text(text)
                .build();
        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getBotUsername() {
        return "jiga_sb_bot"; // o'z bot nomingizni yozing
    }

    @Override
    public String getBotToken() {
        return "7777304787:AAGx6_AOKvstwEUnQhqdpZv0aRFuHOj1EYY"; // @BotFather'dan olgan token
    }
}
