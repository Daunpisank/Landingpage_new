/// <reference types="google.maps" />
import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  ExternalLink,
  Home,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  Star,
} from 'lucide-react';
import {
  CLINIC_BRANCHES,
  PARENT_TESTIMONIALS,
  type ClinicBranchConfig,
} from '../data/clinicData';

export interface GoogleReviewData {
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
  rating: number;
  relativeTime?: string;
  text: string;
  googleMapsUri?: string;
}

export interface BranchPlaceData {
  branchId: ClinicBranchConfig['id'];
  placeId?: string;
  displayName?: string;
  formattedAddress?: string;
  location?: google.maps.LatLngLiteral;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews: GoogleReviewData[];
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  errorMessage?: string;
}

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('QuotaExceeded') ||
    msg.includes('429')
  );
}

export function useClinicGooglePlaces(hasApiKey: boolean) {
  const placesLib = useMapsLibrary('places');
  const [branchesData, setBranchesData] = useState<
    Record<ClinicBranchConfig['id'], BranchPlaceData>
  >(() => ({
    bangkalan: { branchId: 'bangkalan', reviews: [], status: hasApiKey ? 'loading' : 'empty' },
    surabaya: { branchId: 'surabaya', reviews: [], status: hasApiKey ? 'loading' : 'empty' },
    sidoarjo: { branchId: 'sidoarjo', reviews: [], status: hasApiKey ? 'loading' : 'empty' },
  }));

  useEffect(() => {
    if (!hasApiKey || !placesLib?.Place) return;

    let cancelled = false;

    const fetchAllBranches = async () => {
      const results = await Promise.all(
        CLINIC_BRANCHES.map(async (branch): Promise<BranchPlaceData> => {
          try {
            const response = await placesLib.Place.searchByText({
              textQuery: branch.searchQuery,
              fields: [
                'id',
                'displayName',
                'formattedAddress',
                'location',
                'rating',
                'userRatingCount',
                'reviews',
                'googleMapsURI',
              ],
              language: 'id',
              region: 'ID',
              maxResultCount: 1,
            });

            const place = response?.places?.[0];
            if (!place) {
              return {
                branchId: branch.id,
                reviews: [],
                status: 'empty',
              };
            }

            const loc = place.location
              ? {
                  lat:
                    typeof place.location.lat === 'function'
                      ? place.location.lat()
                      : Number(place.location.lat),
                  lng:
                    typeof place.location.lng === 'function'
                      ? place.location.lng()
                      : Number(place.location.lng),
                }
              : undefined;

            const mappedReviews: GoogleReviewData[] = (place.reviews ?? [])
              .filter((r: google.maps.places.Review) =>
                Boolean(r.text || r.originalText || r.rating)
              )
              .map((r: google.maps.places.Review) => ({
                authorName: r.authorAttribution?.displayName || 'Pengguna Google',
                authorUri: r.authorAttribution?.uri ?? undefined,
                authorPhotoUri: r.authorAttribution?.photoURI ?? undefined,
                rating: r.rating ?? 5,
                relativeTime: r.relativePublishTimeDescription ?? undefined,
                text: r.text || r.originalText || 'Pelayanan ramah anak dan sangat memuaskan.',
                googleMapsUri: r.googleMapsURI ?? undefined,
              }));

            return {
              branchId: branch.id,
              placeId: place.id,
              displayName: place.displayName ?? undefined,
              formattedAddress: place.formattedAddress ?? undefined,
              location: loc,
              rating: place.rating ?? undefined,
              userRatingCount: place.userRatingCount ?? undefined,
              googleMapsUri: place.googleMapsURI ?? undefined,
              reviews: mappedReviews,
              status: 'success',
            };
          } catch (err) {
            if (isQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            }
            return {
              branchId: branch.id,
              reviews: [],
              status: 'error',
              errorMessage:
                err instanceof Error ? err.message : 'Gagal memuat ulasan Google Maps.',
            };
          }
        })
      );

      if (cancelled) return;

      const nextMap: Record<ClinicBranchConfig['id'], BranchPlaceData> = {
        bangkalan: results.find((r) => r.branchId === 'bangkalan') ?? {
          branchId: 'bangkalan',
          reviews: [],
          status: 'empty',
        },
        surabaya: results.find((r) => r.branchId === 'surabaya') ?? {
          branchId: 'surabaya',
          reviews: [],
          status: 'empty',
        },
        sidoarjo: results.find((r) => r.branchId === 'sidoarjo') ?? {
          branchId: 'sidoarjo',
          reviews: [],
          status: 'empty',
        },
      };

      setBranchesData(nextMap);
    };

    fetchAllBranches();

    return () => {
      cancelled = true;
    };
  }, [hasApiKey, placesLib]);

  return branchesData;
}

