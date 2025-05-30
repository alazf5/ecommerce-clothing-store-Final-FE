// AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuthContext } from '../../context/AuthContext';
import { adminLinks } from '../../data/SideBarLinks';

function AdminLayout() {
  const { currentUser } = useAuthContext();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        links={adminLinks} 
        userRole="Admin" 
        userName={currentUser?.firstName} 
      />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This will render the matched child route */}
      </main>
    </div>
  );
}

export default AdminLayout;