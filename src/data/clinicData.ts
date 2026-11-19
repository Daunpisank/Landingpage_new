export const WHATSAPP_CONFIG = {
  phoneNumber: '6285236959788',
  displayNumber: '0852-3695-9788',
  defaultMessage:
    'Halo Admin Sunat Nano, saya ingin konsultasi gratis tentang layanan sunat anak.',
};

export function buildWhatsAppLink(customMessage?: string): string {
  const message = customMessage ?? WHATSAPP_CONFIG.defaultMessage;
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
}

export const ASSETS = {
  mascotLogo: '/assets/aistudio/WhatsApp_Image_2026-07-15_at_14.33.22_7ea65c16.jpeg',
  pricelistPoster: '/assets/aistudio/Pricelist_lengkap_2c1365d3.jpg',
};

export const HERO_GALLERY_PHOTOS = [
  {
    src: '/assets/aistudio/WhatsApp_Image_2026-07-27_at_09.54.39_bb3845ee.webp',
    alt: 'Anak tenang bermain game didampingi orang tua di ruang tindakan Sunat Nano Circumcision',
    caption: 'Suasana klinik ceria & boleh bermain game',
  },
  {
    src: '/assets/aistudio/WhatsApp_Image_2026-09-23_at_09.39.36_fbffa574.webp',
    alt: 'Keluarga dan anak tersenyum memegang sertifikat VIP dan hadiah mobil remote di Sunat Nano Circumcision',
    caption: 'Pulang bawa sertifikat VIP & Mobil Remote gratis',
  },
  {
    src: '/assets/aistudio/toy_unboxing_square_88cf19f6.webp',
    alt: 'Anak ceria unboxing hadiah mobil remote RC Sideway Car dari Sunat Nano Circumcision',
    caption: 'Hadiah langsung Mobil Remote untuk si kecil',
  },
];

export type PatientCategory = 'reguler' | 'gemuk' | 'abk' | 'dewasa';

export interface CategoryOption {
  id: PatientCategory;
  label: string;
  description: string;
}

export const PATIENT_CATEGORIES: CategoryOption[] = [
  {
    id: 'reguler',
    label: 'Anak Reguler',
    description: 'Usia balita hingga remaja dengan kondisi standar yang nyaman dan ceria.',
  },
  {
    id: 'gemuk',
    label: 'Sunat Gemuk',
    description: 'Penanganan khusus anak bertubuh gemuk agar hasil tetap rapi tanpa perlu diet ketat dulu.',
  },
  {
    id: 'abk',
    label: 'Sunat ABK',
    description: 'Pendekatan ekstra sabar dan lembut untuk Anak Berkebutuhan Khusus.',
  },
  {
    id: 'dewasa',
    label: 'Sunat Dewasa',
    description: 'Layanan privat, higienis, dan cepat pulih untuk remaja akhir hingga dewasa.',
  },
];

export interface CoreMethodItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  iconKey: 'sealer' | 'painless' | 'stitchfree';
  imageSrc: string;
  imageAlt: string;
}

export const CORE_METHODS: CoreMethodItem[] = [
  {
    id: 'bipolar-teknosealer',
    title: 'Bipolar Teknosealer',
    subtitle: 'Glans Pro Bipolar Pen Sealer',
    description:
      'Teknologi penyegel jaringan presisi tinggi yang meminimalkan risiko perdarahan sekaligus memberikan hasil estetis dan simetris tanpa trauma jaringan berlebih.',
    highlight: 'Proses singkat 10–20 menit',
    iconKey: 'sealer',
    imageSrc: '/assets/aistudio/Glowing_Medical_Kitten_Mascot_ebcfdd57.webp',
    imageAlt: 'Maskot Dokter Kucing memegang alat Bipolar Teknosealer modern Sunat Nano',
  },
  {
    id: 'minim-nyeri',
    title: 'Minim Nyeri',
    subtitle: 'Bius Tanpa Jarum Suntik',
    description:
      'Menggunakan teknologi bius tanpa jarum suntik bertekanan lembut yang bersahabat bagi anak. Didukung suasana ceria sehingga si kecil tetap tenang tanpa rasa takut.',
    highlight: 'Anak tetap santai & boleh main',
    iconKey: 'painless',
    imageSrc: '/assets/aistudio/Cheerful_Gaming_With_a_Cat_Doctor_48c3c864.webp',
    imageAlt: 'Anak ceria bermain game bersama Dokter Kucing saat sunat minim nyeri di Sunat Nano',
  },
  {
    id: 'tanpa-jahitan',
    title: 'Tanpa Jahitan',
    subtitle: 'Cepat Pulih & Praktis Dirawat',
    description:
      'Tidak memerlukan benang jahit yang harus dicabut ataupun perban tebal yang merepotkan. Luka lebih cepat mengering dan anak bisa beraktivitas ringan lebih awal.',
    highlight: 'Tanpa cabut benang pasca sunat',
    iconKey: 'stitchfree',
    imageSrc: '/assets/aistudio/Boy_and_Cat_Doctor_Race_a_Toy_Car_145b03db.webp',
    imageAlt: 'Anak aktif bermain mobil mainan bersama Dokter Kucing setelah sunat tanpa jahitan',
  },
];

