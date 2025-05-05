package example.com.service;

import example.com.dto.UpdateUserRequest;
import example.com.dto.UserWithTasks;
import example.com.exception.ResourceNotFoundException;
import example.com.exception.UserAlreadyExistsException;
import example.com.model.Task;
import example.com.model.User;
import example.com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserWithTasks> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public Optional<UserWithTasks> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToDto);
    }


    public User createUser(User user) {
        if (userRepository.findAll().stream().anyMatch(u -> u.getUsername().equals(user.getUsername()))) {
            throw new UserAlreadyExistsException("Bu kullanıcı adı zaten kayıtlı.");
        }
        //user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null) {
            user.setPassword(request.getPassword()); // şifreleme yoksa direkt yazılır
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        return userRepository.save(user);
    }

    public ResponseEntity<?> deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Kullanıcının görevlerinden çıkarılması
        for (Task task : user.getTasks()) {
            task.getUsers().remove(user);
        }

        userRepository.delete(user);

        return ResponseEntity.ok(Map.of(
                "message", id + " id'li kullanıcı silindi"
        ));
    }


    private UserWithTasks mapToDto(User user) {
        List<Long> taskIds = user.getTasks() == null ? List.of()
                : user.getTasks().stream().map(t -> t.getId()).toList();

        boolean maxLimit = taskIds.size() >= 3;

        return new UserWithTasks(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                taskIds,
                maxLimit
        );
    }

}
