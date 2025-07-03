package org.exp.primeapp.controller.admin.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.user.SpotlightRes;
import org.exp.primeapp.service.interfaces.admin.spotlight.AdminSpotlightService;
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

    private final AdminSpotlightService adminSpotlightService;

    @GetMapping
    public ResponseEntity<List<SpotlightRes>> getSpotlights() {



        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

}