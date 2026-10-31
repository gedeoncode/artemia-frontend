// shared/components/error-view.tsx

import { Card, CardContent, Button } from "@/components/ui/";

type ErrorViewProps = {
  title: string;
  description: string;
  retry?: () => void;
};

export function ErrorView({ title, description, retry }: ErrorViewProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center px-6">
      <Card className="w-full max-w-md ">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <div className="w-16 h-16 mb-6 text-red-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold">{title}</h1>

          <p className="mt-2 text-sm text-muted-foreground">{description}</p>

         <div className="flex gap-3">

            <Button variant="outline" onClick={retry} className="mt-6">
              Try again
            </Button>
            <Button variant="primary" onClick={()=> window.location.reload()} className="mt-6">
             Reload page
            </Button>
         </div>
       
        </CardContent>
      </Card>
    </div>
  );
}
