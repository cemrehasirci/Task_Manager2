package example.com.dto;

import example.com.model.TaskStatus;
import lombok.Data;
import lombok.Getter;

@Data
public class CreateTaskRequest {
    @Getter
    private String title;
    private String description;
    private TaskStatus status;
    private Long user;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public Long getUser() {
        return user;
    }
}