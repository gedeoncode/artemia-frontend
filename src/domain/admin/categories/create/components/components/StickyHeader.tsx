'use client';

import { ChevronLeft, 
  // Save, Loader2, CheckCircle, AlertCircle 

} from 'lucide-react';
import Link from 'next/link';
// import { Button, Badge} from '@/components/ui/';
// import { cn } from '@/lib/utils';
// import type { SaveStatus } from '../types/category.types';

interface StickyHeaderProps {
  title: string;
  // saveStatus: SaveStatus;
  // lastSaved: Date | null;
  // onSaveDraft: () => void;
  // isDirty: boolean;
}

export function StickyHeader({ title,  }: StickyHeaderProps) {
  // const getSaveIcon = () => {
  //   switch (saveStatus) {
  //     case 'saving':
  //       return <Loader2 className="w-4 h-4 animate-spin" />;
  //     case 'saved':
  //       return <CheckCircle className="w-4 h-4" />;
  //     case 'error':
  //       return <AlertCircle className="w-4 h-4" />;
  //     default:
  //       return <Save className="w-4 h-4" />;
  //   }
  // };
  
  // const getSaveText = () => {
  //   switch (saveStatus) {
  //     case 'saving':
  //       return 'Saving...';
  //     case 'saved':
  //       return 'Saved';
  //     case 'error':
  //       return 'Save failed';
  //     default:
  //       return 'Save draft';
  //   }
  // };
  
  // const getSaveColor = () => {
  //   switch (saveStatus) {
  //     case 'saved':
  //       return 'text-green-600';
  //     case 'error':
  //       return 'text-red-600';
  //     default:
  //       return 'text-gray-600';
  //   }
  // };
  
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/categories"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Back to categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-500">
                  Create a new product category with advanced settings
                </p>
                {/* {isDirty && (
                  <Badge variant="outline" className="text-xs">
                    Unsaved changes
                  </Badge>
                )} */}
              </div>
            </div>
          </div>
          
          {/* <div className="flex items-center gap-3"> */}
            {/* Auto-save status */}
            {/* {lastSaved && saveStatus === 'idle' && (
              <span className="text-xs text-gray-400">
                Last saved {lastSaved.toLocaleTimeString()}
              </span>
            )} */}
            
            {/* Manual save button */}
            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              disabled={saveStatus === 'saving' || !isDirty}
              className={cn("gap-2", getSaveColor())}
            >
              {getSaveIcon()}
              {getSaveText()}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}