export interface ServiceCategoryItem {
  id: string;
  title: string;
  ageOrScope: string;
  description: string;
  topicPrompt: string;
  iconKey: 'baby' | 'child' | 'teen' | 'adult' | 'revision' | 'home';
  teaserImageSrc?: string;
  teaserImageAlt?: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  {
    id: 'bayi',
    title: 'Sunat Bayi',
    ageOrScope: 'Usia 0 – 12 Bulan',
    description:
      'Penanganan super lembut dan higienis oleh dokter berpengalaman. Pemulihan jaringan bayi berlangsung sangat cepat dengan minim rewel.',
    topicPrompt: 'Layanan Sunat Bayi',
    iconKey: 'baby',
    teaserImageSrc: '/assets/aistudio/Caring_Cat_Doctor_and_Sleeping_Baby_f4e54681.webp',
    teaserImageAlt: 'Ilustrasi Dokter Kucing merawat bayi yang tidur tenang untuk layanan Sunat Bayi',
  },
  {
    id: 'anak',
    title: 'Sunat Anak',
    ageOrScope: 'Reguler · Gemuk · ABK',
    description:
      'Melayani anak reguler, sunat anak gemuk tanpa diet ketat, hingga anak berkebutuhan khusus (ABK). Termasuk hadiah Mobil Remote gratis.',
    topicPrompt: 'Layanan Sunat Anak (Reguler / Gemuk / ABK)',
    iconKey: 'child',
    teaserImageSrc: '/assets/aistudio/Boy_and_Cat_Doctor_High-Five_b6aebdc9.webp',
    teaserImageAlt: 'Ilustrasi anak ceria membawa mobil mainan tos bersama Dokter Kucing untuk Sunat Anak',
  },
  {
    id: 'remaja',
    title: 'Sunat Remaja',
    ageOrScope: 'Usia SMP – SMA',
    description:
      'Metode presisi dengan hasil rapi dan estetis. Pemulihan cepat agar remaja dapat segera kembali sekolah dan beraktivitas seperti biasa.',
    topicPrompt: 'Layanan Sunat Remaja',
    iconKey: 'teen',
  },
  {
    id: 'dewasa',
    title: 'Sunat Dewasa',
    ageOrScope: 'Privat & Higienis',
    description:
      'Ditangani secara profesional di ruang tindakan privat untuk kenyamanan penuh, minim nyeri, dan masa pemulihan yang terukur.',
    topicPrompt: 'Layanan Sunat Dewasa',
    iconKey: 'adult',
    teaserImageSrc: '/assets/aistudio/Cheerful_Doctor_Cat_Team_6aca939f.webp',
    teaserImageAlt: 'Ilustrasi pria dewasa dan Dokter Kucing profesional untuk layanan Sunat Dewasa',
  },
  {
    id: 'perbaikan',
    title: 'Sunat Perbaikan',
    ageOrScope: 'Revisi Hasil Sebelumnya',
    description:
      'Konsultasi dan tindakan koreksi bagi pasien dengan hasil sunat sebelumnya yang kurang rapi atau belum optimal agar nyaman secara medis maupun estetis.',
    topicPrompt: 'Layanan Sunat Perbaikan / Revisi',
    iconKey: 'revision',
  },
  {
    id: 'home-visit',
    title: 'Layanan Home Visit',
    ageOrScope: 'Dokter Datang ke Rumah',
    description:
      'Nikmati kenyamanan dan privasi maksimal tanpa perlu keluar rumah atau antre. Tim dokter membawa peralatan steril lengkap ke lokasi Anda.',
    topicPrompt: 'Layanan Home Visit ke Rumah',
    iconKey: 'home',
  },
];

export interface MethodPackage {
  id: string;
  name: string;
  shortTag: string;
  highlight?: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  features: string[];
  prices: Partial<Record<PatientCategory, string>>;
}

