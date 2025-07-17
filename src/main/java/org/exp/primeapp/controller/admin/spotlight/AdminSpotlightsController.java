package org.exp.primeapp.controller.admin.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.admin.spotlight.SimpleSpotlightRes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + SPOTLIGHTS)
public class AdminSpotlightsController {

    @GetMapping
    public ResponseEntity<List<SimpleSpotlightRes>> getSpotlights() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}