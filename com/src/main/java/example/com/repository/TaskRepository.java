package example.com.repository;

import example.com.model.Task;
import example.com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT COUNT(t) FROM Task t JOIN t.users u WHERE u = :user")
    long countByUser(@Param("user") User user);

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.username = :username")
    List<Task> findByUsername(@Param("username") String username);


}