export const METHOD_PACKAGES: MethodPackage[] = [
  {
    id: 'bipolar-vip',
    name: 'Glans Pro Bipolar Pen Sealer VIP',
    shortTag: 'Tanpa Jahitan · Pemulihan Tercepat',
    highlight: 'Pilihan Favorit Orang Tua',
    summary:
      'Teknologi Bipolar Pen Sealer presisi tinggi dengan pemulihan paling cepat, tanpa jahitan, tanpa perban, dan pendampingan penuh.',
    imageSrc: '/assets/aistudio/WhatsApp_Image_2026-09-23_at_09.39.36_fbffa574.webp',
    imageAlt: 'Paket Glans Pro Bipolar Pen Sealer VIP Sunat Nano Circumcision',
    features: [
      'Bius tanpa jarum suntik (nyaman untuk anak)',
      'Teknologi Bipolar Pen Sealer minim perdarahan',
      'Tanpa jahitan dan tanpa lepas alat kontrol',
      'Bonus langsung Mobil Remote & paket perawatan lengkap',
    ],
    prices: {
      reguler: 'Rp 2.700.000',
      gemuk: 'Rp 2.900.000',
      abk: 'Rp 3.000.000',
      dewasa: 'Rp 3.500.000',
    },
  },
  {
    id: 'bipolar-reg',
    name: 'Glans Pro Bipolar Pen Sealer REG',
    shortTag: 'Tanpa Jahitan · Praktis & Rapi',
    summary:
      'Menggunakan alat Bipolar Pen Sealer modern yang menyegel jaringan secara lembut agar anak lebih cepat kembali bermain.',
    imageSrc: '/assets/aistudio/WhatsApp_Image_2026-09-25_at_10.26.58_c132c1e1.webp',
    imageAlt: 'Paket Glans Pro Bipolar Pen Sealer REG Sunat Nano Circumcision',
    features: [
      'Bius tanpa jarum suntik yang ramah anak',
      'Proses tindakan singkat 10–20 menit',
      'Tanpa jahitan, hasil estetik dan bersih',
      'Bonus langsung Mobil Remote untuk si kecil',
    ],
    prices: {
      reguler: 'Rp 2.400.000',
      gemuk: 'Rp 2.600.000',
      abk: 'Rp 2.700.000',
      dewasa: 'Rp 3.200.000',
    },
  },
  {
    id: 'klamp-vip',
    name: 'Nano Klamp VIP',
    shortTag: 'Klamp Ringan · Anak Bebas Aktivitas',
    summary:
      'Metode klamp generasi terbaru dengan pelindung ringan sehingga anak dapat langsung mandi dan memakai celana dengan nyaman.',
    imageSrc: '/assets/aistudio/toy_unboxing_square_88cf19f6.webp',
    imageAlt: 'Paket Nano Klamp VIP Sunat Nano Circumcision',
    features: [
      'Bius tanpa jarum suntik bebas rasa cemas',
      'Pelindung klamp ringan, aman saat bergerak',
      'Pendampingan kontrol dan perawatan lengkap',
      'Bonus langsung Mobil Remote pilihan anak',
    ],
    prices: {
      reguler: 'Rp 1.900.000',
      gemuk: 'Rp 2.100.000',
      abk: 'Rp 2.200.000',
    },
  },
  {
    id: 'klamp-reg',
    name: 'Nano Klamp REG',
    shortTag: 'Ekonomis · Aman & Higienis',
    summary:
      'Pilihan metode modern yang tetap mengutamakan kenyamanan anak tanpa jahitan dan dengan biaya yang terjangkau.',
    imageSrc: '/assets/aistudio/WhatsApp_Image_2026-07-27_at_09.54.39_bb3845ee.webp',
    imageAlt: 'Paket Nano Klamp REG Sunat Nano Circumcision',
    features: [
      'Bius tanpa jarum suntik',
      'Tanpa jahitan konvensional',
      'Panduan perawatan luka rumah yang mudah diikuti',
      'Bonus langsung Mobil Remote untuk anak',
    ],
    prices: {
      reguler: 'Rp 1.600.000',
      gemuk: 'Rp 1.800.000',
      abk: 'Rp 1.900.000',
    },
  },
];

export interface ParentTestimonial {
  id: string;
  parentName: string;
  cityAndService: string;
  rating: number;
  quote: string;
  photoSrc?: string;
  photoAlt?: string;
}

