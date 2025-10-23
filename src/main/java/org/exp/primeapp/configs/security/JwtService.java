package org.exp.primeapp.configs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret.key}")
    private String secretKey;

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhone())
                .claim("id", user.getId())
                .claim("firstName", user.getFirstName())
                .claim("phoneNumber", user.getPhone())
                //.claim("active", user.getActive())
                .claim("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")))
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
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
            throw new IllegalArgumentException("validation failed!", e);
        }
    }

    public User getUserObject(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String phone = claims.getSubject();
        Long id = claims.get("id", Long.class);
        String firstName = claims.get("firstName", String.class);
        String phoneNumber = claims.get("phoneNumber", String.class);
        String roles = (String) claims.get("roles");
        List<Role> authorities = Arrays.stream(roles.split(",")).map(Role::new).toList();
        return User.builder()
                .id(id)
                .phone(phone)
                .firstName(firstName)
                .phone(phoneNumber)
                //.active(active)
                .roles(authorities)
                .build();
    }

    public String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("prime-token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void setJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("prime-token", token);
        cookie.setHttpOnly(true);
        //cookie.setDomain("howdy.uz");
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
    }
}
