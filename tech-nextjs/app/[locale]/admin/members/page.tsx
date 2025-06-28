'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSuspendedUsers, getApprovedUsers, fetchMembers, getPendingUsers , deleteUser } from '@/services/context/UsersContext';
import { User } from '@/types/user';
import { useUser } from '@/services/hooks/useUser';
import { EyeIcon, EyeSlashIcon, TrashIcon, PencilSquareIcon, CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCheck, faTimes, faUser, faUserGraduate, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/services/context/AuthContext';


const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
  const { member, saveUser, approvedUser, suspendedUser, rejectedUser } = useUser();
  const router = useRouter();
  const t = useTranslations("admin");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [suspendedUsers, setSuspendedUsers] = useState<User[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'suspended' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showColumns, setShowColumns] = useState({
    userName: true,
    email: true,
    password: true,
    status: true,
    profile_image: true,
    role: true,
    phone: true,
    mainfield: true,
    loaction: true,
    National: true,    
    isexpert: true,
    isjobseek: true
  });

  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
    const { user } = useAuth();
    if (user && user.role !== 'admin') {
      if (typeof window !== 'undefined') {
        router.replace('/forbidden');
      }
      return null; // or a loader if you want
    }
  useEffect(() => {
    const loadUsers = async () => {
    if (!user || user.role !== 'admin') return;

      setLoading(true);
      try {
        const [all, approved, suspended, pending] = await Promise.all([
          fetchMembers(),
          getApprovedUsers(),
          getSuspendedUsers(),
          getPendingUsers()
        ]);
        
        setAllUsers(all);
        setApprovedUsers(approved);
        setSuspendedUsers(suspended);
        setPendingUsers(pending);

        const rejected = all.filter(user => user.status === 'rejected');
        setRejectedUsers(rejected);
        
        setError(null);
        setCurrentPage(1);
      } catch (err) {
        setError(t("error_loading_User"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  const filterUsers = (user: User[]) => {
    return user.filter(user => 
      user.National?.toLowerCase().includes(searchTerm.toLowerCase()) ||      
      user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||             
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||          
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||   
      user.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mainfield?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.status && user.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getCurrentUsers = () => {
    let filteredUsers: User[] = [];
    
    switch (activeTab) {
      case 'all': filteredUsers = filterUsers(allUsers); break;
      case 'pending': filteredUsers = filterUsers(pendingUsers); break;
      case 'approved': filteredUsers = filterUsers(approvedUsers); break;
      case 'suspended': filteredUsers = filterUsers(suspendedUsers); break;
      case 'rejected': filteredUsers = filterUsers(rejectedUsers); break;
      default: filteredUsers = filterUsers(allUsers);
    }

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      totalPages,
      totalItems: filteredUsers.length
    };
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === getCurrentUsers().users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(getCurrentUsers().users.map(user => user.id! ?? null));
    }
  };

  const refreshUserLists = async () => {
  try {
    const [all, approved, suspended, pending] = await Promise.all([
      fetchMembers(),
      getApprovedUsers(),
      getSuspendedUsers(),
      getPendingUsers()
    ]);
    
    setAllUsers(all);
    setApprovedUsers(approved);
    setSuspendedUsers(suspended);
    setPendingUsers(pending);
    setRejectedUsers(all.filter(user => user.status === 'rejected'));
  } catch (err) {
    setError(t("error_loading_User"));
    console.error(err);
  }
};

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleBulkAction = async (action: string) => {
    try {
      for (const userId of selectedUsers) {
        const user = allUsers.find(u => u.id === userId);
        if (user) {
          switch (action) {
            case 'approved':
              await approvedUser(user);
              break;
            case 'suspended':
              await suspendedUser(user);
              break;
            case 'rejected':
              await rejectedUser(user);
              break;
            case 'delete':
              if (confirm(t("confirm_delete_user"))) {
                await deleteUser(userId);
              }
              break;
          }
        }
      }
      
      // Refresh user data
      refreshUserLists();
    } catch (err) {
      setError(t("error_processing_action"));
      console.error(err);
    }
  };

  const renderPagination = (totalPages: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("previous")}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("next")}
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t("showing")} <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> {t("to")}{' '}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, getCurrentUsers().totalItems)}</span>{' '}
              {t("of")} <span className="font-medium">{getCurrentUsers().totalItems}</span> {t("results")}
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t("first")}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t("previous")}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t("next")}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t("last")}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersTable = (users: User[], totalItems: number) => {
    if (users.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <EyeSlashIcon className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t("no_users")}</h3>
          <p className="mt-1 text-sm text-gray-500">{t("try_search")}</p>
          <div className="mt-6">
            <Link
              href="/admin/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" />
              {t("new_user")}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-700">
                {selectedUsers.length} {t("selected")}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleBulkAction('approved')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <EyeIcon className="-ml-1 mr-1 h-4 w-4" />
                {t("approve")}
              </button>
              <button
                onClick={() => handleBulkAction('suspended')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <EyeSlashIcon className="-ml-1 mr-1 h-4 w-4" />
                {t("suspend")}
              </button>
              <button
                onClick={() => handleBulkAction('rejected')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XMarkIcon className="-ml-1 mr-1 h-4 w-4" />
                {t("rejected")}
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="-ml-1 mr-1 h-4 w-4" />
                {t("delete")}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                {showColumns.profile_image && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("image")}
                  </th>
                )}
                {showColumns.userName && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("username")}
                  </th>
                )}
                {showColumns.email && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("email")}
                  </th>
                )}    
                {showColumns.phone && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("phone")}
                  </th>
                )}
                {showColumns.role && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("role")}
                  </th>
                )}
                {showColumns.mainfield && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("main_field")}
                  </th>
                )}
                {showColumns.status && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("status")}
                  </th>
                )}
                {showColumns.National && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("national")}
                  </th>
                )}
                {showColumns.loaction && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("address")}
                  </th>
                )}
                {showColumns.isexpert && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("expert")}
                  </th>
                )}
                {showColumns.isjobseek && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("job_seek")}
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedUsers.includes(user.id!)}
                      onChange={() => toggleSelectUser(user.id!)}
                    />
                  </td>
                  
                  {showColumns.profile_image && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.profile_image ? (
                        <img 
                          src={`${API_URL}/storage/${user.profile_image}`}
                          alt="User" 
                          className="h-14 w-14 rounded object-cover" 
                        />
                      ) : (
                        <div className="h-14 w-14 rounded bg-gray-200 flex items-center justify-center">
                          {user.role === 'professional' && (
                            <FontAwesomeIcon icon={faUserTie} className="text-gray-500 text-xl" />
                          )}
                          {user.role === 'student' && (
                            <FontAwesomeIcon icon={faUserGraduate} className="text-gray-500 text-xl" />
                          )}
                          {user.role === 'company' && (
                            <FontAwesomeIcon icon={faBuilding} className="text-gray-500 text-xl" />
                          )}
                          {!['professional', 'student', 'company'].includes(user.role!) && (
                            <FontAwesomeIcon icon={faUser} className="text-gray-500 text-xl" />
                          )}
                        </div>
                      )}
                    </td>
                  )}
                  {showColumns.userName && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.name}</div>
                    </td>
                  )}
                  {showColumns.email && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.email}
                      </div>
                    </td>
                  )}
                  {showColumns.phone && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.phone}
                      </div>
                    </td>
                  )}
                  {showColumns.role && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.role}
                      </div>
                    </td>
                  )}
                  {showColumns.mainfield && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.mainfield}
                      </div>
                    </td>
                  )}
                  {showColumns.status && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t(user.status!)}
                      </span>
                    </td>
                  )}
                  {showColumns.National && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.National || "-"}</div>
                    </td>
                  )}
                  {showColumns.loaction && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.city} {user.country}</div>
                    </td>
                  )}
                  {showColumns.isexpert && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <FontAwesomeIcon
                            icon={user.isexpert ? faCheck : faTimes}
                            className={user.isexpert ? 'text-green-500' : 'text-red-500'}
                          />
                        </div>
                      </td>
                    )}
                    {showColumns.isjobseek && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <FontAwesomeIcon
                            icon={user.isjobseek ? faCheck : faTimes}
                            className={user.isjobseek ? 'text-green-500' : 'text-red-500'}
                          />
                        </div>
                      </td>
                    )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/admin/profile/${user.id ?? ''}`}
                        className="text-blue-600 hover:text-blue-900"
                        title={t("view")}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link 
                        href={`/admin/profile/${user.id}`}
                        className="text-gray-600 hover:text-gray-900"
                        title={t("edit")}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      {user.status === 'approved' ? (
                        <button
                          onClick={() => {suspendedUser(user);
                                           refreshUserLists();
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                          title={t("suspend")}
                        >
                          <EyeSlashIcon className="h-5 w-5" />
                        </button>
                      ) : (user.status === 'suspended' || user.status === 'pending') ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {approvedUser(user);refreshUserLists();}}
                            className="text-green-600 hover:text-green-900"
                            title={t("approve")}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {rejectedUser(user);refreshUserLists();}}
                            className="text-red-600 hover:text-red-900"
                            title={t("rejected")}
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : null}
                      <button
                        onClick={() => {
                          if (confirm(t("confirm_delete_user"))) {
                            deleteUser(user.id!);
                            refreshUserLists();
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title={t("delete")}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(Math.ceil(totalItems / ITEMS_PER_PAGE))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t("error")}!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const currentUsers = getCurrentUsers();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{t("users_dashboard")}</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t("search_users")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t("all_users")}
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {allUsers.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('pending');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t("pending")}
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingUsers.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('approved');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t("approved")}
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {approvedUsers.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('suspended');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'suspended' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t("suspended")}
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {suspendedUsers.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('rejected');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rejected' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t("rejected")}
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {rejectedUsers.length}
            </span>
          </button>
        </nav>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {renderUsersTable(currentUsers.users, currentUsers.totalItems)}
      </div>
    </div>
  );
}