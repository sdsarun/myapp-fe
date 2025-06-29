'use client';

import { useState, useEffect } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}/myapp/api/users`;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      setName('');
      setEmail('');
      fetchUsers();
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: number) {
    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      setName('');
      setEmail('');
      setEditingId(null);
      fetchUsers();
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: number) {
    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchUsers();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("[LOG] - page.tsx:13 - API_URL:", API_URL)
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-16 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">User CRUD</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded w-full sm:w-1/3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full sm:w-1/3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {editingId === null ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={createUser}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        ) : (
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            onClick={() => updateUser(editingId)}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3 border-b">ID</th>
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-left p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id + user.name + user.email} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="p-3 border-b">{user.id}</td>
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b space-x-2">
                  <button
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => {
                      setName(user.name);
                      setEmail(user.email);
                      setEditingId(user.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => deleteUser(user.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
