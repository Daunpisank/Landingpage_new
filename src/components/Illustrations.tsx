import React from 'react';

export const HeroClinicIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Ilustrasi dokter ramah mendampingi anak yang tersenyum ceria di Klinik Sunat Nano"
    >
      <defs>
        <linearGradient id="bgSky" x1="0" y1="0" x2="520" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="55%" stopColor="#F0FDFA" />
          <stop offset="100%" stopColor="#FFFBEB" />
        </linearGradient>
        <linearGradient id="sofaBlue" x1="120" y1="260" x2="400" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="warmYellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Soft sunlit room backdrop */}
      <rect x="0" y="0" width="520" height="420" rx="28" fill="url(#bgSky)" />

      {/* Sunlit window frame */}
      <rect x="44" y="38" width="142" height="118" rx="18" fill="#FFFFFF" fillOpacity="0.85" stroke="#BAE6FD" strokeWidth="2" />
      <line x1="115" y1="38" x2="115" y2="156" stroke="#E0F2FE" strokeWidth="3" />
      <line x1="44" y1="97" x2="186" y2="97" stroke="#E0F2FE" strokeWidth="3" />
      <circle cx="84" cy="70" r="14" fill="url(#warmYellow)" />
      <path d="M130 82C136 74 148 74 154 82C160 82 164 87 164 92C164 97 159 101 153 101H128C123 101 119 97 119 92C119 87 124 82 130 82Z" fill="#BAE6FD" />

      {/* Wall shelf with toy & plant */}
      <rect x="330" y="78" width="132" height="10" rx="5" fill="#CBD5E1" />
      <rect x="348" y="44" width="24" height="34" rx="6" fill="#0D9488" />
      <circle cx="360" cy="36" r="10" fill="#5EEAD4" />
      <rect x="394" y="52" width="44" height="26" rx="8" fill="#F97316" />
      <circle cx="404" cy="78" r="7" fill="#0F2942" />
      <circle cx="428" cy="78" r="7" fill="#0F2942" />

      {/* Floor shadow */}
      <ellipse cx="260" cy="368" rx="196" ry="22" fill="#BAE6FD" fillOpacity="0.55" />

      {/* Playful Sofa / Treatment Lounge */}
      <rect x="92" y="238" width="336" height="114" rx="26" fill="url(#sofaBlue)" />
      <rect x="76" y="274" width="38" height="78" rx="18" fill="#0369A1" />
      <rect x="406" y="274" width="38" height="78" rx="18" fill="#0369A1" />
      <rect x="114" y="286" width="292" height="58" rx="16" fill="#7DD3FC" fillOpacity="0.45" />

      {/* Friendly Doctor (Left) */}
      {/* Body / White coat */}
      <path d="M138 228C138 194 164 176 198 176C232 176 254 196 254 228V316H138V228Z" fill="#FFFFFF" stroke="#DCE8F5" strokeWidth="2" />
      {/* Teal Scrub */}
      <path d="M180 178L198 222L216 178H180Z" fill="#0D9488" />
      {/* Stethoscope */}
      <path d="M174 184C174 218 186 238 202 238C218 238 226 218 226 184" stroke="#0F2942" strokeWidth="4" strokeLinecap="round" />
      <circle cx="202" cy="244" r="7" fill="#F59E0B" stroke="#0F2942" strokeWidth="2.5" />
      {/* Doctor Head */}
      <circle cx="196" cy="138" r="36" fill="#FDBA74" />
      {/* Hair */}
      <path d="M160 132C160 108 178 96 198 96C220 96 234 110 232 132C222 122 208 118 192 118C178 118 168 124 160 132Z" fill="#1E293B" />
      {/* Warm glasses & smile */}
      <circle cx="184" cy="138" r="8" stroke="#0F2942" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.3" />
      <circle cx="210" cy="138" r="8" stroke="#0F2942" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.3" />
      <line x1="192" y1="138" x2="202" y2="138" stroke="#0F2942" strokeWidth="2.5" />
      <circle cx="184" cy="138" r="2.2" fill="#0F2942" />
      <circle cx="210" cy="138" r="2.2" fill="#0F2942" />
      <path d="M188 153C193 159 202 159 207 153" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
      {/* Doctor gentle thumbs-up / welcoming hand */}
      <path d="M242 224L276 212" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
      <circle cx="282" cy="210" r="11" fill="#FDBA74" />

      {/* Happy Child (Right) */}
      {/* Shirt */}
      <path d="M286 244C286 218 306 204 332 204C358 204 378 218 378 244V316H286V244Z" fill="#F59E0B" />
      {/* Cute stripe on shirt */}
      <rect x="294" y="256" width="76" height="12" rx="6" fill="#FDE68A" />
      {/* Child Head */}
      <circle cx="332" cy="168" r="32" fill="#FED7AA" />
      {/* Child Hair */}
      <path d="M298 164C298 140 316 128 336 128C354 128 368 140 366 164C358 152 344 148 330 148C316 148 306 154 298 164Z" fill="#0F2942" />
      {/* Happy Eyes & Big Smile */}
      <circle cx="321" cy="168" r="3" fill="#0F2942" />
      <circle cx="343" cy="168" r="3" fill="#0F2942" />
      <circle cx="313" cy="176" r="4.5" fill="#FB7185" fillOpacity="0.45" />
      <circle cx="351" cy="176" r="4.5" fill="#FB7185" fillOpacity="0.45" />
      <path d="M322 180C327 187 337 187 342 180" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />

      {/* Child holding a red toy remote car / controller */}
      <rect x="308" y="274" width="52" height="28" rx="10" fill="#EA580C" />
      <circle cx="320" cy="302" r="7" fill="#0F2942" />
      <circle cx="348" cy="302" r="7" fill="#0F2942" />
      <rect x="318" y="280" width="22" height="10" rx="4" fill="#BAE6FD" />

      {/* Gentle Floating Heart & Star Accent */}
      <path
        d="M266 122C266 116 274 114 277 119C280 114 288 116 288 122C288 129 277 136 277 136C277 136 266 129 266 122Z"
        fill="#FB7185"
      />
      <path
        d="M424 148L428 158L438 162L428 166L424 176L420 166L410 162L420 158L424 148Z"
        fill="#F59E0B"
      />
    </svg>
  );
};

