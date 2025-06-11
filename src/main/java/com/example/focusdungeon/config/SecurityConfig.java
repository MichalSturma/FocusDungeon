package com.example.focusdungeon.config;

import com.example.focusdungeon.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/styles.css", "/script.js",
                                "/js/**", "/images/**", "/sounds/**","/css/**", "/setTime.html", "/credits.html",
                                "/css/base/**","/css/components/**","/css/pages/**","leaderboard","leaderboard.html").permitAll() // Povolí statické soubory
                        .requestMatchers("/api/auth/**").permitAll() // Povolí autentizační endpointy
                        .requestMatchers("/api/user/stats/**","/api/user/**").permitAll()
                        .anyRequest().authenticated() // Ostatní požadavky musí být ověřeny
                )
                .cors(cors -> cors.disable()) // ❌ (Lepší by bylo nastavit správné CORS pravidla)
                .csrf(csrf -> csrf.disable()) // ❌ (Pokud nepoužíváš cookies pro autentizaci, toto je OK)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ Použití JWT - bez session
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // ✅ Přidání JWT filtru
                .formLogin(form -> form.disable()); // ❌ Zakázání formulářového loginu

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
