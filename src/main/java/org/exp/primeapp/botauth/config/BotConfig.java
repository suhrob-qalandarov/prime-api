package org.exp.primeapp.botauth.config;

import com.pengrad.telegrambot.TelegramBot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.settings.Setting;
import org.exp.primeapp.models.enums.setting.SettingType;
import org.exp.primeapp.service.face.setting.SettingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BotConfig {

    private final SettingService settingService;

    @Value("${telegram.bot.token:}")
    private String botTokenFallback;

    @Bean
    public TelegramBot telegramBot() {
        try {
            Setting setting = settingService.findByType(SettingType.BOT_TOKEN);
            String botToken = (setting != null && setting.getValue() != null && !setting.getValue().isBlank())
                    ? setting.getValue()
                    : botTokenFallback;

            if (botToken == null || botToken.isBlank()) {
                log.warn("⚠️ Telegram bot token not found in settings table or application.properties. Bot will be disabled.");
                return null;
            }

            log.info("✅ Telegram bot token found. Initializing bot...");
            return new TelegramBot(botToken);
        } catch (Exception e) {
            log.error("❌ Error initializing Telegram bot: {}", e.getMessage());
            return null;
        }
    }

    @Bean
    public ExecutorService executorService() {
        return Executors.newFixedThreadPool(30);
    }
}