export const CoverageMapIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 520 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Ilustrasi peta lokasi Klinik Sunat Nano dan area jangkauan layanan Home Visit"
    >
      <rect x="0" y="0" width="520" height="360" rx="24" fill="#EFF6FF" />

      {/* Subtle Map Grid & Roads */}
      <path d="M0 95H520M0 245H520M145 0V360M375 0V360" stroke="#DCE8F5" strokeWidth="10" />
      <path d="M40 310C150 240 240 165 480 60" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
      <path d="M85 40C195 140 310 215 460 320" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />

      {/* Park & City Blocks */}
      <rect x="44" y="122" width="76" height="90" rx="16" fill="#CCFBF1" />
      <rect x="404" y="124" width="84" height="92" rx="16" fill="#FEF3C7" />

      {/* Home Visit Coverage Radius Rings */}
      <circle cx="260" cy="180" r="136" fill="#0284C7" fillOpacity="0.06" stroke="#0284C7" strokeOpacity="0.25" strokeDasharray="8 6" strokeWidth="2" />
      <circle cx="260" cy="180" r="84" fill="#0D9488" fillOpacity="0.08" stroke="#0D9488" strokeOpacity="0.35" strokeWidth="2" />

      {/* Home Visit Destination Pins */}
      <g>
        <circle cx="152" cy="112" r="16" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.5" />
        <path d="M145 114L152 107L159 114V120H145V114Z" fill="#0D9488" />
        <rect x="102" y="134" width="100" height="24" rx="6" fill="#FFFFFF" />
        <text x="152" y="150" textAnchor="middle" fill="#0F2942" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          Home Visit Barat
        </text>
      </g>

      <g>
        <circle cx="386" cy="118" r="16" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.5" />
        <path d="M379 120L386 113L393 120V126H379V120Z" fill="#0D9488" />
        <rect x="336" y="140" width="100" height="24" rx="6" fill="#FFFFFF" />
        <text x="386" y="156" textAnchor="middle" fill="#0F2942" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          Home Visit Timur
        </text>
      </g>

      <g>
        <circle cx="356" cy="264" r="16" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.5" />
        <path d="M349 266L356 259L363 266V272H349V266Z" fill="#0D9488" />
        <rect x="302" y="286" width="108" height="24" rx="6" fill="#FFFFFF" />
        <text x="356" y="302" textAnchor="middle" fill="#0F2942" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          Home Visit Selatan
        </text>
      </g>

      {/* Center Clinic Main Marker */}
      <g>
        <circle cx="260" cy="180" r="28" fill="#0284C7" />
        <path d="M260 164V196M244 180H276" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <rect x="176" y="216" width="168" height="30" rx="8" fill="#0F2942" />
        <text x="260" y="235" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          Klinik Sunat Nano (Pusat)
        </text>
      </g>
    </svg>
  );
};
