package com.example.findy.controller;

import com.example.findy.JwtUtil;
import com.example.findy.model.User;
import com.example.findy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ====== LOGIN ENDPOINT ======
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        logger.info("🔑 Login attempt for email: {}", email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("❌ Login failed: User not found for {}", email);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();
        boolean matches = passwordEncoder.matches(password, user.getPassword());

        if (!matches) {
            logger.warn("❌ Login failed: Wrong password for {}", email);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        // ✅ Generate JWT with ID + Email + Roles
        List<String> roles = (user.getRoles() != null) ? user.getRoles() : List.of("USER");
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), roles);

        // ✅ Build Response (Hiding password)
        user.setPassword(null);
        LoginResponse response = new LoginResponse(token, user);

        logger.info("✅ Login successful for {}", email);
        return ResponseEntity.ok(response);
    }

    // ====== DTO CLASSES ======
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private User user;

        public LoginResponse(String token, User user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() { return token; }
        public User getUser() { return user; }
    }
}
