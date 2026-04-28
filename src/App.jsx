import React, { Suspense, useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, AuthContext } from "./auth/AuthContext";
import { LanguageProvider, LanguageContext } from "./i18n/LanguageContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsent from "./components/CookieConsent";
import InstallPrompt from "./components/InstallPrompt";
import SWUpdateBanner from "./components/SWUpdateBanner";
import OfflineBanner from "./components/OfflineBanner";
import { ToastProvider } from "./components/ToastNotification";
import { AnalyticsService } from "./services/AnalyticsService";
import TimeLimitOverlay from "./components/TimeLimitOverlay";
import { CertificateService } from "./services/CertificateService";
import { SkeletonCard } from "./components/SkeletonLoader";

const MilestoneCertificate = React.lazy(() => import("./components/rewards/MilestoneCertificate"));

const HomePage = React.lazy(() => import("./pages/HomePage"));
const AuthPage = React.lazy(() => import("./auth/AuthPage"));
const GuestSetup = React.lazy(() => import("./pages/GuestSetup"));
const QuizPage = React.lazy(() => import("./pages/QuizPage"));
const QuizPage_2_3_unified = React.lazy(() => import("./pages/QuizPage_2_3_unified"));
const QuizPage_4_5_logic = React.lazy(() => import("./pages/QuizPage_4_5_logic"));
const ActivityQuizPage = React.lazy(() => import("./pages/ActivityQuizPage"));
const FunQuizPage = React.lazy(() => import("./pages/FunQuizPage"));
const ParentDashboard = React.lazy(() => import("./pages/ParentDashboard"));
const OnboardingPage = React.lazy(() => import("./pages/OnboardingPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const BoardGamesPage = React.lazy(() => import("./pages/BoardGamesPage"));
const AdultGamesPage = React.lazy(() => import("./pages/AdultGamesPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const PlayerStatsPage = React.lazy(() => import("./pages/PlayerStatsPage"));
const MyGamesPage = React.lazy(() => import("./pages/MyGamesPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const FAQPage = React.lazy(() => import("./pages/FAQPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const SubscriptionPage = React.lazy(() => import("./pages/SubscriptionPage"));
const LeaderboardPage = React.lazy(() => import("./pages/LeaderboardPage"));
const WeeklyReportPage = React.lazy(() => import("./pages/WeeklyReportPage"));
const ContentEditorPage = React.lazy(() => import("./pages/ContentEditorPage"));
const OnlineMultiplayerPage = React.lazy(() => import("./pages/OnlineMultiplayerPage"));
const AITutorPage = React.lazy(() => import("./pages/AITutorPage"));
const TeacherDashboard = React.lazy(() => import("./pages/TeacherDashboard"));
const JoinClassroomPage = React.lazy(() => import("./pages/JoinClassroomPage"));
const MyClassroomPage = React.lazy(() => import("./pages/MyClassroomPage"));
const AchievementsPage = React.lazy(() => import("./pages/AchievementsPage"));
const ShopPage = React.lazy(() => import("./pages/ShopPage"));
const CurriculumMapPage = React.lazy(() => import("./pages/CurriculumMapPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const ForTeachersPage = React.lazy(() => import("./pages/ForTeachersPage"));
const ForParentsPage = React.lazy(() => import("./pages/ForParentsPage"));
const LessonViewPage = React.lazy(() => import("./pages/LessonViewPage"));

function PlayGate({ children }) {
  const { user, guest, loading, isGuestExpired, userProfile } = React.useContext(AuthContext);
  const loc = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (user) {
    if (!userProfile && loc.pathname !== "/onboarding") return <Navigate to="/onboarding" replace />;
    return children;
  }
  if (guest) {
    if (isGuestExpired()) return <Navigate to="/guest-expired" replace />;
    return children;
  }
  return <Navigate to="/guest-setup" replace />;
}

function AuthGate({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

const GuestExpiredPage = React.lazy(() => import("./pages/GuestExpiredPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-48 mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-72 mb-6" />
        </div>
        <SkeletonCard count={6} />
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    AnalyticsService.pageView(pathname);
  }, [pathname]);
  return null;
}

function OnboardingGuard() {
  const { user, userProfile, loading } = React.useContext(AuthContext);
  const { pathname } = useLocation();
  const skipPaths = ["/onboarding", "/auth", "/guest-setup", "/guest-expired", "/privacy", "/terms", "/faq", "/contact", "/about"];
  if (loading) return null;
  if (user && !userProfile && !skipPaths.includes(pathname)) {
    return <Navigate to="/onboarding" replace />;
  }
  return null;
}

function SkipLink() {
  const { lang } = React.useContext(LanguageContext);
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById("main-content");
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: false });
    }
  };
  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      {lang === "el" ? "Μετάβαση στο περιεχόμενο" : "Skip to content"}
    </a>
  );
}

function MilestoneListener() {
  const { lang } = React.useContext(LanguageContext);
  const { user, guest } = React.useContext(AuthContext);
  const [cert, setCert] = useState(null);

  const userName = user?.displayName || guest?.name || "";

  useEffect(() => {
    const unshown = CertificateService.getUnshownCertificate();
    if (unshown) setCert(unshown);
  }, []);

  useEffect(() => {
    const handler = (e) => setCert(e.detail);
    window.addEventListener("geo:milestone", handler);
    return () => window.removeEventListener("geo:milestone", handler);
  }, []);

  const handleClose = useCallback(() => {
    if (cert) CertificateService.markCertificateShown(cert.id);
    setCert(null);
  }, [cert]);

  if (!cert) return null;

  return (
    <Suspense fallback={null}>
      <MilestoneCertificate cert={cert} userName={userName} lang={lang} onClose={handleClose} />
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <ThemeProvider>
    <AuthProvider>
      <LanguageProvider>
        <SubscriptionProvider>
        <ProgressProvider>
          <BrowserRouter>
            <ScrollToTop />
            <OnboardingGuard />
            <ToastProvider>
            <SkipLink />
            <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<AuthGate><OnboardingPage /></AuthGate>} />
                <Route path="/profile" element={<PlayGate><ProfilePage /></PlayGate>} />
                <Route path="/stats" element={<PlayGate><PlayerStatsPage /></PlayGate>} />
                <Route path="/my-games" element={<PlayGate><MyGamesPage /></PlayGate>} />
                <Route path="/guest-setup" element={<GuestSetup />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/curriculum" element={<CurriculumMapPage />} />
                <Route path="/blog/:slug" element={<BlogPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/for-teachers" element={<ForTeachersPage />} />
                <Route path="/for-parents" element={<ForParentsPage />} />
                <Route path="/my-records" element={<LeaderboardPage />} />
                <Route path="/weekly-report" element={<PlayGate><WeeklyReportPage /></PlayGate>} />
                <Route path="/content-editor" element={<PlayGate><ContentEditorPage /></PlayGate>} />
                <Route path="/online-multiplayer" element={<PlayGate><OnlineMultiplayerPage /></PlayGate>} />
                <Route path="/ai-tutor" element={<PlayGate><AITutorPage /></PlayGate>} />
                <Route path="/achievements" element={<PlayGate><AchievementsPage /></PlayGate>} />
                <Route path="/shop" element={<PlayGate><ShopPage /></PlayGate>} />
                <Route path="/guest-expired" element={<GuestExpiredPage />} />
                <Route path="/play" element={<PlayGate><ErrorBoundary><QuizPage /></ErrorBoundary></PlayGate>} />
                <Route path="/play/2-3-school" element={<PlayGate><ErrorBoundary><QuizPage_2_3_unified mode="school" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/2-3-fun" element={<PlayGate><ErrorBoundary><QuizPage_2_3_unified mode="fun" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/2-3-logic" element={<PlayGate><ErrorBoundary><QuizPage_2_3_unified mode="logic" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/4-5-fun" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="4-5" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/4-5-logic" element={<PlayGate><ErrorBoundary><QuizPage_4_5_logic /></ErrorBoundary></PlayGate>} />
                <Route path="/play/6-fun" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="6" mode="fun" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/6-logic" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="6" mode="logic" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/7-8-fun" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="7-8" mode="fun" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/7-8-logic" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="7-8" mode="logic" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/9-10-fun" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="9-10" mode="fun" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/9-10-logic" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="9-10" mode="logic" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/11-12-school" element={<PlayGate><ErrorBoundary><QuizPage menuVariant="11-12" mode="school" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/11-12-fun" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="11-12" mode="fun" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/11-12-logic" element={<PlayGate><ErrorBoundary><FunQuizPage ageGroup="11-12" mode="logic" /></ErrorBoundary></PlayGate>} />
                <Route path="/play/board-games" element={<PlayGate><ErrorBoundary><BoardGamesPage /></ErrorBoundary></PlayGate>} />
                <Route path="/play/adult-games" element={<PlayGate><ErrorBoundary><AdultGamesPage /></ErrorBoundary></PlayGate>} />
                <Route path="/play/adult-games/:category" element={<PlayGate><ErrorBoundary><AdultGamesPage /></ErrorBoundary></PlayGate>} />
                <Route path="/play/:ageGroup" element={<PlayGate><ErrorBoundary><ActivityQuizPage /></ErrorBoundary></PlayGate>} />
                <Route path="/parent-dashboard" element={<PlayGate><ErrorBoundary><ParentDashboard /></ErrorBoundary></PlayGate>} />
                <Route path="/teacher-dashboard" element={<PlayGate><ErrorBoundary><TeacherDashboard /></ErrorBoundary></PlayGate>} />
                <Route path="/join/:code" element={<PlayGate><ErrorBoundary><JoinClassroomPage /></ErrorBoundary></PlayGate>} />
                <Route path="/join" element={<PlayGate><ErrorBoundary><JoinClassroomPage /></ErrorBoundary></PlayGate>} />
                <Route path="/lesson/:code" element={<ErrorBoundary><LessonViewPage /></ErrorBoundary>} />
                <Route path="/my-classroom/:code" element={<PlayGate><ErrorBoundary><MyClassroomPage /></ErrorBoundary></PlayGate>} />
                <Route path="/my-classroom" element={<PlayGate><ErrorBoundary><MyClassroomPage /></ErrorBoundary></PlayGate>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
            <TimeLimitOverlay />
            <MilestoneListener />
            <CookieConsent />
            <InstallPrompt />
            <SWUpdateBanner />
            <OfflineBanner />
            </ToastProvider>
          </BrowserRouter>
        </ProgressProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}
