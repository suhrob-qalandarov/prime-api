package org.exp.primeapp.controller.user.collection;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.CollectionProductRes;
import org.exp.primeapp.service.interfaces.user.CollectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + COLLECTION)
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping("/{collectionId}")
    public ResponseEntity<CollectionProductRes> getCollection(@PathVariable Long collectionId) {
        CollectionProductRes collectionRes = collectionService.getCollection(collectionId);
        return ResponseEntity.ok(collectionRes);
    }
}
