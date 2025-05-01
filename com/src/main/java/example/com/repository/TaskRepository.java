package example.com.repository;

import example.com.model.Task;
import example.com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByUser(User user);
}
