package getabec.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);


    @Query("select u.id from User u where lower(u.email) = lower(:email)")
    Optional<Long> findIdByEmail(@Param("email") String email);

}