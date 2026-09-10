import React, { useState, useMemo } from 'react';
import { Header } from '../components/common/Header';
import { TopStatStrip, TopStatItem } from '../components/common/TopStatStrip';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { AnimatedPrice } from '../components/common/AnimatedPrice';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { Product, ProductStatus } from '../types';
import {
  Package,
  CheckCircle2,
  EyeOff,
  AlertTriangle,
  Star,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  RotateCcw,
  Tag,
  Percent,
} from 'lucide-react';

interface ProductsPageProps {
  deletedOnly?: boolean;
  onMobileMenuToggle: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ deletedOnly = false, onMobileMenuToggle }) => {
  const { products, categories, addProduct, updateProduct, deleteProduct, restoreProduct, addToast } =
    useStore();
  const { currency, symbol, convertToBase, convertFromBase } = useCurrency();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('Any');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionDropdownOpenId, setActionDropdownOpenId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('T-Shirts');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80');
  const [formSellingPrice, setFormSellingPrice] = useState('35');
  const [formCostPrice, setFormCostPrice] = useState('18');
  const [formStock, setFormStock] = useState('50');
  const [formStatus, setFormStatus] = useState<ProductStatus>('Active');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTags, setFormTags] = useState('Streetwear, Casual');

  // Filtered Products
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      const isDeletedMatch = deletedOnly ? !!p.isDeleted : !p.isDeleted;
      if (!isDeletedMatch) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      if (categoryFilter !== 'All' && p.category !== categoryFilter) {
        return false;
      }

      if (featuredFilter === 'Featured' && !p.featured) return false;
      if (featuredFilter === 'Not Featured' && p.featured) return false;

      if (statusFilter !== 'All' && p.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [products, deletedOnly, searchTerm, categoryFilter, featuredFilter, statusFilter]);

  // Statistics
  const activeProducts = products.filter((p) => !p.isDeleted);
  const totalCount = activeProducts.length;
  const activeCount = activeProducts.filter((p) => p.status === 'Active').length;
  const inactiveCount = activeProducts.filter((p) => p.status === 'Inactive').length;
  const outOfStockCount = activeProducts.filter((p) => p.status === 'Out of Stock' || p.stock === 0).length;
  const featuredCount = activeProducts.filter((p) => p.featured).length;

  const topStats: TopStatItem[] = [
    {
      id: 'total',
      label: 'Total Products',
      value: totalCount,
      icon: <Package className="w-4 h-4" />,
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
      icon: <EyeOff className="w-4 h-4" />,
      color: 'zinc',
    },
    {
      id: 'stock',
      label: 'Out of Stock',
      value: outOfStockCount,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'red',
    },
    {
      id: 'featured',
      label: 'Featured',
      value: featuredCount,
      icon: <Star className="w-4 h-4" />,
      color: 'yellow',
    },
  ];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory(categories[0]?.name || 'T-Shirts');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80');
    // Pre-fill prices according to current currency
    setFormSellingPrice(currency === 'PKR' ? '3000' : '30');
    setFormCostPrice(currency === 'PKR' ? '1800' : '18');
    setFormStock('100');
    setFormStatus('Active');
    setFormFeatured(false);
    setFormTags('Streetwear, Casual');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormImage(product.image);

    // Convert stored USD base price to current currency for user editing
    const currentSelling = convertFromBase(product.sellingPrice);
    const currentCost = convertFromBase(product.costPrice);
    setFormSellingPrice(currency === 'PKR' ? Math.round(currentSelling).toString() : currentSelling.toFixed(2));
    setFormCostPrice(currency === 'PKR' ? Math.round(currentCost).toString() : currentCost.toFixed(2));

    setFormStock(product.stock.toString());
    setFormStatus(product.status);
    setFormFeatured(product.featured);
    setFormTags(product.tags.join(', '));
    setIsAddModalOpen(true);
    setActionDropdownOpenId(null);
  };

  // Handle Form Submit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('error', 'Product name is required');
      return;
    }

    const enteredSelling = parseFloat(formSellingPrice) || 0;
    const enteredCost = parseFloat(formCostPrice) || 0;
    const enteredStock = parseInt(formStock, 10) || 0;

    // Convert entered prices (in current selected currency) back to BASE USD
    const sellingUSD = convertToBase(enteredSelling);
    const costUSD = convertToBase(enteredCost);

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        sku: formSku,
        category: formCategory,
        description: formDescription,
        image: formImage,
        sellingPrice: sellingUSD,
        costPrice: costUSD,
        stock: enteredStock,
        status: formStatus,
        featured: formFeatured,
        tags: tagsArray,
      });
    } else {
      addProduct({
        name: formName,
        sku: formSku,
        category: formCategory,
        description: formDescription,
        image: formImage,
        sellingPrice: sellingUSD,
        costPrice: costUSD,
        stock: enteredStock,
        status: formStatus,
        featured: formFeatured,
        tags: tagsArray,
      });
    }

    setIsAddModalOpen(false);
  };

  // Live profit calculation inside modal
  const liveSelling = parseFloat(formSellingPrice) || 0;
  const liveCost = parseFloat(formCostPrice) || 0;
  const liveProfit = liveSelling - liveCost;
  const liveMargin = liveSelling > 0 ? ((liveProfit / liveSelling) * 100).toFixed(1) : '0.0';

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setFeaturedFilter('Any');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Products' },
          { label: deletedOnly ? 'Deleted' : 'All Products' },
        ]}
        title={deletedOnly ? 'Deleted Products Archive' : 'All Products'}
        subtitle={
          deletedOnly
            ? 'View and restore archived products'
            : 'Manage store products and inventory'
        }
        actionButton={
          !deletedOnly && (
            <button
              id="add-product-btn"
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )
        }
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Top 5 Metric Cards matching Bento Strip */}
      {!deletedOnly && <TopStatStrip items={topStats} />}

      {/* Filter Bar */}
      <FilterBar onReset={resetFilters}>
        {/* Search */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Featured</label>
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="Any">Any</option>
            <option value="Featured">Featured</option>
            <option value="Not Featured">Not Featured</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">Select status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </FilterBar>

      {/* Products Table - Bento Container */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="py-3.5 pl-5">Product</th>
                <th className="py-3.5 px-3">Selling Price</th>
                <th className="py-3.5 px-3">Cost Price</th>
                <th className="py-3.5 px-3">Profit</th>
                <th className="py-3.5 px-3">Stock</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Last Updated</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                    <p className="text-sm">No products found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => {
                  const profitUSD = product.sellingPrice - product.costPrice;
                  const marginPct =
                    product.sellingPrice > 0
                      ? ((profitUSD / product.sellingPrice) * 100).toFixed(0)
                      : '0';

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Product details */}
                      <td className="py-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover border border-white/[0.08] bg-zinc-900"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                                {product.name}
                              </span>
                              {product.featured && (
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-zinc-500">
                              {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-3 font-semibold text-white whitespace-nowrap">
                        <AnimatedPrice amountUSD={product.sellingPrice} />
                      </td>

                      {/* Cost Price */}
                      <td className="py-3.5 px-3 text-zinc-400 whitespace-nowrap">
                        <AnimatedPrice amountUSD={product.costPrice} />
                      </td>

                      {/* Profit */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="text-emerald-400 font-semibold">
                          <AnimatedPrice amountUSD={profitUSD} />
                        </div>
                        <div className="text-[10px] text-zinc-400 font-medium">
                          {marginPct}% margin
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-semibold ${
                            product.stock === 0
                              ? 'text-rose-400'
                              : product.stock < 20
                              ? 'text-amber-400'
                              : 'text-zinc-200'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={product.status} type="product" />
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-3 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {product.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-5 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActionDropdownOpenId(
                                actionDropdownOpenId === product.id ? null : product.id
                              )
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <span>Actions</span>
                            <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                          </button>

                          {actionDropdownOpenId === product.id && (
                            <div className="absolute right-5 mt-1 w-36 rounded-xl bg-[#141414] border border-white/[0.1] shadow-2xl py-1 z-30 backdrop-blur-md">
                              {!deletedOnly ? (
                                <>
                                  <button
                                    onClick={() => handleOpenEditModal(product)}
                                    className="w-full px-3 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const nextStatus: ProductStatus =
                                        product.status === 'Active' ? 'Inactive' : 'Active';
                                      updateProduct(product.id, { status: nextStatus });
                                      setActionDropdownOpenId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                                  >
                                    <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Toggle Status</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteConfirmId(product.id);
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
                                    restoreProduct(product.id);
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        subtitle="Manage product pricing, cost price, margins and stock level"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Teal Five-Panel Cap"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">SKU</label>
              <input
                type="text"
                placeholder="HAT-005"
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing Section (Currency Sensitive with Live Calculation) */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-[#181818] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Pricing & Profit Calculation</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold">
                    In {currency}
                  </span>
                </span>
                <span className="text-[11px] text-zinc-400">
                  Values stored in USD base, converted automatically
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Selling Price ({symbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(e.target.value)}
                    className="w-full bg-[#121212] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Cost Price ({symbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    className="w-full bg-[#121212] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              {/* Live Calculation Display as required by prompt section 17 */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                <div className="bg-[#121212] rounded-xl p-2.5 border border-white/[0.04]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Profit Per Unit
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      liveProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {symbol} {liveProfit.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#121212] rounded-xl p-2.5 border border-white/[0.04]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Profit Margin
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      parseFloat(liveMargin) >= 0 ? 'text-orange-400' : 'text-rose-400'
                    }`}
                  >
                    {liveMargin}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Product Image URL
              </label>
              <input
                type="url"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Product material, specs and highlights..."
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Tags & Featured */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                <span className="ml-2.5 text-xs font-medium text-zinc-300">
                  Featured on Home Store
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
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
              {editingProduct ? 'Save Changes' : 'Create Product'}
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
            deleteProduct(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product? It will be moved to the Deleted archive and can be restored later."
      />
    </div>
  );
};
