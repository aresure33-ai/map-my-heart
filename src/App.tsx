import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LoveTestProvider } from "@/contexts/LoveTestContext";

// Lazy load pages to reduce initial CSS bundle
const Index = lazy(() => import("./pages/Index"));
const TestPage = lazy(() => import("./pages/TestPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-primary text-xl">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <LoveTestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/result" element={<ResultPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </LoveTestProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
