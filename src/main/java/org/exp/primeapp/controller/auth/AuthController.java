package org.exp.primeapp.controller.auth;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.request.VerifyEmailReq;
import org.exp.primeapp.dto.responce.LoginRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

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

    @PostMapping(REFRESH + "/{refreshToken}")
    public ResponseEntity<String> verifyEmail(@RequestParam String refreshToken) {
        User user = jwtService.getUserObject(refreshToken);
        String accessToken = jwtService.generateToken(user);
        return ResponseEntity.ok(accessToken);
    }
}

