package org.exp.primeapp.controller.admin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.SpotlightRes;
import org.exp.primeapp.service.interfaces.SpotlightService;
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
@RequestMapping(API + V1 + ADMIN + SPOTLIGHT)
public class SpotlightController {

    private final SpotlightService spotlightService;

    @GetMapping
    public ResponseEntity<List<SpotlightRes>> getSpotlights() {
        List<SpotlightRes> spotlights = spotlightService.getHeroSpotlights();
        return new ResponseEntity<>(spotlights, HttpStatus.ACCEPTED);
    }
}
