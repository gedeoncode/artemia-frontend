'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Folder, FolderOpen, Search } from 'lucide-react';
import { Input, ScrollArea } from '@/components/ui/';
import { cn } from '@/lib/utils';

interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  children?: CategoryNode[];
}

interface HierarchySelectorProps {
  categories: CategoryNode[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
}

export function HierarchySelector({ categories, value, onChange, disabled }: HierarchySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filteredCategories, setFilteredCategories] = useState<CategoryNode[]>(categories);
  
  // Build tree structure
  const buildTree = (items: CategoryNode[]): CategoryNode[] => {
    const itemMap = new Map<string, CategoryNode>();
    const tree: CategoryNode[] = [];
    
    items.forEach(item => {
      itemMap.set(item._id, { ...item, children: [] });
    });
    
    items.forEach(item => {
      const node = itemMap.get(item._id);
      if (node && item.parent && itemMap.has(item.parent)) {
        const parent = itemMap.get(item.parent);
        parent?.children?.push(node);
      } else if (node) {
        tree.push(node);
      }
    });
    
    return tree;
  };
  
  // Filter categories by search term
useEffect(() => {
  if (!searchTerm) {
    setFilteredCategories(categories);
    return;
  }

  const expanded = new Set<string>();

  const filterCategories = (items: CategoryNode[]): CategoryNode[] => {
    return items.reduce<CategoryNode[]>((acc, item) => {
      const matches = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const children = filterCategories(item.children || []);

      if (matches || children.length > 0) {
        acc.push({
          ...item,
          children,
        });

        if (matches && item.children?.length) {
          expanded.add(item._id);
        }
      }

      return acc;
    }, []);
  };

  const filtered = filterCategories(categories);

  setFilteredCategories(filtered);
  setExpandedNodes(expanded);

}, [searchTerm, categories]);
  
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };
  
  const renderTreeNode = (node: CategoryNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node._id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = value === node._id;
    
    return (
      <div key={node._id}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
            "hover:bg-gray-100",
            isSelected && "bg-blue-50 hover:bg-blue-100",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => !disabled && onChange?.(node._id)}
          role="option"
          aria-selected={isSelected}
        >
          {hasChildren && (
            <button
              type="button"
              className="p-0.5 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node._id);
              }}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform",
                isExpanded && "rotate-90"
              )} />
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-gray-400" />
          ) : (
            <Folder className="w-4 h-4 text-gray-400" />
          )}
          
          <span className={cn(
            "text-sm",
            isSelected && "font-medium text-blue-700"
          )}>
            {node.name}
          </span>
          
          {isSelected && (
            <span className="text-xs text-blue-600 ml-auto">Selected</span>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {node.children?.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const tree = buildTree(filteredCategories);
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          disabled={disabled}
        />
      </div>
      
      <ScrollArea className="h-[300px] border rounded-md p-2">
        {tree.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No categories available
          </div>
        ) : (
          <div className="space-y-0.5">
            {/* Root option */}
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                "hover:bg-gray-100",
                value === null && "bg-blue-50 hover:bg-blue-100",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onChange?.(null)}
              role="option"
              aria-selected={value === null}
            >
              <Folder className="w-4 h-4 text-gray-400" />
              <span className={cn(
                "text-sm",
                value === null && "font-medium text-blue-700"
              )}>
                No Parent (Top-level)
              </span>
              {value === null && (
                <span className="text-xs text-blue-600 ml-auto">Selected</span>
              )}
            </div>
            
            {tree.map(node => renderTreeNode(node))}
          </div>
        )}
      </ScrollArea>
      
      <p className="text-xs text-gray-500">
        Select a parent category to create a nested hierarchy
      </p>
    </div>
  );
}