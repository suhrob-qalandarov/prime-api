package org.exp.primeapp.controller.setting;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.settings.Setting;
import org.exp.primeapp.models.enums.setting.SettingType;
import org.exp.primeapp.service.face.setting.SettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + SETTING)
public class SettingController {

    private final SettingService settingService;

    /**
     * Hamma sozlamalarni olish
     */
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Setting>> getAll() {
        List<Setting> settings = settingService.getAll();
        log.info("Fetched {} settings", settings.size());
        return ResponseEntity.ok(settings);
    }

    /**
     * Bitta sozlamani olish (key bo‘yicha)
     */
    @GetMapping("/{key}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getOne(@PathVariable String key) {
        Setting setting = settingService.getSetting(key);
        if (setting == null) {
            return ResponseEntity.badRequest().body("❌ Setting not found: " + key);
        }
        return ResponseEntity.ok(setting);
    }

    /**
     * Sozlamani yangilash yoki yaratish
     */
    @PutMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> update(
            @RequestParam String key,
            @RequestParam String value,
            @RequestParam(defaultValue = "STRING") SettingType type,
            @RequestParam(required = false) String description
    ) {
        settingService.update(key, value, type, description);
        log.info("✅ Setting updated: {} = {}", key, value);
        return ResponseEntity.ok("✅ Setting updated successfully!");
    }

    /**
     * Cache’ni DB’dan yangilash
     */
    @PostMapping("/reload")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> reload() {
        settingService.reload();
        log.info("♻️ Settings cache reloaded manually");
        return ResponseEntity.ok("♻️ Settings cache reloaded from database");
    }

    /**
     * Misol uchun: typed get — string, int, bool
     */
    @GetMapping("/value")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getValue(
            @RequestParam String key,
            @RequestParam(defaultValue = "STRING") SettingType type
    ) {
        Object result;
        switch (type) {
            case INTEGER -> result = settingService.getInt(key, 0);
            case BOOLEAN -> result = settingService.getBool(key, false);
            default -> result = settingService.getString(key, null);
        }

        if (result == null) {
            return ResponseEntity.badRequest().body("❌ Setting not found: " + key);
        }

        return ResponseEntity.ok(result);
    }
}
