import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit2, 
  Shield, 
  User as UserIcon,
  Mail,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { logActivity } from '../utils/activityLogger';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'User' | 'Admin';
  notifications: boolean;
  password?: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [activeTab, setActiveTab] = useState<'User' | 'Admin'>('User');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<UserData | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const isCoreAdmin = user?.email === 'admin.com';

  useEffect(() => {
    if (user && user.role.toLowerCase() !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    const allUsers: UserData[] = [
      {
        id: 'Admin',
        email: 'admin@hydrix.com',
        name: 'Core Admin',
        role: 'Admin',
        notifications: true
      },
      ...storedUsers
    ];
    setUsers(allUsers);
  };

  const regularUsers = users.filter(u => u.role === 'User');
  const adminUsers = users.filter(u => u.role === 'Admin');

  const handleAddUser = () => {
    if (!userFormData.name || !userFormData.email || !userFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (users.find(u => u.email === userFormData.email)) {
      toast.error('User with this email already exists');
      return;
    }

    const newUser: UserData = {
      id: 'user_' + Date.now(),
      email: userFormData.email,
      name: userFormData.name,
      role: 'User',
      notifications: true,
      password: userFormData.password
    };

    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('hydrix_users', JSON.stringify(storedUsers));

    logActivity(
      user!.name,
      user!.email,
      'User added',
      `Added new user: ${userFormData.name} (${userFormData.email})`,
      'system'
    );

    toast.success('User added successfully');
    setUserFormData({ name: '', email: '', password: '' });
    setShowAddUserForm(false);
    loadUsers();
  };

  const handleAddAdmin = () => {
    if (!isCoreAdmin) {
      toast.error('Only core admin can add new administrators');
      return;
    }

    if (!adminFormData.name || !adminFormData.email || !adminFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (users.find(u => u.email === adminFormData.email)) {
      toast.error('User with this email already exists');
      return;
    }

    const newAdmin: UserData = {
      id: 'Admin_' + Date.now(),
      email: adminFormData.email,
      name: adminFormData.name,
      role: 'Admin',
      notifications: true,
      password: adminFormData.password
    };

    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    storedUsers.push(newAdmin);
    localStorage.setItem('hydrix_users', JSON.stringify(storedUsers));

    logActivity(
      user!.name,
      user!.email,
      'Admin added',
      `Added new admin: ${adminFormData.name} (${adminFormData.email})`,
      'system'
    );

    toast.success('Admin added successfully');
    setAdminFormData({ name: '', email: '', password: '' });
    setShowAddAdminForm(false);
    loadUsers();
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    const updatedUsers = storedUsers.map((u: UserData) =>
      u.id === editingUser.id ? { ...u, name: editingUser.name } : u
    );
    localStorage.setItem('hydrix_users', JSON.stringify(updatedUsers));

    logActivity(
      user!.name,
      user!.email,
      'User updated',
      `Updated user: ${editingUser.name} (${editingUser.email})`,
      'system'
    );

    toast.success('User updated successfully');
    setEditingUser(null);
    loadUsers();
  };

  const handleUpdateAdmin = () => {
    if (!editingAdmin) return;

    if (!isCoreAdmin) {
      toast.error('Only core admin can update administrators');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    const updatedUsers = storedUsers.map((u: UserData) =>
      u.id === editingAdmin.id ? { ...u, name: editingAdmin.name } : u
    );
    localStorage.setItem('hydrix_users', JSON.stringify(updatedUsers));

    logActivity(
      user!.name,
      user!.email,
      'Admin updated',
      `Updated admin: ${editingAdmin.name} (${editingAdmin.email})`,
      'system'
    );

    toast.success('Admin updated successfully');
    setEditingAdmin(null);
    loadUsers();
  };

  const handleDeleteUser = (userToDelete: UserData) => {
    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    const updatedUsers = storedUsers.filter((u: UserData) => u.id !== userToDelete.id);
    localStorage.setItem('hydrix_users', JSON.stringify(updatedUsers));

    logActivity(
      user!.name,
      user!.email,
      'User removed',
      `Removed user: ${userToDelete.name} (${userToDelete.email})`,
      'system'
    );

    toast.success('User removed successfully');
    loadUsers();
  };

  const handleDeleteAdmin = (adminToDelete: UserData) => {
    if (adminToDelete.email === 'admin@hydrix.com') {
      toast.error('Cannot delete core admin');
      return;
    }

    if (!isCoreAdmin) {
      toast.error('Only core admin can delete administrators');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    const updatedUsers = storedUsers.filter((u: UserData) => u.id !== adminToDelete.id);
    localStorage.setItem('hydrix_users', JSON.stringify(updatedUsers));

    logActivity(
      user!.name,
      user!.email,
      'Admin removed',
      `Removed admin: ${adminToDelete.name} (${adminToDelete.email})`,
      'system'
    );

    toast.success('Admin removed successfully');
    loadUsers();
  };

  if (!user || user.role.toLowerCase() !== 'admin') return null;

  return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage users and administrators.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{regularUsers.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={32} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Admins</p>
                  <p className="text-3xl font-bold text-purple-600">{adminUsers.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="text-white" size={32} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toggle Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-full">
          <button
            onClick={() => {
              setActiveTab('User');
              setShowAddAdminForm(false);
              setEditingAdmin(null);
            }}
            className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'User'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon size={16} />
            User
          </button>
          <button
            onClick={() => {
              setActiveTab('Admin');
              setShowAddUserForm(false);
              setEditingUser(null);
            }}
            className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'Admin'
                ? 'bg-white text-purple-600 shadow-sm border border-purple-100'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield size={16} />
            Admin
          </button>
        </div>

        {/* ── USER TAB ── */}
        {activeTab === 'User' && (
          <>
            {/* Add User Button */}
            <div className="mb-6">
              <Button
                onClick={() => {
                  setShowAddUserForm(!showAddUserForm);
                  setEditingUser(null);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus size={18} className="mr-2" />
                Add User
              </Button>
            </div>

            {/* Add/Edit User Form */}
            {(showAddUserForm || editingUser) && (
              <Card className="mb-6 border-blue-200">
                <CardHeader>
                  <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
                  <CardDescription>
                    {editingUser ? 'Update user information' : 'Create a new user account'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editingUser ? editingUser.name : userFormData.name}
                        onChange={(e) => {
                          if (editingUser) {
                            setEditingUser({ ...editingUser, name: e.target.value });
                          } else {
                            setUserFormData({ ...userFormData, name: e.target.value });
                          }
                        }}
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingUser ? editingUser.email : userFormData.email}
                        onChange={(e) => {
                          if (!editingUser) {
                            setUserFormData({ ...userFormData, email: e.target.value });
                          }
                        }}
                        placeholder="Enter email"
                        disabled={!!editingUser}
                      />
                    </div>
                  </div>

                  {!editingUser && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={editingUser ? handleUpdateUser : handleAddUser}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editingUser ? 'Update User' : 'Add User'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddUserForm(false);
                        setEditingUser(null);
                        setUserFormData({ name: '', email: '', password: '' });
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Users List */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-blue-600" size={24} />
                  Users List
                </CardTitle>
                <CardDescription>All registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {regularUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto mb-2 opacity-30" size={48} />
                    <p>No users registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {regularUsers.map((userData) => (
                      <Card key={userData.id} className="border-blue-100">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                                <UserIcon className="text-white" size={20} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-800">{userData.name}</p>
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                    user
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                  <Mail size={14} />
                                  {userData.email}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => {
                                  setEditingUser(userData);
                                  setShowAddUserForm(false);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                onClick={() => handleDeleteUser(userData)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ── ADMIN TAB ── */}
        {activeTab === 'Admin' && (
          <>
            {/* Add Admin Button */}
            {isCoreAdmin && (
              <div className="mb-6">
                <Button
                  onClick={() => {
                    setShowAddAdminForm(!showAddAdminForm);
                    setEditingAdmin(null);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <UserPlus size={18} className="mr-2" />
                  Add Admin
                </Button>
              </div>
            )}

            {/* Add/Edit Admin Form */}
            {(showAddAdminForm || editingAdmin) && (
              <Card className="mb-6 border-purple-200">
                <CardHeader>
                  <CardTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</CardTitle>
                  <CardDescription>
                    {editingAdmin ? 'Update admin information' : 'Create a new admin account'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editingAdmin ? editingAdmin.name : adminFormData.name}
                        onChange={(e) => {
                          if (editingAdmin) {
                            setEditingAdmin({ ...editingAdmin, name: e.target.value });
                          } else {
                            setAdminFormData({ ...adminFormData, name: e.target.value });
                          }
                        }}
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingAdmin ? editingAdmin.email : adminFormData.email}
                        onChange={(e) => {
                          if (!editingAdmin) {
                            setAdminFormData({ ...adminFormData, email: e.target.value });
                          }
                        }}
                        placeholder="Enter email"
                        disabled={!!editingAdmin}
                      />
                    </div>
                  </div>

                  {!editingAdmin && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={adminFormData.password}
                        onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={editingAdmin ? handleUpdateAdmin : handleAddAdmin}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {editingAdmin ? 'Update Admin' : 'Add Admin'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddAdminForm(false);
                        setEditingAdmin(null);
                        setAdminFormData({ name: '', email: '', password: '' });
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admins List */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-purple-600" size={24} />
                  Admins List
                </CardTitle>
                <CardDescription>All system administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminUsers.map((userData) => (
                    <Card key={userData.id} className="border-purple-100">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600">
                              <Shield className="text-white" size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800">{userData.name}</p>
                                {userData.email === 'admin@hydrix.com' && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs rounded-full">
                                    <Crown size={12} />
                                    Core Admin
                                  </span>
                                )}
                                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                  admin
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <Mail size={14} />
                                {userData.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {userData.email !== 'admin@hydrix.com' && (
                              <>
                                <Button
                                  onClick={() => {
                                    if (!isCoreAdmin) {
                                      toast.error('Only core admin can edit other admins');
                                      return;
                                    }
                                    setEditingAdmin(userData);
                                    setShowAddAdminForm(false);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-purple-600 hover:bg-purple-50"
                                  disabled={!isCoreAdmin}
                                >
                                  <Edit2 size={16} />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteAdmin(userData)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                  disabled={!isCoreAdmin}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {!isCoreAdmin && (
              <Card className="mt-6 bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Only the core admin (admin@hydrix.com) can add, edit, or remove other administrators.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
  );
}