package org.exp.primeapp.controller.admin.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.admin.spotlight.SimpleSpotlightRes;
import org.exp.primeapp.service.interfaces.admin.spotlight.AdminSpotlightsService;
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

    private final AdminSpotlightsService adminSpotlightsService;

    @GetMapping
    public ResponseEntity<List<SimpleSpotlightRes>> getSpotlights() {
        List<SimpleSpotlightRes> categorySpotlights = adminSpotlightsService.getCategorySpotlights();
        return new ResponseEntity<>(categorySpotlights, HttpStatus.OK);
    }


}