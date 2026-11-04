import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono, Chakra_Petch, Rajdhani } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { LandingLanguageProvider } from "@/contexts/LandingLanguageContext";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://careercrew.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CareerCrew AI — AI Resume Builder & Job Search Automation | Create ATS-Optimized Resumes",
    template: "%s | CareerCrew AI — AI Career Suite",
  },
  description:
    "Build ATS-friendly resumes in minutes with AI. CareerCrew AI auto-generates tailored resumes, cover letters & cold emails for every job. Autopilot applies to jobs while you sleep. Free to start.",
  keywords: [
    "AI resume builder",
    "resume creator",
    "resume creation",
    "ATS resume",
    "ATS-optimized resume",
    "AI resume generator",
    "job search",
    "job search automation",
    "automated job applications",
    "AI job search",
    "AI for resume",
    "AI for job search",
    "resume maker",
    "free resume builder",
    "online resume builder",
    "cover letter generator",
    "cold email generator",
    "job application autopilot",
    "career AI tool",
    "professional resume",
    "tailored resume",
    "resume templates",
    "job hunting AI",
    "auto apply jobs",
  ],
  authors: [{ name: "CareerCrew AI", url: siteUrl }],
  creator: "CareerCrew AI",
  publisher: "CareerCrew AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CareerCrew AI",
    title: "CareerCrew AI — AI Resume Builder & Automated Job Search",
    description:
      "Create ATS-optimized resumes with AI in minutes. Let Autopilot search and apply to jobs for you. Free AI resume builder with cover letters & cold emails.",
    images: [
      {
        url: "/hero-mockup.png",
        width: 1200,
        height: 630,
        alt: "CareerCrew AI — AI-powered resume builder and job search automation platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerCrew AI — AI Resume Builder & Job Search Automation",
    description:
      "Build ATS-friendly resumes in minutes. AI-powered resume creation, cover letters & automated job applications. Free to start.",
    images: ["/hero-mockup.png"],
    creator: "@careercrew_ai",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Technology",
};

// JSON-LD structured data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CareerCrew AI",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      sameAs: [
        "https://twitter.com/careercrew_ai",
        "https://linkedin.com/company/careercrew-ai",
        "https://github.com/careercrew-ai",
      ],
      description:
        "AI-powered resume builder and job search automation platform. Create ATS-optimized resumes, cover letters, and let AI apply to jobs for you.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: "CareerCrew AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description:
        "AI resume builder that creates ATS-optimized resumes tailored to job descriptions. Features automated job search, one-click applications, cover letter generation, and cold email drafting.",
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          name: "Free Plan",
          description: "3 AI agent runs per month, 1 resume per day",
        },
        {
          "@type": "Offer",
          price: "3",
          priceCurrency: "USD",
          name: "Pro Plan",
          description: "2 agent runs per day, unlimited resume creation",
        },
        {
          "@type": "Offer",
          price: "16",
          priceCurrency: "USD",
          name: "Elite Plan",
          description: "Unlimited agent runs, unlimited resume creation",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "2500",
        bestRating: "5",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "CareerCrew AI",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How does AI resume creation work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CareerCrew AI uses AI to analyze job descriptions and your professional profile, then generates ATS-optimized resumes tailored to each specific role. Simply input your experience once, paste a job description, and get a perfectly formatted resume in seconds.",
          },
        },
        {
          "@type": "Question",
          name: "Can AI help with job search and applications?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! CareerCrew AI's Autopilot feature uses AI to automatically search for jobs matching your profile, generate tailored resumes for each position, and submit applications on your behalf. It works 24/7 so you never miss an opportunity.",
          },
        },
        {
          "@type": "Question",
          name: "Is CareerCrew AI free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CareerCrew AI offers a free plan that includes 3 AI agent runs per month and 1 manual resume creation per day. Paid plans start at $3/month for more features and unlimited usage.",
          },
        },
        {
          "@type": "Question",
          name: "What is an ATS-optimized resume?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An ATS (Applicant Tracking System) optimized resume is formatted and structured to pass automated screening software used by most companies. CareerCrew AI ensures your resume uses the right keywords, formatting, and structure to get past these filters and into a recruiter's hands.",
          },
        },
        {
          "@type": "Question",
          name: "How is CareerCrew AI different from other resume builders?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unlike traditional resume builders, CareerCrew AI combines AI resume generation with automated job search. It doesn't just create resumes — it finds matching jobs, tailors your resume to each one, generates cover letters and cold emails, and can even apply on your behalf with the Autopilot feature.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} ${chakraPetch.variable} ${rajdhani.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LandingLanguageProvider>
              {children}
              <Toaster position="top-right" />
            </LandingLanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
