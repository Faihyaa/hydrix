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
  Crown,
  Loader,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { logActivity } from '../utils/activityLogger';
import { db } from '../../lib/firebase'; // ✅ Your Firebase config
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  where
} from 'firebase/firestore';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'User' | 'Admin'>('User');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<UserData | null>(null);
  const [searchUser, setSearchUser] = useState('');
  const [searchAdmin, setSearchAdmin] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<UserData | null>(null);
  const [deleteType, setDeleteType] = useState<'user' | 'admin' | null>(null);
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

  const isCoreAdmin = user?.email === 'adminhydrix@gmail.com';

  useEffect(() => {
    if (user && user.role.toLowerCase() !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  // ✅ LOAD FROM FIRESTORE
  const loadUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      
      const firebaseUsers: UserData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
        name: doc.data().name,
        role: doc.data().role || 'User',
        notifications: doc.data().notifications || true
      }));

      // Add core admin separately
      const allUsers: UserData[] = [
        ...firebaseUsers
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users from database');
    } finally {
      setLoading(false);
    }
  };

  const regularUsers = users.filter(u => u.role === 'User').filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));
  const adminUsers = users.filter(u => u.role === 'Admin').filter(u => u.name.toLowerCase().includes(searchAdmin.toLowerCase()) || u.email.toLowerCase().includes(searchAdmin.toLowerCase())).sort((a, b) => {
    // Core admin always on top
    if (a.email === 'adminhydrix@gmail.com') return -1;
    if (b.email === 'adminhydrix@gmail.com') return 1;
    return 0;
  });

  // ✅ ADD USER TO FIRESTORE
  const handleAddUser = async () => {
    if (!userFormData.name || !userFormData.email || !userFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Check if email already exists
      const existingQuery = query(
        collection(db, 'users'),
        where('email', '==', userFormData.email)
      );
      const existingDocs = await getDocs(existingQuery);

      if (!existingDocs.empty) {
        toast.error('User with this email already exists');
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, 'users'), {
        email: userFormData.email,
        name: userFormData.name,
        password: userFormData.password, // ⚠️ TODO: Hash passwords in production!
        role: 'User',
        notifications: true,
        createdAt: new Date()
      });

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
      loadUsers(); // Refresh from Firestore
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  // ✅ ADD ADMIN TO FIRESTORE
  const handleAddAdmin = async () => {
    if (!isCoreAdmin) {
      toast.error('Only core admin can add new administrators');
      return;
    }

    if (!adminFormData.name || !adminFormData.email || !adminFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Check if email already exists
      const existingQuery = query(
        collection(db, 'users'),
        where('email', '==', adminFormData.email)
      );
      const existingDocs = await getDocs(existingQuery);

      if (!existingDocs.empty) {
        toast.error('User with this email already exists');
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, 'users'), {
        email: adminFormData.email,
        name: adminFormData.name,
        password: adminFormData.password, // ⚠️ TODO: Hash passwords in production!
        role: 'Admin',
        notifications: true,
        createdAt: new Date()
      });

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
      loadUsers(); // Refresh from Firestore
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin');
    }
  };

  // ✅ UPDATE USER IN FIRESTORE
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        name: editingUser.name
      });

      logActivity(
        user!.name,
        user!.email,
        'User updated',
        `Updated user: ${editingUser.name} (${editingUser.email})`,
        'system'
      );

      toast.success('User updated successfully');
      setEditingUser(null);
      loadUsers(); // Refresh from Firestore
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  // ✅ UPDATE ADMIN IN FIRESTORE
  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    if (!isCoreAdmin) {
      toast.error('Only core admin can update administrators');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', editingAdmin.id), {
        name: editingAdmin.name
      });

      logActivity(
        user!.name,
        user!.email,
        'Admin updated',
        `Updated admin: ${editingAdmin.name} (${editingAdmin.email})`,
        'system'
      );

      toast.success('Admin updated successfully');
      setEditingAdmin(null);
      loadUsers(); // Refresh from Firestore
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin');
    }
  };

  // ✅ DELETE USER FROM FIRESTORE
  const handleDeleteUser = async (userToDelete: UserData) => {
    try {
      await deleteDoc(doc(db, 'users', userToDelete.id));

      logActivity(
        user!.name,
        user!.email,
        'User removed',
        `Removed user: ${userToDelete.name} (${userToDelete.email})`,
        'system'
      );

      toast.success('User removed successfully');
      setDeleteConfirm(null);
      setDeleteType(null);
      loadUsers(); // Refresh from Firestore
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // ✅ DELETE ADMIN FROM FIRESTORE
  const handleDeleteAdmin = async (adminToDelete: UserData) => {
    if (adminToDelete.email === 'adminhydrix@gmail.com') {
      toast.error('Cannot delete core admin');
      return;
    }

    if (!isCoreAdmin) {
      toast.error('Only core admin can delete administrators');
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', adminToDelete.id));

      logActivity(
        user!.name,
        user!.email,
        'Admin removed',
        `Removed admin: ${adminToDelete.name} (${adminToDelete.email})`,
        'system'
      );

      toast.success('Admin removed successfully');
      setDeleteConfirm(null);
      setDeleteType(null);
      loadUsers(); // Refresh from Firestore
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Failed to delete admin');
    }
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
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? <Loader className="animate-spin" size={24} /> : regularUsers.length}
                </p>
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
                <p className="text-3xl font-bold text-purple-600">
                  {loading ? <Loader className="animate-spin" size={24} /> : adminUsers.length}
                </p>
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

          {/* Add New User Form */}
          {showAddUserForm && !editingUser && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Create a new user account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

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

                <div className="flex gap-3">
                  <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                    Add User
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddUserForm(false);
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

          {/* Floating Edit User Card */}
          {editingUser && (
            <div className="fixed inset-x-4 top-20 z-50 mx-auto w-full max-w-2xl rounded-2xl border border-blue-200 bg-white shadow-2xl ring-1 ring-black/5">
              <Card className="border-transparent shadow-none">
                <CardHeader className="border-b border-slate-200/70 px-6 py-4">
                  <CardTitle>Edit User</CardTitle>
                  <CardDescription>Update user information without scrolling.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-6 py-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="floating-user-name">Name</Label>
                      <Input
                        id="floating-user-name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floating-user-email">Email</Label>
                      <Input
                        id="floating-user-email"
                        type="email"
                        value={editingUser.email}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button
                      onClick={handleUpdateUser}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Update User
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingUser(null);
                      }}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
              {/* Search Users */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-10"
                />
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <Loader className="mx-auto animate-spin text-blue-600" size={48} />
                </div>
              ) : regularUsers.length === 0 ? (
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
                            <AlertDialog open={deleteConfirm?.id === userData.id && deleteType === 'user'} onOpenChange={(open) => {
                              if (!open) {
                                setDeleteConfirm(null);
                                setDeleteType(null);
                              }
                            }}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setDeleteConfirm(userData);
                                    setDeleteType('user');
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{userData.name}</strong> ({userData.email})? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-3 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(userData)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
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
              {/* Search Admins */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search admins by name or email..."
                  value={searchAdmin}
                  onChange={(e) => setSearchAdmin(e.target.value)}
                  className="pl-10"
                />
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <Loader className="mx-auto animate-spin text-purple-600" size={48} />
                </div>
              ) : (
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
                                {userData.email === 'adminhydrix@gmail.com' && (
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
                            {userData.email !== 'adminhydrix@gmail.com' && (
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
                                <AlertDialog open={deleteConfirm?.id === userData.id && deleteType === 'admin'} onOpenChange={(open) => {
                                  if (!open) {
                                    setDeleteConfirm(null);
                                    setDeleteType(null);
                                  }
                                }}>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        setDeleteConfirm(userData);
                                        setDeleteType('admin');
                                      }}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:bg-red-50"
                                      disabled={!isCoreAdmin}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Admin</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete <strong>{userData.name}</strong> ({userData.email})? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex gap-3 justify-end">
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteAdmin(userData)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {!isCoreAdmin && (
            <Card className="mt-6 bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Only the core admin (adminhydrix@gmail.com) can add, edit, or remove other administrators.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}