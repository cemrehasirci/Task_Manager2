package example.com.service;

import example.com.dto.TaskResponse;
import example.com.dto.UpdateTaskRequest;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private static final int MAX_TASK_PER_USER = 3;


    public List<TaskResponse> getAllTasks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(granted -> granted.getAuthority().equals("ROLE_ADMIN"));

        List<Task> tasks = isAdmin ? taskRepository.findAll() : taskRepository.findByUsername(username);

        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(CreateTaskRequest taskRequest) {
        Set<User> assignedUsers = new HashSet<>();

        for (Long userId : taskRequest.getUserIds()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

            long taskCount = taskRepository.countByUser(user);
            if (taskCount >= MAX_TASK_PER_USER) {
                throw new AccessDeniedException("Kullanıcıya en fazla " + MAX_TASK_PER_USER + " görev atanabilir: " + user.getUsername());
            }

            assignedUsers.add(user);
        }

        Task task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .createdAt(LocalDateTime.now())
                .users(assignedUsers)
                .build();

        for (User user : assignedUsers) {
            user.getTasks().add(task);
        }

        return mapToTaskResponse(taskRepository.save(task));
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı"));
        return mapToTaskResponse(task);
    }

    public TaskResponse updateTask(Long id, UpdateTaskRequest updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı"));

        String currentUsername = AuthUtil.getCurrentUsername();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && task.getUsers().stream().noneMatch(u -> u.getUsername().equals(currentUsername))) {
            throw new AccessDeniedException("Bu görevi güncellemeye yetkiniz yok.");
        }

        if (updatedTask.getTitle() != null) task.setTitle(updatedTask.getTitle());
        if (updatedTask.getDescription() != null) task.setDescription(updatedTask.getDescription());
        if (updatedTask.getStatus() != null) task.setStatus(updatedTask.getStatus());

        // Kullanıcı listesi güncelleme
        if (updatedTask.getUserIds() != null) {
            Set<User> newUsers = new HashSet<>();

            for (Long userId : updatedTask.getUserIds()) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

                long taskCount = taskRepository.countByUser(user);
                boolean alreadyAssigned = task.getUsers().contains(user);

                if (taskCount >= MAX_TASK_PER_USER && !alreadyAssigned) {
                    throw new AccessDeniedException("Kullanıcıya en fazla " + MAX_TASK_PER_USER + " görev atanabilir: " + user.getUsername());
                }

                newUsers.add(user);
            }

            // eski user'lardan görev çıkar
            Set<User> oldUsers = new HashSet<>(task.getUsers());
            for (User oldUser : oldUsers) {
                oldUser.getTasks().remove(task);
            }

            // yeni user'lara görev ekle
            for (User newUser : newUsers) {
                newUser.getTasks().add(task);
            }

            task.setUsers(newUsers);
        }

        return mapToTaskResponse(taskRepository.save(task));
    }


    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı"));

        String currentUsername = AuthUtil.getCurrentUsername();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && task.getUsers().stream().noneMatch(u -> u.getUsername().equals(currentUsername))) {
            throw new AccessDeniedException("Bu görevi silmeye yetkiniz yok.");
        }

        for (User user : task.getUsers()) {
            user.getTasks().remove(task); // senkron
        }

        taskRepository.delete(task);
    }

    private TaskResponse mapToTaskResponse(Task task) {
        Set<Long> userIds = task.getUsers().stream()
                .map(User::getId)
                .collect(Collectors.toSet());

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .userIds(userIds)
                .build();
    }
}
