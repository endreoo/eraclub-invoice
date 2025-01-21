interface User {
  email: string;
  id: string;
  name: string;
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await fetch('http://37.27.142.148:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    const user = { email, id: data.id || '1', name: data.name || email };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    throw new Error('Invalid email or password');
  }
}

export function logout() {
  localStorage.removeItem('user');
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getUser();
}