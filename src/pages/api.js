// api.js
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, 
    ...options.headers, 
  };

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};
