package org.exp.primeapp.controller.admin.collection;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CollectionReq;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + COLLECTIONS)
public class AdminCollectionsController {

    @GetMapping
    public ResponseEntity<List<CollectionReq>> getCollections() {
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody CollectionReq collectionReq) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{collectionId}")
    public ResponseEntity<Void> update(@PathVariable Long collectionId, @RequestBody CollectionReq collectionReq) {
        return ResponseEntity.ok().build();
    }
}
