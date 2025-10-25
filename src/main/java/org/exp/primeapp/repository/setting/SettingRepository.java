package org.exp.primeapp.repository.setting;

import org.exp.primeapp.models.entities.settings.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {

}