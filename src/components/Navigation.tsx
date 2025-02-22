import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartPanel from "./CartPanel";
import SearchPanel from "./SearchPanel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { useEffect } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.split('-')[1]]: value
    }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Account created successfully!");
      setShowAuthDialog(false);
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google successfully!");
      setShowAuthDialog(false);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      setIsCartOpen(true);
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex flex-col items-start -space-y-1 pl-0">
                <span className="text-white font-medium tracking-wide text-base">SIAMTECH</span>
                <span className="text-gray-400 text-[0.65rem] font-light tracking-widest uppercase">online</span>
              </a>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/products" className="text-gray-300 hover:text-white transition-colors">
                Products
              </a>
              <a href="/warranty" className="text-gray-300 hover:text-white transition-colors">
                Warranty
              </a>
              <a href="/support" className="text-gray-300 hover:text-white transition-colors">
                Support
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
              <button 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogContent>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <DialogHeader>
                      <DialogTitle className="sm:text-center">Sign up to SIAMTECH</DialogTitle>
                      <DialogDescription className="sm:text-center">
                        Create an account to access your cart and manage orders
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <form onSubmit={handleEmailSignUp} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full name</Label>
                        <Input 
                          id="signup-name" 
                          placeholder="John Doe" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Sign up
                    </Button>
                  </form>

                  <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
                    <span className="text-xs text-gray-400">Or</span>
                  </div>

                  <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                    Continue with Google
                  </Button>

                  <p className="text-center text-xs text-gray-400">
                    By signing up you agree to our{" "}
                    <a href="/privacy" className="underline hover:no-underline">
                      Terms
                    </a>
                    .
                  </p>
                </DialogContent>
              </Dialog>
              <button 
                className="md:hidden text-gray-300 hover:text-white transition-colors" 
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} className="md:hidden bg-black/95 backdrop-blur-lg">
              <div className="px-4 pt-2 pb-3 space-y-1">
                <a href="/products" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  Products
                </a>
                <a href="/warranty" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  Warranty
                </a>
                <a href="/support" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  Support
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartPanel isOpen={isCartOpen && isAuthenticated} onClose={() => setIsCartOpen(false)} />
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navigation;
