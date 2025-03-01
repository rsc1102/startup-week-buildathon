// pages/login.tsx

import { useState } from 'react';
// import { useRouter } from 'next/router';
import BidRides from '../components/BidRides';

export default function Login () {
  // const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      // Mocking API response, replace with real authentication logic
      const response = await mockLogin(email, password);
      
      setIsDriver(response.isDriver);
      setIsLoggedIn(true);

    } catch (error) {
      setError('Login failed. Please check your credentials');
    }
  };

  // Mock login function, replace with real API call
  const mockLogin = (email: string, password: string) => {
    return new Promise<{ isDriver: boolean }>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'driver@example.com' && password === 'driverpass') {
          resolve({ isDriver: true });
        } else if (email === 'user@example.com' && password === 'userpass') {
          resolve({ isDriver: false });
        } else {
          reject('Invalid credentials');
        }
      }, 1000);
    });
  };

  if (isLoggedIn && isDriver) {
    return <BidRides />;
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '2px solid #4A90E2', // Blue border for contrast
        backgroundColor: '#404040', // Darker background for contrast
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        color: '#fff',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #4A90E2',
              borderRadius: '4px',
              backgroundColor: '#333',
              color: '#fff',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #4A90E2',
              borderRadius: '4px',
              backgroundColor: '#333',
              color: '#fff',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4A90E2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}