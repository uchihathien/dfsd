package getabec.backend.auth;

import getabec.backend.auth.dto.AuthResponse;
import getabec.backend.auth.dto.LoginRequest;
import getabec.backend.auth.dto.RegisterRequest;
import getabec.backend.auth.dto.TokenResponse;
import getabec.backend.auth.dto.UserResponse;
import getabec.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// auth/AuthController.java
@RestController
@RequestMapping({"/api/auth", "/auth"})
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepo;

    @PostMapping("/register")
    public TokenResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    private ResponseCookie buildCartCookie(String cartId) {
        return ResponseCookie.from("cart_id", cartId.trim())
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(60L * 60 * 24 * 30)
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest req,
            @CookieValue(value = "cart_id", required = false) String guestCartId
    ) {
        AuthResponse response = authService.login(req, parseGuestCartId(guestCartId));
        ResponseEntity.BodyBuilder builder = ResponseEntity.ok();
        if (response.cartId() != null && !response.cartId().isBlank()) {
            builder = builder.header(HttpHeaders.SET_COOKIE, buildCartCookie(response.cartId()).toString());
        }
        return builder.body(response);
    }

    private java.util.UUID parseGuestCartId(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return java.util.UUID.fromString(raw.trim());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody Map<String,String> req) {
        return authService.refresh(req.get("refreshToken"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        var u = userRepo.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(UserResponse.from(u));
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userRepo.findByEmail(email.trim().toLowerCase()).isPresent();
        return Map.of("exists", exists);
    }


}
