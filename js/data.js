export const getUsersFromServer = async (query = '') => {
  const response = await fetch(`http://localhost:3000/api/clients?search=${query}`);
  const data = await response.json();

  return { users: data, status: response.status };
};

export const getUserToIdFromServer = async (id) => {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`);
  const data = await response.json();

  return data;
};

export const addUserToServer = async (user) => {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  const data = await response.json();

  return data;
};

export const updateUserToServer = async (id, user) => {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user }),
  });

  const data = await response.json();

  return data;
};

export const deleteUserToServer = async (id) => {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  return data;
};
