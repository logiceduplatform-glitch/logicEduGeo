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
import WelcomeQuest from "./components/WelcomeQuest";
import FeedbackWidget from "./components/FeedbackWidget";
import RewardToast from "./components/games/RewardToast";
import SWUpdateBanner from "./components/SWUpdateBanner";
import OfflineBanner from "./components/OfflineBanner";
import SystemAnnouncementBanner from "./components/SystemAnnouncementBanner";
import { ToastProvider } from "./components/ToastNotification";
import { AnalyticsService } from "./services/AnalyticsService";
import TimeLimitOverlay from "./components/TimeLimitOverlay";
import { CertificateService } from "./services/CertificateService";
import { FeatureFlagService } from "./services/FeatureFlagService";
import { PremiumContentService } from "./services/PremiumContentService";
import "./services/NotificationService";
import FeatureGate from "./components/FeatureGate";
import PremiumGate from "./components/PremiumGate";
import { SkeletonCard } from "./components/SkeletonLoader";
import SeasonalDecorations from "./components/SeasonalDecorations";
import AccessibilitySVGFilters from "./components/AccessibilitySVGFilters";
import AccessibilityFAB from "./components/AccessibilityFAB";
import "./services/AccessibilityService";
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
const CookiesPage = React.lazy(() => import("./pages/CookiesPage"));
const DPAPage = React.lazy(() => import("./pages/DPAPage"));
const StatusPage = React.lazy(() => import("./pages/StatusPage"));
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
const AILessonGeneratorPage = React.lazy(() => import("./pages/AILessonGeneratorPage"));
const DailyQuestsPage = React.lazy(() => import("./pages/DailyQuestsPage"));
const OnlineBattlePage = React.lazy(() => import("./pages/OnlineBattlePage"));
const GuildsPage = React.lazy(() => import("./pages/GuildsPage"));
const PublicProfilePage = React.lazy(() => import("./pages/PublicProfilePage"));
const NarrativeAdventurePage = React.lazy(() => import("./pages/NarrativeAdventurePage"));
const VoiceQuizPage = React.lazy(() => import("./pages/VoiceQuizPage"));
const LearningPathPage = React.lazy(() => import("./pages/LearningPathPage"));
const SchoolAdminPage = React.lazy(() => import("./pages/SchoolAdminPage"));
const SchoolLicensePage = React.lazy(() => import("./pages/SchoolLicensePage"));
const FriendChallengesPage = React.lazy(() => import("./pages/FriendChallengesPage"));
const LiveClassroomPage = React.lazy(() => import("./pages/LiveClassroomPage"));
const PhotoSolverPage = React.lazy(() => import("./pages/PhotoSolverPage"));
const AIStoryPage = React.lazy(() => import("./pages/AIStoryPage"));
const TimeManagementPage = React.lazy(() => import("./pages/TimeManagementPage"));
const NewGamesShowcasePage = React.lazy(() => import("./pages/games/NewGamesShowcasePage"));
const WordlePage = React.lazy(() => import("./pages/games/WordlePage"));
const Game2048Page = React.lazy(() => import("./pages/games/Game2048Page"));
const SnakePage = React.lazy(() => import("./pages/games/SnakePage"));
const TetrisPage = React.lazy(() => import("./pages/games/TetrisPage"));
const TicTacToeOnlinePage = React.lazy(() => import("./pages/games/TicTacToeOnlinePage"));
const Game24Page = React.lazy(() => import("./pages/games/Game24Page"));
const WordSearchPage = React.lazy(() => import("./pages/games/WordSearchPage"));
const WhackAMolePage = React.lazy(() => import("./pages/games/WhackAMolePage"));
const ConnectDotsPage = React.lazy(() => import("./pages/games/ConnectDotsPage"));
const DrawingPadPage = React.lazy(() => import("./pages/games/DrawingPadPage"));
const EducationalGamesShowcasePage = React.lazy(() => import("./pages/games/EducationalGamesShowcasePage"));
const SpellingBeePage = React.lazy(() => import("./pages/games/SpellingBeePage"));
const TellTimePage = React.lazy(() => import("./pages/games/TellTimePage"));
const MoneyCounterPage = React.lazy(() => import("./pages/games/MoneyCounterPage"));
const TimesTablesRacePage = React.lazy(() => import("./pages/games/TimesTablesRacePage"));
const MapOfGreecePage = React.lazy(() => import("./pages/games/MapOfGreecePage"));
const PeriodicTablePage = React.lazy(() => import("./pages/games/PeriodicTablePage"));
const AnatomyPage = React.lazy(() => import("./pages/games/AnatomyPage"));
const MathSprintPage = React.lazy(() => import("./pages/games/MathSprintPage"));
const VerbConjugationPage = React.lazy(() => import("./pages/games/VerbConjugationPage"));
const PeriodicQuizPage = React.lazy(() => import("./pages/games/PeriodicQuizPage"));
const CapitalsPage = React.lazy(() => import("./pages/games/CapitalsPage"));
const HistoryTimelinePage = React.lazy(() => import("./pages/games/HistoryTimelinePage"));
const CodePuzzlesPage = React.lazy(() => import("./pages/games/CodePuzzlesPage"));
const LogicGatesPage = React.lazy(() => import("./pages/games/LogicGatesPage"));
const FractionPizzaPage = React.lazy(() => import("./pages/games/FractionPizzaPage"));
const MusicNotesPage = React.lazy(() => import("./pages/games/MusicNotesPage"));
const CreativeGamesShowcasePage = React.lazy(() => import("./pages/games/CreativeGamesShowcasePage"));
const StoryBuilderPage = React.lazy(() => import("./pages/games/StoryBuilderPage"));
const ComicMakerPage = React.lazy(() => import("./pages/games/ComicMakerPage"));
const MusicComposerPage = React.lazy(() => import("./pages/games/MusicComposerPage"));
const PatternDesignerPage = React.lazy(() => import("./pages/games/PatternDesignerPage"));
const PixelArtPage = React.lazy(() => import("./pages/games/PixelArtPage"));
const MadLibsPage = React.lazy(() => import("./pages/games/MadLibsPage"));
const AnimationStudioPage = React.lazy(() => import("./pages/games/AnimationStudioPage"));
const EmojiStoryPage = React.lazy(() => import("./pages/games/EmojiStoryPage"));
const VoiceRecorderPage = React.lazy(() => import("./pages/games/VoiceRecorderPage"));
const StopMotionPage = React.lazy(() => import("./pages/games/StopMotionPage"));
const BlockCodingPage = React.lazy(() => import("./pages/games/BlockCodingPage"));
const RobotMazePage = React.lazy(() => import("./pages/games/RobotMazePage"));
const BeatMakerPage = React.lazy(() => import("./pages/games/BeatMakerPage"));
const MultiplayerGamesShowcasePage = React.lazy(() => import("./pages/games/MultiplayerGamesShowcasePage"));
const ActionGamesShowcasePage = React.lazy(() => import("./pages/games/ActionGamesShowcasePage"));
const BattleQuizPage = React.lazy(() => import("./pages/games/BattleQuizPage"));
const CoopMazePage = React.lazy(() => import("./pages/games/CoopMazePage"));
const WordBattlePage = React.lazy(() => import("./pages/games/WordBattlePage"));
const MathDuelPage = React.lazy(() => import("./pages/games/MathDuelPage"));
const PictionaryPage = React.lazy(() => import("./pages/games/PictionaryPage"));
const ReactionTimePage = React.lazy(() => import("./pages/games/ReactionTimePage"));
const ColorMatchPage = React.lazy(() => import("./pages/games/ColorMatchPage"));
const FallingLettersPage = React.lazy(() => import("./pages/games/FallingLettersPage"));
const BubblePopPage = React.lazy(() => import("./pages/games/BubblePopPage"));
const MemorySequencePage = React.lazy(() => import("./pages/games/MemorySequencePage"));
const QuickMathPage = React.lazy(() => import("./pages/games/QuickMathPage"));
const SpeedReadingPage = React.lazy(() => import("./pages/games/SpeedReadingPage"));
const TapDancePage = React.lazy(() => import("./pages/games/TapDancePage"));
const STEMGamesShowcasePage = React.lazy(() => import("./pages/games/STEMGamesShowcasePage"));
const AllGamesShowcasePage = React.lazy(() => import("./pages/games/AllGamesShowcasePage"));
const ChemistryLabPage = React.lazy(() => import("./pages/games/ChemistryLabPage"));
const PhysicsSandboxPage = React.lazy(() => import("./pages/games/PhysicsSandboxPage"));
const SolarSystemPage = React.lazy(() => import("./pages/games/SolarSystemPage"));
const DNABuilderPage = React.lazy(() => import("./pages/games/DNABuilderPage"));
const CircuitBuilderPage = React.lazy(() => import("./pages/games/CircuitBuilderPage"));
const WeatherSimPage = React.lazy(() => import("./pages/games/WeatherSimPage"));
const EcosystemPage = React.lazy(() => import("./pages/games/EcosystemPage"));
const ReflexLeaderboardPage = React.lazy(() => import("./pages/games/ReflexLeaderboardPage"));
const WhatsNewPage = React.lazy(() => import("./pages/WhatsNewPage"));
const KidLoginPage = React.lazy(() => import("./pages/KidLoginPage"));
const AffiliatePage = React.lazy(() => import("./pages/AffiliatePage"));
const CurriculumPacksPage = React.lazy(() => import("./pages/CurriculumPacksPage"));
const MiniGamesPage = React.lazy(() => import("./pages/MiniGamesPage"));
const MusicSettingsPage = React.lazy(() => import("./pages/MusicSettingsPage"));
const AccessibilityPage = React.lazy(() => import("./pages/AccessibilityPage"));
const ARFlashcardsPage = React.lazy(() => import("./pages/ARFlashcardsPage"));
const CoPlayPage = React.lazy(() => import("./pages/CoPlayPage"));
const PrintOnDemandPage = React.lazy(() => import("./pages/PrintOnDemandPage"));
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

