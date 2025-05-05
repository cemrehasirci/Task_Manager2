package example.com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWithTasks {
    private Long id;
    private String username;
    private String role;
    private List<Long> taskIds;
    private boolean maxLimitReached;
}
