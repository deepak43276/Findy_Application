package com.example.findy.config;

import com.example.findy.JwtUtil;
import com.example.findy.model.User;
import com.example.findy.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        logger.debug(">>> Incoming request [{} {}]", method, path);

        // 1️⃣ Skip JWT validation for public endpoints & preflight (CORS)
        if (isPublicEndpoint(path) || "OPTIONS".equalsIgnoreCase(method)) {
            logger.debug("Skipping JWT check for public endpoint or OPTIONS: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        // 2️⃣ Extract JWT from Authorization header
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("❌ Missing or invalid Authorization header for path: {}", path);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            return;
        }

        String jwt = authHeader.substring(7);
        String email;

        try {
            email = jwtUtil.extractUsername(jwt);
            logger.debug("Extracted email from JWT: {}", email);
        } catch (Exception e) {
            logger.error("❌ JWT extraction failed for token: {} | Error: {}", jwt, e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
            return;
        }

        // 3️⃣ Validate token & authenticate if not already in SecurityContext
        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            // Check token validity first
            if (!jwtUtil.validateToken(jwt, email)) {
                logger.warn("❌ JWT validation failed for email: {}", email);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT validation failed");
                return;
            }

            // Check if user exists in DB
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                logger.warn("❌ No user found for email in JWT: {}", email);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                return;
            }

            User dbUser = userOpt.get();

            // ✅ Build UserDetails and set authentication in SecurityContext
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(dbUser.getEmail())       // principal = email
                    .password(dbUser.getPassword())    // not used for JWT
                    .authorities(Collections.emptyList()) // Add roles if required
                    .build();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

            logger.debug("✅ Successfully authenticated user: {}", email);
        }

        // 4️⃣ Continue the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * ✅ Public endpoints (no JWT required)
     */
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/jobs")
                || path.startsWith("/api/auth")
                || path.startsWith("/api/users/register")
                || path.startsWith("/api/candidates")
                || path.startsWith("/api/saved-jobs")
                || path.equals("/error");
    }
}
