// components/DatabaseStateModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Database, RefreshCw, Copy, Check } from 'lucide-react';
import Modal from './Modal';

interface DatabaseState {
  counts: {
    brands: number;
    categories: number;
    links: number;
  };
  sequences: Record<string, number>;
  schemas: {
    brands: any[];
    categories: any[];
    links: any[];
  };
  data: {
    brands: any[];
    categories: any[];
    links: any[];
  };
  timestamp: string;
}

interface DatabaseStateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatabaseStateModal({ isOpen, onClose }: DatabaseStateModalProps) {
  const [state, setState] = useState<DatabaseState | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'brands' | 'categories' | 'links'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchState = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/database-state');
      const data = await res.json();
      setState(data);
    } catch (error) {
      console.error('Failed to fetch database state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchState();
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    if (state) {
      navigator.clipboard.writeText(JSON.stringify(state, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!state) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Database State Viewer">
      <div className="space-y-4">
        {/* Header with refresh and copy buttons */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Last updated: {formatDate(state.timestamp)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={fetchState}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-4">
            {(['overview', 'brands', 'categories', 'links'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Row Counts */}
              <div>
                <h3 className="font-medium mb-2">Row Counts</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Brands:</span>
                    <span className="font-mono">{state.counts.brands}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-mono">{state.counts.categories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Links:</span>
                    <span className="font-mono">{state.counts.links}</span>
                  </div>
                </div>
              </div>

              {/* Auto-increment Sequences */}
              <div>
                <h3 className="font-medium mb-2">Auto-increment Values</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  {Object.entries(state.sequences).map(([table, value]) => (
                    <div key={table} className="flex justify-between">
                      <span>{table}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="space-y-2">
              {state.data.brands.map((brand) => (
                <div key={brand.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-mono text-sm">
                    <div>ID: {brand.id}</div>
                    <div>Name: {brand.name}</div>
                    <div className="text-gray-600">Created: {formatDate(brand.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-2">
              {state.data.categories.map((category) => (
                <div key={category.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-mono text-sm">
                    <div>ID: {category.id}</div>
                    <div>Name: {category.name}</div>
                    <div className="text-gray-600">Created: {formatDate(category.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-2">
              {state.data.links.map((link) => (
                <div key={link.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-mono text-sm space-y-1">
                    <div className="font-medium">ID: {link.id}</div>
                    <div>Title: {link.title}</div>
                    <div className="text-xs text-gray-600">URL: {link.url}</div>
                    <div>Brand ID: {link.brand_id}</div>
                    <div>Category ID: {link.category_id}</div>
                    <div>Clicks: {link.clicks}</div>
                    {link.description && <div className="text-gray-600">Desc: {link.description}</div>}
                    <div className="text-gray-600">Created: {formatDate(link.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}