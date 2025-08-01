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
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
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
        String query = request.getQueryString();

        // 1️⃣ Skip JWT validation for public endpoints & preflight requests
        if (isPublicEndpoint(path) || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            logger.debug("Skipping JWT check for public endpoint: {}?{}", path, query);
            filterChain.doFilter(request, response);
            return;
        }

        // 2️⃣ Extract token from Authorization header
        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                email = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.warn("Invalid JWT token: {}", e.getMessage());
            }
        }

        // 3️⃣ Validate token & set SecurityContext
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && jwtUtil.validateToken(jwt, email)) {
                User user = userOpt.get();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user, null, null // You can attach roles if needed
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Define all public endpoints here
     */
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/jobs")
                || path.startsWith("/api/auth")
                || path.startsWith("/api/users/register")
                || path.startsWith("/api/candidates")
                || path.equals("/error");
    }
}
