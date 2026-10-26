"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SectionContainer from "@/components/ui/SectionContainer";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import { RevealItem } from "@/components/ui/Reveal";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import type { SpkluBrand, SpkluOperator, SpkluPage, SpkluSort } from "@/types";
import { SORT_OPTIONS, SPKLU_PER_PAGE } from "./data";

import "swiper/css";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEARCH_DEBOUNCE_MS = 400;

/** Durasi geser 1 logo (ms) -- makin besar makin pelan. */
const MARQUEE_SPEED = 3500;

/** Loop Swiper butuh cukup slide; brand yang sedikit diulang sampai minimal segini. */
const MARQUEE_MIN_SLIDES = 12;

interface Filters {
  search: string;
  sort: SpkluSort;
}

/**
 * Daftar operator SPKLU. Halaman pertama (A-Z) dirender server; pencarian, urutan,
 * dan paginasi berikutnya diambil lewat /api/spklu (10 per halaman dari backend).
 */
export default function Spklu({
  initialPage,
  initialError,
  brands,
}: {
  initialPage: SpkluPage;
  initialError: boolean;
  brands: SpkluBrand[];
}) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>({ search: "", sort: "asc" });
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [openId, setOpenId] = useState<string | null>(
    initialPage.items[0]?.id ?? null,
  );

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listTopRef = useRef<HTMLDivElement | null>(null);
  // Operator yang perlu di-scroll setelah render berikutnya (klik logo).
  const scrollTargetRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      abortRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const id = scrollTargetRef.current;
    if (!id) return;
    scrollTargetRef.current = null;
    (document.getElementById(id) ?? listTopRef.current)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  async function load(next: Filters, page: number, focusId?: string) {
    // Batalkan request sebelumnya supaya hasil lama tidak menimpa hasil terbaru
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);

    const params = new URLSearchParams({ sort: next.sort, page: String(page) });
    if (next.search.trim()) params.set("search", next.search.trim());

    try {
      const res = await fetch(`/api/spklu?${params}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result: SpkluPage = await res.json();
      setData(result);
      if (focusId) {
        setOpenId(focusId);
        scrollTargetRef.current = focusId;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function handleSearchChange(search: string) {
    const next = { ...filters, search };
    setFilters(next);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(
      () => void load(next, 1),
      SEARCH_DEBOUNCE_MS,
    );
  }

  function handleSortChange(label: string) {
    const next: Filters = {
      ...filters,
      sort: SORT_OPTIONS.find((o) => o.label === label)?.value ?? "asc",
    };
    setFilters(next);
    void load(next, 1);
  }

  function handlePageChange(page: number) {
    void load(filters, page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Klik logo: brand diurutkan A-Z sama seperti API, jadi posisinya = posisi di
  // list tanpa pencarian. Pencarian dikosongkan supaya operatornya pasti ada.
  function selectOperator(id: string) {
    const index = brands.findIndex((b) => b.id === id);
    if (index === -1) return;
    const position =
      filters.sort === "desc" ? brands.length - 1 - index : index;
    const page = Math.floor(position / SPKLU_PER_PAGE) + 1;

    if (searchTimer.current) clearTimeout(searchTimer.current);
    const next = { ...filters, search: "" };
    setFilters(next);

    // Sudah di halaman yang tepat: cukup buka & scroll, tanpa request.
    if (!filters.search && page === data.page && !loading && !error) {
      setOpenId(id);
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    void load(next, page, id);
  }

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? "A–Z";
  const totalOperators = brands.length || initialPage.total;

  return (
    <SectionContainer withGuides withOrnament variant="white">
      <RevealItem>
        <h1 className="font-display text-2xl leading-8 font-bold tracking-[-0.03em] text-koleksi-navy uppercase md:text-[32px] md:leading-10 dark:text-ink-dark">
          {format(t.spklu.heading, { count: totalOperators })}
        </h1>
        <p className="mt-3 text-sm leading-6 font-normal text-koleksi-navy-dark md:mt-4 md:text-base dark:text-ink-dark/60">
          {t.spklu.source}
        </p>
      </RevealItem>

      {brands.length > 0 && (
        <RevealItem className="mt-10 md:mt-14">
          <LogoMarquee brands={brands} onSelect={selectOperator} />
        </RevealItem>
      )}

      {/* Pencarian + urutan A-Z / Z-A, di-center */}
      <RevealItem className="mx-auto mt-10 max-w-195 md:mt-14">
        <SearchFilterBar
          iconPosition="right"
          search={filters.search}
          onSearchChange={handleSearchChange}
        >
          <FilterDropdown
            label="A–Z"
            options={SORT_OPTIONS.map((o) => o.label)}
            value={sortLabel}
            onChange={handleSortChange}
          />
        </SearchFilterBar>
      </RevealItem>

      <RevealItem className="mt-10 md:mt-14">
        <div
          ref={listTopRef}
          aria-busy={loading}
          className={clsx(
            "flex scroll-mt-28 flex-col gap-3 transition-opacity duration-300",
            loading && "opacity-50",
          )}
        >
          {data.items.map((o, index) => (
            <motion.div
              key={`${data.page}-${o.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE_OUT,
                delay: index * 0.03,
              }}
            >
              <OperatorAccordion
                operator={o}
                isOpen={openId === o.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === o.id ? null : o.id))
                }
              />
            </motion.div>
          ))}
        </div>

        {error ? (
          <p className="text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            {t.spklu.error}
          </p>
        ) : (
          !loading &&
          data.items.length === 0 && (
            <p className="text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
              {filters.search.trim()
                ? t.spklu.empty
                : t.spklu.noData}
            </p>
          )
        )}

        {data.totalPages > 1 && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            className="mt-14 md:mt-20"
          />
        )}
      </RevealItem>
    </SectionContainer>
  );
}

