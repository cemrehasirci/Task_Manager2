package example.com;

import example.com.model.Role;
import example.com.model.User;
import example.com.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication(scanBasePackages = "example.com")
public class TaskManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskManagerApplication.class, args);
	}
/*
	@Bean
	CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder encoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(encoder.encode("123456"));
				admin.setRole(Role.ADMIN);
				userRepository.save(admin);
				System.out.println("✅ Admin kullanıcısı eklendi: admin / 123456");
			} else {
				System.out.println("ℹ️ Admin zaten var.");
			}
		};
	}
	*/
}

