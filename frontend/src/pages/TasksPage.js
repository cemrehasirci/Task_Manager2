import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    let role = '';
    if (token) {
        try {
            role = jwtDecode(token).role;
        } catch (_) {}
    }

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            setError('Görevler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm(`Görevi silmek istediğine emin misin? [ID: ${id}]`)) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch {
            alert('Görev silinirken hata oluştu.');
        }
    };

    return (
        <Container className="mt-4">
            <h3>Görev Listesi</h3>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Başlık</th>
                        <th>Açıklama</th>
                        <th>Durum</th>
                        <th>Oluşturulma</th>
                        <th>İşlem</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.status}</td>
                            <td>{new Date(task.createdAt).toLocaleString()}</td>
                            <td>
                                <div className="d-flex">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => navigate(`/tasks/edit/${task.id}`)}
                                    >
                                        Düzenle
                                    </Button>
                                    {role === 'ADMIN' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Sil
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default TasksPage;
