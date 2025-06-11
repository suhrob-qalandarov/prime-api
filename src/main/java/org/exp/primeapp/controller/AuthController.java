package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.request.VerifyEmailReq;
import org.exp.primeapp.dto.responce.LoginRes;
import org.exp.primeapp.service.interfaces.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(LOGIN)
    public ResponseEntity<LoginRes> login(@RequestBody LoginReq loginReq) {
        LoginRes loginRes = authService.login(loginReq);
        return ResponseEntity.ok(loginRes);
    }

    @PostMapping(REGISTER)
    public ResponseEntity<String> sendCode(@RequestBody RegisterReq req) {
        String msg = authService.sendVerificationCode(req);
        return ResponseEntity.ok(msg);
    }

    @PostMapping(VERIFY)
    public ResponseEntity<String> verifyCode(@RequestBody VerifyEmailReq req) {
        String msg = authService.verifyCodeAndRegister(req);
        return ResponseEntity.ok(msg);
    }
}

