'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, MousePointer, Package, Link, Tag, Trash2, Edit2, Settings, RotateCcw, Database } from 'lucide-react';
import AddBrandModal from '@/components/AddBrandModal';
import AddLinkModal from '@/components/AddLinkModal';
import EditLinkModal from '@/components/EditLinkModal';
import ManageCategoriesModal from '@/components/ManageCategoriesModal';
import DatabaseStateModal from '@/components/DatabaseStateModal';

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface LinkData {
  id: number;
  brand_id: number;
  category_id: number;
  title: string;
  url: string;
  description: string | null;
  clicks: number;
  brand_name: string;
  category_name: string;
}

interface EditableLink {
  id: number;
  brandId: number;
  categoryId: number;
  title: string;
  url: string;
  description: string;
}

export default function Home() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isEditLinkModalOpen, setIsEditLinkModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();
  const [editingLink, setEditingLink] = useState<EditableLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isDatabaseStateModalOpen, setIsDatabaseStateModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchBrands(), fetchCategories(), fetchLinks()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    }
  };

  const handleResetDatabase = async () => {
    const confirmed = confirm(
      'Are you sure you want to reset the database?\n\n' +
      'This will:\n' +
      '• Delete all current brands, categories, and links\n' +
      '• Restore the original sample data\n\n' +
      'This action cannot be undone!'
    );
    
    if (!confirmed) return;
    
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset-database', { method: 'POST' });
      if (res.ok) {
        // Refresh all data
        await Promise.all([fetchBrands(), fetchCategories(), fetchLinks()]);
        alert('Database has been reset to initial state!');
      } else {
        alert('Failed to reset database. Please try again.');
      }
    } catch (error) {
      console.error('Failed to reset database:', error);
      alert('Failed to reset database. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleAddBrand = async (name: string) => {
    await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchBrands();
  };

  const handleDeleteBrand = async (id: number) => {
    if (confirm('Delete this brand and all its links?')) {
      await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      fetchBrands();
      fetchLinks();
    }
  };

  const handleAddLink = async (link: { brandId: number; categoryId: number; title: string; url: string; description: string }) => {
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link)
    });
    fetchLinks();
  };

  const handleUpdateLink = async (link: EditableLink) => {
    await fetch(`/api/links/${link.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link)
    });
    fetchLinks();
  };

  const handleDeleteLink = async (id: number) => {
    if (confirm('Delete this link?')) {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      fetchLinks();
    }
  };

  const handleLinkClick = async (id: number) => {
    await fetch(`/api/links/${id}`, { method: 'PATCH' });
    fetchLinks();
  };

  const handleAddCategory = async (name: string) => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchCategories();
  };

  const handleUpdateCategory = async (id: number, name: string) => {
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchCategories();
    fetchLinks();
  };

  const handleDeleteCategory = async (id: number) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
    fetchLinks();
  };

  const openAddLinkModal = (brandId?: number) => {
    setSelectedBrandId(brandId);
    setIsAddLinkModalOpen(true);
  };

  const openEditLinkModal = (link: LinkData) => {
    setEditingLink({
      id: link.id,
      brandId: link.brand_id,
      categoryId: link.category_id,
      title: link.title,
      url: link.url,
      description: link.description || ''
    });
    setIsEditLinkModalOpen(true);
  };

  const filteredLinks = links.filter(link => {
    const query = searchQuery.toLowerCase();
    return (
      link.brand_name.toLowerCase().includes(query) ||
      link.title.toLowerCase().includes(query) ||
      link.description?.toLowerCase().includes(query) ||
      link.category_name.toLowerCase().includes(query)
    );
  });

  const groupedLinks = brands.map(brand => ({
    brand,
    links: filteredLinks.filter(link => link.brand_id === brand.id)
  }));

  const stats = {
    totalBrands: brands.length,
    totalLinks: links.length,
    topClicked: [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your bike shop links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">🚴 Bike Shop Link Manager</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDatabaseStateModalOpen(true)}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors flex items-center gap-2"
                title="View database state"
              >
                <Database className="w-4 h-4" />
                View DB
              </button>
              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                title="Reset database to initial state"
              >
                <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                {isResetting ? 'Resetting...' : 'Reset DB'}
              </button>
              <button
                onClick={() => setIsCategoriesModalOpen(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Categories
              </button>
              <button
                onClick={() => setIsAddBrandModalOpen(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Brand
              </button>
              <button
                onClick={() => openAddLinkModal()}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search brands, links, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Package className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Brands</p>
                <p className="text-2xl font-bold">{stats.totalBrands}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Link className="w-10 h-10 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Links</p>
                <p className="text-2xl font-bold">{stats.totalLinks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <MousePointer className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-gray-600 text-sm mb-2">Top Clicked</p>
                <div className="space-y-1">
                  {stats.topClicked.slice(0, 3).map(link => (
                    <div key={link.id} className="text-xs text-gray-600">
                      {link.title} ({link.clicks} clicks)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {groupedLinks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No links found matching your search.' : 'No brands or links yet. Add your first brand to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedLinks.map(({ brand, links }) => (
              <div key={brand.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{brand.name}</h2>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openAddLinkModal(brand.id)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="Add link to this brand"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="p-1.5 hover:bg-red-100 rounded transition-colors"
                      title="Delete brand"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {links.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">No links for this brand yet.</div>
                  ) : (
                    links.map(link => (
                      <div key={link.id} className="group">
                        <div className="flex items-start justify-between">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleLinkClick(link.id)}
                            className="flex-1 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-600 hover:text-blue-700">
                                {link.title}
                              </span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                              {link.clicks > 0 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                  {link.clicks}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Tag className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{link.category_name}</span>
                            </div>
                            {link.description && (
                              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                            )}
                          </a>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditLinkModal(link)}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Edit link"
                            >
                              <Edit2 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1.5 hover:bg-red-100 rounded transition-colors"
                              title="Delete link"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddBrandModal
        isOpen={isAddBrandModalOpen}
        onClose={() => setIsAddBrandModalOpen(false)}
        onAdd={handleAddBrand}
      />
      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => {
          setIsAddLinkModalOpen(false);
          setSelectedBrandId(undefined);
        }}
        onAdd={handleAddLink}
        brands={brands}
        categories={categories}
        selectedBrandId={selectedBrandId}
      />
      <EditLinkModal
        isOpen={isEditLinkModalOpen}
        onClose={() => {
          setIsEditLinkModalOpen(false);
          setEditingLink(null);
        }}
        onUpdate={handleUpdateLink}
        link={editingLink}
        brands={brands}
        categories={categories}
      />
      <ManageCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        onAdd={handleAddCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />
      <DatabaseStateModal
        isOpen={isDatabaseStateModalOpen}
        onClose={() => setIsDatabaseStateModalOpen(false)}
      />
    </div>
  );
}