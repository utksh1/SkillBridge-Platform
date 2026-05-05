"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveStoredProfile, setAuthenticated } from '../data/profileUtils';

// --- Pupil Component ---
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    
    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

// --- EyeBall Component ---
interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

// --- Main Login Component ---
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  
  // Character states
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Random blinking logic
  useEffect(() => {
    const scheduleBlink = (setter: (v: boolean) => void) => {
      const timeout = setTimeout(() => {
        setter(true);
        setTimeout(() => {
          setter(false);
          scheduleBlink(setter);
        }, 150);
      }, Math.random() * 4000 + 3000);
      return timeout;
    };
    const t1 = scheduleBlink(setIsPurpleBlinking);
    const t2 = scheduleBlink(setIsBlackBlinking);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    return {
      faceX: Math.max(-15, Math.min(15, deltaX / 20)),
      faceY: Math.max(-10, Math.min(10, deltaY / 30)),
      bodySkew: Math.max(-6, Math.min(6, -deltaX / 120))
    };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    saveStoredProfile({
      email: email || 'alex@skillbridge.edu',
      onboardingComplete: true,
    });
    setAuthenticated(true);
    navigate('/');
  };

  return (
    <div 
      id="login-page-root"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        backgroundColor: '#000000',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Left Section - Gray Gradient with Characters */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #EBEBEB 0%, #D4D4D4 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link to="/login" className="login-brand" aria-label="SkillBridge home">
            <span className="login-brand-text">
              <span className="login-brand-skill">Skill</span>
              <span className="login-brand-bridge">Bridge</span>
            </span>
          </Link>
        </div>

        <Link 
          to="/features" 
          style={{ 
            position: 'absolute',
            top: '48px',
            right: '48px',
            zIndex: 100,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '100px',
            color: '#333',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: '1px solid rgba(0,0,0,0.1)',
          }}
          onMouseOver={(e) => { 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; 
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => { 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; 
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Sparkles size={16} className="text-purple-600" />
          Explore Features
        </Link>

        {/* Character Container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '40px' }}>
          <div style={{ position: 'relative', width: '500px', height: '400px' }}>
            
            {/* Purple Character */}
            <div 
              ref={purpleRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '60px',
                width: '160px',
                height: (isTyping || (password.length > 0 && !showPassword)) ? '420px' : '380px',
                backgroundColor: '#6C3FF5',
                borderRadius: '12px 12px 0 0',
                zIndex: 1,
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'bottom center',
                transform: (password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : (isTyping || (password.length > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  display: 'flex',
                  gap: '30px',
                  transition: 'all 0.7s ease-in-out',
                  left: (password.length > 0 && showPassword) ? '25px' : isLookingAtEachOther ? '50px' : `${40 + purplePos.faceX}px`,
                  top: (password.length > 0 && showPassword) ? '35px' : isLookingAtEachOther ? '60px' : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking} forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking} forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Black Character */}
            <div 
              ref={blackRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '220px',
                width: '110px',
                height: '300px',
                backgroundColor: '#2D2D2D',
                borderRadius: '10px 10px 0 0',
                zIndex: 2,
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'bottom center',
                transform: (password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (password.length > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  display: 'flex',
                  gap: '24px',
                  transition: 'all 0.7s ease-in-out',
                  left: (password.length > 0 && showPassword) ? '12px' : isLookingAtEachOther ? '30px' : `${24 + blackPos.faceX}px`,
                  top: (password.length > 0 && showPassword) ? '28px' : isLookingAtEachOther ? '12px' : `${30 + blackPos.faceY}px`,
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking} forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking} forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
              </div>
            </div>

            {/* Orange Character */}
            <div 
              ref={orangeRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '-20px',
                width: '230px',
                height: '190px',
                backgroundColor: '#FF9B6B',
                borderRadius: '115px 115px 0 0',
                zIndex: 3,
                transition: 'all 0.7s ease-in-out',
                transformOrigin: 'bottom center',
                transform: `skewX(${orangePos.bodySkew || 0}deg)`
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  display: 'flex',
                  gap: '28px',
                  transition: 'all 0.2s ease-out',
                  left: `${80 + orangePos.faceX}px`,
                  top: `${85 + orangePos.faceY}px`,
                }}
              >
                <Pupil size={10} maxDistance={5} pupilColor="#2D2D2D" />
                <Pupil size={10} maxDistance={5} pupilColor="#2D2D2D" />
              </div>
            </div>

            {/* Yellow Character */}
            <div 
              ref={yellowRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '290px',
                width: '130px',
                height: '220px',
                backgroundColor: '#E8D754',
                borderRadius: '65px 65px 0 0',
                zIndex: 4,
                transition: 'all 0.7s ease-in-out',
                transformOrigin: 'bottom center',
                transform: `skewX(${yellowPos.bodySkew || 0}deg)`
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  display: 'flex',
                  gap: '20px',
                  transition: 'all 0.2s ease-out',
                  left: `${50 + yellowPos.faceX}px`,
                  top: `${40 + yellowPos.faceY}px`,
                }}
              >
                <Pupil size={11} maxDistance={5} pupilColor="#2D2D2D" />
                <Pupil size={11} maxDistance={5} pupilColor="#2D2D2D" />
              </div>
              <div 
                style={{
                  position: 'absolute',
                  width: '70px',
                  height: '3px',
                  backgroundColor: '#2D2D2D',
                  borderRadius: '100px',
                  transition: 'all 0.2s ease-out',
                  left: `${30 + yellowPos.faceX}px`,
                  top: '85px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
          <Link to="/features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
        </div>
      </div>

      {/* Right Section - Black Background with Form */}
      <div 
        style={{
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 700, margin: '0 0 8px 0' }}>Welcome back!</h1>
            <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>Please enter your details</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500 }}>Email</label>
              <input
                type="text"
                className="login-auth-input"
                inputMode="email"
                placeholder="anna@gmail.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                style={{
                  height: '48px',
                  backgroundColor: '#000',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '0 52px 0 16px',
                  color: '#FFF',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#666'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-auth-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#000',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '0 40px 0 16px',
                    color: '#FFF',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="rem" style={{ width: '16px', height: '16px' }} />
                <label htmlFor="rem" style={{ color: '#BBB', fontSize: '14px', cursor: 'pointer' }}>Remember for 30 days</label>
              </div>
              <Link to="#" style={{ color: '#BBB', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
            </div>

            {error && (
              <div style={{ padding: '12px', color: '#FF4444', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(255,0,0,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                height: '48px',
                backgroundColor: '#E5E5E5',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginTop: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFF'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E5E5E5'}
            >
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <button
            type="button"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: 'transparent',
              color: '#FFF',
              border: '1px solid #333',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '16px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.color = '#000'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFF'; }}
          >
            <Mail size={20} />
            Log in with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: '32px', color: '#999', fontSize: '14px' }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: '#FFF', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
