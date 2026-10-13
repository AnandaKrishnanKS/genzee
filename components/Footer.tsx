import Link from "next/link";
import { Heart, Mail, Phone, AlertTriangle } from "lucide-react";

const footerLinks = {
  explore: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/consultation", label: "Consultations" },
    { href: "/book", label: "Book a Session" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Cancellation" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Emergency Support" },
    { href: "/admin", label: "Psychologist Admin" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#24212E] text-white">
      {/* Emergency Notice */}
      <div className="bg-[#FFD8C5]/10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-[#FFD8C5] shrink-0" />
          <p className="text-sm text-white/70">
            <strong className="text-[#FFD8C5]">Crisis support:</strong>{" "}
            This is not an emergency service. If you are in immediate danger, please call{" "}
            <strong>112</strong> or iCall{" "}
            <strong>9152987821</strong>.{" "}
            <Link href="/support" className="underline text-[#A78BFA] hover:text-[#A78BFA]/80">
              More resources →
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#A78BFA] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl">
                GenZee<span className="text-[#A78BFA]">.</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              A welcoming space for honest conversations, personal growth, and
              psychological support — at your own pace.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#A78BFA] hover:bg-[#A78BFA]/10 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#A78BFA] hover:bg-[#A78BFA]/10 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#A78BFA] hover:bg-[#A78BFA]/10 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Info
            </h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <a
                href="mailto:hello@genzee-psychologist.com"
                className="flex items-center gap-2 text-white/60 hover:text-[#A78BFA] text-sm transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                hello@genzee-psychologist.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} GenZee Psychologist. All rights reserved.
          </p>
          <p className="text-white/30 text-xs text-center">
            Online psychological consultations. Not a crisis service.
            <br className="md:hidden" /> Professional registration details available on request.
          </p>
        </div>
      </div>
    </footer>
  );
}
