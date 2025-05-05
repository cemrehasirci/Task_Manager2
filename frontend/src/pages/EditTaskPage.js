import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

function EditTaskPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'TODO',
        userIds: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskRes, usersRes] = await Promise.all([
                    api.get(`/tasks/${id}`),
                    api.get('/users'),
                ]);

                const task = taskRes.data;
                setForm({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    userIds: task.userIds, // ✅ doğru alan
                });

                setUsers(usersRes.data);
            } catch (err) {
                setError('Veriler getirilemedi.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUserSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const ids = selectedOptions.map((opt) => parseInt(opt.value));
        setForm((prev) => ({ ...prev, userIds: ids }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ❗ GÖREV LİMİTİ KONTROLÜ
        const invalidUsers = users.filter(
            (u) => u.maxLimit === true && !form.userIds.includes(u.id) // zaten görevde değilse
        );

        const selectedInvalidUsers = invalidUsers.filter(u =>
            form.userIds.includes(u.id)
        );

        if (selectedInvalidUsers.length > 0) {
            setError("Seçilen kullanıcılar arasında görev limiti dolu olanlar var. Lütfen kontrol edin.");
            return;
        }

        try {
            await api.put(`/tasks/${id}`, form);
            navigate('/tasks');
        } catch {
            setError('Görev güncellenemedi.');
        }
    };


    if (loading) return <Spinner animation="border" className="mt-4 ms-4" />;

    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h3>Görevi Güncelle</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Başlık</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Açıklama</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Durum</Form.Label>
                    <Form.Select name="status" value={form.status} onChange={handleChange}>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Atanmış Kullanıcılar</Form.Label>
                    <Form.Select
                        multiple
                        value={form.userIds}
                        onChange={handleUserSelect}
                    >
                        {users.map((user) => {
                            const isSelected = form.userIds.includes(user.id);
                            const isDisabled = user.maxLimit && !isSelected;
                            return (
                                <option
                                    key={user.id}
                                    value={user.id}
                                    disabled={isDisabled}
                                >
                                    {user.username} {isDisabled ? '(Görev limiti dolu)' : ''}
                                </option>
                            );
                        })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                        Birden fazla kullanıcı seçmek için Ctrl (Cmd) tuşunu kullan.
                    </Form.Text>
                </Form.Group>

                <Button type="submit" variant="success">
                    Güncelle
                </Button>
            </Form>
        </Container>
    );
}

export default EditTaskPage;
