/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { 
  Smartphone, 
  Sun, 
  Moon, 
  ArrowRight, 
  UploadCloud, 
  Share2, 
  Coins, 
  Sparkles, 
  Lock, 
  Check, 
  HelpCircle,
  Eye,
  Instagram,
  X,
  CreditCard,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LockedContentCard from './components/LockedContentCard';
import { Content } from './types';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CreatorPublicProfile from './pages/CreatorPublicProfile';
import PaymentConfirm from './pages/PaymentConfirm';
import SubscriptionConfirm from './pages/SubscriptionConfirm';
import ContentView from './pages/ContentView';
import BuyerPortal from './pages/BuyerPortal';
import BuyerPurchases from './pages/BuyerPurchases';

// Route Guards
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-accent-corail border-t-transparent animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
}

function AuthRoute({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-accent-corail border-t-transparent animate-spin" />
      </div>
    );
  }
  
  if (user) {
    if (profile) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Pages (Redirect to dashboard if already logged in) */}
            <Route path="/auth/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/auth/signup" element={<AuthRoute><Signup /></AuthRoute>} />
            
            {/* Protected Creator Pages */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/content" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/withdrawals" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/subscription" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Maketou payment return confirmation */}
            <Route path="/payment/confirm" element={<PaymentConfirm />} />
            <Route path="/subscription/confirm" element={<SubscriptionConfirm />} />

            
            {/* Secured Content view page */}
            <Route path="/content/:contentId" element={<ContentView />} />

            {/* Buyer Portal */}
            <Route path="/portal" element={<BuyerPortal />} />
            <Route path="/portal/purchases" element={<BuyerPurchases />} />

            {/* Dynamic Public Creator Profile */}
            <Route path="/:username" element={<CreatorPublicProfile />} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export function LandingPage() {
  const { isDarkMode, setIsDarkMode, styles } = useTheme();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeDemoContent, setActiveDemoContent] = useState<Content | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'wave' | 'orange' | 'mtn' | 'moov'>('wave');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'loading' | 'success'>('details');

  // Exemples de contenus fictifs de démonstration
  const demoContents: Content[] = [
    {
      id: '1',
      creator_id: 'creator_1',
      title: 'Pack PDF : Booster son audience TikTok en 30 jours',
      description: "Ma méthode exacte, mes scripts prêts à l'emploi et mon calendrier éditorial pour passer de 0 à 10 000 abonnés rapidement.",
      price_fcfa: 2500,
      thumbnail_url: null,
      file_url: 'https://example.com/secured/guide-tiktok.pdf',
      content_type: 'pdf',
      status: 'published',
      is_published: true,
      created_at: new Date().toISOString(),
      creator: {
        id: 'creator_1',
        user_id: 'user_1',
        username: 'michella_coaching',
        display_name: 'Michella Coaching',
        bio: 'Experte en croissance organique et stratégies de contenu.',
        avatar_url: null,
        social_links: { tiktok: '@michella_coaching' },
        payout_phone_number: '+22890123456',
        payout_provider: 'wave',
        created_at: new Date().toISOString(),
      }
    },
    {
      id: '2',
      creator_id: 'creator_1',
      title: 'Template Notion : Organiser ses tournages Reels & TikTok',
      description: "Le template complet que j'utilise au quotidien pour planifier mes tournages, rédiger mes accroches et suivre mes métriques.",
      price_fcfa: 1500,
      thumbnail_url: null,
      file_url: 'https://example.com/secured/notion-template.zip',
      content_type: 'pdf',
      status: 'published',
      is_published: true,
      created_at: new Date().toISOString(),
      creator: {
        id: 'creator_1',
        user_id: 'user_1',
        username: 'michella_coaching',
        display_name: 'Michella Coaching',
        bio: 'Experte en croissance organique et stratégies de contenu.',
        avatar_url: null,
        social_links: { tiktok: '@michella_coaching' },
        payout_phone_number: '+22890123456',
        payout_provider: 'wave',
        created_at: new Date().toISOString(),
      }
    },
    {
      id: '3',
      creator_id: 'creator_1',
      title: 'Masterclass : Décryptage de l\'Algorithme 2026 (Vidéo 20m)',
      description: "Une vidéo exclusive de 20 minutes où je vous montre les coulisses de l'algorithme actuel, et comment maximiser le taux de rétention.",
      price_fcfa: 5000,
      thumbnail_url: null,
      file_url: 'https://example.com/secured/masterclass-algo.mp4',
      content_type: 'video',
      status: 'published',
      is_published: true,
      created_at: new Date().toISOString(),
      creator: {
        id: 'creator_1',
        user_id: 'user_1',
        username: 'michella_coaching',
        display_name: 'Michella Coaching',
        bio: 'Experte en croissance organique et stratégies de contenu.',
        avatar_url: null,
        social_links: { tiktok: '@michella_coaching' },
        payout_phone_number: '+22890123456',
        payout_provider: 'wave',
        created_at: new Date().toISOString(),
      }
    }
  ];

  const handleUnlockClick = (content: Content) => {
    setActiveDemoContent(content);
    setPaymentPhone('');
    setPaymentStep('details');
    setIsPaymentModalOpen(true);
  };

  const startMockPayment = () => {
    if (!paymentPhone) return;
    setPaymentStep('loading');
    setIsPaying(true);

    setTimeout(() => {
      setPaymentStep('success');
      setIsPaying(false);
      if (activeDemoContent) {
        setUnlockedIds(prev => [...prev, activeDemoContent.id]);
      }
    }, 2000);
  };

  const floatingLogos = [
    {
      url: "https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/eac30152-d08a-4b2d-8b21-6bb36eed4d16.png",
      position: "left-[1%] md:left-[2%] lg:left-[4%] top-[12%]",
      delay: 0,
      duration: 5,
    },
    {
      url: "https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/b32e99dd-45d8-409a-b1a4-382b27c2d0f5.jpg",
      position: "left-[5%] md:left-[8%] lg:left-[12%] top-[44%]",
      delay: 1.5,
      duration: 6,
    },
    {
      url: "https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/1eb16b59-0a1c-44bb-b97b-c7cd0bf23ec3.jpg",
      position: "left-[2%] md:left-[3%] lg:left-[6%] top-[74%]",
      delay: 0.8,
      duration: 5.5,
    },
    {
      url: "https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/2ae62ee0-65e9-41c8-92cc-585fd4f0cfef.png",
      position: "right-[1%] md:right-[2%] lg:right-[4%] top-[15%]",
      delay: 0.5,
      duration: 5.2,
    },
    {
      url: "https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/e5138f48-879a-47b8-b5ed-1d361151def9.png",
      position: "right-[5%] md:right-[8%] lg:right-[12%] top-[48%]",
      delay: 2,
      duration: 6.4,
    },
    {
      url: "https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/db10a3b5-4d71-4372-98d3-09cf1f5152dc.png",
      position: "right-[2%] md:right-[3%] lg:right-[6%] top-[76%]",
      delay: 1.2,
      duration: 4.8,
    }
  ];

  const handleScrollToDemo = () => {
    document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${styles.bg} ${styles.textPrimary} font-sans`}>
      {/* Header */}
      <header id="app-header" className={`border-b ${styles.border} py-4 px-6 sticky top-0 backdrop-blur-md z-40 bg-opacity-80`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-corail animate-pulse" />
            <h1 className="font-display text-2xl font-medium tracking-tight">Momo Creator</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              id="header-cta"
              to="/auth/signup"
              className="px-5 py-2 rounded-full text-xs font-semibold bg-accent-corail text-white hover:bg-accent-corail-hover transition-all cursor-pointer text-center"
            >
              Devenir créateur
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Relative and Overflow-Visible for absolute floating elements */}
      <section id="hero" className="relative max-w-6xl w-full mx-auto px-4 md:px-12 pt-16 pb-12 flex flex-col items-center text-center gap-6 overflow-visible">
        {/* Absolute Floating Badges (Visible on desktop and tablets for dynamic styling) */}
        {floatingLogos.map((logo, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${logo.position} hidden md:flex items-center justify-center bg-white p-2 rounded-[14px] border border-border-custom/60 shadow-lg hover:scale-110 hover:shadow-xl hover:border-accent-corail/30 transition-all duration-300 z-10 w-12 h-12 lg:w-16 lg:h-16`}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: logo.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: logo.delay,
            }}
          >
            <img
              src={logo.url}
              alt={`Paiement floating ${idx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-[10px]"
            />
          </motion.div>
        ))}

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-corail/10 text-accent-corail text-xs font-semibold border border-accent-corail/20">
          <Sparkles size={12} />
          <span>Pour les créateurs sur TikTok, Instagram & Snapchat</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight leading-tight max-w-3xl">
          Monétisez votre communauté avec le <span className="text-accent-corail">Mobile Money</span>
        </h1>

        <p className={`text-base sm:text-lg ${styles.textSecondary} max-w-xl leading-relaxed`}>
          Vendez vos guides, formations, photos ou vidéos exclusifs directement à vos abonnés au Togo, en Côte d’Ivoire, au Sénégal et au Cameroun. Vos fans paient en un clic via <strong>Wave, Orange, MTN ou Moov</strong>.
        </p>

        {/* Inline payment row - Only displayed on mobile screen viewports */}
        <div id="payment-logos-showcase" className="flex flex-col items-center justify-center gap-2.5 mt-2 md:hidden">
          <span className={`text-[10px] font-bold ${styles.textSecondary} opacity-80 uppercase tracking-widest`}>
            Paiements Mobile Money acceptés
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {floatingLogos.map((logo, idx) => (
              <img
                key={idx}
                src={logo.url}
                alt={`Méthode de paiement ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="h-8 w-auto object-contain rounded-md border border-border-custom/50 bg-white p-1"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
          <Link
            id="hero-primary-cta"
            to="/auth/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-accent-corail text-white hover:bg-accent-corail-hover transition-all duration-200 cursor-pointer shadow-lg shadow-accent-corail/15 flex items-center justify-center gap-2"
          >
            <span>Devenir créateur (Gratuit)</span>
            <ArrowRight size={16} />
          </Link>
          
          <button
            id="hero-secondary-cta"
            onClick={handleScrollToDemo}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold border ${styles.border} ${styles.hoverBg} transition-all duration-200 cursor-pointer flex items-center justify-center gap-2`}
          >
            <Eye size={16} />
            <span>Essayer la démo acheteur</span>
          </button>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs mt-6 opacity-80">
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-success-gold" /> Sans abonnement, sans frais cachés
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-success-gold" /> Retraits directs en 24h
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-success-gold" /> Sécurité maximale (liens signés)
          </span>
        </div>
      </section>

      {/* Section "Comment ça marche ?" */}
      <section id="how-it-works" className={`border-t border-b ${styles.border} py-16 px-4 ${isDarkMode ? 'bg-bg-surface/30' : 'bg-gray-50/50'}`}>
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2">
            <h2 className="font-display text-3xl font-medium tracking-tight">Comment ça marche ?</h2>
            <p className={`text-sm ${styles.textSecondary} max-w-lg mx-auto`}>
              Trois étapes simples pour transformer vos vues sur les réseaux sociaux en revenus réels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className={`p-6 rounded-[16px] border ${styles.surface} flex flex-col gap-4 relative overflow-hidden group`}>
              <div className="p-3 rounded-xl bg-accent-corail/10 text-accent-corail w-fit">
                <UploadCloud size={24} />
              </div>
              <div className="absolute top-4 right-6 text-5xl font-display font-medium text-accent-corail/10">1</div>
              <h3 className="font-display text-lg font-medium">1. Créez & fixez votre prix</h3>
              <p className={`text-sm ${styles.textSecondary} leading-relaxed`}>
                Importez votre PDF, vidéo ou document confidentiel. Fixez un prix unique en FCFA (ex: 2 500 FCFA). Nous générons un lien sécurisé.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-[16px] border ${styles.surface} flex flex-col gap-4 relative overflow-hidden group`}>
              <div className="p-3 rounded-xl bg-accent-corail/10 text-accent-corail w-fit">
                <Share2 size={24} />
              </div>
              <div className="absolute top-4 right-6 text-5xl font-display font-medium text-accent-corail/10">2</div>
              <h3 className="font-display text-lg font-medium">2. Partagez votre lien</h3>
              <p className={`text-sm ${styles.textSecondary} leading-relaxed`}>
                Ajoutez le lien dans votre bio TikTok, Instagram ou envoyez-le sur Snapchat. Vos fans accèdent directement à votre page sans inscription.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-[16px] border ${styles.surface} flex flex-col gap-4 relative overflow-hidden group`}>
              <div className="p-3 rounded-xl bg-accent-corail/10 text-accent-corail w-fit">
                <Coins size={24} />
              </div>
              <div className="absolute top-4 right-6 text-5xl font-display font-medium text-accent-corail/10">3</div>
              <h3 className="font-display text-lg font-medium">3. Encaissez directement</h3>
              <p className={`text-sm ${styles.textSecondary} leading-relaxed`}>
                Les acheteurs paient en Mobile Money. Vos fonds s'accumulent instantanément. Demandez vos retraits en Wave, Orange ou MTN à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section id="live-demo" className="max-w-6xl w-full mx-auto px-4 py-16 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-3">
          <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight">Découvrez l'expérience de vos abonnés</h2>
          <p className={`text-base ${styles.textSecondary} max-w-xl mx-auto`}>
            Cliquez sur un contenu ci-dessous pour tester le processus d'achat fictif par Mobile Money et voir comment le contenu se déverrouille instantanément.
          </p>
        </div>

        {/* Creator profile card + Contents grid wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
          
          {/* Creator Profile Panel - Optimized for mobile & tablet (horizontal grid) and desktop (sticky sidebar) */}
          <div className={`lg:col-span-1 p-6 rounded-[16px] border ${styles.surface} flex flex-col sm:grid sm:grid-cols-3 lg:flex lg:flex-col gap-6 lg:sticky lg:top-24 h-fit`}>
            <div className="flex flex-col items-center text-center gap-3 sm:col-span-1 lg:col-span-full">
              <div className="w-20 h-20 rounded-full bg-accent-corail/15 flex items-center justify-center border-2 border-accent-corail/30 relative">
                <span className="font-display text-2xl font-medium text-accent-corail">MC</span>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-bg-primary" />
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-display text-base sm:text-lg font-medium">Michella Coaching</h3>
                <span className="text-xs text-accent-corail font-semibold">@michella_coaching</span>
              </div>
              
              <p className={`text-xs ${styles.textSecondary} leading-relaxed max-w-xs mx-auto`}>
                Aide les créateurs à structurer leur communication et à monétiser intelligemment leur audience TikTok & Instagram.
              </p>
            </div>

            <div className={`pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l lg:border-l-0 lg:border-t ${styles.border} flex flex-col gap-3 text-xs sm:px-6 lg:px-0 sm:col-span-1 lg:col-span-full justify-center`}>
              <div className="flex justify-between items-center gap-4">
                <span className={styles.textSecondary}>Pays d'origine</span>
                <span className="font-medium">Togo 🇹🇬</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className={styles.textSecondary}>Abonnés cumulés</span>
                <span className="font-medium">120K</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className={styles.textSecondary}>Contenus vendus</span>
                <span className="font-medium text-success-gold font-bold">1 240+</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-1 lg:col-span-full sm:pl-6 lg:pl-0 justify-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.textSecondary}`}>Réseaux</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-md ${styles.badgeBg} text-[10px] font-medium flex items-center gap-1`}>
                  TikTok
                </span>
                <span className={`px-2 py-1 rounded-md ${styles.badgeBg} text-[10px] font-medium flex items-center gap-1`}>
                  Instagram
                </span>
              </div>
            </div>
          </div>

          {/* Locked Content Grid Showcase */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Boutique de démonstration
              </span>
              <button 
                onClick={() => setUnlockedIds([])} 
                className="text-xs text-accent-corail hover:underline cursor-pointer font-medium"
              >
                Réinitialiser les déblocages
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {demoContents.map((content) => (
                <LockedContentCard 
                  key={content.id}
                  content={content}
                  isUnlocked={unlockedIds.includes(content.id)}
                  onUnlock={() => handleUnlockClick(content)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section id="trust" className={`border-t ${styles.border} py-16 px-4 bg-opacity-30 ${isDarkMode ? 'bg-bg-surface/25' : 'bg-gray-50/25'}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-medium tracking-tight">Une technologie pensée pour l'Afrique francophone</h2>
            <p className={`text-sm ${styles.textSecondary} leading-relaxed`}>
              La majorité des outils de monétisation actuels imposent d'avoir un compte Stripe ou Paypal, inaccessibles ou très limités pour la plupart des créateurs de contenu en Afrique de l'Ouest et Centrale.
            </p>
            <p className={`text-sm ${styles.textSecondary} leading-relaxed`}>
              <strong>Momo Creator</strong> résout cela en se branchant directement sur les services que vos abonnés et vous-même utilisez déjà tous les jours : <strong>Wave, Orange Money, MTN MoMo, Moov Money</strong>.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-2">
                <Check size={16} className="text-success-gold mt-0.5 shrink-0" />
                <span className="text-xs font-semibold">Taux de conversion imbattable</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={16} className="text-success-gold mt-0.5 shrink-0" />
                <span className="text-xs font-semibold">Support réactif 24/7</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={16} className="text-success-gold mt-0.5 shrink-0" />
                <span className="text-xs font-semibold">Sécurisation contre le partage</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={16} className="text-success-gold mt-0.5 shrink-0" />
                <span className="text-xs font-semibold">Zéro frais d'installation</span>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-[24px] border ${styles.surface} flex flex-col gap-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-corail/5 rounded-full blur-3xl" />
            <h3 className="font-display text-xl font-medium">Prêt pour le grand saut ?</h3>
            
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex gap-3">
                <span className="p-2 h-fit rounded-lg bg-accent-corail/10 text-accent-corail shrink-0">
                  <Smartphone size={16} />
                </span>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Compatible avec 100% des smartphones</h4>
                  <p className={styles.textSecondary}>Achetez sur n'importe quel mobile sans aucune application externe requise.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="p-2 h-fit rounded-lg bg-accent-corail/10 text-accent-corail shrink-0">
                  <Coins size={16} />
                </span>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Retraits instantanés de vos fonds</h4>
                  <p className={styles.textSecondary}>Votre argent est transféré vers votre compte Mobile Money dès que vous en faites la demande.</p>
                </div>
              </div>
            </div>

            <Link
              to="/auth/signup"
              className="w-full py-3 rounded-full text-xs font-semibold bg-accent-corail text-white hover:bg-accent-corail-hover transition-all cursor-pointer text-center mt-2 block"
            >
              Commencer maintenant (Création en 2 min)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Final CTA */}
      <section id="final-cta" className="max-w-4xl w-full mx-auto px-4 py-20 flex flex-col items-center text-center gap-8">
        <h2 className="font-display text-4xl font-medium tracking-tight">
          Rejoignez la révolution de la monétisation en Afrique
        </h2>
        <p className={`text-base ${styles.textSecondary} max-w-lg mx-auto`}>
          Inscrivez-vous dès aujourd’hui et commencez à vendre votre savoir, vos conseils et vos créations de manière professionnelle.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <Link
            to="/auth/signup"
            className="w-full px-8 py-4 rounded-full text-sm font-semibold bg-accent-corail text-white hover:bg-accent-corail-hover transition-all duration-200 cursor-pointer shadow-lg shadow-accent-corail/10 flex items-center justify-center gap-2"
          >
            <span>Créer mon compte créateur</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider font-semibold opacity-75 mt-4">
          <span>🇹🇬 Togo</span>
          <span>🇨🇮 Côte d’Ivoire</span>
          <span>🇸🇳 Sénégal</span>
          <span>🇨🇲 Cameroun</span>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${styles.border} py-8 px-6 text-center text-xs ${styles.textSecondary}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong>Momo Creator</strong> © {new Date().getFullYear()} — La plateforme de monétisation préférée des créateurs africains.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Conditions d’utilisation</span>
            <span className="hover:underline cursor-pointer">Politique de confidentialité</span>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE MOCK PAYMENT MODAL (Aesthetic Highlight for Step 1) */}
      <AnimatePresence>
        {isPaymentModalOpen && activeDemoContent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-[20px] border ${styles.surface} relative shadow-2xl flex flex-col gap-5`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-full border ${styles.border} ${styles.hoverBg} transition-all cursor-pointer`}
              >
                <X size={16} />
              </button>

              {/* Title & Product Info */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-accent-corail uppercase tracking-widest">
                  Paiement Mobile Money Sécurisé
                </span>
                <h3 className="font-display text-lg font-medium">Débloquer le contenu</h3>
                <div className={`p-3 rounded-xl border ${styles.border} mt-2 flex items-start gap-3`}>
                  <div className="p-2 bg-accent-corail/10 text-accent-corail rounded-lg shrink-0">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-text-primary line-clamp-1">{activeDemoContent.title}</h4>
                    <span className="text-xs text-accent-corail font-bold mt-1 block">
                      {activeDemoContent.price_fcfa.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Step Content */}
              {paymentStep === 'details' && (
                <div className="flex flex-col gap-4">
                  {/* Select Operator */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">Sélectionnez votre opérateur</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'wave', label: 'Wave', color: 'bg-blue-500/10 border-blue-500/40 text-blue-500' },
                        { id: 'orange', label: 'Orange', color: 'bg-orange-500/10 border-orange-500/40 text-orange-500' },
                        { id: 'mtn', label: 'MTN', color: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500' },
                        { id: 'moov', label: 'Moov', color: 'bg-blue-600/10 border-blue-600/40 text-blue-600' }
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          onClick={() => setSelectedProvider(prov.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            selectedProvider === prov.id 
                              ? prov.color + ' border-2 font-bold ring-2 ring-accent-corail/10' 
                              : `border-border-custom hover:bg-bg-surface-hover ${styles.textSecondary}`
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase">{prov.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Phone number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">Numéro Mobile Money</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="Ex: 90 12 34 56"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${styles.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent-corail/50 focus:border-accent-corail transition-all`}
                        required
                      />
                    </div>
                    <span className="text-[10px] opacity-75">
                      Entrez un numéro fictif pour tester la démo.
                    </span>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={startMockPayment}
                    disabled={!paymentPhone}
                    className={`w-full py-3.5 rounded-xl text-xs font-semibold text-white bg-accent-corail hover:bg-accent-corail-hover transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                      !paymentPhone && 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span>Valider et payer {activeDemoContent.price_fcfa.toLocaleString('fr-FR')} FCFA</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {paymentStep === 'loading' && (
                <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full border-4 border-accent-corail/20 animate-ping" />
                    <span className="w-10 h-10 rounded-full border-4 border-accent-corail border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Paiement en cours...</h4>
                    <p className={`text-xs ${styles.textSecondary} mt-1 max-w-[240px]`}>
                      Veuillez valider la transaction fictive sur votre téléphone.
                    </p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-4 bg-green-500/10 text-success-gold rounded-full border border-green-500/30 animate-bounce">
                    <Check size={32} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-medium text-text-primary">Félicitations !</h4>
                    <p className={`text-xs ${styles.textSecondary} mt-1 max-w-[280px]`}>
                      Le paiement de <strong>{activeDemoContent.price_fcfa.toLocaleString('fr-FR')} FCFA</strong> a été validé. Le contenu est maintenant débloqué !
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="mt-2 px-6 py-2.5 rounded-full bg-accent-corail text-white text-xs font-semibold hover:bg-accent-corail-hover transition-all cursor-pointer"
                  >
                    Voir le contenu
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
