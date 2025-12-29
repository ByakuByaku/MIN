import { useState, FormEvent, ChangeEvent } from 'react';

interface LoginFormProps {
  onLogin: (nickname: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const validateNickname = (value: string): boolean => {
    if (!value.trim()) {
      setError('Никнейм не может быть пустым');
      return false;
    }
    if (value.length < 2) {
      setError('Никнейм должен содержать минимум 2 символа');
      return false;
    }
    if (value.length > 20) {
      setError('Никнейм не должен превышать 20 символов');
      return false;
    }
    if (!/^[a-zA-Zа-яА-ЯёЁ0-9_-]+$/.test(value)) {
      setError('Никнейм может содержать только буквы, цифры, _ и -');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    if (error && value.trim()) {
      validateNickname(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateNickname(nickname)) {
      onLogin(nickname.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Добро пожаловать в MIN Chat!</h2>
        <p>Введите ваш никнейм для входа в чат</p>
        
        <div className="form-group">
          <label htmlFor="nickname">Никнейм</label>
          <input
            id="nickname"
            type="text"
            className={`form-input ${error ? 'error' : ''}`}
            value={nickname}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ваш никнейм"
            autoFocus
            maxLength={20}
          />
          {error && <span className="form-error">{error}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!!error || !nickname.trim()}
        >
          Войти в чат
        </button>
      </form>
    </div>
  );
};
