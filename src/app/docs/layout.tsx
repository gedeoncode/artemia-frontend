
// app/docs/layout.tsx
import { ThemeProvider } from "next-themes";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

    <div className="flex flex-col min-h-screen bg-background">
{children}
    </div>
    </ThemeProvider>
  );
}

