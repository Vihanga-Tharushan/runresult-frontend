import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Trophy,
  User,
  Users,
} from "lucide-react";
import heroSprint from "../assets/hero-sprint.png";
import heroHurdles from "../assets/hero-hurdles.jpg";
import heroRelay from "../assets/hero-relay.jpg";
import heroJavelin from "../assets/hero-javelin.jpg";

const SLIDES = [
  { src: heroSprint, alt: "Sprinters racing on the track" },
  { src: heroHurdles, alt: "Athlete clearing a hurdle" },
  { src: heroRelay, alt: "Relay baton exchange" },
  { src: heroJavelin, alt: "Javelin thrower in action" },
];

const SLIDE_INTERVAL_MS = 5000;
const FADE_MS = 1000;

const FEATURES = [
  { icon: Trophy, title: "Live Results", text: "Real-time updates" },
  { icon: CalendarDays, title: "Event Management", text: "Simple & efficient" },
  { icon: Users, title: "Athlete Profiles", text: "Track their journey" },
];

// Staggered entrance for the left copy (runs once on load, never on slide change)
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [loaded, setLoaded] = useState([]); // src values that finished loading
  const [failed, setFailed] = useState([]); // src values that failed to load

  const slides = SLIDES.filter((s) => !failed.includes(s.src));
  const count = slides.length;
  const current = count ? index % count : 0;
  const firstReady = count > 0 && loaded.includes(slides[0].src);
  const running = count > 1 && !reduceMotion && !paused && !pageHidden;

  const mark = (setter) => (src) =>
    setter((prev) => (prev.includes(src) ? prev : [...prev, src]));
  const markLoaded = mark(setLoaded);
  const markFailed = mark(setFailed);

  const goTo = (i) => count && setIndex(((i % count) + count) % count);

  // Timer restarts after every change (manual or automatic) so it always lines
  // up with the progress bar on the active dot.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % count),
      SLIDE_INTERVAL_MS
    );
    return () => clearTimeout(timer);
  }, [index, running, count]);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Warm up the next photograph so the crossfade never shows a loading flash
  useEffect(() => {
    if (count < 2) return;
    const img = new Image();
    img.src = slides[(current + 1) % count].src;
  }, [current, count]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="relative overflow-hidden bg-bg">
      <style>{`
        @keyframes heroShimmer { 100% { transform: translateX(100%); } }
        @keyframes heroProgress { from { width: 0%; } to { width: 100%; } }
      `}</style>

      {/* Decorative angular shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-40 h-105 w-105 rotate-45 rounded-3xl bg-primary/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 -left-16 h-64 w-64 -rotate-12 rounded-3xl bg-primary/10"
      />

      {/* lg:pt-20 clears the fixed navbar so the copy centers in the visible hero area */}
      <div className="relative mx-auto flex max-w-8xl flex-col pt-24 lg:min-h-screen lg:flex-row lg:pt-20">
        {/* Left: content — extra left padding on desktop moves it away from the edge */}
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-10 lg:w-[46%] lg:py-20 lg:pl-20 lg:pr-6 xl:pl-28"
        >
          <motion.h1
            variants={item}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
          >
            ATHLETICS
            <br />
            <span className="text-primary">LIVE FOR YOU</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg"
          >
            Official platform for athletics championships. Register, compete and
            celebrate excellence.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            {/* text-white! forces white even if a global `a { color }` rule exists */}
            <Link
              to="/results"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white! no-underline shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.98]"
            >
              <Trophy className="h-4 w-4" />
              Live Results
              <ArrowRight className="-ml-1 h-4 w-4 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-7 py-3.5 text-sm font-semibold text-primary no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.98]"
            >
              <User className="h-4 w-4" />
              Online Registration
            </Link>
          </motion.div>
          {/* 
          <motion.div variants={item} className="mt-14 flex flex-wrap gap-x-10 gap-y-8">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="mt-0.5 text-xs text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </motion.div> */}
        </motion.div>

        {/* Right: rotating image panel */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative min-h-95 flex-1 lg:min-h-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          {/* ">" edge: the white copy area pushes a point into the photo at mid-height.
              Change 12% to make the arrow shallower or deeper. */}
          <div className="absolute inset-0 overflow-hidden bg-primary/10 lg:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,12%_50%)]">
            {/* Loading skeleton — fades out once the first photograph is ready */}
            <div
              aria-hidden
              className={`absolute inset-0 overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-primary/15 transition-opacity duration-700 ${
                firstReady || count === 0 ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent"
                style={{ animation: "heroShimmer 1.6s ease-in-out infinite" }}
              />
            </div>

            {count > 0 ? (
              slides.map((slide, i) => {
                const isActive = i === current;
                const isReady = loaded.includes(slide.src);
                return (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={isActive ? slide.alt : ""}
                    aria-hidden={!isActive}
                    width={1152}
                    height={1024}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    decoding="async"
                    draggable={false}
                    onLoad={() => markLoaded(slide.src)}
                    onError={() => markFailed(slide.src)}
                    className="absolute inset-0 h-full w-full object-cover will-change-transform"
                    style={{
                      opacity: isActive && isReady ? 1 : 0,
                      filter: isReady ? "none" : "blur(12px)",
                      // subtle Ken Burns on the active photograph
                      transform: reduceMotion
                        ? "none"
                        : isActive
                          ? "scale(1.07) translateX(1%)"
                          : "scale(1.02)",
                      transition: reduceMotion
                        ? `opacity ${FADE_MS}ms ease-in-out`
                        : `opacity ${FADE_MS}ms ease-in-out, filter 700ms ease-out, transform ${
                            isActive ? SLIDE_INTERVAL_MS + FADE_MS : FADE_MS
                          }ms linear`,
                    }}
                  />
                );
              })
            ) : (
              <div
                role="img"
                aria-label="RunResult athletics"
                className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary via-primary-dark to-primary-dark"
              >
                <Trophy className="h-20 w-20 text-white/25" aria-hidden />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/25 via-transparent to-transparent" />
          </div>

          {/* Carousel controls */}
          {count > 1 && (
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-5 lg:bottom-8">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => goTo(current - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-gray-900 shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5">
                {slides.map((slide, i) => {
                  const isActive = i === current;
                  return (
                    <button
                      key={slide.src}
                      type="button"
                      aria-label={`Show image ${i + 1} of ${count}: ${slide.alt}`}
                      aria-current={isActive}
                      onClick={() => goTo(i)}
                      className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        isActive ? "w-8 bg-white/80" : "w-2.5 bg-white/80 hover:bg-white"
                      }`}
                    >
                      {isActive && (
                        <span
                          key={`${current}-${running}`}
                          className="absolute inset-y-0 left-0 rounded-full bg-primary"
                          style={
                            running
                              ? {
                                  animation: `heroProgress ${SLIDE_INTERVAL_MS}ms linear forwards`,
                                }
                              : { width: "100%" }
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Next image"
                onClick={() => goTo(current + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-gray-900 shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}