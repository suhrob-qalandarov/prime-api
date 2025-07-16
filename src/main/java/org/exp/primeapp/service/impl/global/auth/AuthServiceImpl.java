package org.exp.primeapp.service.impl.global.auth;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.models.dto.request.LoginReq;
import org.exp.primeapp.models.dto.request.RegisterReq;
import org.exp.primeapp.models.dto.request.VerifyEmailReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.RoleRepository;
import org.exp.primeapp.repository.UserRepository;
import org.exp.primeapp.service.interfaces.global.auth.AuthService;
import org.exp.primeapp.service.interfaces.global.auth.EmailService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final UserDetailsService userDetailsService;

    @Override
    public UserRes login(LoginReq loginReq, HttpServletResponse response) {
        var auth = new UsernamePasswordAuthenticationToken(
                loginReq.email(),
                loginReq.password()
        );

        User user;
        try {
            authenticationManager.authenticate(auth);
            user = (User) userDetailsService.loadUserByUsername(loginReq.email());
        } catch (UsernameNotFoundException e) {
            log.error("Foydalanuvchi topilmadi: {}", loginReq.email());
            throw new UsernameNotFoundException("Foydalanuvchi topilmadi: " + loginReq.email());
        } catch (BadCredentialsException e) {
            log.error("Parol noto‘g‘ri: {}", loginReq.email());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Parol noto‘g‘ri");
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        setTokensToCookie(accessToken, refreshToken, response);

        return UserRes.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .build();
    }

    @Override
    @Transactional
    public ApiResponse sendVerificationCode(RegisterReq req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        String code = String.valueOf(1000 + new Random().nextInt(9000));

        List<Role> roleUser = roleRepository.findALlByNameIn(List.of("ROLE_USER"));

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .active(false)
                .roles(roleUser)
                .verifyCode(code)
                .build();
        userRepository.save(user);

        emailService.sendVerificationEmail(req.getEmail(), code);
        return new ApiResponse(true, "Verification code sent to email");
    }

    @Override
    public ApiResponse verifyCodeAndRegister(VerifyEmailReq req) {
        Optional<User> optionalUser = userRepository.getByEmailOptional(req.getEmail());

        if (optionalUser.isEmpty()) {
            return new ApiResponse(false, "Invalid email address.");
        }

        User user = optionalUser.get();
        String verifyCode = user.getVerifyCode();

        if (verifyCode != null && verifyCode.equals(req.getCode())) {
            user.setActive(true);
            userRepository.save(user);
            return new ApiResponse(true, "User registered successfully");
        } else {
            return new ApiResponse(false, "Invalid verification code.");
        }
    }

    public void setTokensToCookie(String accessToken, String refreshToken, HttpServletResponse response) {
        String accessTokenValue = (accessToken != null && accessToken.startsWith("Bearer "))
                ? accessToken.substring(7)
                : accessToken;

        String refreshTokenValue = (refreshToken != null && refreshToken.startsWith("Bearer "))
                ? refreshToken.substring(7)
                : refreshToken;

        if (accessTokenValue != null && refreshTokenValue != null) {
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessTokenValue)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .sameSite("Strict")
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshTokenValue)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(Duration.ofDays(14))
                    .sameSite("Strict")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        } else {
            log.error("Tokenlardan biri null: accessToken= {}, refreshToken={}", accessToken, refreshToken);
        }
    }
}
