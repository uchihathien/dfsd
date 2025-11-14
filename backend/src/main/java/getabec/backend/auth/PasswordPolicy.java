package getabec.backend.auth;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class PasswordPolicy {

    // Yêu cầu tối thiểu 8 ký tự, >=1 chữ hoa, >=1 chữ thường, >=1 số, >=1 ký tự đặc biệt, không khoảng trắng
    public List<String> validate(String password) {
        List<String> errors = new ArrayList<>();
        if (password == null || password.isBlank()) {
            errors.add("Mật khẩu không được để trống");
            return errors;
        }
        if (password.length() < 8) errors.add("Mật khẩu tối thiểu 8 ký tự");
        if (!password.chars().anyMatch(Character::isUpperCase)) errors.add("Cần ít nhất 1 chữ HOA (A‑Z)");
        if (!password.chars().anyMatch(Character::isLowerCase)) errors.add("Cần ít nhất 1 chữ thường (a‑z)");
        if (!password.chars().anyMatch(Character::isDigit)) errors.add("Cần ít nhất 1 chữ số (0‑9)");
        if (password.chars().anyMatch(Character::isWhitespace)) errors.add("Không được chứa khoảng trắng");
        // ký tự đặc biệt: bất kỳ ký tự không phải chữ/số
        boolean hasSpecial = password.chars().anyMatch(c ->
                !Character.isLetterOrDigit(c) && !Character.isWhitespace(c)
        );
        if (!hasSpecial) errors.add("Cần ít nhất 1 ký tự đặc biệt (ví dụ: !@#$%^&*)");
        return errors;
    }
}
