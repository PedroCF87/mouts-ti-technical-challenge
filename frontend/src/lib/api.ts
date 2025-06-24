import Cookies from 'js-cookie'

const API_URL = process.env.API_URL || 'http://localhost:3001'

export async function getUsers(token: string | undefined) {
  const fetchOptions: RequestInit & { cache?: string } = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  };
  const response = await fetch(`${API_URL}/users`, fetchOptions);
  if (!response.ok) {
    throw new Error(response.status.toString());
  }
  return response.json();
}

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  const { access_token } = await response.json()

  Cookies.set('auth_token', access_token, { expires: 1, sameSite: 'strict' })
}

export async function createUser(data: any) {
  const token = Cookies.get('auth_token');
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create user');
  }

  return response.json();
}

export async function getUserById(id: string) {
    try {

        const token = Cookies.get('auth_token');

        const response = await fetch(`${API_URL}/users/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return response.json();

    } catch (error) {
        console.error('Error fetching user by ID:', error);
        let errorMessage = 'Failed to fetch user';
        if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return { error: errorMessage };
    }
}

export async function updateUser(id: string, data: any) {
  const token = Cookies.get('auth_token');
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user');
  }
  return response.json();
}

export async function deleteUser(id: string) {
  const token = Cookies.get('auth_token');
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    // tenta extrair mensagem de erro, se houver
    let errorMessage = 'Failed to delete user';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  // Se status 204 ou sem corpo, apenas retorna sucesso
  if (response.status === 204) return;
  const text = await response.text();
  if (!text) return;
  try {
    return JSON.parse(text);
  } catch {
    return;
  }
}
