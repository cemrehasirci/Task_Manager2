import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateUserPage() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'USER',
        taskIds: [] // 👈 görev ataması
    });

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/tasks')
            .then(res => setTasks(res.data))
            .catch(() => setError("Görevler yüklenemedi."))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTaskSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
        setForm({ ...form, taskIds: selectedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', form);
            navigate('/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Kullanıcı oluşturulamadı.');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '500px' }}>
            <h3>Yeni Kullanıcı Oluştur</h3>
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <Spinner animation="border" />
            ) : (
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
                        <Form.Select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Görev Atamaları</Form.Label>
                        <Form.Select
                            multiple
                            value={form.taskIds}
                            onChange={handleTaskSelect}
                        >
                            {tasks.map(task => {
                                const isFull = task.userIds?.length >= 3;
                                return (
                                    <option
                                        key={task.id}
                                        value={task.id}
                                        disabled={isFull}
                                    >
                                        {task.title} {isFull ? '(Dolu)' : ''}
                                    </option>
                                );
                            })}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Bir kullanıcıya birden fazla görev atayabilirsiniz.
                        </Form.Text>
                    </Form.Group>

                    <Button type="submit" variant="primary">Oluştur</Button>
                </Form>
            )}
        </Container>
    );
}

export default CreateUserPage;
