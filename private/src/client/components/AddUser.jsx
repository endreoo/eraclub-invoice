import React, { useState } from 'react';
import axios from 'axios';
import { Card, TextInput, Button } from '@tremor/react';

const AddUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', formData);
      setMessage('User registered successfully!');
      setFormData({ email: '', password: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          type="email"
          required
        />
        <TextInput
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          type="password"
          required
        />
        <Button type="submit" className="w-full">
          Register User
        </Button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </Card>
  );
};

export default AddUser; 