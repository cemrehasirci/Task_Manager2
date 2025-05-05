import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function EditUserPage() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'USER',
        taskIds: []
    });

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, tasksRes] = await Promise.all([
                    api.get(`/users/${id}`),
                    api.get('/tasks')
                ]);

                setForm({
                    username: userRes.data.username,
                    password: '',
                    role: userRes.data.role,
                    taskIds: userRes.data.taskIds || []
                });

                setTasks(tasksRes.data);
            } catch {
                setError('Veriler getirilemedi.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTaskSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
        setForm({ ...form, taskIds: selected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}`, form);
            navigate('/users');
        } catch {
            setError('Kullanıcı güncellenemedi.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h3>Kullanıcıyı Düzenle</h3>
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
                            placeholder="Değiştirmek istemiyorsan boş bırak"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select name="role" value={form.role} onChange={handleChange}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Atanmış Görevler</Form.Label>
                        <Form.Select multiple value={form.taskIds} onChange={handleTaskSelect}>
                            {tasks.map(task => {
                                const isSelected = form.taskIds.includes(task.id);
                                const isDisabled = task.maxLimitReached && !isSelected;
                                return (
                                    <option key={task.id} value={task.id} disabled={isDisabled}>
                                        {task.title} {isDisabled ? ' - (Dolu)' : ''}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Button type="submit" variant="primary">Kaydet</Button>
                </Form>
            )}
        </Container>
    );
}

export default EditUserPage;
