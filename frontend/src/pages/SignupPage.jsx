import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await client.post('/auth/signup', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <main className="auth-card">
      <h1>Signup</h1>
      <form onSubmit={submit}>
        <input placeholder="Name" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input
          placeholder="Password"
          type="password"
          required
          minLength={6}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Signup</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}
