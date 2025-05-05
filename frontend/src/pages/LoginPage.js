import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ Context'ten login fonksiyonunu alıyoruz

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', form);
            login(res.data.token); // ✅ token'ı context'e yazıyoruz
            navigate('/tasks');
        } catch (err) {
            console.error('Login error:', err.response || err);
            setError(err.response?.data?.message || 'Giriş başarısız.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h3 className="mb-4">Giriş Yap</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Şifre</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="success" type="submit">Giriş Yap</Button>
            </Form>
        </Container>
    );
}

export default LoginPage;
