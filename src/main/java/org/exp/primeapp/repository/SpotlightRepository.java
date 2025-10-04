/*
package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Spotlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SpotlightRepository extends JpaRepository<Spotlight, Long> {

    List<Spotlight> findAllByOrderByOrderNumberAsc();

    List<Spotlight> findAllByActiveTrueOrderByOrderNumberAsc();

    List<Spotlight> findAllByActiveFalseOrderByOrderNumberAsc();

    @Transactional
    @Modifying
    @Query("UPDATE Spotlight s SET s.active = CASE WHEN s.active = true THEN false ELSE true END WHERE s.id = :spotlightName")
    void toggleSpotlightActiveStatus(@Param("spotlightName") Long spotlightName);
}
*/
