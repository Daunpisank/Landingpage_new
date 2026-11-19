import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Baby,
  Check,
  CheckCircle2,
  ExternalLink,
  Gift,
  HeartHandshake,
  Home,
  Images,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  User,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  ASSETS,
  CLINIC_BRANCHES,
  CORE_METHODS,
  GALLERY_PHOTOS,
  HERO_GALLERY_PHOTOS,
  METHOD_PACKAGES,
  PATIENT_CATEGORIES,
  SERVICE_CATEGORIES,
  WHATSAPP_CONFIG,
  buildWhatsAppLink,
  type ClinicBranchConfig,
  type PatientCategory,
} from './data/clinicData';
import {
  BerandaMapAndReviewsSection,
  useClinicGooglePlaces,
  type BranchPlaceData,
} from './components/GoogleReviewsAndMap';
import { PricelistModal, WhatsAppModal } from './components/WhatsAppModal';
import { SunatNanoWordmark } from './components/SunatNanoWordmark';

declare const __GOOGLE_MAPS_API_KEY__: string;

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '');
const hasMapsApiKey = Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim().length > 0);

const INITIAL_BRANCHES_DATA: Record<ClinicBranchConfig['id'], BranchPlaceData> = {
  bangkalan: { branchId: 'bangkalan', reviews: [], status: hasMapsApiKey ? 'loading' : 'empty' },
  surabaya: { branchId: 'surabaya', reviews: [], status: hasMapsApiKey ? 'loading' : 'empty' },
  sidoarjo: { branchId: 'sidoarjo', reviews: [], status: hasMapsApiKey ? 'loading' : 'empty' },
};

const TEASER_SERVICE_IDS = ['bayi', 'anak', 'dewasa'] as const;

type PageId = 'beranda' | 'metode' | 'layanan' | 'galeri';

const NAV_LINKS: Array<{ id: PageId; href: string; emoji: string; label: string }> = [
  { id: 'beranda', href: 'index.html', emoji: '🏠', label: 'Beranda' },
  { id: 'metode', href: 'metode.html', emoji: '🩺', label: 'Metode' },
  { id: 'layanan', href: 'layanan.html', emoji: '🧸', label: 'Layanan' },
  { id: 'galeri', href: 'galeri.html', emoji: '📸', label: 'Galeri' },
];

function detectCurrentPage(): PageId {
  if (typeof document !== 'undefined') {
    const rootPage = document.getElementById('root')?.getAttribute('data-page');
    if (
      rootPage === 'beranda' ||
      rootPage === 'metode' ||
      rootPage === 'layanan' ||
      rootPage === 'galeri'
    ) {
      return rootPage;
    }
  }
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.endsWith('metode.html') || pathname.endsWith('/metode')) return 'metode';
    if (pathname.endsWith('layanan.html') || pathname.endsWith('/layanan')) return 'layanan';
    if (pathname.endsWith('galeri.html') || pathname.endsWith('/galeri')) return 'galeri';
  }
  return 'beranda';
}

const PlacesDataSync: React.FC<{
  onData: (data: Record<ClinicBranchConfig['id'], BranchPlaceData>) => void;
}> = ({ onData }) => {
  const branchesData = useClinicGooglePlaces(true);
  useEffect(() => {
    onData(branchesData);
  }, [branchesData, onData]);
  return null;
};

