import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditUserPage() {
    const [form, setForm] = useState({ username: '', password: '', role: 'USER' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setForm({
                    username: res.data.username,
                    password: '', // Şifreyi boş bırak, kullanıcı güncelleyebilir
                    role: res.data.role,
                });
            } catch (err) {
                setError('Kullanıcı bilgisi alınamadı.');
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/users/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/users');
        } catch (err) {
            setError('Kullanıcı güncellenemedi.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h3>Kullanıcıyı Düzenle</h3>
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
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select name="role" value={form.role} onChange={handleChange}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </Form.Select>
                </Form.Group>
                <Button type="submit" variant="primary">Kaydet</Button>
            </Form>
        </Container>
    );
}

export default EditUserPage;
