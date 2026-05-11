import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { useCookieConsent, openCookieSettings } from "@/hooks/useCookieConsent";
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Calendar,
  ChevronDown
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

import Tree_d_Submark___All_White from "@assets/Tree'd Submark - All White.png";

export function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const cookieConsent = useCookieConsent();
const isLight = theme === 'light';

const footerLinkClass = "text-zinc-500 hover:!text-[#c7db45] text-sm transition-colors";
const footerContactLinkClass = "flex items-center gap-2 text-zinc-500 hover:!text-[#c7db45] text-sm transition-colors";

  return (
    <footer className="bg-background border-t border-white/5 pt-24 pb-0 relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-3 mb-8 group cursor-pointer">
                <img 
                  src={Tree_d_Submark___All_White} 
                  alt="Tree'd" 
                  className="h-8 w-auto brightness-200 transition-transform group-hover:scale-105" 
                />
              </div>
            </Link>
            <div className="relative mb-8 max-w-xs group">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent rounded-full group-hover:from-primary group-hover:via-primary/50 group-hover:to-transparent transition-all duration-500"></div>
              <p className="text-lg text-white font-medium leading-relaxed tracking-wide">
                {t('footer.tagline')}
              </p>
            </div>
            <div className="flex gap-4">
            <a href="https://www.instagram.com/treed.guide/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 text-zinc-400 flex items-center justify-center transition-all hover:border-primary/50">
  <Instagram className="w-5 h-5" />
</a>

<a href="https://www.linkedin.com/company/treedhistoryguide" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 text-zinc-400 flex items-center justify-center transition-all hover:border-primary/50">
  <Linkedin className="w-5 h-5" />
</a>

<a href="https://x.com/treedguide" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 text-zinc-400 flex items-center justify-center transition-all hover:border-primary/50">
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
</a>

<a href="https://www.facebook.com/treedguide" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 text-zinc-400 flex items-center justify-center transition-all hover:border-primary/50">
  <Facebook className="w-5 h-5" />
</a>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.product')}</h4>
              <ul className="space-y-4">
                <li><Link href="/solution" className={footerLinkClass} data-testid="link-footer-solution">
{t('footer.overview')}</Link></li>
                <li><Link href="/handset" className={footerLinkClass} data-testid="link-footer-handset">{t('footer.handset')}</Link></li>
<li><Link href="/tree" className={footerLinkClass} data-testid="link-footer-tree">{t('footer.tree')}</Link></li>
<li><Link href="/dashboard" className={footerLinkClass} data-testid="link-footer-dashboard">{t('footer.dashboard')}</Link></li>
<li><Link href="/visitor-experience" className={footerLinkClass} data-testid="link-footer-visitor-experience">{t('footer.visitorExperience')}</Link></li>
<li><Link href="/use-cases" className={footerLinkClass} data-testid="link-footer-use-cases">{t('footer.useCases')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
  {t('footer.resources')}
</h4>
              <ul className="space-y-4">
<li>
  <Link href="/request-pricing" className={footerLinkClass}>
    {t('footer.requestPricing')}
  </Link>
</li>
<li><Link href="/revenue-sharing" className={footerLinkClass}>{t('footer.revenueSharing')}</Link></li>
<li><Link href="/sustainability" className={footerLinkClass}>{t('footer.sustainability')}</Link></li>
<li><Link href="/blog" className={footerLinkClass}>{t('footer.blog', 'Blog')}</Link></li>
<li><Link href="/faq" className={footerLinkClass}>{t('footer.faq')}</Link></li>
</ul>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.company')}</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className={footerLinkClass} data-testid="link-footer-about">{t('footer.about')}</Link></li>
                <li><Link href="/careers" className={footerLinkClass} data-testid="link-footer-careers">{t('footer.careers')}</Link></li>
                <li><Link href="/contact" className={footerLinkClass} data-testid="link-footer-contact">{t('footer.contact')}</Link></li>
              </ul>
              {/* Language selector — mobile only, bottom-aligned with Book a Demo */}
              <div className="mt-auto pt-4 lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="bg-[#B7D34B] rounded-full px-4 py-2 text-sm font-bold flex items-center gap-1"
                      style={{ color: '#000000' }}
                      aria-label={t('footer.selectLanguage')}
                    >
                      {i18n.language.toUpperCase().slice(0, 2)}
                      <ChevronDown className="w-3 h-3" style={{ color: '#000000' }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="bg-black text-white border-none"
                    style={{ zIndex: 9999 }}
                  >
                    {['en', 'nl', 'fr'].map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => i18n.changeLanguage(lang)}
                        className="text-sm font-bold cursor-pointer focus:bg-white/10 focus:text-white"
                      >
                        {lang.toUpperCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.contactBlock')}</h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+31202101985" className={footerContactLinkClass}>
                    <Phone className="w-4 h-4" /> +31 20 210 1985
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@treed.co" className={footerContactLinkClass}>
                    <Mail className="w-4 h-4" /> hello@treed.co
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/+33781515277" target="_blank" rel="noopener noreferrer" className={footerContactLinkClass}>
                    <WhatsAppIcon className="w-4 h-4" /> {t('footer.whatsapp')}
                  </a>
                </li>
                <li>
                  <Link href="/booking" className={footerContactLinkClass}>
                    <Calendar className="w-4 h-4" /> {t('footer.bookDemo')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      <div className="w-full h-48 md:h-64 border-t border-white/5 bg-zinc-950/50 relative overflow-hidden">
                {cookieConsent === "accepted" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000.000000000000!2d4.910309176865225!3d52.36683897202283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6090a9b3e1075%3A0xe3a842f53431f269!2sPlantage%20Kerklaan%2021%2C%201018%20SZ%20Amsterdam%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1715695000000!5m2!1sen!2snl"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(100%)' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-40 hover:opacity-100 transition-opacity duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                      Plantage Kerklaan 21, Amsterdam
                    </p>
                  </div>
                )}
              </div>
              <div className="border-t border-white/5 bg-background">
                <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-zinc-600 text-[9px] uppercase tracking-[0.2em] font-bold">
                    © {currentYear} {t('footer.rights')}
                  </p>
                  <div className="flex items-center gap-6">
                    <Link href="/privacy-policy" className="text-zinc-600 hover:!text-[#c7db45] text-[8px] uppercase tracking-[0.2em] font-bold transition-colors">
                      {t('footer.privacyPolicy')}
                    </Link>
                    <Link href="/cookie-policy" className="text-zinc-600 hover:!text-[#c7db45] text-[8px] uppercase tracking-[0.2em] font-bold transition-colors">
                      {t('footer.cookiePolicy')}
                    </Link>
                    <Link href="/terms-of-use" className="text-zinc-600 hover:!text-[#c7db45] text-[8px] uppercase tracking-[0.2em] font-bold transition-colors">
                      {t('footer.termsOfUse')}
                    </Link>
                    <button
                      onClick={openCookieSettings}
                      className="text-zinc-600 hover:!text-[#c7db45] text-[8px] uppercase tracking-[0.2em] font-bold transition-colors"
                    >
                      {t('footer.cookieSettings')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        );
      }