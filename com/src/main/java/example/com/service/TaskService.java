package example.com.service;

import example.com.model.User;
import example.com.model.Task;
import example.com.dto.CreateTaskRequest;
import example.com.repository.UserRepository;
import example.com.repository.TaskRepository;
import example.com.exception.ResourceNotFoundException;
import example.com.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> getAllTasks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return taskRepository.findAll();
        } else {
            return taskRepository.findAll().stream()
                    .filter(task -> task.getUser() != null &&
                            task.getUser().getUsername().equals(username))
                    .toList();
        }
    }

    public Task createTask(CreateTaskRequest taskRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + username));

        long taskCount = taskRepository.countByUser(user);
        if (taskCount >= 3) {
            throw new AccessDeniedException("Her kullanıcı en fazla 3 görev oluşturabilir.");
        }

        Task task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return taskRepository.save(task);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev ID " + id + " bulunamadı"));
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı"));

        String currentUsername = AuthUtil.getCurrentUsername();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !task.getUser().getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("Bu görevi güncellemeye yetkiniz yok.");
        }

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı"));

        String currentUsername = AuthUtil.getCurrentUsername();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !task.getUser().getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("Bu görevi silmeye yetkiniz yok.");
        }

        taskRepository.deleteById(id);
    }
}
