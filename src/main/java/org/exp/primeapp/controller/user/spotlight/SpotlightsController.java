package org.exp.primeapp.controller.user.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.admin.CategorySpotlightRes;
import org.exp.primeapp.models.dto.responce.user.SpotlightRes;
import org.exp.primeapp.models.dto.responce.user.CatalogSpotlightRes;
import org.exp.primeapp.service.interfaces.user.SpotlightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + SPOTLIGHTS)
public class SpotlightsController {

    private final SpotlightService spotlightService;

    @GetMapping()
    public ResponseEntity<List<SpotlightRes>> getSpotlights() {
        List<SpotlightRes> spotlights = spotlightService.getHeroSpotlights();
        return new ResponseEntity<>(spotlights, HttpStatus.valueOf("RETRIEVED"));
    }

    @GetMapping("/category")
    public ResponseEntity<List<CategorySpotlightRes>> getSpotlightsForCategory() {
        List<CategorySpotlightRes> spotlights = spotlightService.getSpotlightsForCategory();
        return new ResponseEntity<>(spotlights, HttpStatus.valueOf("RETRIEVED"));
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<CatalogSpotlightRes>> getCatalogSpotlights() {
        List<CatalogSpotlightRes> catalogSpotlights = spotlightService.getCatalogSpotlightsWithCategories();
        return new ResponseEntity<>(catalogSpotlights, HttpStatus.ACCEPTED);
    }
}
