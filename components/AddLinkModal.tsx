'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (link: { brandId: number; categoryId: number; title: string; url: string; description: string }) => void;
  brands: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  selectedBrandId?: number;
}

export default function AddLinkModal({ isOpen, onClose, onAdd, brands, categories, selectedBrandId }: AddLinkModalProps) {
  const [brandId, setBrandId] = useState(selectedBrandId || 0);
  const [categoryId, setCategoryId] = useState(0);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedBrandId) setBrandId(selectedBrandId);
  }, [selectedBrandId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandId && categoryId && title && url) {
      onAdd({ brandId, categoryId, title, url, description });
      setTitle('');
      setUrl('');
      setDescription('');
      setCategoryId(0);
      if (!selectedBrandId) setBrandId(0);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Link">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., B2B Portal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of this link"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Link
          </button>
        </div>
      </form>
    </Modal>
  );
}