export const PARENT_TESTIMONIALS: ParentTestimonial[] = [
  {
    id: 'testi-1',
    parentName: 'Bunda Rina & Ayah Dimas',
    cityAndService: 'Surabaya · Paket Bipolar VIP',
    rating: 5,
    quote:
      'Awalnya anak saya takut banget dengar kata sunat, tapi di Sunat Nano suasananya ceria. Biusnya tanpa jarum suntik jadi tidak menangis, pulangnya senang sekali bawa mobil remote.',
    photoSrc: '/assets/aistudio/WhatsApp_Image_2026-09-23_at_09.39.36_fbffa574.webp',
    photoAlt: 'Keluarga dan anak tersenyum ceria bersama di Sunat Nano Circumcision',
  },
  {
    id: 'testi-2',
    parentName: 'Ayah Hendra Saputra',
    cityAndService: 'Sidoarjo · Sunat Anak Gemuk',
    rating: 5,
    quote:
      'Dokternya sangat sabar menjelaskan step by step ke orang tua dan anak. Tanpa jahitan benar-benar praktis dirawat di rumah, hari ketiga anak sudah aktif lagi.',
    photoSrc: '/assets/aistudio/WhatsApp_Image_2026-09-25_at_10.26.58_c132c1e1.webp',
    photoAlt: 'Anak tersenyum memegang sertifikat dan mobil remote di Sunat Nano',
  },
  {
    id: 'testi-3',
    parentName: 'Bunda Siti Aminah',
    cityAndService: 'Bangkalan · Sunat Remaja',
    rating: 5,
    quote:
      'Alhamdulillah sunat di sini sangat tenang, ruangannya bersih, tim medisnya ramah sekali. Konsultasi pasca sunat via WhatsApp juga selalu dijawab cepat oleh dokter.',
    photoSrc: '/assets/aistudio/WhatsApp_Image_2026-09-19_at_12.02.10_8ba043b1.webp',
    photoAlt: 'Keluarga berfoto ceria di klinik Sunat Nano Circumcision',
  },
  {
    id: 'testi-4',
    parentName: 'Bunda Nadia & Keluarga',
    cityAndService: 'Surabaya · Layanan Home Visit',
    rating: 5,
    quote:
      'Pilih layanan Home Visit karena ingin privasi dan anak lebih nyaman di kamar sendiri. Peralatan dokter steril lengkap, tindakan cepat 15 menit dan hasilnya rapi.',
  },
];

export interface ClinicBranchConfig {
  id: 'bangkalan' | 'surabaya' | 'sidoarjo';
  cityLabel: string;
  searchQuery: string;
  areaDescription: string;
  mapsSearchUrl: string;
}

export const CLINIC_BRANCHES: ClinicBranchConfig[] = [
  {
    id: 'bangkalan',
    cityLabel: 'Bangkalan',
    searchQuery: 'Sunat Nano Circumcision Bangkalan',
    areaDescription:
      'Melayani kunjungan klinik di wilayah Bangkalan & Madura serta layanan Home Visit.',
    mapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Sunat+Nano+Circumcision+Bangkalan',
  },
  {
    id: 'surabaya',
    cityLabel: 'Surabaya',
    searchQuery: 'Sunat Nano Circumcision Surabaya',
    areaDescription:
      'Melayani area Surabaya Barat, Timur, Selatan, Utara, Pusat, dan Home Visit.',
    mapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Sunat+Nano+Circumcision+Surabaya',
  },
  {
    id: 'sidoarjo',
    cityLabel: 'Sidoarjo',
    searchQuery: 'Sunat Nano Circumcision Sidoarjo',
    areaDescription:
      'Melayani area Sidoarjo Kota, Waru, Taman, Gedangan, Candi, dan sekitarnya.',
    mapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Sunat+Nano+Circumcision+Sidoarjo',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-nyeri',
    question: 'Apakah sakit saat dibius dan saat tindakan sunat?',
    answer:
      'Kami menggunakan teknologi bius tanpa jarum suntik sehingga anak tidak merasakan tusukan jarum yang menakutkan. Saat bius bekerja, area tindakan menjadi kebas dan anak hanya merasakan sentuhan ringan, sambil tetap ditemani orang tua, membawa mainan, atau menonton tayangan favorit.',
  },
  {
    id: 'faq-pemulihan',
    question: 'Berapa lama pemulihan setelah sunat di Sunat Nano?',
    answer:
      'Dengan metode Bipolar Teknosealer maupun Nano Klamp yang tanpa jahitan, anak umumnya sudah nyaman beraktivitas ringan di rumah dalam 1–3 hari dan pulih optimal dalam 5–7 hari. Perawatan luka di rumah sangat praktis tanpa harus repot cabut benang.',
  },
  {
    id: 'faq-metode',
    question: 'Metode apa yang dipakai dan bagaimana menentukan pilihan terbaik?',
    answer:
      'Sunat Nano menyediakan metode modern unggulan Glans Pro Bipolar Pen Sealer (tanpa jahitan dan tanpa alat menempel) serta Nano Klamp (pelindung ringan bebas aktivitas). Dokter akan memeriksa kondisi anatomis dan merekomendasikan metode paling aman saat sesi konsultasi.',
  },
  {
    id: 'faq-durasi',
    question: 'Berapa lama proses sunat berlangsung dari datang hingga selesai?',
    answer:
      'Tindakan inti berjalan singkat sekitar 10 hingga 20 menit saja. Secara keseluruhan, Ayah dan Bunda cukup meluangkan waktu sekitar 45 menit termasuk sesi perkenalan agar anak rileks, pemeriksaan dokter, serta edukasi perawatan pasca sunat.',
  },
  {
    id: 'faq-khusus',
    question: 'Apakah melayani bayi, anak gemuk, anak ABK, dewasa, atau Home Visit?',
    answer:
      'Ya, kami melayani seluruh kelompok usia mulai dari sunat bayi, anak reguler, sunat gemuk (tanpa harus diet dulu), anak berkebutuhan khusus (ABK), sunat remaja & dewasa, hingga sunat perbaikan. Tersedia juga layanan Home Visit bagi keluarga yang memilih tindakan di rumah.',
  },
  {
    id: 'faq-hadiah',
    question: 'Apakah anak benar-benar mendapat hadiah Mobil Remote gratis?',
    answer:
      'Benar! Setiap anak yang selesai menjalani tindakan sunat di Sunat Nano berhak membawa pulang hadiah Mobil Remote gratis serta sertifikat keberanian agar momen sunat menjadi kenangan yang membanggakan.',
  },
];

