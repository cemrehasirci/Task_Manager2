-- Şifreler önceden BCrypt ile encode edilmiş
/*INSERT INTO users (id, username, password, role) VALUES
                                                     (1, 'admin', '$2a$10$VFkFlIfULC3EqPV5Kf1.FelMSXLbbYNp9hFzrcRSKk0d8LZKFuWXK', 'ADMIN'),
                                                     (2, 'user', '$2a$10$8NKh8sDiX3Gac/O30epz9u4vlEVwX5wPZ4u8/nKMX5JuS2J.uxY2C', 'USER');
*/


-- admin: admin123 | user: user123

-- Admin ve normal kullanıcı
INSERT INTO users (username, password, role) VALUES
    ('admin', 'admin123', 'ADMIN'),
    ('user', 'user123', 'USER');

-- Görev örnekleri
INSERT INTO task (title, description, status, created_at) VALUES
                                                                           ('İlk görev', 'Giriş yap', 'TODO', CURRENT_TIMESTAMP),
                                                                           ('İkinci görev', 'Task kontrolü yap', 'IN_PROGRESS', CURRENT_TIMESTAMP);

-- Kullanıcı-görev eşleşmesi (ara tabloya yazılır)
INSERT INTO task_users (task_id, user_id) VALUES (1, 2), (2, 2);