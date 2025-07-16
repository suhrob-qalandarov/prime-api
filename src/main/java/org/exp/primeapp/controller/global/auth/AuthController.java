package org.exp.primeapp.controller.global.auth;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.models.dto.request.LoginReq;
import org.exp.primeapp.models.dto.request.RegisterReq;
import org.exp.primeapp.models.dto.request.VerifyEmailReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.global.LoginRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.global.auth.AuthService;
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
    public ResponseEntity<UserRes> login(@RequestBody @Valid LoginReq loginReq, HttpServletResponse response) {
        UserRes user = authService.login(loginReq, response);
        return new ResponseEntity<>(user, HttpStatus.OK);
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