export interface GalleryPhotoItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

export const GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'galeri-1',
    src: '/assets/aistudio/WhatsApp_Image_2026-07-27_at_09.54.39_bb3845ee.webp',
    alt: 'Anak tenang bermain game didampingi orang tua di ruang tindakan Sunat Nano Circumcision',
    title: 'Tenang & Boleh Main Game',
    category: 'Suasana Tindakan',
  },
  {
    id: 'galeri-2',
    src: '/assets/aistudio/WhatsApp_Image_2026-09-23_at_09.39.36_fbffa574.webp',
    alt: 'Keluarga dan anak tersenyum memegang sertifikat VIP dan hadiah mobil remote di Sunat Nano Circumcision',
    title: 'Bangga Raih Sertifikat VIP & RC Car',
    category: 'Momen Keluarga',
  },
  {
    id: 'galeri-3',
    src: '/assets/aistudio/toy_unboxing_square_88cf19f6.webp',
    alt: 'Anak ceria unboxing hadiah mobil remote RC Sideway Car dari Sunat Nano Circumcision',
    title: 'Hadiah Langsung Mobil Remote',
    category: 'Hadiah Anak',
  },
  {
    id: 'galeri-4',
    src: '/assets/aistudio/WhatsApp_Image_2026-09-25_at_10.26.58_c132c1e1.webp',
    alt: 'Keluarga berfoto ceria bersama sertifikat sunat di Sunat Nano Circumcision',
    title: 'Senyum Hangat Keluarga',
    category: 'Momen Keluarga',
  },
  {
    id: 'galeri-5',
    src: '/assets/aistudio/WhatsApp_Image_2026-09-10_at_14.21.01_bc85d19d.webp',
    alt: 'Anak-anak berani berfoto bersama orang tua di Sunat Nano Circumcision',
    title: 'Para Jagoan Berani Sunat',
    category: 'Dokumentasi Pasien',
  },
  {
    id: 'galeri-6',
    src: '/assets/aistudio/WhatsApp_Image_2026-09-19_at_12.02.10_8ba043b1.webp',
    alt: 'Keluarga berpose santai setelah tindakan sunat di Sunat Nano Circumcision',
    title: 'Nyaman untuk Anak & Remaja',
    category: 'Sunat Remaja',
  },
  {
    id: 'galeri-7',
    src: '/assets/aistudio/WhatsApp_Image_2026-10-01_at_15.00.44_85b1cf7f.webp',
    alt: 'Keluarga bahagia membawa pulang sertifikat dan mobil remote di Sunat Nano Circumcision',
    title: 'Pulang Ceria Bawa Mobil Remote',
    category: 'Hadiah Anak',
  },
];
