import React, { useState, useMemo } from 'react';
import { Header } from '../components/common/Header';
import { TopStatStrip, TopStatItem } from '../components/common/TopStatStrip';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { User, UserStatus } from '../types';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Trash2,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  RotateCcw,
  CheckCircle,
  Plus,
} from 'lucide-react';

interface UsersPageProps {
  deletedOnly?: boolean;
  onMobileMenuToggle: () => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ deletedOnly = false, onMobileMenuToggle }) => {
  const { users, addUser, toggleUserVerification, deleteUser, restoreUser, addToast } = useStore();

  // Filters state matching Screenshot 5
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionDropdownOpenId, setActionDropdownOpenId] = useState<string | null>(null);

  // Form State
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCountry, setFormCountry] = useState('Pakistan');
  const [formStatus, setFormStatus] = useState<UserStatus>('Verified');

  // Filtered Users
  const visibleUsers = useMemo(() => {
    return users.filter((u) => {
      const isDelMatch = deletedOnly ? !!u.isDeleted : !u.isDeleted;
      if (!isDelMatch) return false;

      if (emailFilter && !u.email.toLowerCase().includes(emailFilter.toLowerCase())) return false;
      if (phoneFilter && !u.phone.includes(phoneFilter)) return false;
      if (countryFilter !== 'All' && u.country !== countryFilter) return false;
      if (usernameFilter && !u.username.toLowerCase().includes(usernameFilter.toLowerCase())) return false;
      if (firstNameFilter && !u.firstName.toLowerCase().includes(firstNameFilter.toLowerCase())) return false;
      if (lastNameFilter && !u.lastName.toLowerCase().includes(lastNameFilter.toLowerCase())) return false;
      if (verificationFilter !== 'All' && u.status !== verificationFilter) return false;

      return true;
    });
  }, [
    users,
    deletedOnly,
    emailFilter,
    phoneFilter,
    countryFilter,
    usernameFilter,
    firstNameFilter,
    lastNameFilter,
    verificationFilter,
  ]);

  // Statistics matching Screenshot 5:
  // Total: 18, Deleted: 12, Unverified: 6, Verified: 12, New This Week: 2
  const topStats: TopStatItem[] = [
    {
      id: 'total',
      label: 'Total Users',
      value: 18,
      icon: <Users className="w-4 h-4" />,
      color: 'orange',
    },
    {
      id: 'deleted',
      label: 'Deleted Users',
      value: 12,
      icon: <Trash2 className="w-4 h-4" />,
      color: 'red',
    },
    {
      id: 'unverified',
      label: 'Unverified Users',
      value: 6,
      icon: <ShieldAlert className="w-4 h-4" />,
      color: 'yellow',
    },
    {
      id: 'verified',
      label: 'Verified Users',
      value: 12,
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'green',
    },
    {
      id: 'new',
      label: 'New This Week',
      value: 2,
      icon: <UserPlus className="w-4 h-4" />,
      color: 'blue',
    },
  ];

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim()) {
      addToast('error', 'Email is required');
      return;
    }

    addUser({
      firstName: formFirstName,
      lastName: formLastName,
      username: formUsername || formEmail.split('@')[0],
      email: formEmail,
      phone: formPhone || '—',
      country: formCountry,
      status: formStatus,
    });

    setIsAddModalOpen(false);
  };

  const resetFilters = () => {
    setEmailFilter('');
    setPhoneFilter('');
    setCountryFilter('All');
    setUsernameFilter('');
    setFirstNameFilter('');
    setLastNameFilter('');
    setVerificationFilter('All');
    setFromDateFilter('');
    setToDateFilter('');
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Users' },
          { label: deletedOnly ? 'Deleted' : 'All Users' },
        ]}
        title={deletedOnly ? 'Deleted Users Archive' : 'All Users'}
        subtitle={
          deletedOnly
            ? 'View archived customer accounts'
            : 'Manage platform users and accounts'
        }
        actionButton={
          !deletedOnly && (
            <button
              id="create-user-btn"
              type="button"
              onClick={() => {
                setFormFirstName('');
                setFormLastName('');
                setFormUsername('');
                setFormEmail('');
                setFormPhone('');
                setFormCountry('Pakistan');
                setFormStatus('Verified');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create User</span>
            </button>
          )
        }
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Top 5 Metric Cards matching Bento Strip */}
      {!deletedOnly && <TopStatStrip items={topStats} />}

      {/* Comprehensive Filter Bar matching Bento Grid */}
      <FilterBar onReset={resetFilters}>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</label>
          <input
            type="text"
            placeholder="Filter by email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</label>
          <input
            type="text"
            placeholder="Filter by phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Country</label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">All countries</option>
            <option value="Pakistan">Pakistan</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="UAE">UAE</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Username</label>
          <input
            type="text"
            placeholder="Filter by username"
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">First Name</label>
          <input
            type="text"
            placeholder="Filter by first name"
            value={firstNameFilter}
            onChange={(e) => setFirstNameFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Last Name</label>
          <input
            type="text"
            placeholder="Filter by last name"
            value={lastNameFilter}
            onChange={(e) => setLastNameFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Verification</label>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">Any status</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">From Date</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            value={fromDateFilter}
            onChange={(e) => setFromDateFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
          />
        </div>
      </FilterBar>

      {/* Users Table - Bento Container */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="py-3.5 pl-5">Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                    <p className="text-sm">No users found</p>
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user) => {
                  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.username;
                  const initial = (user.firstName[0] || user.email[0] || 'U').toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Name with initial avatar */}
                      <td className="py-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-zinc-200">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                              {fullName}
                            </div>
                            <div className="text-[11px] text-zinc-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-zinc-400">{user.phone}</td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={user.status} type="user" />
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        {user.joinedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-5 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActionDropdownOpenId(
                                actionDropdownOpenId === user.id ? null : user.id
                              )
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <span>Actions</span>
                            <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                          </button>

                          {actionDropdownOpenId === user.id && (
                            <div className="absolute right-5 mt-1 w-40 rounded-xl bg-[#141414] border border-white/[0.1] shadow-2xl py-1 z-30 backdrop-blur-md">
                              {!deletedOnly ? (
                                <>
                                  <button
                                    onClick={() => {
                                      toggleUserVerification(user.id);
                                      setActionDropdownOpenId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>
                                      {user.status === 'Verified' ? 'Mark Unverified' : 'Mark Verified'}
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteConfirmId(user.id);
                                      setActionDropdownOpenId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    restoreUser(user.id);
                                    setActionDropdownOpenId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-left text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Restore User</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New User Account"
        subtitle="Provision customer or staff account details"
        maxWidth="md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
                placeholder="e.g. Asad"
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
                placeholder="e.g. Qadri"
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Country</label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="UAE">UAE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as UserStatus)}
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.05] rounded-xl border border-white/[0.08]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteUser(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete User"
        message="Are you sure you want to delete this user? The account will be deactivated and placed in the deleted archive."
      />
    </div>
  );
};
