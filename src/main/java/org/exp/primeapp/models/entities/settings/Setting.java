package org.exp.primeapp.models.entities.settings;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.enums.setting.SettingType;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "settings")
public class Setting extends BaseEntity {

    @Column(nullable = false, unique = true, length = 255)
    private String key;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private SettingType type;
}
