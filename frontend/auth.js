const API = 'http://localhost:8000/api';

function showError(form, message) {
  let el = form.querySelector('.error-msg');
  if (!el) {
    el = document.createElement('p');
    el.className = 'error-msg';
    form.appendChild(el);
  }
  el.textContent = message;
}

function clearError(form) {
  const el = form.querySelector('.error-msg');
  if (el) el.textContent = '';
}

// ── Login ──────────────────────────────────────────────────────────────────
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError(e.target);

  const email    = e.target[0].value.trim();
  const password = e.target[1].value;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const res = await fetch(`${API}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || data.message || 'Login failed');

    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);

    window.location.href = '/dashboard';
  } catch (err) {
    showError(e.target, err.message || 'An error occurred. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});

// ── Register ───────────────────────────────────────────────────────────────
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError(e.target);

  const name     = e.target[0].value.trim();
  const email    = e.target[1].value.trim();
  const phone    = e.target[2].value.trim();
  const password = e.target[3].value;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Creating account…';

  try {
    const res = await fetch(`${API}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.detail || data.message
        || Object.values(data).flat().join(' ')
        || 'Registration failed';
      throw new Error(msg);
    }

    const success = document.createElement('p');
    success.className = 'success-msg';
    success.textContent = 'Account created! Redirecting to login…';
    e.target.appendChild(success);

    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  } catch (err) {
    showError(e.target, err.message || 'An error occurred. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
});
