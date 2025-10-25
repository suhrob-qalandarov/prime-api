package org.exp.primeapp.service.impl.setting;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.entities.settings.Setting;
import org.exp.primeapp.models.enums.setting.SettingType;
import org.exp.primeapp.repository.setting.SettingRepository;
import org.exp.primeapp.service.face.setting.SettingService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SettingRepository repository;
    private final Map<String, Setting> cache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        reload();
    }

    @Override
    public synchronized void reload() {
        cache.clear();
        repository.findAll().forEach(setting -> cache.put(setting.getKey(), setting));
        System.out.println("♻️ Settings reloaded (" + cache.size() + " keys)");
    }

    @Override
    public Setting getSetting(String key) {
        return cache.get(key);
    }

    @Override
    public String getString(String key, String defaultValue) {
        Setting s = cache.get(key);
        return s != null ? s.getValue() : defaultValue;
    }

    @Override
    public int getInt(String key, int defaultValue) {
        try {
            Setting s = cache.get(key);
            return s != null ? Integer.parseInt(s.getValue()) : defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }

    @Override
    public boolean getBool(String key, boolean defaultValue) {
        try {
            Setting s = cache.get(key);
            return s != null ? Boolean.parseBoolean(s.getValue()) : defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }

    @Override
    public void update(String key, String value, SettingType type, String description) {
        Setting setting = repository.findAll()
                .stream()
                .filter(s -> s.getKey().equals(key))
                .findFirst()
                .orElseGet(() -> Setting.builder()
                        .key(key)
                        .type(type)
                        .description(description)
                        .build());

        setting.setValue(value);
        setting.setType(type);
        setting.setDescription(description);

        repository.save(setting);
        cache.put(key, setting);

        System.out.println("✅ Setting updated: " + key + " = " + value);
    }

    @Override
    public List<Setting> getAll() {
        return repository.findAll();
    }
}
