"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, Phone, Globe } from "lucide-react";
import { LoadingScreen } from "./components/LoadingScreen";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
  </svg>
);

function LinkButton({ link }: { link: { label: string; href: string; value?: string; icon: React.ElementType; secondaryIcon?: React.ElementType; secondaryHref?: string } }) {
  const Icon = link.icon;
  const SecondaryIcon = link.secondaryIcon;
  return (
    <div className="flex w-full max-w-[500px] items-center gap-3 sm:gap-4">
      <Link 
        href={link.href} 
        className="relative flex flex-1 flex-col items-start justify-center gap-0.5 rounded-2xl border border-zinc-200 bg-white py-3 px-6"
      >
        <span className="text-base font-semibold text-zinc-900">
          {link.label}
        </span>
        {link.value && (
          <span className="text-xs font-medium text-zinc-500">
            {link.value}
          </span>
        )}
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        <Link 
          href={link.href}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white"
        >
          <Icon className="h-8 w-8 text-zinc-900" strokeWidth={1.25} />
        </Link>
        {SecondaryIcon && (
          <Link 
            href={link.secondaryHref || link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white"
          >
            <SecondaryIcon className="h-10 w-10 text-zinc-900" strokeWidth={1.25} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function LinkTree() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { label: "Visit Website", href: "https://www.dollyva.com", value: "dollyva.com", icon: Globe },
    { label: "Email Us", href: "mailto:info@dollyva.com", value: "info@dollyva.com", icon: Mail },
    { label: "Phone", href: "tel:+947111111111", value: "+947111111111", icon: Phone, secondaryIcon: WhatsappIcon, secondaryHref: "https://wa.me/947111111111" },
  ];

  const socialLinks = [
    { href: "https://www.instagram.com/dollyva.team/", icon: InstagramIcon, label: "Instagram" },
    { href: "https://www.linkedin.com/company/dollyva", icon: LinkedinIcon, label: "LinkedIn" },
    { href: "https://www.facebook.com/profile.php?id=61590359254322", icon: FacebookIcon, label: "Facebook" },
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-[100svh] w-full flex flex-col items-center overflow-hidden bg-white selection:bg-zinc-900 selection:text-white font-sans">
      <LoadingScreen />


      <main className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pt-12 pb-4 sm:px-10 sm:pt-20 sm:pb-6">
        
        {/* Profile / Logo Section */}
        <div className="relative mb-12 flex flex-col items-center gap-6">
          <div id="header-logo" className="relative flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52 opacity-0">
            <Image 
              src="/logo.jpg" 
              alt="Dollyva Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Dollyva
            </h1>
            <p className="max-w-xs text-sm font-medium text-zinc-500 sm:max-w-sm sm:text-base">
              Let&apos;s build something <span className="font-serif italic text-zinc-400">extraordinary.</span>
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-600 sm:max-w-md sm:text-base">
              We design and build premium, high-performance web applications, mobile apps, and custom digital platforms.
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex w-full flex-col items-center gap-4">
          {links.map((link, i) => (
            <LinkButton key={i} link={link} />
          ))}
        </div>

        {/* Social Icons Section */}
        <div className="mt-10 flex w-full flex-col items-center gap-6">
          <div className="flex w-full max-w-[500px] items-center gap-4 px-6">
            <div className="h-px flex-1 bg-zinc-200"></div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Follow Us</span>
            <div className="h-px flex-1 bg-zinc-200"></div>
          </div>
          
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            {socialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
              <Link 
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
                title={social.label}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white transition-colors group-hover:bg-zinc-50">
                  <Icon className="h-8 w-8 text-zinc-900" strokeWidth={1.25} />
                </div>
                <span className="text-xs font-medium text-zinc-500">{social.label}</span>
              </Link>
            );
          })}
          </div>
        </div>

        {/* Copyright Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs font-medium text-zinc-400">
            &copy; {new Date().getFullYear()} Dollyva. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Massive Typography Footer Effect */}
      <div className="relative z-10 w-full overflow-hidden mt-auto [perspective:1000px] pointer-events-none select-none px-4 pb-4">
        <h1 className="flex w-full justify-between text-[15vw] font-black uppercase leading-[0.75] tracking-tighter text-zinc-950/5">
          {"DOLLYVA".split("").map((char, index) => (
            <span
              key={index}
              className="block origin-bottom"
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
