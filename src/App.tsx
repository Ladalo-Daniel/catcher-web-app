import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import Index from "./pages/Index";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MyItems from "./pages/MyItems";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";

// Layout components
import { NavBar } from "./components/nav-bar";
import { Footer } from "./components/footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              {/* <div className=" self-center text-4xl items-center p-9 animate-pulse">Loading...</div> */}
              <NavBar />
              <main className="flex-1 pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/my-items" element={<MyItems />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
