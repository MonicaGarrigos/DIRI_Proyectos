import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from './AuthForm';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

describe('AuthForm UI tests', () => {
  afterEach(() => {
    cleanup();
  });

  const renderAuthForm = () =>
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AuthForm />
        </I18nextProvider>
      </Provider>
    );

  it('Should render login and register buttons', async () => {
    renderAuthForm();

    // Adaptado al texto visible en el botón
    const loginButton = await screen.findByText('Iniciar sesión');
    const registerButton = await screen.findByText('Crear cuenta');

    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it('Should toggle between login and register forms', async () => {
    const user = userEvent.setup();
    renderAuthForm();

    // Verificamos que el modo inicial sea "login" mostrando botón Entrar
    const submitButtonLogin = await screen.findByRole('button', { name: /entrar/i });
    expect(submitButtonLogin).toBeInTheDocument();

    // Cambiamos a "crear cuenta"
    const registerToggle = await screen.findByRole('button', { name: /crear cuenta/i });
    await user.click(registerToggle);

    // Esperamos que aparezca el botón alternativo (por ejemplo "Registrarse")
    const submitButtonRegister = await screen.findByRole('button', { name: /registrarse/i });

    expect(submitButtonRegister).toBeInTheDocument();
  });


  it('Should update input values as user types', async () => {
    const user = userEvent.setup();
    renderAuthForm();

    // Etiquetas exactas según DOM real
    const emailInput = await screen.findByLabelText(/correo electrónico/i);
    const passwordInput = await screen.findByLabelText(/contraseña/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123456');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('123456');
  });
});
