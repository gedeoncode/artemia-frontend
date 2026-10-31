'use client';

import { useFormContext } from 'react-hook-form';
import { Eye, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePreviewPanelProps {
  className?: string;
}

export function LivePreviewPanel({ className }: LivePreviewPanelProps) {
  const { watch } = useFormContext();
  
  const name = watch('name');
  const slug = watch('slug');
  const description = watch('description');
  const image = watch('image');
  const status = watch('status');
  const isFeatured = watch('isFeatured');
  const parent = watch('parent');
  
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className={cn("sticky top-24", className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
        </div>
        
        {/* Category Card Preview */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {image && (
            <div className="w-full h-32 bg-gray-100 overflow-hidden">
              <img
                src={image}
                alt={name || 'Category preview'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">
                {name || 'Category Name'}
              </h4>
              <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description || 'No description provided'}
            </p>
            
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Tag className="w-3 h-3" />
                <span>/{slug || 'category-slug'}</span>
              </div>
              
              {isFeatured && (
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-600">Featured</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-gray-700">Status Summary</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Status:</span>
              <span className={cn(
                "font-medium",
                status === 'active' ? "text-green-600" : 
                status === 'draft' ? "text-yellow-600" : "text-gray-600"
              )}>
                {getStatusLabel()}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Parent:</span>
              <span className="text-gray-700">
                {parent ? 'Has parent' : 'Top-level'}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">URL:</span>
              <span className="text-gray-700 font-mono truncate max-w-[150px]">
                /category/{slug || '...'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Validation Summary */}
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-900 mb-2">Validation</p>
          <div className="space-y-1 text-xs text-blue-800">
            <p>✓ All required fields will be validated</p>
            <p>✓ Slug must be unique</p>
            <p>✓ Featured categories need images</p>
          </div>
        </div>
      </div>
    </div>
  );
}