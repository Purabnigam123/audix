import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 95, damping: 24, mass: 0.45 };

  const heroTextOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.58], [1, 0.9, 0]),
    springConfig,
  );
  const heroTextY = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.58], [0, -18, -70]),
    springConfig,
  );
  const imageScale = useSpring(
    useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 0.94, 0.84]),
    springConfig,
  );
  const imageOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.6, 0.82], [1, 0.46, 0.12]),
    springConfig,
  );
  const imageParallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 120]),
    springConfig,
  );
  const imageRotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -4]),
    springConfig,
  );
  const sectionScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 0.985]),
    springConfig,
  );
  const sectionOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.88, 0.8]),
    springConfig,
  );
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const textContainerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.14,
        delayChildren: 0.2,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 min-h-[calc(100vh-86px)] w-[100dvw] -translate-x-1/2 overflow-hidden bg-gradient-to-b from-black to-slate-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99, 101, 241, 0.45),transparent_42%)]" />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="relative z-20 mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-7xl flex-col items-center justify-start gap-3 px-4 py-8 sm:gap-4 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-12"
      >
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="mt-4 flex w-full max-w-xl flex-col items-center text-center lg:mt-0 lg:w-[42%] lg:items-start lg:text-left"
        >
          <motion.h1
            variants={textItemVariants}
            className="section-title max-w-2xl text-4xl leading-[0.95] text-white sm:text-6xl lg:text-7xl"
          >
            Hear music in
            <span className="ml-2 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              pure detail
            </span>
          </motion.h1>

          <motion.p
            variants={textItemVariants}
            className="mt-5 max-w-xl text-sm text-slate-300 sm:text-base"
          >
            Premium wireless headphones crafted for cinematic sound, deep
            comfort, and immersive daily listening.
          </motion.p>

          <motion.div variants={textItemVariants}>
            <Link
              to="/products"
              className="btn-primary mt-8 inline-flex rounded-full px-7 py-3 text-sm font-semibold"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            y: imageParallaxY,
            scale: imageScale,
            opacity: imageOpacity,
            rotate: imageRotate,
          }}
          className="relative flex w-full items-center justify-center lg:w-[58%] lg:justify-end"
        >
          <motion.img
            src="/images/hero.png"
            alt="Audix hero headphones"
            initial={{ opacity: 0, scale: 0.86, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.75, ease: "easeOut", delay: 0.35 },
              scale: { duration: 0.75, ease: "easeOut", delay: 0.35 },
              y: {
                duration: 4.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.05,
              },
            }}
            className="relative z-20 w-[124%] max-w-none object-contain drop-shadow-[0_20px_30px_rgba(2,6,23,0.55)] sm:w-[128%] lg:w-[145%] lg:-mr-65"
          />
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-slate-700/70">
          <motion.div
            style={{ width: progressWidth }}
            className="h-px bg-gradient-to-r from-slate-400/50 via-slate-300/60 to-slate-400/50"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
