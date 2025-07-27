
package org.exp.primeapp.telegram;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.enums.ProductStatus;
import org.exp.primeapp.service.interfaces.admin.attachment.AdminAttachmentService;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.exp.primeapp.service.interfaces.user.CategoryService;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.GetFile;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.PhotoSize;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.io.InputStream;
import java.net.URL;
import java.util.*;

@Component
@RequiredArgsConstructor
public class ProductAdminBot extends TelegramLongPollingBot {

    private final AdminProductService adminProductService;
    private final AdminAttachmentService attachmentService;
    private final CategoryService categoryService;

    private final List<Long> adminChatIds = List.of(1199855419L);

    private enum Step {
        NAME, DESCRIPTION, PRICE, SELECT_CATEGORY, PHOTO
    }

    @Data
    static class ProductDraft {
        String name;
        String description;
        Double price;
        Long categoryId;
        List<Long> attachmentIds = new ArrayList<>();
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

        if (msg.hasPhoto()) {
            handlePhoto(msg, chatId);
            return;
        }

        if (msg.hasText()) {
            String text = msg.getText();

            if (text.equals("/addproduct")) {
                userStep.put(chatId, Step.NAME);
                userDraft.put(chatId, new ProductDraft());
                send(chatId, "📝 Mahsulot nomini kiriting:");
                return;
            }

            Step step = userStep.get(chatId);
            ProductDraft draft = userDraft.get(chatId);

            if (step == null || draft == null) return;

            switch (step) {
                case NAME -> {
                    draft.setName(text);
                    userStep.put(chatId, Step.DESCRIPTION);
                    send(chatId, "✏️ Tavsifni kiriting:");
                }
                case DESCRIPTION -> {
                    draft.setDescription(text);
                    userStep.put(chatId, Step.PRICE);
                    send(chatId, "💰 Narxni kiriting:");
                }
                case PRICE -> {
                    try {
                        draft.setPrice(Double.parseDouble(text));
                        userStep.put(chatId, Step.SELECT_CATEGORY);

                        StringBuilder sb = new StringBuilder("🏷️ Kategoriya raqamini tanlang:\n");
                        List<Category> categories = categoryService.getCategories();
                        for (Category category : categories) {
                            sb.append(category.getId()).append(" - ").append(category.getName()).append("\n");
                        }
                        send(chatId, sb.toString());
                    } catch (NumberFormatException e) {
                        send(chatId, "❗ Narx noto‘g‘ri formatda.");
                    }
                }
                case SELECT_CATEGORY -> {
                    try {
                        Long selectedCategoryId = Long.parseLong(text);
                        draft.setCategoryId(selectedCategoryId);
                        userStep.put(chatId, Step.PHOTO);
                        send(chatId, "📷 Endi mahsulot uchun rasm yuboring:");
                    } catch (NumberFormatException e) {
                        send(chatId, "❗ Raqam noto‘g‘ri. Iltimos, kategoriya ID raqamini kiriting.");
                    }
                }
                case PHOTO -> send(chatId, "📷 Rasm yuboring...");
            }
        }
    }

    private void handlePhoto(Message msg, Long chatId) {
        List<PhotoSize> photos = msg.getPhoto();
        PhotoSize biggest = photos.get(photos.size() - 1);

        try {
            String fileId = biggest.getFileId();
            GetFile getFile = new GetFile(fileId);
            org.telegram.telegrambots.meta.api.objects.File telegramFile = execute(getFile);
            String filePath = telegramFile.getFilePath();

            String fileUrl = "https://api.telegram.org/file/bot" + getBotToken() + "/" + filePath;

            try (InputStream inputStream = new URL(fileUrl).openStream()) {
                String fileName = UUID.randomUUID() + ".jpg";

                MockMultipartFile multipartFile = new MockMultipartFile(
                        "file", fileName, "image/jpeg", inputStream
                );

                Attachment saved = attachmentService.uploadOne(multipartFile);

                ProductDraft draft = userDraft.get(chatId);
                if (draft == null) {
                    send(chatId, "⚠️ Iltimos, mahsulotni boshlash uchun /addproduct yuboring.");
                    return;
                }

                draft.getAttachmentIds().add(saved.getId());

                ProductReq req = ProductReq.builder()
                        .name(draft.getName())
                        .description(draft.getDescription())
                        .price(draft.getPrice())
                        .categoryId(draft.getCategoryId())
                        .attachmentIds(draft.getAttachmentIds())
                        .active(true)
                        .status(ProductStatus.NEW)
                        .productSizes(new ArrayList<>())
                        .build();

                ApiResponse response = adminProductService.saveProduct(req);
                send(chatId, "✅ Mahsulot saqlandi:\n" + response.getMessage());

                userStep.remove(chatId);
                userDraft.remove(chatId);
            }
        } catch (Exception e) {
            send(chatId, "❌ Rasm yuklashda xatolik: " + e.getMessage());
            e.printStackTrace();
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
        return "jiga_sb_bot";
    }

    @Override
    public String getBotToken() {
        return "7777304787:AAGx6_AOKvstwEUnQhqdpZv0aRFuHOj1EYY";
    }
}

