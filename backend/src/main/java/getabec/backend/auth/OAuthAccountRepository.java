package getabec.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// auth/OAuthAccountRepository.java
public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, Long> {
    Optional<OAuthAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
}
