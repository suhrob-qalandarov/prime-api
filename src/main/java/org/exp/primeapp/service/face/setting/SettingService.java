package org.exp.primeapp.service.face.setting;

import org.exp.primeapp.models.entities.settings.Setting;
import org.exp.primeapp.models.enums.setting.SettingType;

import java.util.List;

public interface SettingService {

    void reload();

    Setting getSetting(String key);

    String getString(String key, String defaultValue);

    int getInt(String key, int defaultValue);

    boolean getBool(String key, boolean defaultValue);

    void update(String key, String value, SettingType type, String description);

    List<Setting> getAll();
}
