package getabec.backend.auth;

import getabec.backend.auth.dto.AuthResponse;
import getabec.backend.auth.dto.LoginRequest;
import getabec.backend.auth.dto.RegisterRequest;
import getabec.backend.auth.dto.TokenResponse;
import getabec.backend.auth.dto.UserResponse;
import getabec.backend.common.ex.EmailExistsException;
import getabec.backend.common.ex.InvalidCredentialsException;
import getabec.backend.common.ex.WeakPasswordException;
import getabec.backend.user.User;
import getabec.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// auth/AuthService.java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final PasswordPolicy passwordPolicy;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public TokenResponse register(RegisterRequest r) {
        String email = r.email().trim().toLowerCase();

        if (userRepo.findByEmail(email).isPresent()) {
            throw new EmailExistsException();
        }

        var pwErrors = passwordPolicy.validate(r.password());
        if (!pwErrors.isEmpty()) {
            throw new WeakPasswordException(pwErrors);
        }

        var u = new User();
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setFullName(r.fullName().trim());

        try {
            userRepo.save(u);
        } catch (DataIntegrityViolationException ex) {
            throw new EmailExistsException();
        }

        var ud = new org.springframework.security.core.userdetails.User(
                u.getEmail(), "", List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole()))
        );
        return new TokenResponse(jwtUtil.generateAccessToken(ud), jwtUtil.generateRefreshToken(ud));
    }

    public AuthResponse login(LoginRequest r) {
        String email = r.email().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, r.password())
            );
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException();
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        TokenResponse tokens = tokensFor(userDetails);

        return new AuthResponse(tokens.accessToken(), tokens.refreshToken(), UserResponse.from(user));
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtUtil.isRefreshToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN");
        }
        String email = jwtUtil.extractUsername(refreshToken);
        return tokensFor(email);
    }

    private TokenResponse tokensFor(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return tokensFor(userDetails);
    }

    private TokenResponse tokensFor(UserDetails userDetails) {
        return new TokenResponse(
                jwtUtil.generateAccessToken(userDetails),
                jwtUtil.generateRefreshToken(userDetails)
        );
    }

}
