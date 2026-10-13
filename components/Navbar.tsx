"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/consultation", label: "Consultations" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Blur background when scrolled down
      setScrolled(currentScrollY > 20);

      // Always show at the top of the page
      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling DOWN -> smoothly hide header
        if (!isOpen) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling UP -> smoothly slide header down
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setIsVisible(true);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-xl shadow-[0_2px_16px_0_rgba(36,33,46,0.06)] border-b border-[#F0E9FF]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#A78BFA] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg text-[#24212E] tracking-tight">
              GenZee<span className="text-[#A78BFA]">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-[#F0E9FF] text-[#6D4EC9] font-semibold"
                      : "text-[#24212E]/70 hover:text-[#24212E] hover:bg-[#F0E9FF]/60"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/book"
              className="bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_4px_14px_0_rgba(167,139,250,0.4)] hover:shadow-[0_4px_20px_0_rgba(167,139,250,0.6)] hover:scale-[1.03] active:scale-[0.98]"
            >
              Book a Session
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#24212E] hover:bg-[#F0E9FF] transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 md:hidden"
          >
            <ul className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-5 py-4 rounded-2xl text-lg font-semibold transition-all",
                      pathname === link.href
                        ? "bg-[#F0E9FF] text-[#6D4EC9]"
                        : "text-[#24212E] hover:bg-[#F0E9FF]/60"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/book"
              className="block w-full text-center bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(167,139,250,0.4)]"
            >
              Book a Session 💜
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
