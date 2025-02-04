// src/pages/Login/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
//import { login } from '../../store/uiSlice';

import './LoginPage.css';
import { login } from '../../services/authService';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamada al endpoint /auth/login
      const data = await login(formData);

      // Guardas token en localStorage (o donde quieras)
      localStorage.setItem('token', data.accessToken);

      // Podrías despachar un action de Redux para guardar user info
      // dispatch(setUserData(data.user));
      
      // Redirigir a la página principal o dashboard
      // Por ejemplo, con react-router: navigate('/dashboard')
      alert('Login exitoso!');
    } catch (error) {
      console.error(error);
      alert('Error en login.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            
            <label>
              Contraseña:
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit">Login</button>
          </form>

          <div className="register-link">
            <p>¿No tienes cuenta?</p>
            <a href="/register">Regístrate aquí</a>
          </div>
      </div>
  </div>
  );
};

export default LoginPage;
/*
function LoginPage() {
  const dispatch = useDispatch();
  //const department = useSelector((state) => state.ui.department);

  const handleLogin = () => {
    // Ejemplo: loguear y setear departamento
    dispatch(login('EjemploDepto'));
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label htmlFor="department">Departamento:</label>
          <select id="department" name="department">
            <option value="dep1">Departamento 1</option>
            <option value="dep2">Departamento 2</option>
          </select>
        </div>
        <button type="submit" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
*/
