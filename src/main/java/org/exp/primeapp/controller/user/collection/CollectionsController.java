package org.exp.primeapp.controller.user.collection;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.CollectionProductRes;
import org.exp.primeapp.models.dto.responce.HeroCollectionRes;
import org.exp.primeapp.service.interfaces.user.CollectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + COLLECTIONS)
public class CollectionsController {

    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<CollectionProductRes>> getActiveCollections() {
        List<CollectionProductRes> randomCollections = collectionService.getActiveCollections();
        return ResponseEntity.ok(randomCollections);
    }

    @GetMapping("/random")
    public ResponseEntity<List<CollectionProductRes>> getRandomCollections(HttpServletResponse response) {
        List<CollectionProductRes> randomCollections = collectionService.getRandomCollections();
        return ResponseEntity.ok(randomCollections);
    }

    @GetMapping("/hero")
    public ResponseEntity<HeroCollectionRes> getRandomHeroCollection() {
        HeroCollectionRes collectionRes = collectionService.getRandomHeroCollection();
        return ResponseEntity.ok(collectionRes);
    }
}
