package org.exp.primeapp.controller.admin.collection;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CollectionReq;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + COLLECTION)
public class AdminCollectionController {

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody CollectionReq collectionReq) {



        return ResponseEntity.ok().build();
    }
}
