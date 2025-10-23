package org.exp.primeapp.configs.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class FilterChainConfig {

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http, JwtCookieFilter mySecurityFilter) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        http.authorizeHttpRequests(auth ->
                auth
                        // Public endpoints (Swagger, etc.)
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Public auth endpoint
                        .requestMatchers(
                                HttpMethod.POST,
                                API + V1 + AUTH + "/code/*"
                        ).permitAll()

                        // Public product endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + PRODUCT + WAY_ALL
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + PRODUCTS,
                                API + V1 + PRODUCTS + BY_CATEGORY + "/*"
                        ).permitAll()

                        // Public category endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + CATEGORY,
                                API + V1 + CATEGORY + WAY_ALL
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + CATEGORIES,
                                API + V1 + CATEGORIES + WAY_ALL
                        ).permitAll()

                        // Public attachment endpoint
                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + ATTACHMENT + "/*"
                        ).permitAll()

                        // Allow GET requests to AdminProductController for ROLE_ADMIN and ROLE_VISITOR
                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + ADMIN + PRODUCT,
                                API + V1 + ADMIN + PRODUCT + "/dashboard",
                                API + V1 + ADMIN + PRODUCT + "/*"
                        ).hasAnyRole("ADMIN", "VISITOR")

                        // Restrict all other AdminProductController endpoints to ROLE_ADMIN
                        .requestMatchers(
                                API + V1 + ADMIN + PRODUCT + "/**"
                        ).hasRole("ADMIN")

                        // Allow GET requests to AdminAttachmentController for ROLE_ADMIN and ROLE_VISITOR
                        .requestMatchers(
                                HttpMethod.GET,
                                API + V1 + ADMIN + ATTACHMENT + "/{attachmentId}",
                                API + V1 + ADMIN + ATTACHMENT + "/with-key/{attachmentKey}"
                        ).hasAnyRole("ADMIN", "VISITOR")

                        // Restrict all other AdminAttachmentController endpoints to ROLE_ADMIN
                        .requestMatchers(
                                API + V1 + ADMIN + ATTACHMENT + "/**"
                        ).hasRole("ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated()
        );

        http.addFilterBefore(mySecurityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "https://prime.howdy.uz", "https://api.howdy.uz",  "https://admin.howdy.uz",
                "https://prime77.uz",  "https://api.prime77.uz", "https://admin.prime77.uz",
                "http://localhost:3000", "http://localhost:3001"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setUserDetailsService(customUserDetailsService);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }
}