import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { SEO, StructuredData } from "@/components/SEO";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      <SEO page="notFound" />
      <StructuredData page="notFound" />
      <Navbar />
      
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,223,82,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block text-[120px] md:text-[180px] font-bold text-primary/20 leading-none mb-4"
            >
              404
            </motion.span>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
              {t('notFoundPage.headingStart')} <span className="text-primary">{t('notFoundPage.headingHighlight')}</span>
            </h2>

            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-12 max-w-xl mx-auto">
              {t('notFoundPage.desc')}
            </p>

            <Link href="/">
              <Button
                size="lg"
                className="bg-primary text-black hover:bg-primary/90 rounded-full px-12 h-14 font-bold text-sm uppercase tracking-widest cursor-pointer transition-colors"
                data-testid="button-return-home"
              >
                {t('notFoundPage.cta')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
