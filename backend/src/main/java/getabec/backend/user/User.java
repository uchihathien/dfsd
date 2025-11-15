package getabec.backend.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

// user/User.java
@Entity
@Table(name="users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique=true, nullable=false) private String email;
    private String password; // null nếu chỉ dùng OAuth
    private String fullName;
    private String role = "USER";
    private String status = "ACTIVE";
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

}


