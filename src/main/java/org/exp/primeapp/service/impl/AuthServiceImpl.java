package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.request.VerifyEmailReq;
import org.exp.primeapp.dto.responce.LoginRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.models.repo.RoleRepository;
import org.exp.primeapp.models.repo.UserRepository;
import org.exp.primeapp.service.interfaces.AuthService;
import org.exp.primeapp.service.interfaces.EmailService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public LoginRes login(LoginReq loginReq) {
            String accessToken = "";
            String refreshToken = "";
            return new LoginRes(accessToken, refreshToken, "success");
    }

    @Override
    @Transactional
    public String sendVerificationCode(RegisterReq req) {
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
                .password(req.getPassword())
                .phone(req.getPhone())
                ._active(false)
                .roles(roleUser)
                .verifyCode(code)
                .build();
        userRepository.save(user);

        emailService.sendVerificationEmail(req.getEmail(), code);
        return "Verification code sent to email.";
    }

    @Override
    public String verifyCodeAndRegister(VerifyEmailReq req) {
        Optional<User> optionalUser = userRepository.getByEmailOptional(req.getEmail());

        if (optionalUser.isEmpty()) {
            return "Invalid email address.";
        }

        User user = optionalUser.get();
        String verifyCode = user.getVerifyCode();

        if (verifyCode != null && verifyCode.equals(req.getCode())) {
            user.set_active(true);
            userRepository.save(user);
            return "User registered successfully.";
        } else {
            return "Invalid verification code.";
        }
    }
}
