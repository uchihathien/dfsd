package getabec.backend.auth;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import getabec.backend.auth.dto.TokenResponse;
import getabec.backend.user.User;
import getabec.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Map;

// auth/OAuthController.java (Google)
@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthController {
    private final UserRepository userRepo;
    private final OAuthAccountRepository oauthRepo;
    private final JwtService jwt;

    @Value("${oauth.google.client-id}") private String googleClientId;

    @PostMapping("/google")
    public TokenResponse google(@RequestBody Map<String,String> body) throws Exception {
        String idTokenString = body.get("idToken");
        if (idTokenString == null) throw new RuntimeException("ID_TOKEN_REQUIRED");

        var verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList(googleClientId)).build();
        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) throw new RuntimeException("INVALID_GOOGLE_TOKEN");

        var payload = idToken.getPayload();
        String sub = payload.getSubject();
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");

        // tìm hoặc tạo user
        var account = oauthRepo.findByProviderAndProviderUserId("google", sub).orElse(null);
        User u;
        if (account == null) {
            u = userRepo.findByEmail(email.toLowerCase()).orElseGet(() -> {
                var nu = new User();
                nu.setEmail(email.toLowerCase());
                nu.setFullName(name);
                // password = null -> chỉ đăng nhập qua OAuth
                return userRepo.save(nu);
            });
            var oa = new OAuthAccount();
            oa.setProvider("google"); oa.setProviderUserId(sub); oa.setUser(u);
            oauthRepo.save(oa);
        } else {
            u = account.getUser();
        }

        var ud = new org.springframework.security.core.userdetails.User(u.getEmail(), "", List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole())));
        return new TokenResponse(jwt.generateAccessToken(ud), jwt.generateRefreshToken(ud));
    }

    // auth/OAuthController.java (Facebook)
    @Value("${oauth.facebook.app-id}") private String fbAppId;
    @Value("${oauth.facebook.app-secret}") private String fbAppSecret;

    @PostMapping("/facebook")
    public TokenResponse facebook(@RequestBody Map<String,String> body) {
        String accessToken = body.get("accessToken");
        if (accessToken == null) throw new RuntimeException("ACCESS_TOKEN_REQUIRED");

        var rest = new RestTemplate();

        // 1) verify token
        String appToken = fbAppId + "|" + fbAppSecret;
        var debugUrl = UriComponentsBuilder.fromHttpUrl("https://graph.facebook.com/debug_token")
                .queryParam("input_token", accessToken)
                .queryParam("access_token", appToken).build().toUri();
        var debug = rest.getForObject(debugUrl, Map.class);

        // (Bạn có thể kiểm tra "data"->"is_valid" và audience)

        // 2) get profile
        var meUrl = UriComponentsBuilder.fromHttpUrl("https://graph.facebook.com/me")
                .queryParam("fields", "id,name,email")
                .queryParam("access_token", accessToken).build().toUri();
        var me = rest.getForObject(meUrl, Map.class);
        String id = (String) me.get("id");
        String name = (String) me.get("name");
        String email = (String) me.get("email"); // có thể null nếu user ẩn email

        if (id == null) throw new RuntimeException("INVALID_FACEBOOK_TOKEN");

        // map user
        var account = oauthRepo.findByProviderAndProviderUserId("facebook", id).orElse(null);
        User u;
        if (account == null) {
            if (email == null) {
                // nếu FB không trả email: tạo email giả mạo nội bộ, hoặc yêu cầu bổ sung email ở FE
                email = ("fb_" + id + "@facebook.local").toLowerCase();
            }
            String finalEmail = email;
            u = userRepo.findByEmail(email.toLowerCase()).orElseGet(() -> {
                var nu = new User();
                nu.setEmail(finalEmail.toLowerCase());
                nu.setFullName(name);
                return userRepo.save(nu);
            });
            var oa = new OAuthAccount();
            oa.setProvider("facebook"); oa.setProviderUserId(id); oa.setUser(u);
            oauthRepo.save(oa);
        } else {
            u = account.getUser();
        }

        var ud = new org.springframework.security.core.userdetails.User(u.getEmail(), "", List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole())));
        return new TokenResponse(jwt.generateAccessToken(ud), jwt.generateRefreshToken(ud));
    }

}
