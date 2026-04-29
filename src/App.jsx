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
import SystemAnnouncementBanner from "./components/SystemAnnouncementBanner";
import { ToastProvider } from "./components/ToastNotification";
import { AnalyticsService } from "./services/AnalyticsService";
import TimeLimitOverlay from "./components/TimeLimitOverlay";
import { CertificateService } from "./services/CertificateService";
import { FeatureFlagService } from "./services/FeatureFlagService";
import { PremiumContentService } from "./services/PremiumContentService";
import FeatureGate from "./components/FeatureGate";
import PremiumGate from "./components/PremiumGate";
import { SkeletonCard } from "./components/SkeletonLoader";
import SeasonalDecorations from "./components/SeasonalDecorations";
import KeyboardShortcutsHandler from "./components/KeyboardShortcutsHandler";

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
const GlobalLeaderboardPage = React.lazy(() => import("./pages/GlobalLeaderboardPage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const TrophyRoomPage = React.lazy(() => import("./pages/TrophyRoomPage"));
const SpeedrunPage = React.lazy(() => import("./pages/SpeedrunPage"));
const SubjectMasteryPage = React.lazy(() => import("./pages/SubjectMasteryPage"));
const StudyBuddyPage = React.lazy(() => import("./pages/StudyBuddyPage"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
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
const DailyChallengePage = React.lazy(() => import("./pages/DailyChallengePage"));
const AdventureMapPage = React.lazy(() => import("./pages/AdventureMapPage"));
const AvatarBuilderPage = React.lazy(() => import("./pages/AvatarBuilderPage"));
const LiveQuizPage = React.lazy(() => import("./pages/LiveQuizPage"));
const ChallengeFriendPage = React.lazy(() => import("./pages/ChallengeFriendPage"));
const PrintableWorksheetsPage = React.lazy(() => import("./pages/PrintableWorksheetsPage"));
const BattleRoyalePage = React.lazy(() => import("./pages/BattleRoyalePage"));
const PetPage = React.lazy(() => import("./pages/PetPage"));
const StoryModePage = React.lazy(() => import("./pages/StoryModePage"));
const CollectibleCardsPage = React.lazy(() => import("./pages/CollectibleCardsPage"));
const FamilyChallengePage = React.lazy(() => import("./pages/FamilyChallengePage"));

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
  useEffect(() => {
    FeatureFlagService.init();
    PremiumContentService.init();
  }, []);

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
            <SeasonalDecorations />
            <KeyboardShortcutsHandler />
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
                <Route path="/subscription" element={<FeatureGate flag="subs_enabled"><SubscriptionPage /></FeatureGate>} />
                <Route path="/curriculum" element={<CurriculumMapPage />} />
                <Route path="/blog/:slug" element={<FeatureGate flag="blog"><BlogPage /></FeatureGate>} />
                <Route path="/blog" element={<FeatureGate flag="blog"><BlogPage /></FeatureGate>} />
                <Route path="/for-teachers" element={<ForTeachersPage />} />
                <Route path="/for-parents" element={<ForParentsPage />} />
                <Route path="/my-records" element={<LeaderboardPage />} />
                <Route path="/leaderboard" element={<FeatureGate flag="leaderboard"><PremiumGate id="feature_leaderboard"><GlobalLeaderboardPage /></PremiumGate></FeatureGate>} />
                <Route path="/events" element={<FeatureGate flag="events"><PremiumGate id="feature_events"><EventsPage /></PremiumGate></FeatureGate>} />
                <Route path="/trophy-room" element={<FeatureGate flag="trophyRoom"><PremiumGate id="feature_trophyRoom"><TrophyRoomPage /></PremiumGate></FeatureGate>} />
                <Route path="/admin/*" element={<AuthGate><AdminDashboard /></AuthGate>} />
                <Route path="/speedrun" element={<PlayGate><FeatureGate flag="speedrun"><PremiumGate id="feature_speedrun"><SpeedrunPage /></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/mastery" element={<PlayGate><FeatureGate flag="masteryTracker"><PremiumGate id="feature_masteryTracker"><SubjectMasteryPage /></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/study-buddy" element={<PlayGate><FeatureGate flag="aiTutor"><PremiumGate id="feature_aiTutor"><StudyBuddyPage /></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/weekly-report" element={<PlayGate><WeeklyReportPage /></PlayGate>} />
                <Route path="/content-editor" element={<PlayGate><ContentEditorPage /></PlayGate>} />
                <Route path="/online-multiplayer" element={<PlayGate><OnlineMultiplayerPage /></PlayGate>} />
                <Route path="/ai-tutor" element={<PlayGate><FeatureGate flag="aiTutor"><PremiumGate id="feature_aiTutor"><AITutorPage /></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/achievements" element={<PlayGate><AchievementsPage /></PlayGate>} />
                <Route path="/shop" element={<PlayGate><FeatureGate flag="shop"><PremiumGate id="feature_shop"><ShopPage /></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/guest-expired" element={<GuestExpiredPage />} />
                <Route path="/play" element={<PlayGate><ErrorBoundary><QuizPage /></ErrorBoundary></PlayGate>} />
                <Route path="/play/2-3-school" element={<PlayGate><FeatureGate flag="games_age_2_3_school"><PremiumGate id="games_age_2_3_school"><ErrorBoundary><QuizPage_2_3_unified mode="school" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/2-3-fun" element={<PlayGate><FeatureGate flag="games_age_2_3_fun"><PremiumGate id="games_age_2_3_fun"><ErrorBoundary><QuizPage_2_3_unified mode="fun" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/2-3-logic" element={<PlayGate><FeatureGate flag="games_age_2_3_logic"><PremiumGate id="games_age_2_3_logic"><ErrorBoundary><QuizPage_2_3_unified mode="logic" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/4-5-fun" element={<PlayGate><FeatureGate flag="games_age_4_5_fun"><PremiumGate id="games_age_4_5_fun"><ErrorBoundary><FunQuizPage ageGroup="4-5" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/4-5-logic" element={<PlayGate><FeatureGate flag="games_age_4_5_logic"><PremiumGate id="games_age_4_5_logic"><ErrorBoundary><QuizPage_4_5_logic /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/6-fun" element={<PlayGate><FeatureGate flag="games_age_6_fun"><PremiumGate id="games_age_6_fun"><ErrorBoundary><FunQuizPage ageGroup="6" mode="fun" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/6-logic" element={<PlayGate><FeatureGate flag="games_age_6_logic"><PremiumGate id="games_age_6_logic"><ErrorBoundary><FunQuizPage ageGroup="6" mode="logic" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/7-8-fun" element={<PlayGate><FeatureGate flag="games_age_7_8_fun"><PremiumGate id="games_age_7_8_fun"><ErrorBoundary><FunQuizPage ageGroup="7-8" mode="fun" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/7-8-logic" element={<PlayGate><FeatureGate flag="games_age_7_8_logic"><PremiumGate id="games_age_7_8_logic"><ErrorBoundary><FunQuizPage ageGroup="7-8" mode="logic" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/9-10-fun" element={<PlayGate><FeatureGate flag="games_age_9_10_fun"><PremiumGate id="games_age_9_10_fun"><ErrorBoundary><FunQuizPage ageGroup="9-10" mode="fun" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/9-10-logic" element={<PlayGate><FeatureGate flag="games_age_9_10_logic"><PremiumGate id="games_age_9_10_logic"><ErrorBoundary><FunQuizPage ageGroup="9-10" mode="logic" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/11-12-school" element={<PlayGate><FeatureGate flag="games_age_11_12_school"><PremiumGate id="games_age_11_12_school"><ErrorBoundary><QuizPage menuVariant="11-12" mode="school" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/11-12-fun" element={<PlayGate><FeatureGate flag="games_age_11_12_fun"><PremiumGate id="games_age_11_12_fun"><ErrorBoundary><FunQuizPage ageGroup="11-12" mode="fun" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/11-12-logic" element={<PlayGate><FeatureGate flag="games_age_11_12_logic"><PremiumGate id="games_age_11_12_logic"><ErrorBoundary><FunQuizPage ageGroup="11-12" mode="logic" /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/board-games" element={<PlayGate><FeatureGate flag="games_age_adult_board"><PremiumGate id="games_age_adult_board"><ErrorBoundary><BoardGamesPage /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/adult-games" element={<PlayGate><FeatureGate flag="games_age_adult_brain"><PremiumGate id="games_age_adult_brain"><ErrorBoundary><AdultGamesPage /></ErrorBoundary></PremiumGate></FeatureGate></PlayGate>} />
                <Route path="/play/adult-games/:category" element={<PlayGate><ErrorBoundary><AdultGamesPage /></ErrorBoundary></PlayGate>} />
                <Route path="/play/:ageGroup" element={<PlayGate><ErrorBoundary><ActivityQuizPage /></ErrorBoundary></PlayGate>} />
                <Route path="/parent-dashboard" element={<PlayGate><ErrorBoundary><ParentDashboard /></ErrorBoundary></PlayGate>} />
                <Route path="/teacher-dashboard" element={<PlayGate><ErrorBoundary><TeacherDashboard /></ErrorBoundary></PlayGate>} />
                <Route path="/join/:code" element={<PlayGate><ErrorBoundary><JoinClassroomPage /></ErrorBoundary></PlayGate>} />
                <Route path="/join" element={<PlayGate><ErrorBoundary><JoinClassroomPage /></ErrorBoundary></PlayGate>} />
                <Route path="/lesson/:code" element={<ErrorBoundary><LessonViewPage /></ErrorBoundary>} />
                <Route path="/daily" element={<FeatureGate flag="dailyChallenge"><PremiumGate id="feature_dailyChallenge"><ErrorBoundary><DailyChallengePage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/adventure" element={<FeatureGate flag="adventureMap"><PremiumGate id="feature_adventureMap"><ErrorBoundary><AdventureMapPage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/avatar" element={<FeatureGate flag="avatarBuilder"><PremiumGate id="feature_avatar"><ErrorBoundary><AvatarBuilderPage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/live-quiz" element={<FeatureGate flag="liveQuiz"><PremiumGate id="feature_liveQuiz"><ErrorBoundary><LiveQuizPage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/challenge" element={<ErrorBoundary><ChallengeFriendPage /></ErrorBoundary>} />
                <Route path="/worksheets" element={<FeatureGate flag="worksheets"><ErrorBoundary><PrintableWorksheetsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/battle" element={<FeatureGate flag="battleRoyale"><PremiumGate id="feature_battleRoyale"><ErrorBoundary><BattleRoyalePage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/pet" element={<FeatureGate flag="pet"><PremiumGate id="feature_pet"><ErrorBoundary><PetPage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/story" element={<FeatureGate flag="storyMode"><PremiumGate id="feature_storyMode"><ErrorBoundary><StoryModePage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/family-challenge" element={<FeatureGate flag="familyChallenge"><PremiumGate id="feature_familyChallenge"><ErrorBoundary><FamilyChallengePage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/cards" element={<FeatureGate flag="cards"><PremiumGate id="feature_cards"><ErrorBoundary><CollectibleCardsPage /></ErrorBoundary></PremiumGate></FeatureGate>} />
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
            <SystemAnnouncementBanner />
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
