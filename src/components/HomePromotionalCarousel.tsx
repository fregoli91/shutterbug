'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent
} from 'react';
import type { HomePromotion } from '@/lib/home-promotions';

const AUTOPLAY_DELAY = 7000;
const INTERACTION_PAUSE = 12000;
const SWIPE_THRESHOLD = 44;

type HomePromotionalCarouselProps = {
  promotions: HomePromotion[];
};

type PointerStart = {
  x: number;
  y: number;
  pointerId: number;
};

export function HomePromotionalCarousel({ promotions }: HomePromotionalCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const swiped = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStart = useRef<PointerStart | null>(null);

  const pauseAfterInteraction = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }

    setIsInteractionPaused(true);
    resumeTimer.current = setTimeout(() => {
      setIsInteractionPaused(false);
      resumeTimer.current = null;
    }, INTERACTION_PAUSE);
  }, []);

  const goTo = useCallback(
    (index: number, manual = true) => {
      if (!promotions.length) return;
      setActiveIndex((index + promotions.length) % promotions.length);
      if (manual) pauseAfterInteraction();
    },
    [pauseAfterInteraction, promotions.length]
  );

  const goPrevious = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(document.visibilityState === 'visible');
    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (
      promotions.length < 2 ||
      prefersReducedMotion ||
      isHovered ||
      isFocusWithin ||
      !isPageVisible ||
      isInteractionPaused || autoplayPaused
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % promotions.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplayPaused, isFocusWithin, isHovered, isInteractionPaused, isPageVisible, prefersReducedMotion, promotions.length]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    swiped.current = false;
    if (event.pointerType === 'mouse') return;
    pointerStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;

    swiped.current = true;
    if (deltaX > 0) goPrevious();
    else goNext();
  }

  if (!promotions.length) return null;

  return (
    <section className="bg-cream px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-4 lg:px-8" aria-label="Featured Shutterbug collections">
      <div className="mx-auto max-w-7xl">
        <div
          className="group relative overflow-hidden rounded-lg border border-forest/15 bg-sand shadow-[0_8px_28px_rgba(35,43,32,0.10)]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Shutterbug promotions"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocusWithin(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusWithin(false);
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          >
            {promotions.map((promotion, index) => (
              <article
                key={promotion.id}
                className="relative min-w-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${promotions.length}: ${promotion.title}`}
                aria-hidden={index !== activeIndex}
              >
                <Link
                  href={promotion.href}
                  className="group/slide relative block aspect-[16/9] w-full overflow-hidden bg-cream sm:aspect-[2/1]"
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={(event) => {
                    if (swiped.current) {
                      event.preventDefault();
                      swiped.current = false;
                    }
                    pauseAfterInteraction();
                  }}
                >
                  {promotion.mobileImage ? (
                    <>
                      <Image
                        src={promotion.mobileImage}
                        alt=""
                        fill
                        sizes="(max-width: 639px) calc(100vw - 2rem), 1px"
                        className="object-contain sm:hidden"
                      />
                      <Image
                        src={promotion.desktopImage}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 1280px, (min-width: 640px) calc(100vw - 3rem), 1px"
                        className="hidden object-contain sm:block"
                      />
                    </>
                  ) : (
                    <>
                      {promotion.id === 'canon-powershot' ? (
                        <Image
                          src={promotion.desktopImage}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 1280px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
                          className="scale-110 object-cover opacity-25 blur-xl"
                          aria-hidden="true"
                        />
                      ) : null}
                      <Image
                        src={promotion.desktopImage}
                        alt=""
                        fill
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : undefined}
                        sizes="(min-width: 1280px) 1280px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
                        className={promotion.id === 'canon-powershot' ? 'object-contain sm:object-cover' : 'object-contain'}
                      />
                    </>
                  )}
                  <span className="sr-only">{promotion.alt}</span>
                </Link>
              </article>
            ))}
          </div>

          {promotions.length > 1 ? (
            <>
              <CarouselButton label="Previous promotion" direction="previous" onClick={goPrevious} />
              <CarouselButton label="Next promotion" direction="next" onClick={goNext} />
            </>
          ) : null}
        </div>
        {promotions.length > 1 ? (
          <div className="flex items-center justify-center gap-1" aria-label="Promotion controls">
            {promotions.map((promotion, index) => (
              <button key={promotion.id} type="button" onClick={() => goTo(index)}
                aria-label={`Show promotion ${index + 1}: ${promotion.eyebrow}`}
                aria-pressed={activeIndex === index}
                className="flex h-11 w-9 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
                <span className={`h-1.5 rounded-full ${activeIndex === index ? 'w-5 bg-forest' : 'w-1.5 bg-forest/30'}`} />
              </button>
            ))}
            <button type="button" onClick={() => setAutoplayPaused((value) => !value)}
              aria-label={autoplayPaused ? 'Play promotions' : 'Pause promotions'}
              title={autoplayPaused ? 'Play promotions' : 'Pause promotions'}
              className="flex h-11 w-11 items-center justify-center rounded text-forest hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
              {autoplayPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
            <p className="sr-only" aria-live={isInteractionPaused ? 'polite' : 'off'}>{promotions[activeIndex]?.eyebrow}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  direction,
  onClick
}: {
  label: string;
  direction: 'previous' | 'next';
  onClick: () => void;
}) {
  const isPrevious = direction === 'previous';

  return (
    <button
      type="button"
      className={`absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-cream/80 text-forest shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss sm:inline-flex ${
        isPrevious ? 'left-1.5 sm:left-2' : 'right-1.5 sm:right-2'
      }`}
      aria-label={label}
      onClick={onClick}
    >
      {isPrevious ? <ChevronLeft className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
