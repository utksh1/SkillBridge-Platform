import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRef } from "react";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const PrismaHero = () => {
  const { scrollYProgress } = useScroll();

  // Feature content for scrolling with wider gaps to eliminate any mixing
  const features = [
    {
      title: "Bridge the Gap",
      description: "SkillBridge is a global ecosystem of learners and mentors dedicated to bridging the gap between talent and opportunity.",
      range: [0, 0.1, 0.25]
    },
    {
      title: "Master New Skills",
      description: "Unlock your full potential with hands-on projects and industry-vetted courses designed for modern professionals.",
      range: [0.35, 0.5, 0.65]
    },
    {
      title: "Unlock Your Future",
      description: "Join a worldwide community of experts and ambitious professionals bound by passion and hunger to grow.",
      range: [0.75, 0.9, 1]
    }
  ];

  return (
    <section
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        zIndex: 1
      }}
    >
      {/* Background Video Layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />
        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 1 }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)',
            zIndex: 2
          }}
        />
        <div
          className="noise-overlay"
          style={{ position: 'absolute', inset: 0, opacity: 0.5, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3 }}
        />
      </div>

      {/* Top Navigation - Center Top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: '#000',
            borderRadius: '0 0 2rem 2rem',
            padding: '1rem 3rem',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <Link
            to="/login"
            style={{
              color: '#E1E0CC',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Left Middle: Massive Title */}
      <div
        style={{
          position: 'absolute',
          bottom: '65vh',
          left: '1vw',
          zIndex: 50,
          pointerEvents: 'none',
          lineHeight: 0.7,
          fontSize: "10px",
          fontFamily: "Playfair Display, serif"
        }}
      >
        <h1
          style={{
            color: '#E1E0CC',
            fontSize: '18vw',
            fontWeight: 500,
            letterSpacing: '-0.08em',
            margin: 0,
            lineHeight: 0.8,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <WordsPullUp text="SkillBridge" showAsterisk />
        </h1>
      </div>

      {/* Right Content Area - Animated on Scroll */}
      <div
        style={{
          position: 'absolute',
          bottom: '10vh',
          right: '5vw',
          zIndex: 60,
          maxWidth: '380px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}
      >
        <div style={{ position: 'relative', height: '220px' }}>
          {features.map((feature, i) => (
            <FeatureBlock 
              key={i} 
              feature={feature} 
              progress={scrollYProgress} 
            />
          ))}
        </div>

        {/* Global CTA Button - Always visible at bottom right */}
        <div style={{ marginTop: '2rem' }}>
          <Link to="/login" style={{ textDecoration: 'none', width: 'fit-content' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
              style={{
                backgroundColor: '#E1E0CC',
                color: '#000',
                borderRadius: '100px',
                padding: '0.4rem 0.4rem 0.4rem 1.6rem',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
              Start learning
              <div
                style={{
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ArrowRight size={20} style={{ color: '#E1E0CC' }} />
              </div>
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ---------------- FeatureBlock ---------------- */
const FeatureBlock = ({ feature, progress }: { feature: any, progress: any }) => {
  const opacity = useTransform(progress, feature.range, [0, 1, 0], {
    clamp: true
  });
  const y = useTransform(progress, feature.range, [40, 0, -40], {
    clamp: true
  });

  return (
    <motion.div
      style={{
        opacity,
        y,
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        pointerEvents: opacity === 0 ? 'none' : 'auto'
      }}
    >
      <h3 style={{ color: '#E1E0CC', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        {feature.title}
      </h3>
      <p
        style={{
          color: 'rgba(225, 224, 204, 0.9)',
          fontSize: '1rem',
          lineHeight: 1.4,
          fontWeight: 400,
          margin: 0
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  );
};

export { PrismaHero }