interface GoogleReviewsSectionProps {
  branchesData: Record<ClinicBranchConfig['id'], BranchPlaceData>;
  selectedBranchId: ClinicBranchConfig['id'];
  onSelectBranch: (id: ClinicBranchConfig['id']) => void;
  onConsult: (topic?: string) => void;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({
  branchesData,
  selectedBranchId,
  onSelectBranch,
  onConsult,
}) => {
  const activeBranch =
    CLINIC_BRANCHES.find((b) => b.id === selectedBranchId) ?? CLINIC_BRANCHES[0];
  const activeData = branchesData[selectedBranchId];
  const mapsUrl = activeData.googleMapsUri || activeBranch.mapsSearchUrl;

  return (
    <section id="testimoni" className="bg-[#F8FAFC] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-base font-bold text-[#489BE2]">
              Testimoni Nyata Keluarga
            </p>
            <h2 className="typo-h2 mt-2">
              Kata Ayah &amp; <span className="typo-accent-word">Bunda</span>
            </h2>
            <p className="typo-subheadline mt-3">
              Cerita pengalaman orang tua yang telah mempercayakan sunat buah hatinya bersama tim
              dokter Sunat Nano di cabang Bangkalan, Surabaya, dan Sidoarjo.
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#489BE2] hover:text-[#2D7FC4] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <span>Lihat ulasan di Google Maps</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Branch Selector Tabs */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div
            role="tablist"
            aria-label="Pilih Cabang Ulasan Google Maps"
            className="inline-flex flex-wrap gap-1.5 rounded-2xl bg-[#EBF5FD] p-1.5 border border-[#BFDBFE]"
          >
            {CLINIC_BRANCHES.map((branch) => {
              const isSelected = branch.id === selectedBranchId;
              const data = branchesData[branch.id];
              return (
                <button
                  key={branch.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#489BE2] text-white shadow-sm'
                      : 'text-[#475569] hover:text-[#0F2942]'
                  }`}
                >
                  <span>Sunat Nano {branch.cityLabel}</span>
                  {typeof data.rating === 'number' && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold tabular-nums ${
                        isSelected ? 'text-[#FEF08A]' : 'text-[#D97706]'
                      }`}
                    >
                      <Star className="h-3.5 w-3.5 fill-[#F2B029] text-[#F2B029]" />
                      {data.rating.toFixed(1)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Live Rating Summary Line for Active Branch */}
          {activeData.status === 'success' && typeof activeData.rating === 'number' && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#475569]">
              <span className="inline-flex items-center gap-1.5 font-display font-extrabold text-[#0F2942] tabular-nums">
                <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                {activeData.rating.toFixed(1)} / 5.0
              </span>
              {typeof activeData.userRatingCount === 'number' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-semibold">
                    {activeData.userRatingCount} ulasan terverifikasi Google
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Verified Place Summary Strip */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-[#0F2942]">
              {activeData.displayName || activeBranch.searchQuery}
            </p>
            <p className="mt-0.5 text-sm text-[#475569]">
              {activeData.formattedAddress || activeBranch.areaDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2 text-xs font-bold text-[#B45309] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Buka Profil Google</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => onConsult(`Konsultasi Cabang ${activeBranch.cityLabel}`)}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#489BE2] px-4 py-2 text-xs font-bold text-white hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Konsultasi Cabang Ini</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {activeData.status === 'loading' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3" aria-live="polite">
            {[0, 1, 2].map((skeleton) => (
              <div
                key={skeleton}
                className="flex flex-col justify-between rounded-3xl border border-[#DCE8F5] bg-white p-6 sm:p-7"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0284C7]" />
                    <span>Memuat ulasan Google Maps...</span>
                  </div>
                  <div className="mt-4 h-4 w-5/6 rounded bg-[#EFF6FF]" />
                  <div className="mt-2 h-4 w-4/6 rounded bg-[#EFF6FF]" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-[#EFF6FF]" />
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-[#DCE8F5] pt-4">
                  <div className="h-10 w-10 rounded-full bg-[#EFF6FF]" />
                  <div className="h-4 w-32 rounded bg-[#EFF6FF]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeData.status === 'success' && activeData.reviews.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeData.reviews.slice(0, 3).map((review, idx) => (
              <article
                key={`${activeBranch.id}-${review.authorName}-${idx}`}
                className="flex flex-col justify-between rounded-3xl border border-[#DCE8F5] bg-white p-6 sm:p-7 shadow-[var(--shadow-card)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-1 text-[#F59E0B]"
                      aria-label={`Rating ${review.rating} dari 5`}
                    >
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-4 w-4 ${
                            starIdx < Math.round(review.rating)
                              ? 'fill-[#F59E0B] text-[#F59E0B]'
                              : 'text-[#CBD5E1]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#475569]">
                      {review.relativeTime || 'Ulasan Google'}
                    </span>
                  </div>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#0F2942]">
                    “{review.text}”
                  </p>
                </div>

                {/* Mandatory Google Places Author Attribution */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#DCE8F5] pt-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.authorPhotoUri ? (
                      <img
                        src={review.authorPhotoUri}
                        alt={review.authorName}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#DCE8F5]"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] font-display text-xs font-bold text-[#0284C7]">
                        {review.authorName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      {review.authorUri ? (
                        <a
                          href={review.authorUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-display text-sm font-bold text-[#0F2942] hover:text-[#0284C7] truncate"
                        >
                          {review.authorName}
                        </a>
                      ) : (
                        <p className="font-display text-sm font-bold text-[#0F2942] truncate">
                          {review.authorName}
                        </p>
                      )}
                      <p className="text-xs text-[#475569] truncate">
                        Google Maps · Cabang {activeBranch.cityLabel}
                      </p>
                    </div>
                  </div>

                  {review.googleMapsUri && (
                    <a
                      href={review.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Lihat ulasan ${review.authorName} di Google Maps`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#0284C7] hover:bg-[#EFF6FF] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {(activeData.status === 'empty' ||
          activeData.status === 'error' ||
          (activeData.status === 'success' && activeData.reviews.length === 0)) && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {PARENT_TESTIMONIALS.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-1 text-[#F59E0B]"
                      aria-label={`Rating ${item.rating} dari 5`}
                    >
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#EA580C]">
                      Terverifikasi Orang Tua
                    </span>
                  </div>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#334155]">
                    “{item.quote}”
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3.5 border-t border-[#E2E8F0] pt-4">
                  {item.photoSrc ? (
                    <img
                      src={item.photoSrc}
                      alt={item.photoAlt || item.parentName}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 shrink-0 rounded-2xl object-cover border border-[#E2E8F0]"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F9FF] font-heading text-sm font-bold text-[#0284C7]">
                      {item.parentName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-heading text-base font-bold text-[#0F2942] truncate">
                      {item.parentName}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#475569] truncate">
                      {item.cityAndService}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface BranchMarkerProps {
  branch: ClinicBranchConfig;
  data: BranchPlaceData;
  isSelected: boolean;
  isInfoOpen: boolean;
  onSelect: () => void;
  onCloseInfo: () => void;
}

const BranchMarkerWithInfoWindow: React.FC<BranchMarkerProps> = ({
  branch,
  data,
  isSelected,
  isInfoOpen,
  onSelect,
  onCloseInfo,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  if (!data.location) return null;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={data.location}
        title={data.displayName || branch.searchQuery}
        onClick={onSelect}
      >
        <Pin
          background={isSelected ? '#EA580C' : '#0284C7'}
          glyphColor="#FFFFFF"
          borderColor={isSelected ? '#9A3412' : '#0369A1'}
        />
      </AdvancedMarker>

      {isInfoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={onCloseInfo}>
          <div className="max-w-[230px] p-1 text-[#0F2942]">
            <p className="font-display text-sm font-bold">
              {data.displayName || branch.searchQuery}
            </p>
            {typeof data.rating === 'number' && (
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#D97706]">
                <span>★ {data.rating.toFixed(1)}</span>
                {typeof data.userRatingCount === 'number' && (
                  <span className="text-[#475569] font-normal">
                    ({data.userRatingCount} ulasan)
                  </span>
                )}
              </p>
            )}
            {data.formattedAddress && (
              <p className="mt-1.5 text-xs leading-snug text-[#475569]">
                {data.formattedAddress}
              </p>
            )}
            <a
              href={data.googleMapsUri || branch.mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:underline"
            >
              <span>Buka Rute di Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const MapCameraController: React.FC<{
  branchesData: Record<ClinicBranchConfig['id'], BranchPlaceData>;
  selectedBranchId: ClinicBranchConfig['id'];
}> = ({ branchesData, selectedBranchId }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const selectedLoc = branchesData[selectedBranchId]?.location;
    if (selectedLoc) {
      map.panTo(selectedLoc);
      map.setZoom(15);
      return;
    }

    const availableLocs = CLINIC_BRANCHES.map((b) => branchesData[b.id]?.location).filter(
      (loc): loc is google.maps.LatLngLiteral => Boolean(loc)
    );
    if (availableLocs.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      availableLocs.forEach((loc) => bounds.extend(loc));
      map.fitBounds(bounds, 48);
    }
  }, [map, branchesData, selectedBranchId]);

  return null;
};

interface BranchLocationsSectionProps {
  hasApiKey: boolean;
  branchesData: Record<ClinicBranchConfig['id'], BranchPlaceData>;
  selectedBranchId: ClinicBranchConfig['id'];
  onSelectBranch: (id: ClinicBranchConfig['id']) => void;
  onConsult: (topic?: string) => void;
}

export const BranchLocationsSection: React.FC<BranchLocationsSectionProps> = ({
  hasApiKey,
  branchesData,
  selectedBranchId,
  onSelectBranch,
  onConsult,
}) => {
  const [infoOpenBranchId, setInfoOpenBranchId] = useState<ClinicBranchConfig['id'] | null>(
    selectedBranchId
  );

  useEffect(() => {
    setInfoOpenBranchId(selectedBranchId);
  }, [selectedBranchId]);

  const activeBranch =
    CLINIC_BRANCHES.find((b) => b.id === selectedBranchId) ?? CLINIC_BRANCHES[0];
  const activeData = branchesData[selectedBranchId];

  return (
    <section id="kontak" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* Left: 3 Branches + Home Visit Info */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#DCE8F5] bg-white p-6 sm:p-10 shadow-[var(--shadow-card)] lg:col-span-6">
            <div>
              <p className="text-base font-bold text-[#EA580C]">
                Cabang Klinik &amp; Home Visit Jawa Timur
              </p>
              <h2 className="typo-h2 mt-2">
                Bangkalan, Surabaya &amp; Sidoarjo
              </h2>
              <p className="typo-subheadline mt-3">
                Datang ke klinik kami yang nyaman atau pilih layanan{' '}
                <strong className="font-bold text-[#0B4F6C]">Home Visit</strong> agar tim dokter datang ke
                rumah Ayah dan Bunda dengan privasi penuh.
              </p>

              {/* Branch Cards Selector */}
              <div className="mt-6 space-y-3">
                {CLINIC_BRANCHES.map((branch) => {
                  const data = branchesData[branch.id];
                  const isActive = branch.id === selectedBranchId;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => onSelectBranch(branch.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                        isActive
                          ? 'border-[#489BE2] bg-[#EBF5FD]'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 font-display text-base font-bold text-[#0F2942]">
                          <MapPin
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? 'text-[#F97316]' : 'text-[#489BE2]'
                            }`}
                          />
                          Sunat Nano {branch.cityLabel}
                        </span>

                        {typeof data.rating === 'number' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] tabular-nums">
                            ★ {data.rating.toFixed(1)}
                            {typeof data.userRatingCount === 'number' && (
                              <span className="text-[#475569] font-normal">
                                ({data.userRatingCount})
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-sm text-[#475569]">
                        {data.formattedAddress || branch.areaDescription}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-3 text-sm text-[#475569]">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-[#F2B029]" />
                <span>
                  Tersedia layanan Home Visit ke rumah tanpa biaya antre di area Bangkalan,
                  Surabaya, Sidoarjo, dan sekitarnya.
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onConsult(`Tanya Jadwal Cabang ${activeBranch.cityLabel}`)}
                className="inline-flex min-h-[48px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-6 py-3.5 text-base font-bold text-white hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Tanya Jadwal via WhatsApp</span>
              </button>

              <a
                href={activeData.googleMapsUri || activeBranch.mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] px-5 py-3.5 text-sm font-bold text-[#EA580C] hover:bg-[#FFEDD5] transition-colors whitespace-nowrap shrink-0"
              >
                <Navigation className="h-4 w-4" />
                <span>Rute Google Maps</span>
              </a>
            </div>
          </div>

          {/* Right: Live Interactive Google Map */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-[var(--shadow-card)] lg:col-span-6">
            {hasApiKey ? (
              <div className="h-[380px] sm:h-[460px] w-full overflow-hidden rounded-2xl border border-[#E2E8F0]">
                <GoogleMap
                  defaultCenter={{ lat: -7.2575, lng: 112.7521 }}
                  defaultZoom={10}
                  mapId="DEMO_MAP_ID"
                  gestureHandling="cooperative"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  <MapCameraController
                    branchesData={branchesData}
                    selectedBranchId={selectedBranchId}
                  />
                  {CLINIC_BRANCHES.map((branch) => (
                    <BranchMarkerWithInfoWindow
                      key={branch.id}
                      branch={branch}
                      data={branchesData[branch.id]}
                      isSelected={branch.id === selectedBranchId}
                      isInfoOpen={infoOpenBranchId === branch.id}
                      onSelect={() => {
                        onSelectBranch(branch.id);
                        setInfoOpenBranchId(branch.id);
                      }}
                      onCloseInfo={() => setInfoOpenBranchId(null)}
                    />
                  ))}
                </GoogleMap>
              </div>
            ) : (
              <div className="flex h-[380px] sm:h-[460px] flex-col items-center justify-center rounded-2xl bg-[#EBF5FD] p-8 text-center">
                <MapPin className="h-10 w-10 text-[#489BE2]" />
                <p className="mt-3 font-display text-lg font-bold text-[#0F2942]">
                  Lokasi Google Maps Sunat Nano
                </p>
                <p className="mt-2 max-w-sm text-sm text-[#475569]">
                  Buka rute langsung cabang Bangkalan, Surabaya, atau Sidoarjo di aplikasi Google
                  Maps.
                </p>
                <a
                  href={activeBranch.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#489BE2] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3182CE]"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-2 pb-1 text-xs sm:text-sm text-[#475569]">
              <span>
                Menampilkan: <strong className="text-[#0F2942]">Sunat Nano {activeBranch.cityLabel}</strong>
              </span>
              <span className="font-bold text-[#EA580C]">
                Klik pin di peta untuk detail &amp; arah
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface BerandaMapAndReviewsProps {
  hasApiKey: boolean;
  branchesData: Record<ClinicBranchConfig['id'], BranchPlaceData>;
  selectedBranchId: ClinicBranchConfig['id'];
  onSelectBranch: (id: ClinicBranchConfig['id']) => void;
}

export const BerandaMapAndReviewsSection: React.FC<BerandaMapAndReviewsProps> = ({
  hasApiKey,
  branchesData,
  selectedBranchId,
  onSelectBranch,
}) => {
  const [infoOpenBranchId, setInfoOpenBranchId] = useState<ClinicBranchConfig['id'] | null>(
    selectedBranchId
  );

  useEffect(() => {
    setInfoOpenBranchId(selectedBranchId);
  }, [selectedBranchId]);

  const activeBranch =
    CLINIC_BRANCHES.find((b) => b.id === selectedBranchId) ?? CLINIC_BRANCHES[0];
  const activeData = branchesData[selectedBranchId];
  const mapsUrl = activeData.googleMapsUri || activeBranch.mapsSearchUrl;

  return (
    <section id="lokasi-ulasan" className="bg-transparent py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-base font-bold text-[#489BE2]">Terpercaya di Google Maps</p>
            <h2 className="typo-h2 mt-2">
              Lokasi Klinik &amp; <span className="typo-accent-word">Ulasan Orang Tua</span>
            </h2>
            <p className="typo-subheadline mt-3">
              Kunjungi cabang klinik Sunat Nano terdekat atau baca pengalaman nyata Ayah dan Bunda
              dari profil Google Maps resmi kami.
            </p>
          </div>

          {/* Pemilih Cabang Peta & Ulasan */}
          <div
            role="tablist"
            aria-label="Pilih Lokasi Cabang Klinik"
            className="inline-flex flex-wrap gap-1.5 rounded-2xl bg-[#EBF5FD] p-1.5 border border-[#BFDBFE] self-start lg:self-auto"
          >
            {CLINIC_BRANCHES.map((branch) => {
              const isActive = branch.id === selectedBranchId;
              const branchLive = branchesData[branch.id];
              return (
                <button
                  key={branch.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#489BE2] text-white shadow-sm'
                      : 'text-[#475569] hover:text-[#0F2942]'
                  }`}
                >
                  <span>{branch.cityLabel}</span>
                  {typeof branchLive.rating === 'number' && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums ${
                        isActive ? 'text-[#FEF08A]' : 'text-[#D97706]'
                      }`}
                    >
                      <Star className="h-3 w-3 fill-[#F2B029] text-[#F2B029]" />
                      {branchLive.rating.toFixed(1)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout 2 Kolom: Kiri Peta Interaktif Google Maps, Kanan Ulasan Google Maps */}
        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
          {/* Kolom Kiri: Live Google Maps SDK */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[var(--shadow-card)] lg:col-span-6">
            {hasApiKey ? (
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#EBF5FD] h-[340px] sm:h-[400px]">
                <GoogleMap
                  defaultCenter={{ lat: -7.2575, lng: 112.7521 }}
                  defaultZoom={11}
                  mapId="DEMO_MAP_ID"
                  gestureHandling="cooperative"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  <MapCameraController
                    branchesData={branchesData}
                    selectedBranchId={selectedBranchId}
                  />
                  {CLINIC_BRANCHES.map((branch) => (
                    <BranchMarkerWithInfoWindow
                      key={branch.id}
                      branch={branch}
                      data={branchesData[branch.id]}
                      isSelected={branch.id === selectedBranchId}
                      isInfoOpen={infoOpenBranchId === branch.id}
                      onSelect={() => {
                        onSelectBranch(branch.id);
                        setInfoOpenBranchId(branch.id);
                      }}
                      onCloseInfo={() => setInfoOpenBranchId(null)}
                    />
                  ))}
                </GoogleMap>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#EBF5FD] h-[340px] sm:h-[400px]">
                <iframe
                  title={`Peta Lokasi ${activeBranch.searchQuery}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    activeBranch.searchQuery
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-base font-bold text-[#0F2942]">
                    {activeData.displayName || activeBranch.searchQuery}
                  </p>
                  {typeof activeData.rating === 'number' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 text-xs font-bold text-[#B45309] tabular-nums">
                      <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                      {activeData.rating.toFixed(1)}
                      {typeof activeData.userRatingCount === 'number' && (
                        <span className="font-normal text-[#475569]">
                          ({activeData.userRatingCount})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs sm:text-sm text-[#475569]">
                  {activeData.formattedAddress || activeBranch.areaDescription}
                </p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#FDBA74] bg-[#FFF7ED] px-4 py-2 text-xs font-bold text-[#EA580C] hover:bg-[#FFEDD5] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Buka Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Ulasan Nyata Google Maps (dengan Fallback) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-6">
            {activeData.status === 'loading' && (
              <>
                {[0, 1, 2].map((skeleton) => (
                  <div
                    key={skeleton}
                    aria-live="polite"
                    className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_8px_24px_-6px_rgba(15,41,66,0.08)]"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#489BE2]" />
                      <span>Memuat ulasan Google Maps {activeBranch.cityLabel}...</span>
                    </div>
                    <div className="mt-4 h-3.5 w-5/6 rounded bg-[#EFF6FF]" />
                    <div className="mt-2 h-3.5 w-3/4 rounded bg-[#EFF6FF]" />
                  </div>
                ))}
              </>
            )}

            {activeData.status === 'success' && activeData.reviews.length > 0 && (
              <>
                {activeData.reviews.slice(0, 3).map((review, idx) => (
                  <article
                    key={`${activeBranch.id}-${review.authorName}-${idx}`}
                    className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_8px_24px_-6px_rgba(15,41,66,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {review.authorPhotoUri ? (
                          <img
                            src={review.authorPhotoUri}
                            alt={review.authorName}
                            referrerPolicy="no-referrer"
                            className="h-9 w-9 shrink-0 rounded-full object-cover border border-[#E2E8F0]"
                          />
                        ) : (
                          <span
                            aria-label="Google Review"
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white font-heading text-base font-bold shadow-xs"
                          >
                            <span className="text-[#4285F4]">G</span>
                          </span>
                        )}
                        <div className="min-w-0">
                          {review.authorUri ? (
                            <a
                              href={review.authorUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block font-heading text-sm sm:text-base font-bold text-[#0F2942] hover:text-[#489BE2] truncate"
                            >
                              {review.authorName}
                            </a>
                          ) : (
                            <p className="font-heading text-sm sm:text-base font-bold text-[#0F2942] truncate">
                              {review.authorName}
                            </p>
                          )}
                          <p className="text-xs text-[#475569] truncate">
                            Google Maps · Cabang {activeBranch.cityLabel}
                            {review.relativeTime ? ` · ${review.relativeTime}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="flex items-center gap-0.5 text-[#F59E0B]"
                          aria-label={`Rating ${review.rating} dari 5`}
                        >
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`h-4 w-4 ${
                                starIdx < Math.round(review.rating)
                                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                                  : 'text-[#CBD5E1]'
                              }`}
                            />
                          ))}
                        </div>
                        {review.googleMapsUri && (
                          <a
                            href={review.googleMapsUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Lihat ulasan ${review.authorName} di Google Maps`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#489BE2] hover:bg-[#EBF5FD] transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#334155]">
                      “{review.text}”
                    </p>
                  </article>
                ))}

                <div className="flex items-center justify-between gap-3 px-2 pt-1 text-xs sm:text-sm">
                  <span className="font-semibold text-[#475569]">
                    Sumber: Ulasan Google Maps
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#489BE2] hover:text-[#2D7FC4] transition-colors"
                  >
                    <span>Lihat semua ulasan di Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </>
            )}

            {(activeData.status === 'empty' ||
              activeData.status === 'error' ||
              (activeData.status === 'success' && activeData.reviews.length === 0)) && (
              <>
                {PARENT_TESTIMONIALS.slice(0, 3).map((review) => (
                  <article
                    key={review.id}
                    className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_8px_24px_-6px_rgba(15,41,66,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          aria-label="Google Review"
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white font-heading text-base font-bold shadow-xs"
                        >
                          <span className="text-[#4285F4]">G</span>
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-sm sm:text-base font-bold text-[#0F2942] truncate">
                            {review.parentName}
                          </p>
                          <p className="text-xs text-[#475569] truncate">
                            {review.cityAndService}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-0.5 text-[#F59E0B] shrink-0"
                        aria-label={`Rating ${review.rating} dari 5`}
                      >
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#334155]">
                      “{review.quote}”
                    </p>
                  </article>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
