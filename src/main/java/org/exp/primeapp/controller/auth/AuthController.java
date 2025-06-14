package org.exp.primeapp.controller.auth;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.models.dto.request.LoginReq;
import org.exp.primeapp.models.dto.request.RegisterReq;
import org.exp.primeapp.models.dto.request.VerifyEmailReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
import org.exp.primeapp.models.dto.responce.LoginRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.AuthService;
import org.springframework.http.HttpStatus;
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
        return new ResponseEntity<>(loginRes, HttpStatus.ACCEPTED);
    }

    @PostMapping(REGISTER)
    public ResponseEntity<ApiResponse> sendCode(@RequestBody RegisterReq req) {
        ApiResponse response = authService.sendVerificationCode(req);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @PostMapping(VERIFY)
    public ResponseEntity<ApiResponse> verifyCode(@RequestBody VerifyEmailReq req) {
        ApiResponse response = authService.verifyCodeAndRegister(req);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @PostMapping(REFRESH + "/{refreshToken}")
    public ResponseEntity<LoginRes> verifyEmail(@RequestParam String refreshToken) {
        User user = jwtService.getUserObject(refreshToken);
        String accessToken = jwtService.generateToken(user);
        LoginRes loginRes = new LoginRes(accessToken, refreshToken, "Successfully updated token!");
        return new ResponseEntity<>(loginRes, HttpStatus.ACCEPTED);
    }
}

