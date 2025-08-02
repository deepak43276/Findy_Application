package com.example.findy;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    // ⚠️ For production, use environment variable or application.properties
    private final String SECRET_KEY = "mysecretkeymysecretkeymysecretkeymysecretkey"; 
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ====== Generate Token with ID + Roles ======
    public String generateToken(Long id, String email, List<String> roles) {
        return Jwts.builder()
                .setClaims(Map.of(
                        "id", id,
                        "roles", roles
                ))
                .setSubject(email) // JWT `sub` field
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ====== Extract Claims ======
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.warn("❌ JWT expired: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("❌ Unsupported JWT: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("❌ Malformed JWT: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            logger.error("❌ Invalid JWT signature: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("❌ Empty or null JWT: {}", e.getMessage());
            throw e;
        }
    }

    // ====== Extract Specific Fields ======
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("id", Long.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ====== Validate Token ======
    public Boolean validateToken(String token, String username) {
        try {
            String tokenUsername = extractUsername(token);
            boolean isValid = tokenUsername.equals(username) && !isTokenExpired(token);

            if (!isValid) {
                logger.warn("❌ Token validation failed for user: {}", username);
            } else {
                logger.debug("✅ Token valid for user: {}", username);
            }
            return isValid;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("❌ JWT validation error: {}", e.getMessage());
            return false;
        }
    }
}
