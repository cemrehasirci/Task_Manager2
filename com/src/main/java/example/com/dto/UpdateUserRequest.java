package example.com.dto;

import example.com.model.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String password;
    private Role role;
}
