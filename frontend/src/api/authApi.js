const API_BASE = 'http://127.0.0.1:8000/api';

const post = (url, body) =>
	fetch(`${API_BASE}${url}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

const normalizeLoginArgs = (emailOrPayload, password) => {
	if (typeof emailOrPayload === 'object' && emailOrPayload !== null) {
		return {
			email: emailOrPayload.email || '',
			password: emailOrPayload.password || '',
		};
	}

	return {
		email: emailOrPayload || '',
		password: password || '',
	};
};

const normalizeRegisterArgs = (nameOrPayload, email, phone, password) => {
	if (typeof nameOrPayload === 'object' && nameOrPayload !== null) {
		return {
			name: nameOrPayload.name || nameOrPayload.full_name || '',
			email: nameOrPayload.email || '',
			phone: nameOrPayload.phone || '',
			password: nameOrPayload.password || '',
		};
	}

	return {
		name: nameOrPayload || '',
		email: email || '',
		phone: phone || '',
		password: password || '',
	};
};

const parseJson = async (response) => {
	try {
		return await response.json();
	} catch {
		return {};
	}
};

const createApiError = (data, status) => {
	const error = new Error(data.detail || data.message || data.error || 'Request failed');
	error.data = data;
	error.status = status;
	return error;
};

export const loginUser = (email, password) => {
	const payload = normalizeLoginArgs(email, password);
	return post('/login/', payload);
};

export const registerUser = (name, email, phone, password) => {
	const payload = normalizeRegisterArgs(name, email, phone, password);
	return post('/register/', payload);
};

export const forgotPassword = (identifier) => post('/forgot-password/', { identifier });

export const verifyOtp = (otp, identifier) => post('/verify-otp/', { otp, identifier });

export const resendOtp = (identifier) => post('/resend-otp/', { identifier });

export const resetPassword = (newPassword, resetToken, identifier) =>
	post('/reset-password/', {
		new_password: newPassword,
		reset_token: resetToken,
		identifier,
	});

export const saveTokens = (access, refresh) => {
	localStorage.setItem('token', access);
	localStorage.setItem('access', access);
	localStorage.setItem('refresh', refresh);
};

export const getToken = () => localStorage.getItem('token');

export const clearTokens = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('access');
	localStorage.removeItem('refresh');
};

export const setOtpSession = (identifier, phone = '') => {
	sessionStorage.setItem('otp_identifier', identifier);
	if (phone) {
		sessionStorage.setItem('otp_phone', phone);
	}
};

export const getOtpIdentifier = () => sessionStorage.getItem('otp_identifier') || '';

export const getOtpPhone = () => sessionStorage.getItem('otp_phone') || '';

export const setResetToken = (token) => sessionStorage.setItem('reset_token', token);

export const getResetToken = () => sessionStorage.getItem('reset_token') || '';

export const clearOtpSession = () => {
	sessionStorage.removeItem('otp_identifier');
	sessionStorage.removeItem('otp_phone');
	sessionStorage.removeItem('reset_token');
};

export const loginApi = async (payload) => {
	const response = await loginUser(payload);
	const data = await parseJson(response);

	if (!response.ok) {
		throw createApiError(data, response.status);
	}

	return { data };
};

export const registerApi = async (payload) => {
	const response = await registerUser(payload);
	const data = await parseJson(response);

	if (!response.ok) {
		throw createApiError(data, response.status);
	}

	return { data };
};
