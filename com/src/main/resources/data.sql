-- Admin ve normal kullanıcı
INSERT INTO users (username, password, role) VALUES
                                                 ('admin', '$2a$10$3N9WxE6FzvLK5X7IjkmdrOOFvKylDgIuejJqJ05PQ0r0oUtpyblg2', 'ADMIN'),
                                                 ('user', '$2a$10$KXZsG.z1VpI5BpYTuWJWleJ1vwhxKxJz8hvkpZBtIaXOsRYeFwAKK', 'USER');
-- Admin,users paswsord:123456, user123

-- Görev örnekleri
INSERT INTO tasks (title, description, status) VALUES
                                                   ('İlk görev', 'H2 ile test', 'TODO'),
                                                   ('İkinci görev', 'Data.sql ile geldi', 'IN_PROGRESS');
