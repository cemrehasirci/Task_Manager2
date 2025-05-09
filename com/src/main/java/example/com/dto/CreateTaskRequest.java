package example.com.dto;

import example.com.model.TaskStatus;
import lombok.Data;
import lombok.Getter;

import java.util.Set;

@Data
public class CreateTaskRequest {
    @Getter
    private String title;
    private String description;
    private TaskStatus status;
    private Set<Long> userIds; // birden fazla user ID


}