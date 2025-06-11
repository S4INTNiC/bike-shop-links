'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import Modal from './Modal';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: number; name: string }[];
  onAdd: (name: string) => void;
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export default function ManageCategoriesModal({ 
  isOpen, 
  onClose, 
  categories, 
  onAdd, 
  onUpdate, 
  onDelete 
}: ManageCategoriesModalProps) {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAdd(newCategory.trim());
      setNewCategory('');
    }
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim());
      cancelEdit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <div className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New category name"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                {editingId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(cat.id, cat.name)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"? Links using this category will need to be updated.`)) {
                          onDelete(cat.id);
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
