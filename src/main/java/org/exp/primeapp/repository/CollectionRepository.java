/*
package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {

    @Query(value = "SELECT id FROM collections WHERE active = true ORDER BY random() LIMIT 1", nativeQuery = true)
    Long findRandomActiveCollectionId();

    @Query("SELECT c FROM Collection c " +
            "LEFT JOIN FETCH c.mainImage " +
            "LEFT JOIN FETCH c.products p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.mainImage " +
            "LEFT JOIN FETCH p.attachments " +
            "LEFT JOIN FETCH p.sizes " +
            "WHERE c.active = true AND p.active = true " +
            "ORDER BY RANDOM() LIMIT 4")
    List<Collection> findRandomCollections();

    List<Collection> findAllByActiveTrue();
}*/
