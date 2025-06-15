package org.exp.primeapp.configs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.models.repo.UserRepository;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.exp.primeapp.utils.Const.TOKEN_PREFIX;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {
    private final UserRepository userRepository;

    public String generateToken(User user) {
        return TOKEN_PREFIX + Jwts.builder()
                .setSubject(user.getEmail())
                .claim("email", user.getEmail())
                .claim("id", user.getId())
                .claim("active", user.getActive())
                .claim("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")))
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + 1000 * 60 * 60 * 24))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        return TOKEN_PREFIX + Jwts.builder()
                .setSubject(user.getEmail())
                .claim("email", user.getEmail())
                .claim("id", user.getId())
                .claim("active", user.getActive()) // Active holatini qo'shish
                .claim("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")))
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2))
                .signWith(getSecretKey())
                .compact();
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor("qwertyasdfghzxcvbnqwertyasdfghjk".getBytes());
    }

    /*
        @Value("${jwt.secret.key}")
        private String secretKey;
        public SecretKey getSecretKey() {
            return Keys.hmacShaKeyFor(secretKey.getBytes());
        }
     */

    public User getUserObject(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String email = claims.getSubject();
        String roles = (String) claims.get("roles");
        Long id = claims.get("id", Long.class); // ID ni olish
        Boolean active = claims.get("active", Boolean.class); // Active ni olish
        List<Role> authorities = Arrays.stream(roles.split(",")).map(Role::new).toList();
        return User.builder()
                .id(id) // ID ni qo'shish
                .email(email)
                .roles(authorities)
                .active(active) // Active ni qo'shish
                .build();
    }
}
