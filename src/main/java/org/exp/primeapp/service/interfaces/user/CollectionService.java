package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.CollectionProductRes;
import org.exp.primeapp.models.dto.responce.HeroCollectionRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CollectionService {

    CollectionProductRes getCollection(Long id);

    HeroCollectionRes getRandomHeroCollection();

    List<CollectionProductRes> getActiveCollections();

    List<CollectionProductRes> getRandomCollections();

}
