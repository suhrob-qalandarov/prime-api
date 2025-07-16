package org.exp.primeapp.configs.security;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.getByEmailOptional(email)
                .orElseThrow(() -> new UsernameNotFoundException("Foydalanuvchi topilmadi: " + email));
    }
}