/** Slider logo berjalan pelan & linear terus-menerus; berhenti di tempat
 *  saat kursor masuk dan lanjut lagi saat keluar. */
function LogoMarquee({
  brands,
  onSelect,
}: {
  brands: SpkluBrand[];
  onSelect: (id: string) => void;
}) {
  const { t } = useI18n();
  const swiperRef = useRef<SwiperType | null>(null);
  const hoveredRef = useRef(false);

  const repeat = Math.ceil(MARQUEE_MIN_SLIDES / brands.length);
  const slides = Array.from({ length: repeat }, () => brands).flat();

  // pauseOnMouseEnter bawaan Swiper menunggu transisi (MARQUEE_SPEED ms)
  // selesai dulu, jadi posisi wrapper dibekukan manual supaya langsung diam.
  const freeze = () => {
    const s = swiperRef.current;
    if (!s || s.destroyed) return;
    hoveredRef.current = true;
    s.autoplay.stop();
    const { m41 } = new DOMMatrixReadOnly(
      getComputedStyle(s.wrapperEl).transform,
    );
    s.setTransition(0);
    s.setTranslate(m41);
    s.animating = false;
  };

  // Selesaikan sisa jarak ke slide aktif dengan kecepatan yang sama, baru
  // autoplay dijalankan lagi -- tidak ada lonjakan kecepatan.
  const resume = () => {
    const s = swiperRef.current;
    if (!s || s.destroyed) return;
    hoveredRef.current = false;
    const target = -s.slidesGrid[s.activeIndex];
    const step =
      (s.slidesSizesGrid[s.activeIndex] ?? 1) +
      Number(s.params.spaceBetween ?? 0);
    const remaining = Math.abs(target - s.translate);
    if (remaining < 1) {
      s.autoplay.start();
      return;
    }
    s.once("transitionEnd", () => {
      if (!hoveredRef.current) s.autoplay.start();
    });
    s.slideTo(s.activeIndex, (remaining / step) * MARQUEE_SPEED, false);
  };

  return (
    <div
      className="spklu-marquee"
      onPointerEnter={(e) => e.pointerType === "mouse" && freeze()}
      onPointerLeave={(e) => e.pointerType === "mouse" && resume()}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={0}
        loop
        speed={MARQUEE_SPEED}
        allowTouchMove={false}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
      >
        {slides.map((o, i) => (
          <SwiperSlide key={`${o.id}-${i}`} className="w-auto!">
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              aria-label={format(t.spklu.viewOperator, { name: o.name })}
              className="group flex h-16 w-40 cursor-pointer items-center justify-center px-4 sm:w-52 sm:px-6"
            >
              {o.logo ? (
                <span className="relative block h-8 w-full sm:h-10">
                  <Image
                    src={o.logo}
                    alt={o.name}
                    fill
                    className="object-contain transition group-hover:scale-105"
                    sizes="208px"
                  />
                </span>
              ) : (
                <span className="font-display truncate text-lg leading-none font-bold tracking-[-0.02em] text-koleksi-navy transition group-hover:text-koleksi-green sm:text-2xl dark:text-ink-dark">
                  {o.name.split(" / ")[0]}
                </span>
              )}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function OperatorAccordion({
  operator,
  isOpen,
  onToggle,
}: {
  operator: SpkluOperator;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();
  const panelId = `${operator.id}-panel`;

  return (
    <div
      id={operator.id}
      className={clsx(
        "scroll-mt-28 rounded-xl border transition-colors duration-300",
        isOpen
          ? "border-transparent bg-muted-light dark:bg-muted-dark"
          : "border-border-light bg-surface-light hover:border-koleksi-navy-dark/70 dark:border-border-dark dark:bg-surface-dark dark:hover:border-ink-dark/40",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left md:px-6 md:py-6"
      >
        <span className="text-base leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
          {operator.name}
        </span>
        <ChevronDown
          size={18}
          className={clsx(
            "shrink-0 text-koleksi-navy-dark transition-transform duration-300 dark:text-ink-dark",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mx-5 grid grid-cols-1 gap-5 border-t border-border-light pt-5 pb-6 sm:grid-cols-3 sm:gap-6 md:mx-6 md:pt-6 md:pb-8 dark:border-border-dark">
              <Field label={t.spklu.operatorName}>{operator.company}</Field>
              <Field label={t.spklu.app}>{operator.app}</Field>
              <Field label={t.spklu.appLink}>
                {operator.playStore || operator.appStore ? (
                  <div className="flex items-center gap-2">
                    {operator.playStore && (
                      <StoreLink
                        href={operator.playStore}
                        label={format(t.spklu.onGooglePlay, { app: operator.app })}
                      >
                        <FaGooglePlay size={15} />
                      </StoreLink>
                    )}
                    {operator.appStore && (
                      <StoreLink
                        href={operator.appStore}
                        label={format(t.spklu.onAppStore, { app: operator.app })}
                      >
                        <FaApple size={17} />
                      </StoreLink>
                    )}
                  </div>
                ) : (
                  "–"
                )}
              </Field>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm leading-[21px] font-bold text-koleksi-navy-dark dark:text-ink-dark/80">
        {label}
      </p>
      <div className="mt-2 text-sm leading-[21px] break-words text-koleksi-navy-dark/60 dark:text-ink-dark/60">
        {children}
      </div>
    </div>
  );
}

function StoreLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex size-9 items-center justify-center rounded-full border border-border-light bg-surface-light text-koleksi-navy-dark transition hover:border-koleksi-navy-dark hover:bg-koleksi-navy-dark hover:text-white dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark"
    >
      {children}
    </a>
  );
}
