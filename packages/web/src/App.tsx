import type { User } from '@synapse/shared-types';
import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Synapse Monorepo</h1>
      <div className="card">
        {user ? (
          <div>
            <h2>Usuário logado:</h2>
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button onClick={() => setUser(null)}>Logout</button>
          </div>
        ) : (
          <div>
            <p>Usuário não logado</p>
            <button onClick={handleLogin}>Simular Login</button>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Projeto com React/Vite + NestJS usando shared types
      </p>
    </>
  );
}

export default App;
