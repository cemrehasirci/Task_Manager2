import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateUserPage() {
    const [form, setForm] = useState({ username: '', password: '', role: 'USER' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/users', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/users'); // başarıyla eklenince listeye dön
        } catch (err) {
            setError(err.response?.data?.message || 'Kullanıcı oluşturulamadı.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h3>Kullanıcı Oluştur</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Şifre</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select name="role" value={form.role} onChange={handleChange}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">Oluştur</Button>
            </Form>
        </Container>
    );
}

export default CreateUserPage;