// RoleGate restricts a route to specific user roles. Guests and users
// without a matching role are redirected. We deliberately reject guests
// here even though PlayGate allows them, because role-restricted pages
// (teacher dashboard, parent dashboard, school admin) require a real
// authenticated user with a profile role set.
function RoleGate({ roles, children }) {
  const { user, userProfile, loading } = React.useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!userProfile) return <Navigate to="/onboarding" replace />;
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(userProfile.role)) {
    return <Navigate to="/" replace />;
  }
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
  const skipPaths = ["/onboarding", "/auth", "/guest-setup", "/guest-expired", "/privacy", "/terms", "/cookies", "/dpa", "/status", "/faq", "/contact", "/about"];
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
            <AccessibilitySVGFilters />
            <AccessibilityFAB />
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
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/dpa" element={<DPAPage />} />
                <Route path="/status" element={<StatusPage />} />
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
                <Route path="/parent-dashboard" element={<RoleGate roles={["parent", "admin"]}><ErrorBoundary><ParentDashboard /></ErrorBoundary></RoleGate>} />
                <Route path="/teacher-dashboard" element={<RoleGate roles={["teacher", "admin"]}><ErrorBoundary><TeacherDashboard /></ErrorBoundary></RoleGate>} />
                <Route path="/teacher/ai-lesson" element={<FeatureGate flag="aiQuizGen"><PremiumGate id="feature_aiQuizGen"><ErrorBoundary><AILessonGeneratorPage /></ErrorBoundary></PremiumGate></FeatureGate>} />
                <Route path="/quests" element={<FeatureGate flag="dailyQuests"><ErrorBoundary><DailyQuestsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/online-battle" element={<FeatureGate flag="onlineBattle"><ErrorBoundary><OnlineBattlePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/online-battle/:code" element={<FeatureGate flag="onlineBattle"><ErrorBoundary><OnlineBattlePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/guilds" element={<FeatureGate flag="guilds"><ErrorBoundary><GuildsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/guilds/:guildId" element={<FeatureGate flag="guilds"><ErrorBoundary><GuildsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/u/:uid" element={<FeatureGate flag="publicProfile"><ErrorBoundary><PublicProfilePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/adventures" element={<FeatureGate flag="adventures"><ErrorBoundary><NarrativeAdventurePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/adventures/:id" element={<FeatureGate flag="adventures"><ErrorBoundary><NarrativeAdventurePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/voice-quiz" element={<FeatureGate flag="voiceQuiz"><ErrorBoundary><VoiceQuizPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/learning-path" element={<FeatureGate flag="learningPath"><ErrorBoundary><LearningPathPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/school-admin" element={<FeatureGate flag="schoolAdmin"><RoleGate roles={["teacher", "admin"]}><ErrorBoundary><SchoolAdminPage /></ErrorBoundary></RoleGate></FeatureGate>} />
                <Route path="/school-license" element={<ErrorBoundary><SchoolLicensePage /></ErrorBoundary>} />
                <Route path="/challenges" element={<ErrorBoundary><FriendChallengesPage /></ErrorBoundary>} />
                <Route path="/live" element={<ErrorBoundary><LiveClassroomPage /></ErrorBoundary>} />
                <Route path="/live/:code" element={<ErrorBoundary><LiveClassroomPage /></ErrorBoundary>} />
                <Route path="/photo-solver" element={<ErrorBoundary><PhotoSolverPage /></ErrorBoundary>} />
                <Route path="/ai-story" element={<ErrorBoundary><AIStoryPage /></ErrorBoundary>} />
                <Route path="/time-management" element={<ErrorBoundary><TimeManagementPage /></ErrorBoundary>} />
                <Route path="/games" element={<FeatureGate flags={["classicGames_master","classicGames_quickWins"]}><ErrorBoundary><NewGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/wordle" element={<ErrorBoundary><WordlePage /></ErrorBoundary>} />
                <Route path="/games/2048" element={<ErrorBoundary><Game2048Page /></ErrorBoundary>} />
                <Route path="/games/snake" element={<ErrorBoundary><SnakePage /></ErrorBoundary>} />
                <Route path="/games/tetris" element={<ErrorBoundary><TetrisPage /></ErrorBoundary>} />
                <Route path="/games/tic-tac-toe" element={<ErrorBoundary><TicTacToeOnlinePage /></ErrorBoundary>} />
                <Route path="/games/tic-tac-toe/:code" element={<ErrorBoundary><TicTacToeOnlinePage /></ErrorBoundary>} />
                <Route path="/games/24" element={<ErrorBoundary><Game24Page /></ErrorBoundary>} />
                <Route path="/games/word-search" element={<ErrorBoundary><WordSearchPage /></ErrorBoundary>} />
                <Route path="/games/whack" element={<ErrorBoundary><WhackAMolePage /></ErrorBoundary>} />
                <Route path="/games/connect-dots" element={<ErrorBoundary><ConnectDotsPage /></ErrorBoundary>} />
                <Route path="/games/drawing" element={<ErrorBoundary><DrawingPadPage /></ErrorBoundary>} />
                <Route path="/games/educational" element={<FeatureGate flags={["classicGames_master","classicGames_educational"]}><ErrorBoundary><EducationalGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/spelling-bee" element={<ErrorBoundary><SpellingBeePage /></ErrorBoundary>} />
                <Route path="/games/tell-time" element={<ErrorBoundary><TellTimePage /></ErrorBoundary>} />
                <Route path="/games/money" element={<ErrorBoundary><MoneyCounterPage /></ErrorBoundary>} />
                <Route path="/games/times-tables" element={<ErrorBoundary><TimesTablesRacePage /></ErrorBoundary>} />
                <Route path="/games/map-greece" element={<ErrorBoundary><MapOfGreecePage /></ErrorBoundary>} />
                <Route path="/games/periodic" element={<ErrorBoundary><PeriodicTablePage /></ErrorBoundary>} />
                <Route path="/games/anatomy" element={<ErrorBoundary><AnatomyPage /></ErrorBoundary>} />
                <Route path="/games/math-sprint" element={<ErrorBoundary><MathSprintPage /></ErrorBoundary>} />
                <Route path="/games/verbs" element={<ErrorBoundary><VerbConjugationPage /></ErrorBoundary>} />
                <Route path="/games/periodic-quiz" element={<ErrorBoundary><PeriodicQuizPage /></ErrorBoundary>} />
                <Route path="/games/capitals" element={<ErrorBoundary><CapitalsPage /></ErrorBoundary>} />
                <Route path="/games/history-timeline" element={<ErrorBoundary><HistoryTimelinePage /></ErrorBoundary>} />
                <Route path="/games/code-puzzles" element={<ErrorBoundary><CodePuzzlesPage /></ErrorBoundary>} />
                <Route path="/games/logic-gates" element={<ErrorBoundary><LogicGatesPage /></ErrorBoundary>} />
                <Route path="/games/fraction-pizza" element={<ErrorBoundary><FractionPizzaPage /></ErrorBoundary>} />
                <Route path="/games/music-notes" element={<ErrorBoundary><MusicNotesPage /></ErrorBoundary>} />
                <Route path="/games/creative" element={<FeatureGate flags={["classicGames_master","classicGames_creative"]}><ErrorBoundary><CreativeGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/story-builder" element={<ErrorBoundary><StoryBuilderPage /></ErrorBoundary>} />
                <Route path="/games/comic-maker" element={<ErrorBoundary><ComicMakerPage /></ErrorBoundary>} />
                <Route path="/games/music-composer" element={<ErrorBoundary><MusicComposerPage /></ErrorBoundary>} />
                <Route path="/games/patterns" element={<ErrorBoundary><PatternDesignerPage /></ErrorBoundary>} />
                <Route path="/games/pixel-art" element={<ErrorBoundary><PixelArtPage /></ErrorBoundary>} />
                <Route path="/games/mad-libs" element={<ErrorBoundary><MadLibsPage /></ErrorBoundary>} />
                <Route path="/games/animation" element={<ErrorBoundary><AnimationStudioPage /></ErrorBoundary>} />
                <Route path="/games/emoji-story" element={<ErrorBoundary><EmojiStoryPage /></ErrorBoundary>} />
                <Route path="/games/voice-recorder" element={<ErrorBoundary><VoiceRecorderPage /></ErrorBoundary>} />
                <Route path="/games/stop-motion" element={<ErrorBoundary><StopMotionPage /></ErrorBoundary>} />
                <Route path="/games/block-coding" element={<ErrorBoundary><BlockCodingPage /></ErrorBoundary>} />
                <Route path="/games/robot-maze" element={<ErrorBoundary><RobotMazePage /></ErrorBoundary>} />
                <Route path="/games/beat-maker" element={<ErrorBoundary><BeatMakerPage /></ErrorBoundary>} />
                <Route path="/games/multiplayer" element={<FeatureGate flags={["classicGames_master","classicGames_multiplayer"]}><ErrorBoundary><MultiplayerGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/action" element={<FeatureGate flags={["classicGames_master","classicGames_action"]}><ErrorBoundary><ActionGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/battle-quiz" element={<ErrorBoundary><BattleQuizPage /></ErrorBoundary>} />
                <Route path="/games/coop-maze" element={<ErrorBoundary><CoopMazePage /></ErrorBoundary>} />
                <Route path="/games/word-battle" element={<ErrorBoundary><WordBattlePage /></ErrorBoundary>} />
                <Route path="/games/math-duel" element={<ErrorBoundary><MathDuelPage /></ErrorBoundary>} />
                <Route path="/games/pictionary" element={<ErrorBoundary><PictionaryPage /></ErrorBoundary>} />
                <Route path="/games/reaction" element={<ErrorBoundary><ReactionTimePage /></ErrorBoundary>} />
                <Route path="/games/color-match" element={<ErrorBoundary><ColorMatchPage /></ErrorBoundary>} />
                <Route path="/games/falling-letters" element={<ErrorBoundary><FallingLettersPage /></ErrorBoundary>} />
                <Route path="/games/bubble-pop" element={<ErrorBoundary><BubblePopPage /></ErrorBoundary>} />
                <Route path="/games/memory-sequence" element={<ErrorBoundary><MemorySequencePage /></ErrorBoundary>} />
                <Route path="/games/quick-math" element={<ErrorBoundary><QuickMathPage /></ErrorBoundary>} />
                <Route path="/games/speed-reading" element={<ErrorBoundary><SpeedReadingPage /></ErrorBoundary>} />
                <Route path="/games/tap-dance" element={<ErrorBoundary><TapDancePage /></ErrorBoundary>} />
                <Route path="/games/stem" element={<FeatureGate flags={["classicGames_master","classicGames_stem"]}><ErrorBoundary><STEMGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/all" element={<FeatureGate flag="classicGames_master"><ErrorBoundary><AllGamesShowcasePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/games/chemistry" element={<ErrorBoundary><ChemistryLabPage /></ErrorBoundary>} />
                <Route path="/games/physics" element={<ErrorBoundary><PhysicsSandboxPage /></ErrorBoundary>} />
                <Route path="/games/solar-system" element={<ErrorBoundary><SolarSystemPage /></ErrorBoundary>} />
                <Route path="/games/dna" element={<ErrorBoundary><DNABuilderPage /></ErrorBoundary>} />
                <Route path="/games/circuit" element={<ErrorBoundary><CircuitBuilderPage /></ErrorBoundary>} />
                <Route path="/games/weather" element={<ErrorBoundary><WeatherSimPage /></ErrorBoundary>} />
                <Route path="/games/ecosystem" element={<ErrorBoundary><EcosystemPage /></ErrorBoundary>} />
                <Route path="/games/leaderboard" element={<FeatureGate flag="classicGames_leaderboard"><ErrorBoundary><ReflexLeaderboardPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/whats-new" element={<FeatureGate flag="classicGames_whatsNew"><ErrorBoundary><WhatsNewPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/k" element={<FeatureGate flag="kidLogin"><ErrorBoundary><KidLoginPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/k/:code" element={<FeatureGate flag="kidLogin"><ErrorBoundary><KidLoginPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/affiliate" element={<FeatureGate flag="affiliate"><ErrorBoundary><AffiliatePage /></ErrorBoundary></FeatureGate>} />
                <Route path="/curriculum" element={<FeatureGate flag="curriculumPacks"><ErrorBoundary><CurriculumPacksPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/curriculum/:id" element={<FeatureGate flag="curriculumPacks"><ErrorBoundary><CurriculumPacksPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/mini-games" element={<FeatureGate flag="miniGames"><ErrorBoundary><MiniGamesPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/mini-games/:id" element={<FeatureGate flag="miniGames"><ErrorBoundary><MiniGamesPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/music" element={<FeatureGate flag="music"><ErrorBoundary><MusicSettingsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/accessibility" element={<FeatureGate flag="accessibility"><ErrorBoundary><AccessibilityPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/ar-flashcards" element={<FeatureGate flag="arFlashcards"><ErrorBoundary><ARFlashcardsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/ar-flashcards/:deckId" element={<FeatureGate flag="arFlashcards"><ErrorBoundary><ARFlashcardsPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/co-play" element={<FeatureGate flag="coPlay"><ErrorBoundary><CoPlayPage /></ErrorBoundary></FeatureGate>} />
                <Route path="/print-shop" element={<FeatureGate flag="printShop"><ErrorBoundary><PrintOnDemandPage /></ErrorBoundary></FeatureGate>} />
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
            {FeatureFlagService.isEnabled("welcomeQuest") && <WelcomeQuest />}
            {FeatureFlagService.isEnabled("feedbackWidget") && <FeedbackWidget />}
            {FeatureFlagService.isEnabled("classicGames_rewardToast") && <RewardToast />}
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
