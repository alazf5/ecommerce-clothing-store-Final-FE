import { useEffect, useState } from "react";
import {
  getAllUsers as fetchAllUsersApi,
  deleteUser,
  createUser,
  patchUser,
} from "../../api/adminService";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Form states
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "BUYER"
  });

  // Fetch users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setFeedbackMessage(null);
      const allUsers = await fetchAllUsersApi();
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add User Handlers
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
        setError("All fields are required.");
        return;
      }

      await createUser(newUser);
      setFeedbackMessage("User added successfully!");
      setShowAddUserModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "BUYER",
      });
      loadUsers();
    } catch (err) {
      console.error("Failed to add user:", err);
      setError(err.response?.data?.message || "Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit User Handlers
  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditFormData({
      firstName: user.firstName || user.firstname,
      lastName: user.lastName || user.lastname,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const updates = {};
      if (editFormData.firstName !== userToEdit.firstName) updates.firstName = editFormData.firstName;
      if (editFormData.lastName !== userToEdit.lastName) updates.lastName = editFormData.lastName;
      if (editFormData.email !== userToEdit.email) updates.email = editFormData.email;
      if (editFormData.role !== userToEdit.role) updates.role = editFormData.role;

      if (Object.keys(updates).length > 0) {
        await patchUser(userToEdit.id, updates);
        setFeedbackMessage("User updated successfully!");
        setShowEditModal(false);
        loadUsers();
      } else {
        setFeedbackMessage("No changes were made.");
        setShowEditModal(false);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err.response?.data?.message || "Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete User Handlers
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(userToDelete.id);
      setFeedbackMessage("User deleted successfully!");
      setShowDeleteModal(false);
      loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(err.response?.data?.message || "Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out"
        >
          Add New User
        </button>
      </div>

      {/* Feedback Messages */}
      {feedbackMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.firstName || user.firstname}</td>
                  <td className="py-3 px-6">{user.lastName || user.lastname}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.role}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New User</h3>
              <form onSubmit={handleAddUserSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={newUser.firstName}
                    onChange={handleAddUserChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={newUser.lastName}
                    onChange={handleAddUserChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleAddUserChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleAddUserChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleAddUserChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit User</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editFirstName">
                    First Name
                  </label>
                  <input
                    id="editFirstName"
                    name="firstName"
                    type="text"
                    value={editFormData.firstName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editLastName">
                    Last Name
                  </label>
                  <input
                    id="editLastName"
                    name="lastName"
                    type="text"
                    value={editFormData.lastName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editEmail">
                    Email
                  </label>
                  <input
                    id="editEmail"
                    name="email"
                    type="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editRole">
                    Role
                  </label>
                  <select
                    id="editRole"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded shadow appearance-none"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete user{" "}
                <span className="font-bold">
                  {userToDelete.firstName || userToDelete.firstname} {userToDelete.lastName || userToDelete.lastname}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;