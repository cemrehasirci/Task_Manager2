import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateTaskPage() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'TODO',
        userIds: []
    });

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(() => setError("Kullanıcılar yüklenemedi."))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUserSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
        setForm({ ...form, userIds: selectedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', form);
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.message || 'Görev oluşturulamadı.');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h3>Yeni Görev Oluştur</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <Spinner animation="border" />
            ) : (
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
                            rows={3}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Durum</Form.Label>
                        <Form.Select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="TODO">Yapılacak</option>
                            <option value="IN_PROGRESS">Devam Ediyor</option>
                            <option value="DONE">Tamamlandı</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Atanacak Kullanıcılar</Form.Label>
                        <Form.Select
                            multiple
                            value={form.userIds}
                            onChange={handleUserSelect}
                        >
                            {users.map(user => {
                                const isDisabled = user.maxLimit && !form.userIds.includes(user.id);
                                return (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                        disabled={isDisabled}
                                    >
                                        {user.username} ({user.role}){isDisabled ? ' - Görev limiti dolu' : ''}
                                    </option>
                                );
                            })}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Birden fazla kullanıcı seçmek için Ctrl (Cmd) tuşunu kullan.
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit">Görev Oluştur</Button>
                </Form>
            )}
        </Container>
    );
}

export default CreateTaskPage;
