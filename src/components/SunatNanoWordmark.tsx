import React from 'react';

interface SunatNanoWordmarkProps {
  className?: string;
  showCircumcision?: boolean;
  circumcisionClassName?: string;
}

const SUNAT_LETTERS = [
  { char: 'S', color: '#EB5757' },
  { char: 'u', color: '#F2B029' },
  { char: 'n', color: '#489BE2' },
  { char: 'a', color: '#EB5757' },
  { char: 't', color: '#F2B029' },
];

const NANO_LETTERS = [
  { char: 'N', color: '#489BE2' },
  { char: 'a', color: '#F2B029' },
  { char: 'n', color: '#EB5757' },
  { char: 'o', color: '#009B8A' },
];

export const SunatNanoWordmark: React.FC<SunatNanoWordmarkProps> = ({
  className = '',
  showCircumcision = false,
  circumcisionClassName = 'text-base sm:text-lg',
}) => {
  return (
    <span
      className={`inline-flex flex-col leading-none font-heading font-bold brand-wordmark-spaced ${className}`}
      aria-label={showCircumcision ? 'Sunat Nano Circumcision' : 'Sunat Nano'}
    >
      <span aria-hidden="true" className="inline-block whitespace-nowrap brand-wordmark-spaced">
        {SUNAT_LETTERS.map((item, idx) => (
          <span key={`s-${idx}`} style={{ color: item.color }}>
            {item.char}
          </span>
        ))}
        {' '}
        {NANO_LETTERS.map((item, idx) => (
          <span key={`n-${idx}`} style={{ color: item.color }}>
            {item.char}
          </span>
        ))}
      </span>
      {showCircumcision && (
        <span
          aria-hidden="true"
          className={`mt-1 font-heading font-bold brand-wordmark-spaced text-[#489BE2] ${circumcisionClassName}`}
        >
          circumcision
        </span>
      )}
    </span>
  );
};
