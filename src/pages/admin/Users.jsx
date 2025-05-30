// src/pages/admin/Users.jsx
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
// import UserTable from '../../components/admin/UserTable';

const Users = () => {
  const { getAllUsers } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setLoading(false);
    };
    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="btn btn-primary">
          Add New User
        </button>
      </div>
      
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};

export default Users;