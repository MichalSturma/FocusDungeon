package   com.example.focusdungeon.controller;

import com.example.focusdungeon.dto.UserRegistrationRequest;
import com.example.focusdungeon.model.User;
import com.example.focusdungeon.service.UserService;
import com.example.focusdungeon.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserRegistrationRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        try {
            if (userService.findUserByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Username already exists!"
                ));
            }

            if (userService.findUserByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Email already registered!"
                ));
            }

            User user = userService.registerUser(username, email, password);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User registered successfully!",
                    "username", user.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Internal server error: " + e.getMessage()
            ));
        }
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<User> userOptional = userService.findUserByUsername(username);

        if (userOptional.isPresent() && userService.authenticate(username, password)) {

            User user = userOptional.get();

            UserDetails userDetails = user; // Tady už není potřeba používat `withUsername()`

            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Login successful!",
                    "username", user.getUsername(),
                    "token", token
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid username or password"
            ));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        String username = principal.getName();
        Optional<User> userOptional = userService.findUserByUsername(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
        }

        User user = userOptional.get();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
        ));
    }



}