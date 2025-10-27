import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Save, 
  Download,
  Search,
  Filter,
  Shield,
  UserCog,
  HelpCircle,
  Eye,
  Edit3,
  Trash,
  Settings,
  BarChart3,
  Users,
  FileText,
  Cpu
} from 'lucide-react';

const Roles = () => {
  // Mock data for built-in roles
  const initialRoles = [
    {
      id: 1,
      name: 'Admin',
      icon: Shield,
      description: 'Full system control with unrestricted access to all features and settings',
      permissions: {
        posts: ['view', 'edit', 'delete', 'manage'],
        users: ['view', 'edit', 'delete', 'manage'],
        reports: ['view', 'edit', 'delete', 'manage'],
        analytics: ['view', 'edit', 'delete', 'manage'],
        settings: ['view', 'edit', 'delete', 'manage'],
        aiConfig: ['view', 'edit', 'delete', 'manage']
      },
      isCustom: false
    },
    {
      id: 2,
      name: 'Moderator',
      icon: UserCog,
      description: 'Content review and user management with limited administrative access',
      permissions: {
        posts: ['view', 'edit', 'delete', 'manage'],
        users: ['view', 'edit'],
        reports: ['view', 'edit', 'manage'],
        analytics: ['view'],
        settings: ['view'],
        aiConfig: ['view']
      },
      isCustom: false
    },
    {
      id: 3,
      name: 'Support',
      icon: HelpCircle,
      description: 'Handles user queries and reports with basic viewing permissions',
      permissions: {
        posts: ['view'],
        users: ['view'],
        reports: ['view', 'edit'],
        analytics: ['view'],
        settings: ['view'],
        aiConfig: ['view']
      },
      isCustom: false
    }
  ];

  // Modules and permissions configuration
  const modules = [
    { key: 'posts', label: 'Posts', icon: FileText },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'aiConfig', label: 'AI Config', icon: Cpu }
  ];

  const permissionTypes = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit', icon: Edit3 },
    { key: 'delete', label: 'Delete', icon: Trash },
    { key: 'manage', label: 'Manage', icon: Settings }
  ];

  // State management
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(initialRoles[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    baseRole: null,
    permissions: {
      posts: [],
      users: [],
      reports: [],
      analytics: [],
      settings: [],
      aiConfig: []
    }
  });

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle permission toggle in matrix
  const togglePermission = (moduleKey, permission) => {
    if (!selectedRole.isCustom) return; // Only allow editing custom roles
    
    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole.id) {
        const currentPermissions = role.permissions[moduleKey] || [];
        const updatedPermissions = currentPermissions.includes(permission)
          ? currentPermissions.filter(p => p !== permission)
          : [...currentPermissions, permission];
        
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [moduleKey]: updatedPermissions
          }
        };
      }
      return role;
    });
    
    setRoles(updatedRoles);
    setSelectedRole(updatedRoles.find(role => role.id === selectedRole.id));
  };

  // Handle new role creation
  const handleCreateRole = () => {
    if (!newRole.name.trim()) return;
    
    const role = {
      id: Date.now(),
      name: newRole.name,
      icon: UserCog,
      description: newRole.description,
      permissions: newRole.permissions,
      isCustom: true
    };
    
    setRoles([...roles, role]);
    setSelectedRole(role);
    setShowCreateModal(false);
    setNewRole({
      name: '',
      description: '',
      baseRole: null,
      permissions: {
        posts: [],
        users: [],
        reports: [],
        analytics: [],
        settings: [],
        aiConfig: []
      }
    });
  };

  // Clone existing role
  const handleCloneRole = (role) => {
    const clonedRole = {
      ...role,
      id: Date.now(),
      name: `${role.name} Copy`,
      isCustom: true
    };
    
    setRoles([...roles, clonedRole]);
  };

  // Delete role
  const handleDeleteRole = (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    setRoles(roles.filter(role => role.id !== roleId));
    if (selectedRole.id === roleId) {
      setSelectedRole(roles[0]);
    }
  };

  // Export roles configuration
  const handleExport = () => {
    const dataStr = JSON.stringify(roles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roles-permissions-backup.json';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Roles & Permissions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage user roles and access permissions across the platform
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Add Role
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search roles by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Role List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Roles
          </h2>
          {filteredRoles.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                  selectedRole.id === role.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <IconComponent size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  {role.isCustom && (
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                      Custom
                    </span>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloneRole(role);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    title="Clone Role"
                  >
                    <Copy size={16} />
                  </button>
                  {role.isCustom && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality would go here
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Edit Role"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column - Permission Matrix and Role Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              {selectedRole.icon && (
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <selectedRole.icon size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedRole.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedRole.description}
                </p>
              </div>
            </div>
            
            {/* Quick Permissions Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {modules.map((module) => {
                const modulePermissions = selectedRole.permissions[module.key] || [];
                const ModuleIcon = module.icon;
                return (
                  <div key={module.key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <ModuleIcon size={18} className="text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {module.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {modulePermissions.length} permissions
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Permission Matrix
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Configure access permissions for {selectedRole.name}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                      Module
                    </th>
                    {permissionTypes.map((perm) => (
                      <th key={perm.key} className="text-center p-4 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center justify-center gap-2">
                          <perm.icon size={16} />
                          {perm.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module) => {
                    const ModuleIcon = module.icon;
                    return (
                      <tr key={module.key} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <ModuleIcon size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {module.label}
                            </span>
                          </div>
                        </td>
                        {permissionTypes.map((perm) => {
                          const hasPermission = selectedRole.permissions[module.key]?.includes(perm.key);
                          return (
                            <td key={perm.key} className="p-4 text-center">
                              <div className="flex justify-center">
                                <input
                                  type="checkbox"
                                  checked={hasPermission}
                                  onChange={() => togglePermission(module.key, perm.key)}
                                  disabled={!selectedRole.isCustom}
                                  className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${
                                    hasPermission
                                      ? 'bg-blue-600 border-blue-600'
                                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                  } ${
                                    !selectedRole.isCustom ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {selectedRole.isCustom && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Role
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Enter role name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe the role's purpose and responsibilities..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Permissions
                </label>
                <div className="space-y-3">
                  {modules.map((module) => {
                    const ModuleIcon = module.icon;
                    return (
                      <div key={module.key} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <ModuleIcon size={18} className="text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {module.label}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          {permissionTypes.map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newRole.permissions[module.key].includes(perm.key)}
                                onChange={(e) => {
                                  const updatedPermissions = e.target.checked
                                    ? [...newRole.permissions[module.key], perm.key]
                                    : newRole.permissions[module.key].filter(p => p !== perm.key);
                                  
                                  setNewRole({
                                    ...newRole,
                                    permissions: {
                                      ...newRole.permissions,
                                      [module.key]: updatedPermissions
                                    }
                                  });
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {perm.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={!newRole.name.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;