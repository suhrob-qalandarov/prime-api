package org.exp.primeapp.service.impl.user.collection;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.dto.responce.CollectionProductRes;
import org.exp.primeapp.models.dto.responce.HeroCollectionRes;
import org.exp.primeapp.models.entities.Collection;
import org.exp.primeapp.models.mapper.CollectionMapper;
import org.exp.primeapp.repository.CollectionRepository;
import org.exp.primeapp.service.interfaces.user.CollectionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final CollectionMapper collectionMapper;

    @Override
    @Transactional(readOnly = true)
    public HeroCollectionRes getRandomHeroCollection() {
        Long randomCollectionId = collectionRepository.findRandomActiveCollectionId();
        Collection collection = collectionRepository.findById(randomCollectionId)
                .orElseThrow(() -> new RuntimeException("Collection not found with id: " + randomCollectionId));

        return HeroCollectionRes.builder()
                .collectionId(collection.getId())
                .productsMainImageKeys(collection.getProducts().stream()
                        .filter(BaseEntity::getActive) // Faqat active=true product'larni olish
                        .map(product -> product.getMainImage().getKey())
                        .toList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CollectionProductRes> getActiveCollections() {
        List<Collection> collections = collectionRepository.findAllByActiveTrue();
        return collectionMapper.toCollectionProductResponseList(collections);
    }

    @Override
    @Transactional(readOnly = true)
    public CollectionProductRes getCollection(Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new RuntimeException("Collection not found with id: " + collectionId));
        return collectionMapper.toCollectionProductResponse(collection);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CollectionProductRes> getRandomCollections() {
        List<Collection> collections = collectionRepository.findRandomCollections();
        return collectionMapper.toCollectionProductResponseList(collections);
    }
}