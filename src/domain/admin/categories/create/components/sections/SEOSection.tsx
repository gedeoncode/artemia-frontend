'use client';

import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input, Textarea, Label } from '@/components/ui/';

import { Section } from '../components/Section';
import { SlugInput } from '../components/SlugInput';

export function SEOSection() {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');
  
  const metaTitleChars = metaTitle?.length || 0;
  const metaDescChars = metaDescription?.length || 0;
  
  return (
    <Section
      title="SEO & URL"
      description="Control how this category appears in search engines"
      icon={<Search className="w-4 h-4" />}
      collapsible={true}
      defaultExpanded={true}
    >
      {/* Slug Input - Custom component */}
      <SlugInput
        name="slug"
        label="URL Slug"
        placeholder="e.g., electronics, clothing"
        autoGenerateFromName={true}
      />
      
      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input
          id="metaTitle"
          placeholder="SEO title (optional)"
          {...register('metaTitle')}
          maxLength={60}
        />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">
            Recommended: 50-60 characters for optimal display
          </span>
          <span className={metaTitleChars > 60 ? 'text-red-500' : 'text-gray-400'}>
            {metaTitleChars}/60
          </span>
        </div>
      </div>
      
      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          placeholder="Brief description for search results (optional)"
          rows={3}
          {...register('metaDescription')}
          maxLength={160}
        />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">
            Recommended: 150-160 characters for optimal display
          </span>
          <span className={metaDescChars > 160 ? 'text-red-500' : 'text-gray-400'}>
            {metaDescChars}/160
          </span>
        </div>
      </div>
      
      {/* URL Preview */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-500 mb-1">Search result preview:</p>
        <div className="space-y-1">
          <p className="text-blue-600 text-sm hover:underline cursor-pointer">
            {metaTitle || watch('name') || 'Category Name'} | Store Name
          </p>
          <p className="text-green-600 text-xs">
            https://artemia.com/category/{watch('slug') || 'category-slug'}
          </p>
          <p className="text-gray-600 text-xs">
            {metaDescription || watch('description') || 'No description provided'}
          </p>
        </div>
      </div>
    </Section>
  );
}