package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.LoginDTO;
import org.exp.primeapp.dto.RegisterDTO;
import org.exp.primeapp.dto.responce.LoginRes;
import org.exp.primeapp.service.interfaces.AuthService;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping
    public HttpEntity<?> login(@RequestBody LoginDTO loginDTO) {
        LoginRes loginRes = authService.login(loginDTO);
        return ResponseEntity.ok(loginRes);
    }

    @PostMapping("/register")
    public HttpEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        authService.register(registerDTO);
        return ResponseEntity.ok().build();
    }
}