export default function App() {
  const [currentPage] = useState<PageId>(() => detectCurrentPage());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waContextTopic, setWaContextTopic] = useState<string | null>(null);
  const [pricelistModalOpen, setPricelistModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PatientCategory>('reguler');
  const [selectedBranchId, setSelectedBranchId] =
    useState<ClinicBranchConfig['id']>('bangkalan');
  const [branchesData, setBranchesData] =
    useState<Record<ClinicBranchConfig['id'], BranchPlaceData>>(INITIAL_BRANCHES_DATA);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [expandedMethodIds, setExpandedMethodIds] = useState<Record<string, boolean>>({});
  const [expandedPackageIds, setExpandedPackageIds] = useState<Record<string, boolean>>({});
  const [mascotError, setMascotError] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  const openConsultation = (topic?: string) => {
    setWaContextTopic(topic ?? null);
    setWaModalOpen(true);
    setMobileMenuOpen(false);
  };

  const toggleMethodDetail = (methodId: string) => {
    setExpandedMethodIds((prev) => ({
      ...prev,
      [methodId]: !prev[methodId],
    }));
  };

  const togglePackageFeatures = (packageId: string) => {
    setExpandedPackageIds((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }));
  };

  const activePackages = METHOD_PACKAGES.filter((pkg) => Boolean(pkg.prices[selectedCategory]));
  const activeCategoryMeta = PATIENT_CATEGORIES.find((cat) => cat.id === selectedCategory);
  const teaserServices = TEASER_SERVICE_IDS.map((id) =>
    SERVICE_CATEGORIES.find((service) => service.id === id)
  ).filter((item): item is (typeof SERVICE_CATEGORIES)[number] => Boolean(item));

  const renderMethodIcon = (iconKey: (typeof CORE_METHODS)[number]['iconKey']) => {
    switch (iconKey) {
      case 'sealer':
        return <Zap className="h-6 w-6 text-[#489BE2]" />;
      case 'painless':
        return <ShieldCheck className="h-6 w-6 text-[#D97706]" />;
      case 'stitchfree':
        return <CheckCircle2 className="h-6 w-6 text-[#EA580C]" />;
    }
  };

  const renderServiceIcon = (iconKey: (typeof SERVICE_CATEGORIES)[number]['iconKey']) => {
    switch (iconKey) {
      case 'baby':
        return <Baby className="h-6 w-6 text-[#489BE2]" />;
      case 'child':
        return <Smile className="h-6 w-6 text-[#D97706]" />;
      case 'teen':
        return <Users className="h-6 w-6 text-[#EA580C]" />;
      case 'adult':
        return <User className="h-6 w-6 text-[#489BE2]" />;
      case 'revision':
        return <Wrench className="h-6 w-6 text-[#D97706]" />;
      case 'home':
        return <Home className="h-6 w-6 text-[#EA580C]" />;
    }
  };

  const appShell = (
    <div className="min-h-screen flex flex-col text-[#0F2942]">
      {quotaExceeded && (
        <div
          role="alert"
          className="fixed top-20 inset-x-4 z-50 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E] shadow-md"
        >
          <span>
            Layanan Google Maps sedang mencapai batas kuota sementara. Silakan gunakan tombol{' '}
            <strong>Buka Maps</strong> untuk melihat lokasi dan ulasan langsung di Google Maps.
          </span>
          <button
            type="button"
            onClick={() => setQuotaExceeded(false)}
            aria-label="Tutup pemberitahuan"
            className="rounded-lg p-1 text-[#92400E] hover:bg-[#FEF3C7]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {/* 1. NAVBAR */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm'
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Brand Wordmark + Maskot */}
          <a
            href="index.html"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7]"
          >
            {!mascotError ? (
              <img
                src={ASSETS.mascotLogo}
                alt="Maskot Sunat Nano"
                referrerPolicy="no-referrer"
                onError={() => setMascotError(true)}
                className="h-11 w-11 rounded-xl object-cover border border-[#E2E8F0]"
              />
            ) : (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0284C7] text-white font-heading font-bold text-sm">
                SN
              </span>
            )}
            <span className="flex flex-col leading-none">
              <SunatNanoWordmark className="text-2xl sm:text-[28px]" />
              <span className="mt-1 font-heading text-[11px] sm:text-xs font-semibold tracking-wide text-[#0B4F6C]">
                sunat canggih &amp; modern
              </span>
            </span>
          </a>

          {/* Zone 2: Pill Nav Links dengan Ikon/Emoji */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-2 text-[15px]"
          >
            {NAV_LINKS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  data-active={isActive ? 'true' : undefined}
                  className="nav-pill-link shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]"
                >
                  <span className="nav-pill-icon" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openConsultation()}
              className="typo-cta hidden sm:inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-5 py-2 text-[15px] text-white shadow-sm hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Konsultasi Gratis</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F2942] lg:hidden hover:bg-[#EBF5FD] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E2E8F0] bg-white px-4 py-4 shadow-lg lg:hidden">
            <nav aria-label="Navigasi Seluler" className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    data-active={isActive ? 'true' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-pill-link nav-pill-mobile text-base"
                  >
                    <span className="nav-pill-icon" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span>{item.label}</span>
                  </a>
                );
              })}
              <button
                type="button"
                onClick={() => openConsultation()}
                className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#489BE2] px-5 py-3 text-base font-bold text-white hover:bg-[#3182CE] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konsultasi Gratis</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HALAMAN 1: BERANDA (index.html) */}
        {currentPage === 'beranda' && (
          <>
            {/* HERO SECTION: FULL-BLEED BACKGROUND GAMBAR KLINIK */}
            {/* GANTI URL_GAMBAR_ANDA_DI_SINI DENGAN LINK GAMBAR BARU */}
            <section
              id="beranda"
              className="hero-fullbleed relative overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
            >
              <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                  {/* Hero Left Copy (Menyatu langsung dengan background tanpa card box) */}
                  <div className="hero-text-open flex flex-col justify-center lg:col-span-6">
                    <div className="flex flex-col items-start gap-2.5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-1 text-xs sm:text-sm font-bold text-[#B45309] shadow-xs">
                        <Star className="h-3.5 w-3.5 fill-[#F2B029] text-[#F97316]" />
                        <span>Pilihan Terbaik Ayah &amp; Bunda · Klinik &amp; Home Visit</span>
                      </span>

                      <SunatNanoWordmark
                        className="mt-1 text-3xl sm:text-4xl"
                        showCircumcision
                        circumcisionClassName="text-base sm:text-lg"
                      />
                    </div>

                    <h1 className="typo-h1 mt-4">
                      Sunat Modern,{' '}
                      <span className="hero-marker-highlight">Anak Senang</span>,{' '}
                      <span className="text-[#EA580C]">Orang Tua Tenang.</span>
                    </h1>

                    <p className="typo-subheadline mt-5">
                      Layanan sunat ramah anak dengan{' '}
                      <strong className="font-bold text-[#0B4F6C]">bius tanpa jarum suntik</strong>,
                      metode presisi{' '}
                      <strong className="font-bold text-[#0B4F6C]">
                        Bipolar Teknosealer &amp; Nano Klamp
                      </strong>{' '}
                      tanpa jahitan, dan ditangani dokter berpengalaman.
                    </p>

                    <p className="mt-3 max-w-xl text-base leading-relaxed text-[#EA580C] font-semibold">
                      Anak boleh membawa mainan favorit, tetap ceria selama tindakan, dan pulang
                      membawa hadiah Mobil Remote gratis.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => openConsultation()}
                        className="typo-cta inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-[#489BE2] px-7 py-3.5 text-base text-white shadow-md hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>Konsultasi Gratis</span>
                      </button>

                      <a
                        href="layanan.html"
                        className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] px-7 py-3.5 text-base font-bold text-[#EA580C] hover:bg-[#FFEDD5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                      >
                        Lihat Layanan Kami
                      </a>
                    </div>

                    {/* Unboxed Trust Line */}
                    <div className="hero-text-shadow mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[#E2E8F0] pt-6 text-sm font-semibold text-[#334155]">
                      <span className="inline-flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-[#489BE2]" />
                        Dokter Berpengalaman
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#F2B029]" />
                        Bius Tanpa Jarum
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Gift className="h-4 w-4 text-[#F97316]" />
                        Gratis Mobil Remote
                      </span>
                    </div>
                  </div>

                  {/* Hero Right Visual: Galeri Foto Slider + Maskot Kucing (Drop-Shadow 3D) */}
                  <div className="hero-right-visual flex flex-col justify-center lg:col-span-6">
                    <div className="hero-gallery-frame border-2 border-white/80">
                      {HERO_GALLERY_PHOTOS.map((photo) => (
                        <img
                          key={photo.src}
                          src={photo.src}
                          alt={photo.alt}
                          referrerPolicy="no-referrer"
                          className="hero-gallery-slide"
                        />
                      ))}
                    </div>

                    {/* Strip Identitas Maskot Kucing & Hadiah */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB]/95 px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        {!mascotError ? (
                          <img
                            src={ASSETS.mascotLogo}
                            alt="Maskot Kucing Sunat Nano Circumcision"
                            referrerPolicy="no-referrer"
                            onError={() => setMascotError(true)}
                            className="h-12 w-12 rounded-xl object-cover border border-[#FDE68A] shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF5FD] text-[#489BE2] shrink-0">
                            <Smile className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-heading text-sm font-bold text-[#0F2942]">
                            Maskot Sahabat Anak Sunat Nano
                          </p>
                          <p className="text-xs text-[#475569]">
                            Suasana klinik ceria, bebas cemas &amp; boleh bawa mainan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#EA580C]">
                        <Gift className="h-4 w-4 shrink-0 text-[#F97316]" />
                        <span>Gratis Mobil Remote</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION STATISTIK */}
            <section
              aria-label="Statistik Kepercayaan Sunat Nano"
              className="border-y border-[#E2E8F0] bg-white/90"
            >
              <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EBF5FD] text-[#489BE2]">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-stat-number text-2xl text-[#0B4F6C]">6+ Tahun</p>
                      <p className="typo-stat-label">Pengalaman</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFFBEB] text-[#D97706]">
                      <Smile className="h-5 w-5 text-[#F2B029]" />
                    </div>
                    <div>
                      <p className="typo-stat-number text-2xl text-[#0B4F6C]">3500+</p>
                      <p className="typo-stat-label">Pasien</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F97316]">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="typo-stat-number text-2xl text-[#0B4F6C]">360+</p>
                      <p className="typo-stat-label">Google Review</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EBF5FD] text-[#489BE2]">
                      <Star className="h-5 w-5 fill-[#F2B029] text-[#F2B029]" />
                    </div>
                    <div>
                      <p className="typo-stat-number text-2xl text-[#0B4F6C]">5.0 ★</p>
                      <p className="typo-stat-label">Layanan Bintang 5</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION INTEGRASI GOOGLE (Lokasi Peta & Ulasan Google Maps) */}
            <BerandaMapAndReviewsSection
              hasApiKey={hasMapsApiKey && !quotaExceeded}
              branchesData={branchesData}
              selectedBranchId={selectedBranchId}
              onSelectBranch={setSelectedBranchId}
            />

            {/* SECTION GALERI FOTO BERJALAN (Auto-Slider Crossfade + Ken Burns) */}
            <section
              aria-label="Galeri Foto Berjalan Sunat Nano"
              className="border-t border-[#E2E8F0] bg-white/65 py-16 sm:py-24"
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-base font-bold text-[#EA580C]">
                    Suasana Ceria &amp; Ramah Anak
                  </p>
                  <h2 className="typo-h2 mt-2">
                    Momen Bahagia di <span className="typo-accent-word">Sunat Nano</span>
                  </h2>
                  <p className="typo-subheadline mx-auto mt-3">
                    Anak tetap santai ditemani orang tua, bebas bermain, dan pulang membawa hadiah
                    Mobil Remote gratis.
                  </p>
                </div>

                <div className="mt-10 mx-auto max-w-5xl">
                  <div className="auto-gallery-frame border-2 border-[#BFDBFE]">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-07-27_at_09.54.39_bb3845ee.webp"
                      alt="Anak tenang bermain game didampingi orang tua di ruang tindakan Sunat Nano Circumcision"
                      referrerPolicy="no-referrer"
                      className="auto-gallery-slide"
                    />
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-09-23_at_09.39.36_fbffa574.webp"
                      alt="Keluarga dan anak tersenyum memegang sertifikat VIP dan hadiah mobil remote di Sunat Nano Circumcision"
                      referrerPolicy="no-referrer"
                      className="auto-gallery-slide"
                    />
                    <img
                      src="/assets/aistudio/toy_unboxing_square_88cf19f6.webp"
                      alt="Anak ceria unboxing hadiah mobil remote RC Sideway Car dari Sunat Nano Circumcision"
                      referrerPolicy="no-referrer"
                      className="auto-gallery-slide"
                    />
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-10-01_at_15.00.44_85b1cf7f.webp"
                      alt="Keluarga bahagia membawa pulang sertifikat dan mobil remote di Sunat Nano Circumcision"
                      referrerPolicy="no-referrer"
                      className="auto-gallery-slide"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 1 (TEASER): METODE SUNAT MODERN KAMI */}
            <section
              id="cuplikan-metode"
              className="border-t border-[#DCE8F5] bg-[#EBF5FD]/40 py-16 sm:py-24"
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-base font-bold text-[#489BE2]">Teknologi Sunat Modern</p>
                  <h2 className="typo-h2 mt-2">
                    Metode Sunat <span className="typo-accent-word">Modern Kami</span>
                  </h2>
                  <p className="typo-subheadline mx-auto mt-3">
                    Tiga keunggulan utama metode Sunat Nano agar si kecil tetap nyaman, minim nyeri,
                    dan cepat kembali beraktivitas.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {CORE_METHODS.map((method, idx) => {
                    const topAccent =
                      idx === 0
                        ? 'border-t-4 border-t-[#489BE2]'
                        : idx === 1
                        ? 'border-t-4 border-t-[#F2B029]'
                        : 'border-t-4 border-t-[#F97316]';
                    const iconFrame =
                      idx === 0
                        ? 'border-[#BFDBFE] bg-white'
                        : idx === 1
                        ? 'border-[#FDE68A] bg-white'
                        : 'border-[#FDBA74] bg-white';

                    return (
                      <article
                        key={method.id}
                        className={`flex flex-col items-center rounded-3xl border border-[#E2E8F0] ${topAccent} bg-white p-6 text-center shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5`}
                      >
                        <div
                          className={`w-full overflow-hidden rounded-2xl border ${iconFrame} aspect-square p-2`}
                        >
                          {/* GANTI GAMBAR METODE */}
                          <img
                            src={method.imageSrc}
                            alt={method.imageAlt}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <h3 className="typo-card-title mt-5 text-xl sm:text-2xl">
                          {method.title}
                        </h3>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-10 text-center">
                  <a
                    href="metode.html"
                    className="typo-cta inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl bg-[#489BE2] px-8 py-3.5 text-base text-white shadow-md hover:bg-[#3182CE] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]"
                  >
                    <span>Lihat Detail Semua Metode</span>
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 2 (TEASER): LAYANAN SUNAT SESUAI USIA */}
            <section
              id="cuplikan-layanan"
              className="border-t border-[#E2E8F0] bg-white/70 py-16 sm:py-24"
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-base font-bold text-[#EA580C]">
                    Layanan Ramah Semua Usia
                  </p>
                  <h2 className="typo-h2 mt-2">
                    Layanan Sunat <span className="typo-accent-word">Sesuai Usia</span>
                  </h2>
                  <p className="typo-subheadline mx-auto mt-3">
                    Penanganan lembut, aman, dan profesional untuk buah hati mulai dari usia bayi,
                    anak-anak, hingga dewasa.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {teaserServices.map((service, idx) => {
                    const topAccent =
                      idx === 0
                        ? 'border-t-4 border-t-[#489BE2]'
                        : idx === 1
                        ? 'border-t-4 border-t-[#F2B029]'
                        : 'border-t-4 border-t-[#F97316]';
                    const imageFrame =
                      idx === 0
                        ? 'border-[#BFDBFE] bg-[#EBF5FD]'
                        : idx === 1
                        ? 'border-[#FDE68A] bg-[#FFFBEB]'
                        : 'border-[#FDBA74] bg-[#FFF7ED]';

                    return (
                      <article
                        key={service.id}
                        className={`flex flex-col items-center rounded-3xl border border-[#E2E8F0] ${topAccent} bg-[#F8FAFC] p-6 text-center shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5`}
                      >
                        <div
                          className={`w-full overflow-hidden rounded-2xl border ${imageFrame} bg-white aspect-square p-2`}
                        >
                          {/* GANTI GAMBAR LAYANAN */}
                          {service.teaserImageSrc ? (
                            <img
                              src={service.teaserImageSrc}
                              alt={service.teaserImageAlt || service.title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              {renderServiceIcon(service.iconKey)}
                            </div>
                          )}
                        </div>
                        <h3 className="typo-card-title mt-5 text-xl sm:text-2xl">
                          {service.title}
                        </h3>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-10 text-center">
                  <a
                    href="layanan.html"
                    className="typo-cta inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] px-8 py-3.5 text-base text-[#EA580C] shadow-sm hover:bg-[#FFEDD5] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                  >
                    <span>Lihat Semua Layanan</span>
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {/* HALAMAN 2: METODE (metode.html) — KARTU METODE INTERAKTIF */}
        {currentPage === 'metode' && (
          <section
            id="metode"
            className="relative overflow-hidden bg-transparent pt-28 pb-16 sm:pt-32 sm:pb-24"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 h-[380px] w-[380px] rounded-full bg-[#489BE2]/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-12 -left-24 h-[340px] w-[340px] rounded-full bg-[#F2B029]/15 blur-3xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="max-w-2xl">
                <p className="text-base font-bold text-[#489BE2]">Teknologi Sunat Modern</p>
                <h1 className="typo-h1 mt-2">
                  Metode <span className="typo-accent-word">Sunat Nano</span>
                </h1>
                <p className="typo-subheadline mt-4">
                  Klik tombol <strong>Selengkapnya</strong> pada tiap kartu metode untuk melihat
                  detail cara kerja dan keunggulannya bagi buah hati.
                </p>
              </div>

              {/* Kartu Metode Interaktif: Awalnya hanya Ikon/Gambar, Judul Singkat & Tombol Selengkapnya */}
              <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
                {CORE_METHODS.map((method, idx) => {
                  const isOpen = Boolean(expandedMethodIds[method.id]);
                  const topAccent =
                    idx === 0
                      ? 'border-t-4 border-t-[#489BE2]'
                      : idx === 1
                      ? 'border-t-4 border-t-[#F2B029]'
                      : 'border-t-4 border-t-[#F97316]';
                  const iconTile =
                    idx === 0
                      ? 'bg-[#EBF5FD] border-[#BFDBFE]'
                      : idx === 1
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-[#FFF7ED] border-[#FDBA74]';
                  const subColor =
                    idx === 0
                      ? 'text-[#489BE2]'
                      : idx === 1
                      ? 'text-[#D97706]'
                      : 'text-[#EA580C]';

                  return (
                    <motion.article
                      key={method.id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`rounded-3xl border border-[#E2E8F0] ${topAccent} bg-white p-6 sm:p-7 shadow-[var(--shadow-card)]`}
                    >
                      {/* Tampilan Depan Ringkas: Gambar/Ikon Alat + Judul Singkat + Tombol Selengkapnya */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-full overflow-hidden rounded-2xl border ${iconTile} bg-white aspect-square p-2`}
                        >
                          {/* GANTI DENGAN GAMBAR ALAT */}
                          <img
                            src={method.imageSrc}
                            alt={method.imageAlt}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <h2 className="typo-card-title mt-5 text-xl sm:text-2xl">
                          {method.title}
                        </h2>

                        <button
                          type="button"
                          onClick={() => toggleMethodDetail(method.id)}
                          aria-expanded={isOpen}
                          className="mt-3 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#EBF5FD] px-4 py-2 text-sm font-bold text-[#2D7FC4] hover:bg-[#DBEAFE] transition-colors"
                        >
                          <span>{isOpen ? 'Tutup ▲' : 'Selengkapnya ▼'}</span>
                        </button>
                      </div>

                      {/* Panel Penjelasan Slide-Down */}
                      <div className="method-detail-panel" data-open={isOpen}>
                        <div className="method-detail-inner">
                          <div className="mt-5 border-t border-[#E2E8F0] pt-5 text-left">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconTile}`}
                              >
                                {renderMethodIcon(method.iconKey)}
                              </span>
                              <p
                                className={`text-xs font-bold uppercase tracking-wider ${subColor}`}
                              >
                                {method.subtitle}
                              </p>
                            </div>

                            <p className="typo-card-desc mt-3 text-sm sm:text-base">
                              {method.description}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
                              <span className="text-xs sm:text-sm font-bold text-[#0F2942]">
                                {method.highlight}
                              </span>
                              <button
                                type="button"
                                onClick={() => openConsultation(`Tanya Metode ${method.title}`)}
                                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#489BE2] hover:text-[#EA580C] transition-colors"
                              >
                                <span>Konsultasi</span>
                                <Sparkles className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Transparansi Paket & Biaya Sunat Nano */}
              <div className="mt-16 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-[var(--shadow-card)]">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div className="max-w-2xl">
                    <p className="text-sm font-bold text-[#EA580C]">
                      Transparansi Biaya &amp; Paket
                    </p>
                    <h2 className="headline-balance mt-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#0F2942]">
                      Pilihan Paket &amp; Estimasi Biaya Resmi
                    </h2>
                    <p className="mt-2 text-base text-[#475569]">
                      Semua paket sudah termasuk{' '}
                      <strong className="text-[#0F2942]">bius tanpa jarum suntik</strong> dan{' '}
                      <strong className="text-[#0F2942]">hadiah Mobil Remote gratis</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPricelistModalOpen(true)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2.5 text-sm font-bold text-[#B45309] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
                  >
                    <span>Lihat Brosur Harga Resmi</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>

                {/* Segmented Category Selector */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div
                    role="tablist"
                    aria-label="Kategori Pasien Sunat Nano"
                    className="inline-flex flex-wrap gap-1.5 rounded-2xl bg-[#EBF5FD] p-1.5 border border-[#BFDBFE]"
                  >
                    {PATIENT_CATEGORIES.map((category) => {
                      const isActive = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`min-h-[40px] rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'bg-[#489BE2] text-white shadow-sm'
                              : 'text-[#475569] hover:text-[#0F2942]'
                          }`}
                        >
                          {category.label}
                        </button>
                      );
                    })}
                  </div>

                  {activeCategoryMeta && (
                    <p className="text-sm text-[#475569]">{activeCategoryMeta.description}</p>
                  )}
                </div>

                {/* Package Cards */}
                <div className="mt-8 grid gap-7 md:grid-cols-2">
                  {activePackages.map((pkg) => {
                    const price = pkg.prices[selectedCategory];
                    const isFavorite = Boolean(pkg.highlight);
                    const isVip = pkg.name.toUpperCase().includes('VIP');
                    const isFeaturesOpen = Boolean(expandedPackageIds[pkg.id]);

                    return (
                      <div
                        key={pkg.id}
                        className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-shadow duration-200 ${
                          isFavorite
                            ? 'border-[#489BE2] bg-[#EBF5FD]/60 shadow-sm'
                            : 'border-[#E2E8F0] bg-[#F8FAFC]'
                        }`}
                      >
                        {isVip && (
                          <span
                            className="vip-crown"
                            role="img"
                            aria-label="Mahkota Paket VIP"
                          >
                            👑
                          </span>
                        )}

                        <div>
                          {/* GANTI DENGAN GAMBAR PAKET */}
                          <img
                            src={pkg.imageSrc}
                            alt={pkg.imageAlt}
                            referrerPolicy="no-referrer"
                            className="card-image"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                            <span className="text-[#489BE2]">{pkg.shortTag}</span>
                            {pkg.highlight && (
                              <span className="rounded-full bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 text-[#EA580C]">
                                {pkg.highlight}
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
                            <h3 className="font-heading text-xl font-bold text-[#0F2942]">
                              {pkg.name}
                            </h3>
                            <p className="font-heading text-2xl font-bold text-[#EA580C] tabular-nums">
                              {price}
                            </p>
                          </div>

                          <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                            {pkg.summary}
                          </p>

                          <div className="mt-4 border-t border-[#E2E8F0] pt-4">
                            <div className="fitur-list" data-open={isFeaturesOpen}>
                              <ul className="space-y-2">
                                {pkg.features.map((feat) => (
                                  <li
                                    key={feat}
                                    className="flex items-start gap-2.5 text-sm text-[#0F2942]"
                                  >
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F2B029]" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              type="button"
                              onClick={() => togglePackageFeatures(pkg.id)}
                              aria-expanded={isFeaturesOpen}
                              className="btn-toggle-fitur"
                            >
                              {isFeaturesOpen ? 'Tutup ▲' : 'Selengkapnya ▼'}
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              openConsultation(
                                `${pkg.name} - ${activeCategoryMeta?.label ?? ''} (${price})`
                              )
                            }
                            className={`inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                              isFavorite
                                ? 'bg-[#489BE2] text-white hover:bg-[#3182CE]'
                                : 'bg-white border border-[#FDBA74] text-[#EA580C] hover:bg-[#FFF7ED]'
                            }`}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Konsultasi Paket Ini</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Konsultasi Bawah */}
              <div className="mt-14 text-center">
                <p className="text-base font-semibold text-[#334155]">
                  Masih bingung memilih metode terbaik untuk buah hati? Konsultasi gratis bersama
                  tim dokter kami.
                </p>
                <button
                  type="button"
                  onClick={() => openConsultation('Tanya Rekomendasi Metode Sunat Nano')}
                  className="typo-cta mt-4 inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-[#489BE2] px-8 py-3.5 text-base text-white shadow-md hover:bg-[#3182CE] transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Konsultasi Gratis</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* HALAMAN 3: LAYANAN (layanan.html) */}
        {currentPage === 'layanan' && (
          <section
            id="layanan"
            className="relative overflow-hidden bg-transparent pt-28 pb-16 sm:pt-32 sm:pb-24"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 h-[380px] w-[380px] rounded-full bg-[#489BE2]/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 -left-24 h-[340px] w-[340px] rounded-full bg-[#F2B029]/15 blur-3xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-base font-bold text-[#EA580C]">
                    Layanan Lengkap Sesuai Usia &amp; Kebutuhan
                  </p>
                  <h1 className="typo-h1 mt-2">
                    Layanan <span className="typo-accent-word">Kami</span>
                  </h1>
                  <p className="typo-subheadline mt-4">
                    Mulai dari sunat bayi, anak-anak, remaja, dewasa, hingga sunat perbaikan dan
                    layanan Home Visit ke rumah Anda.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openConsultation('Tanya Rekomendasi Layanan Sunat')}
                  className="typo-cta inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-6 py-3 text-sm sm:text-base text-white shadow-sm hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Konsultasi Gratis</span>
                </button>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICE_CATEGORIES.map((service, idx) => {
                  const cycle = idx % 3;
                  const iconBox =
                    cycle === 0
                      ? 'bg-[#EBF5FD] border-[#BFDBFE]'
                      : cycle === 1
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-[#FFF7ED] border-[#FDBA74]';
                  const tagText =
                    cycle === 0
                      ? 'text-[#489BE2]'
                      : cycle === 1
                      ? 'text-[#D97706]'
                      : 'text-[#EA580C]';

                  return (
                    <article
                      key={service.id}
                      className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs ${iconBox}`}
                          >
                            {renderServiceIcon(service.iconKey)}
                          </div>
                          <span className={`text-xs font-bold ${tagText}`}>
                            {service.ageOrScope}
                          </span>
                        </div>

                        <h2 className="typo-card-title mt-5">{service.title}</h2>
                        <p className="typo-card-desc mt-2.5">{service.description}</p>
                      </div>

                      <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                        <button
                          type="button"
                          onClick={() => openConsultation(service.topicPrompt)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#489BE2] hover:text-[#EA580C] transition-colors"
                        >
                          <span>Konsultasi {service.title}</span>
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={() => openConsultation('Jadwalkan Layanan Sunat Nano')}
                  className="typo-cta inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-[#489BE2] px-8 py-3.5 text-base text-white shadow-md hover:bg-[#3182CE] transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Konsultasi Gratis Sekarang</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* HALAMAN 4: GALERI (galeri.html) */}
        {currentPage === 'galeri' && (
          <section
            id="galeri"
            className="relative overflow-hidden bg-transparent pt-28 pb-16 sm:pt-32 sm:pb-24"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 h-[380px] w-[380px] rounded-full bg-[#489BE2]/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 -left-24 h-[340px] w-[340px] rounded-full bg-[#F2B029]/15 blur-3xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 text-base font-bold text-[#489BE2]">
                    <Images className="h-4 w-4" />
                    <span>Dokumentasi Keluarga &amp; Buah Hati</span>
                  </p>
                  <h1 className="typo-h1 mt-2">
                    Galeri <span className="typo-accent-word">Keceriaan</span>
                  </h1>
                  <p className="typo-subheadline mt-4">
                    Momen hangat dan senyum ceria anak-anak bersama orang tua serta tim dokter Sunat
                    Nano Circumcision.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openConsultation('Tanya Jadwal Kunjungan Klinik')}
                  className="typo-cta inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-6 py-3 text-sm sm:text-base text-white shadow-sm hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Konsultasi Gratis</span>
                </button>
              </div>

              {/* Grid / Masonry Foto Keluarga & Anak */}
              <div className="mt-10 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
                {GALLERY_PHOTOS.map((photo, idx) => {
                  const badgeStyle =
                    idx % 3 === 0
                      ? 'bg-[#EBF5FD] text-[#2D7FC4] border-[#BFDBFE]'
                      : idx % 3 === 1
                      ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      : 'bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]';

                  return (
                    <figure
                      key={photo.id}
                      className="break-inside-avoid overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="overflow-hidden bg-[#EBF5FD]">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <figcaption className="p-5">
                        <span
                          className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${badgeStyle}`}
                        >
                          {photo.category}
                        </span>
                        <h2 className="mt-2.5 font-heading text-lg font-bold text-[#0F2942]">
                          {photo.title}
                        </h2>
                        <p className="mt-1 text-sm text-[#475569]">{photo.alt}</p>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={() => openConsultation('Konsultasi Sunat Anak')}
                  className="typo-cta inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-[#489BE2] px-8 py-3.5 text-base text-white shadow-md hover:bg-[#3182CE] transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Konsultasi Gratis</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="typo-footer border-t-4 border-t-[#F2B029] bg-[#0F2942] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand & Tagline */}
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                {!mascotError ? (
                  <img
                    src={ASSETS.mascotLogo}
                    alt="Sunat Nano Circumcision"
                    referrerPolicy="no-referrer"
                    onError={() => setMascotError(true)}
                    className="h-11 w-11 rounded-xl object-cover border border-[#E2E8F0]"
                  />
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#489BE2] font-heading font-semibold text-white">
                    SN
                  </span>
                )}
                <SunatNanoWordmark
                  className="text-xl sm:text-2xl"
                  showCircumcision
                  circumcisionClassName="text-xs sm:text-sm"
                />
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#E2E8F0]">
                Sunat Canggih &amp; Modern untuk Anak Indonesia. Metode tanpa jahitan, bius tanpa
                jarum suntik, dan pendampingan dokter yang ramah anak.
              </p>

              <button
                type="button"
                onClick={() => openConsultation()}
                className="typo-cta mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-5 py-2.5 text-sm text-white hover:bg-[#3182CE] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="md:col-span-3">
              <h3 className="font-heading text-base font-semibold text-[#F2B029]">Navigasi</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#E2E8F0]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-[#F2B029] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak & Sosmed */}
            <div className="md:col-span-4">
              <h3 className="font-heading text-base font-semibold text-[#F2B029]">
                Hubungi Kami
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#E2E8F0]">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#489BE2]" />
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F2B029] transition-colors tabular-nums font-semibold"
                  >
                    WhatsApp Admin: {WHATSAPP_CONFIG.displayNumber}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#F2B029]" />
                  <span>halo@sunatnano.id</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F97316]" />
                  <span>Cabang Bangkalan · Surabaya · Sidoarjo (Klinik &amp; Home Visit)</span>
                </li>
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-semibold text-[#CBD5E1]">
                <a
                  href="https://www.instagram.com/sunat_nano_circumcision/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram @sunat_nano_circumcision
                </a>
                <span aria-hidden="true">·</span>
                <span>TikTok @nano.circumcision</span>
                <span aria-hidden="true">·</span>
                <span>FB @Sunat_nano_circumcision</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-[#CBD5E1]">
            <p>© {new Date().getFullYear()} Sunat Nano Circumcision. Seluruh hak cipta dilindungi.</p>
            <p className="inline-flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-[#F97316]" />
              <span>Sunat Anak Modern · Tenang untuk Orang Tua, Ceria untuk Si Kecil</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Tombol Melayang Konsultasi WhatsApp */}
      <button
        type="button"
        onClick={() => openConsultation()}
        aria-label="Konsultasi Gratis via WhatsApp"
        className="floating-wa-btn fixed bottom-5 right-5 z-40 rounded-full bg-[#25D366] text-sm sm:text-base font-bold text-white shadow-lg hover:bg-[#1EBE5D] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        {/* GANTI DENGAN GAMBAR MASKOT KUCING ANDA (PNG Transparan) */}
        <img
          src="/assets/aistudio/Jumping_Cat_with_Red_Race_Car-removebg-preview_82478ce4.png"
          alt="Maskot Kucing Sunat Nano"
          referrerPolicy="no-referrer"
          className="maskot-btn"
        />
        <span className="hidden sm:inline">Konsultasi Gratis</span>
      </button>

      {/* Pop-up Modal Konsultasi Gratis via WhatsApp */}
      <WhatsAppModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        contextTopic={waContextTopic}
      />

      {/* Modal Brosur Pricelist Resmi */}
      <PricelistModal
        isOpen={pricelistModalOpen}
        onClose={() => setPricelistModalOpen(false)}
        onConsult={(topic) => openConsultation(topic)}
      />
    </div>
  );

  if (hasMapsApiKey && !quotaExceeded) {
    return (
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="id" region="ID">
        <PlacesDataSync onData={setBranchesData} />
        {appShell}
      </APIProvider>
    );
  }

  return appShell;
}
