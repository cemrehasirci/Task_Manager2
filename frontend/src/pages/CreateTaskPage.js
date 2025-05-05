import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
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
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Kullanıcılar alınamadı:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value));
        setForm((prev) => ({ ...prev, userIds: selectedOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/tasks', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/tasks');
        } catch (err) {
            setError('Görev oluşturulamadı.');
            console.error(err);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <h3>Görev Ekle</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Başlık</Form.Label>
                    <Form.Control type="text" name="title" value={form.title} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Açıklama</Form.Label>
                    <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} />
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
                    <Form.Label>Kullanıcı Ata</Form.Label>
                    <Form.Select multiple name="userIds" onChange={handleUserSelect}>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button type="submit" variant="success">Görev Oluştur</Button>
            </Form>
        </Container>
    );
}

export default CreateTaskPage;
