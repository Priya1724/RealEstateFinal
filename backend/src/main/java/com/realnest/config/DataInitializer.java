package com.realnest.config;

import com.realnest.entity.Role;
import com.realnest.entity.User;
import com.realnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner ensureAdminUser(UserRepository userRepository,
                                            PasswordEncoder passwordEncoder,
                                            @Value("${app.admin.name}") String adminName,
                                            @Value("${app.admin.email}") String adminEmail,
                                            @Value("${app.admin.password}") String adminPassword) {
        return args -> userRepository.findByEmail(adminEmail).orElseGet(() -> {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN);
            return userRepository.save(admin);
        });
    }
}
