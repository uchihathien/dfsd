package getabec.backend.cart.controller;

import getabec.backend.cart.dto.CartDto;
import getabec.backend.cart.service.CartService;
import getabec.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    private static final String CART_COOKIE = "cart_id";

    private UUID readCartId(HttpServletRequest req) {
        if (req.getCookies() == null) return null;
        for (var c : req.getCookies()) {
            if (CART_COOKIE.equals(c.getName())) {
                try { return UUID.fromString(c.getValue()); } catch (Exception ignore) {}
            }
        }
        return null;
    }

    private ResponseCookie buildCookie(UUID id) {
        return ResponseCookie.from(CART_COOKIE, id.toString())
                .httpOnly(true).path("/").sameSite("Lax")
                .maxAge(Duration.ofDays(30)).build();
    }

    /** Lấy userId an toàn — ưu tiên email từ principal/UserDetails/JWT claims */
    private Long resolveUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) return null;

        // 1) UserDetails -> username thường là email
        if (principal instanceof UserDetails ud) {
            return userRepository.findIdByEmail(ud.getUsername()).orElse(null);
        }
        // 2) Principal là String (email)
        if (principal instanceof String s) {
            return userRepository.findIdByEmail(s).orElse(null);
        }
        // 3) JWT claims (nếu dùng Resource Server): email/sub
        if (principal instanceof Map<?,?> claims) {
            Object email = ((Map<?,?>) claims).get("email");
            if (email != null) return userRepository.findIdByEmail(email.toString()).orElse(null);
            Object sub = ((Map<?,?>) claims).get("sub");
            if (sub != null) {
                String v = sub.toString();
                if (v.matches("\\d+")) return Long.valueOf(v);
                return userRepository.findIdByEmail(v).orElse(null);
            }
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<CartDto> get(HttpServletRequest req, Authentication authentication) {
        Long uid = resolveUserId(authentication);
        UUID guestId = readCartId(req);

        CartDto dto;
        if (uid != null && guestId != null) {
            // guest -> user (hợp nhất)
            dto = cartService.attachOrMerge(guestId, uid);
        } else if (uid != null) {
            dto = cartService.getOrCreateForUser(uid);
        } else {
            dto = cartService.getOrCreate(guestId);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildCookie(dto.getId()).toString())
                .body(dto);
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItem(
            HttpServletRequest req, Authentication authentication,
            @RequestBody Map<String, Object> payload
    ) {
        Long uid = resolveUserId(authentication);
        UUID guestId = readCartId(req);

        Long variantId = ((Number) payload.get("variantId")).longValue();
        int qty = payload.get("quantity") == null ? 1 : ((Number) payload.get("quantity")).intValue();

        // nếu user đã đăng nhập -> đảm bảo đã có cart gắn user (tự merge nếu cần)
        if (uid != null && guestId != null) {
            cartService.attachOrMerge(guestId, uid);
        }
        CartDto dto = (uid != null)
                ? cartService.addItemForUser(uid, variantId, qty)
                : cartService.addItem(guestId, variantId, qty);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildCookie(dto.getId()).toString())
                .body(dto);
    }
}
