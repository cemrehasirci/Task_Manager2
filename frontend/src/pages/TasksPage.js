import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import UserInfoBox from '../components/UserInfoBox'; // Sidebar

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

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
        <div style={{ display: 'flex' }}>
            {/* SOL SİDEBAR */}
            <UserInfoBox />

            {/* ANA İÇERİK */}
            <div style={{ marginLeft: '220px', padding: '20px', width: '100%' }}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>{role === 'ADMIN' ? 'Tüm Görevler' : 'Görevlerim'}</h3>
                        {role === 'ADMIN' && (
                            <Button variant="primary" onClick={() => navigate('/tasks/create')}>
                                + Görev Ekle
                            </Button>
                        )}
                    </div>

                    {loading && <Spinner animation="border" />}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {!loading && !error && (
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Başlık</th>
                                <th>Açıklama</th>
                                <th>Durum</th>
                                <th>Oluşturulma</th>
                                <th>Katılımcı Kullanıcı ID'leri</th>
                                {role === 'ADMIN' && <th>İşlem</th>}
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
                                    <td>{task.userIds?.join(', ') || '-'}</td>
                                    {role === 'ADMIN' && (
                                        <td>
                                            <div className="d-flex">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                                                >
                                                    Düzenle
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    Sil
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default TasksPage;
