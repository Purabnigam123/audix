import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: "easeOut" },
  },
};

const specifications = [
  {
    icon: "driver",
    title: "40mm Dynamic Drivers",
    value: "Hi-Res Tuned",
    detail:
      "Precision-tuned drivers deliver clean highs, controlled mids, and deep low-end response for studio and daily listening.",
  },
  {
    icon: "battery",
    title: "Battery Performance",
    value: "Up to 42 Hours",
    detail:
      "Long playback with fast USB-C charging keeps your sessions uninterrupted across travel, work, and workouts.",
  },
  {
    icon: "noise",
    title: "Noise Control",
    value: "Hybrid ANC",
    detail:
      "Adaptive active noise cancellation with transparency mode helps you switch between focus and awareness in one tap.",
  },
];

const reviews = [
  {
    name: "Aarav Mehta",
    role: "Music Producer",
    quote:
      "The sound profile is clean and balanced. I use them daily for edits and long sessions without fatigue.",
    rating: "5.0",
  },
  {
    name: "Riya Kapoor",
    role: "Daily Commuter",
    quote:
      "Battery life is exactly what I needed. Fast charge and ANC make travel much more comfortable.",
    rating: "4.9",
  },
  {
    name: "Kabir Singh",
    role: "Fitness Enthusiast",
    quote:
      "Very secure fit and punchy bass. The build feels premium and controls are easy while moving.",
    rating: "4.8",
  },
];

const SpecIcon = ({ type }) => {
  if (type === "battery") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect
          x="3"
          y="7"
          width="16"
          height="10"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect x="20" y="10" width="2" height="4" rx="1" fill="currentColor" />
      </svg>
    );
  }

  if (type === "noise") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M4 14a3 3 0 0 0 3 3h1v-7H7a3 3 0 0 0-3 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M20 14a3 3 0 0 1-3 3h-1v-7h1a3 3 0 0 1 3 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 17v-2a4 4 0 0 1 8 0v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
};

const StarRating = ({ rating }) => {
  const stars = Math.round(parseFloat(rating));
  return (
    <div className="flex gap-1.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 transition-all ${i < stars ? "fill-yellow-400 text-yellow-400 drop-shadow-lg" : "fill-slate-700 text-slate-700"}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const QuoteIcon = () => (
  <svg
    className="h-5 w-5 text-yellow-400/60"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5m14 14c3 0 7 1 7 8v8c0 1.25-4.716 5-7 5" />
  </svg>
);

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  const sectionY = useSpring(useTransform(scrollYProgress, [0, 1], [34, 0]), {
    stiffness: 95,
    damping: 24,
    mass: 0.45,
  });
  const sectionOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.4, 1], [0.25, 0.85, 1]),
    {
      stiffness: 95,
      damping: 24,
      mass: 0.45,
    },
  );
  const headingY = useSpring(useTransform(scrollYProgress, [0, 1], [22, 0]), {
    stiffness: 95,
    damping: 24,
    mass: 0.45,
  });

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const products = await getProducts();
        setFeatured(products.slice(0, 3));
      } catch (error) {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div className="-mt-8 space-y-24">
      <Hero />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="space-y-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200/90">
            Specifications
          </p>
          <h3 className="section-title bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-300 bg-clip-text text-4xl text-transparent sm:text-5xl">
            Built For Premium Listening
          </h3>
        </div>

        <div className="space-y-12">
          {specifications.map((spec) => (
            <article
              key={spec.title}
              className="border-b border-indigo-300/15 pb-12 last:border-b-0"
            >
              <div className="flex items-center gap-2 text-indigo-200/75">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-indigo-300/35 bg-indigo-400/10">
                  <SpecIcon type={spec.icon} />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-200/65">
                  {spec.title}
                </p>
              </div>
              <p className="mt-4 text-2xl font-semibold text-blue-300">
                {spec.value}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-loose text-slate-300/95 sm:text-base">
                {spec.detail}
              </p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        ref={sectionRef}
        style={{ y: sectionY, opacity: sectionOpacity }}
        className="space-y-6"
      >
        <motion.div
          style={{ y: headingY }}
          className="flex flex-wrap items-end justify-between gap-5"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Curated Picks
            </p>
            <h2 className="section-title text-3xl text-white sm:text-4xl">
              Featured Products
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
              Designed for creators, commuters, and audiophiles. Handpicked
              models with premium comfort and tuned sound.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 border-b border-slate-600 pb-1 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
          >
            Explore Catalog
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        {loading ? (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-950/55 p-6 text-sm text-slate-400">
            Loading featured products...
          </div>
        ) : (
          <>
            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.22 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {featured.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-10 pt-35"
            >
              <div className="space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200/90">
                  Testimonials
                </p>
                <h3 className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                  What Our Customers Say
                </h3>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300/80">
                  Join thousands of satisfied customers who trust Audix for
                  their audio experience
                </p>
              </div>
              <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid gap-5 md:grid-cols-3"
              >
                {reviews.map((review, idx) => (
                  <motion.article
                    key={review.name}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-2xl bg-slate-950/40 backdrop-blur-sm border border-slate-700/40 transition-all duration-300 hover:border-yellow-400/50 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-yellow-500/10"
                  >
                    {/* Gradient accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-transparent" />

                    <div className="p-6 space-y-4">
                      {/* Star rating at top */}
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs font-medium text-slate-400">
                          {review.rating}
                        </span>
                      </div>

                      {/* Quote text */}
                      <p className="text-sm leading-relaxed text-slate-200 group-hover:text-slate-50 transition-colors italic">
                        "{review.quote}"
                      </p>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-slate-700/50 via-yellow-500/20 to-transparent" />

                      {/* Reviewer info with avatar circle */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-slate-950">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-yellow-100 transition-colors">
                            {review.name}
                          </p>
                          <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate">
                            {review.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.section>
    </div>
  );
};

export default HomePage;
