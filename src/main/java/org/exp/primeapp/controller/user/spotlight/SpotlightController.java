package org.exp.primeapp.controller.user.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.CategoryRes;
import org.exp.primeapp.service.interfaces.user.SpotlightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + SPOTLIGHT)
public class SpotlightController {

    private final SpotlightService spotlightService;

    @GetMapping("/categories/{spotlightId}")
    public ResponseEntity <List<CategoryRes>> getCategoriesBySpotlightId(@PathVariable Long spotlightId) {
        List<CategoryRes> categories = spotlightService.getSpotlightCategories(spotlightId);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}
