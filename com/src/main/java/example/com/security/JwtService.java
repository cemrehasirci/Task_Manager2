package example.com.security;

import example.com.model.User;
import example.com.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final UserRepository userRepository;

    private final String secret = "mysecuresecretkeymysecuresecretkey";
    private final long expiration = 1000 * 60 * 60;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Token oluşturma: username + rol bilgisi
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Token'dan kullanıcı adını al
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Token'dan rolü al
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Genel geçer claim çekici
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token, String username) {
        return extractUsername(token).equals(username);
    }
}
