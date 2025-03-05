import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';  // Importa el contexto
import "../../styles/theme.css";  // Aquí puedes agregar tus estilos adicionales si los necesitas
import 'font-awesome/css/font-awesome.min.css';

const ThemeForm = () => {
    const [theme, setTheme] = useState('');
    const [message, setMessage] = useState('');
    const [themesList, setThemesList] = useState([]);  // Estado para almacenar los temas
    const [editMode, setEditMode] = useState(false); // Estado para saber si estamos editando
    const [selectedThemeId, setSelectedThemeId] = useState(null); // Para saber cuál tema estamos editando

    const { actions, store } = useContext(Context);

    // Utiliza la variable de entorno REACT_APP_BACKEND_URL si está disponible
    const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

    useEffect(() => {
        // Obtiene todos los temas cuando el componente se monta
        fetchThemes();
    }, []);

    // Función para obtener todos los temas
    const fetchThemes = async () => {
        try {
            const response = await fetch(`${backendUrl}api/user`);
            const data = await response.json();
            if (response.ok) {
                setThemesList(data.users);  // Asumiendo que el backend devuelve los temas en data.users
            } else {
                setMessage('Failed to load themes.');
            }
        } catch (error) {
            setMessage('Error fetching themes.');
            console.error('Error fetching themes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!theme) {
            setMessage('Theme name is required!');
            return;
        }

        // Aquí verificamos si estamos en modo edición
        const url = editMode 
            ? `${backendUrl}/api/user/${selectedThemeId}`  // Para PUT, usamos el ID del tema
            : `${backendUrl}/api/user`;  // Para POST, no necesitamos ID

        const method = editMode ? 'PUT' : 'POST';  // Si estamos en modo editar, usamos PUT
        const body = JSON.stringify({
            theme,
        });

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await response.json();

            if (response.ok) {
                // Limpiamos el formulario y desactivamos el modo edición
                setTheme('');
                setEditMode(false);  // Desactivamos el modo edición
                setSelectedThemeId(null);  // Reseteamos el tema seleccionado
                fetchThemes();  // Vuelve a cargar la lista de temas
            }

            setMessage(data.message);
        } catch (error) {
            setMessage('Error creating or updating theme.');
            console.error('Error making request:', error);
        }
    };

    // Función para eliminar un tema
    const handleDelete = async (themeId) => {
        const url = `${backendUrl}/api/user/${themeId}`;
        try {
            const response = await fetch(url, { method: 'DELETE' });
            const data = await response.json();
    
            if (response.ok) {
                // Actualiza la lista de temas localmente después de eliminar uno
                setThemesList((prevThemesList) => {
                    const newThemesList = prevThemesList.filter(theme => theme.id !== themeId);
                    // Si la lista está vacía, también establece un mensaje vacío o similar
                    if (newThemesList.length === 0) {
                        setMessage("No themes available.");
                    }
                    return newThemesList;
                });
                setMessage(data.message || 'Theme deleted successfully.');
            } else {
                setMessage('Failed to delete theme.');
            }
        } catch (error) {
            setMessage('Error deleting theme.');
            console.error('Error deleting theme:', error);
        }
    };

    // Función para manejar el clic en el botón "Editar"
    const handleEdit = (themeId) => {
        const themeToEdit = themesList.find((theme) => theme.id === themeId);
        if (themeToEdit) {
            setTheme(themeToEdit.theme);
            setSelectedThemeId(themeId); // Establecemos el tema seleccionado
            setEditMode(true); // Activamos el modo de edición
        }
    };

    return (
        <div className="container mt-5 mb-5 container-dark">
            <h2 className="text-center mb-4">{editMode ? 'Edit Theme' : 'Create Theme'}</h2>
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="theme" className="form-label">Theme:</label>
                            <input
                                type="text"
                                id="theme"
                                className="form-control"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                required
                                style={{ fontSize: '24px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            {editMode ? 'Save Changes' : 'Create Theme'}
                        </button>
                    </form>
                </div>
            </div>

            {message && <p className="mt-3 text-center text-dark">{message}</p>}

            <h3 className="text-center mt-5">Themes List</h3>
            <div className="mt-4 col-md-7 mx-auto row">
                <ul className="list-group">
                    {themesList.length > 0 ? (
                        themesList.map((theme) => (
                            <li key={theme.id} className="list-group-item d-flex justify-content-between align-items-center  mb-2">
                                <span className="theme-text">{theme.theme}</span>
                                <div className="col-2 d-flex justify-content-between">
                                    <i
                                        className="fa fa-pencil"
                                        style={{
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleEdit(theme.id)}
                                    ></i>
                                    <i
                                        className="fa fa-trash"
                                        style={{
                                            fontSize: '20px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleDelete(theme.id)}
                                    ></i>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="mt-3 text-center text-dark">No themes available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ThemeForm;
