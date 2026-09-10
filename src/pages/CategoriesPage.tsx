import React, { useState, useMemo } from 'react';
import { Header } from '../components/common/Header';
import { TopStatStrip, TopStatItem } from '../components/common/TopStatStrip';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Trash2,
  Box,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  RotateCcw,
  FolderTree,
} from 'lucide-react';

interface CategoriesPageProps {
  deletedOnly?: boolean;
  onMobileMenuToggle: () => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ deletedOnly = false, onMobileMenuToggle }) => {
  const { categories, addCategory, updateCategory, deleteCategory, restoreCategory, addToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrderFilter, setSortOrderFilter] = useState('Default');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionDropdownOpenId, setActionDropdownOpenId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formParent, setFormParent] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formSortOrder, setFormSortOrder] = useState('1');

  // Filtered categories
  const visibleCategories = useMemo(() => {
    return categories
      .filter((c) => {
        const isDelMatch = deletedOnly ? !!c.isDeleted : !c.isDeleted;
        if (!isDelMatch) return false;

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!c.name.toLowerCase().includes(term) && !c.description.toLowerCase().includes(term)) {
            return false;
          }
        }

        if (statusFilter !== 'All' && c.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrderFilter === 'Name') return a.name.localeCompare(b.name);
        if (sortOrderFilter === 'Products') return b.productsCount - a.productsCount;
        return a.sortOrder - b.sortOrder;
      });
  }, [categories, deletedOnly, searchTerm, statusFilter, sortOrderFilter]);

  // Statistics
  const activeCats = categories.filter((c) => !c.isDeleted);
  const totalCount = activeCats.length;
  const activeCount = activeCats.filter((c) => c.status === 'Active').length;
  const inactiveCount = activeCats.filter((c) => c.status === 'Inactive').length;
  const deletedCount = categories.filter((c) => c.isDeleted).length;
  const withProductsCount = activeCats.filter((c) => c.productsCount > 0).length;

  const topStats: TopStatItem[] = [
    {
      id: 'total',
      label: 'Total Categories',
      value: totalCount,
      icon: <LayoutGrid className="w-4 h-4" />,
      color: 'orange',
    },
    {
      id: 'active',
      label: 'Active',
      value: activeCount,
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'green',
    },
    {
      id: 'inactive',
      label: 'Inactive',
      value: inactiveCount,
      icon: <XCircle className="w-4 h-4" />,
      color: 'yellow',
    },
    {
      id: 'deleted',
      label: 'Deleted',
      value: deletedCount,
      icon: <Trash2 className="w-4 h-4" />,
      color: 'red',
    },
    {
      id: 'withProducts',
      label: 'With Products',
      value: withProductsCount,
      icon: <Box className="w-4 h-4" />,
      color: 'blue',
    },
  ];

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormParent('');
    setFormStatus('Active');
    setFormSortOrder((categories.length + 1).toString());
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description);
    setFormParent(category.parent || '');
    setFormStatus(category.status);
    setFormSortOrder(category.sortOrder.toString());
    setIsAddModalOpen(true);
    setActionDropdownOpenId(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('error', 'Category name is required');
      return;
    }

    const orderNum = parseInt(formSortOrder, 10) || 1;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName,
        description: formDescription,
        parent: formParent || undefined,
        status: formStatus,
        sortOrder: orderNum,
      });
    } else {
      addCategory({
        name: formName,
        description: formDescription,
        parent: formParent || undefined,
        status: formStatus,
        sortOrder: orderNum,
      });
    }

    setIsAddModalOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortOrderFilter('Default');
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Categories' },
          { label: deletedOnly ? 'Deleted' : 'All' },
        ]}
        title="Categories"
        subtitle="Manage product categories and subcategories"
        actionButton={
          !deletedOnly && (
            <button
              id="add-category-btn"
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )
        }
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Top Metric Cards Strip matching Bento Grid */}
      {!deletedOnly && <TopStatStrip items={topStats} />}

      {/* Filter Bar */}
      <FilterBar onReset={resetFilters}>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Search categories...</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or desc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">Any status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Parent</label>
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">All parents</option>
            <option value="None">None (Root)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Sort Order</label>
          <select
            value={sortOrderFilter}
            onChange={(e) => setSortOrderFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="Default">Default (Index)</option>
            <option value="Name">Name A-Z</option>
            <option value="Products">Most Products</option>
          </select>
        </div>
      </FilterBar>

      {/* Categories Table - Bento container */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="py-3.5 pl-5">Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Sort Order</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visibleCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    <LayoutGrid className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                    <p className="text-sm">No categories found matching your filter</p>
                  </td>
                </tr>
              ) : (
                visibleCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Name + Subtitle Description */}
                    <td className="py-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-white/[0.08] flex items-center justify-center text-zinc-300">
                          <FolderTree className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 max-w-md truncate">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cat.status} type="product" />
                    </td>

                    {/* Products Count */}
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      {cat.productsCount}
                    </td>

                    {/* Sort Order */}
                    <td className="py-3.5 px-4 text-zinc-400 font-mono">
                      {cat.sortOrder}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-5 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setActionDropdownOpenId(
                              actionDropdownOpenId === cat.id ? null : cat.id
                            )
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <span>Actions</span>
                          <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                        </button>

                        {actionDropdownOpenId === cat.id && (
                          <div className="absolute right-5 mt-1 w-36 rounded-xl bg-[#141414] border border-white/[0.1] shadow-2xl py-1 z-30 backdrop-blur-md">
                            {!deletedOnly ? (
                              <>
                                <button
                                  onClick={() => handleOpenEditModal(cat)}
                                  className="w-full px-3 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const nextStatus = cat.status === 'Active' ? 'Inactive' : 'Active';
                                    updateCategory(cat.id, { status: nextStatus });
                                    setActionDropdownOpenId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>Toggle Status</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmId(cat.id);
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
                                  restoreCategory(cat.id);
                                  setActionDropdownOpenId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-left text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        subtitle="Organize your store catalogue by collections and types"
        maxWidth="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Caps & Headwear"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief overview of what items belong here..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteCategory(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? It will be moved to the archive."
      />
    </div>
  );
};
