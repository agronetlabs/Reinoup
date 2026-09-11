import { createBrowserRouter } from 'react-router-dom';
import { Splash } from './screens/onboarding/Splash';
import { AudiencePicker } from './screens/onboarding/AudiencePicker';
import { Login } from './screens/onboarding/Login';
import { Register } from './screens/onboarding/Register';
import { ChildOnboarding } from './screens/onboarding/ChildOnboarding';

import { AppLayout } from './screens/main/AppLayout';
import { Home } from './screens/main/Home';
import { VerseOfDay } from './screens/main/VerseOfDay';
import { VerseShelf } from './screens/main/VerseShelf';
import { StickerAlbum } from './screens/main/StickerAlbum';
import { DailyChallenges } from './screens/main/DailyChallenges';
import { RewardChest } from './screens/main/RewardChest';
import { Missions } from './screens/main/Missions';
import { DisciplesTrail } from './screens/main/DisciplesTrail';
import { Profile } from './screens/main/Profile';
import { Avatar } from './screens/main/Avatar';
import { Ranking } from './screens/main/Ranking';
import { FinalCelebration } from './screens/main/FinalCelebration';

import { StoriesList } from './screens/story/StoriesList';
import { StoryCover } from './screens/story/StoryCover';
import { ChapterReader } from './screens/story/ChapterReader';
import { Quiz } from './screens/story/Quiz';
import { StoryResult } from './screens/story/StoryResult';

import { GamesHub } from './screens/games/GamesHub';
import { MemoryGame } from './screens/games/MemoryGame';
import { PuzzleGame } from './screens/games/PuzzleGame';
import { OrderGame } from './screens/games/OrderGame';
import { WordSearchGame } from './screens/games/WordSearchGame';

import { Plans } from './screens/subscription/Plans';

import { ParentGuard } from './screens/parent/ParentGuard';
import { ParentPinGate } from './screens/parent/ParentPinGate';
import { ParentHome } from './screens/parent/ParentHome';
import { ActivityReport } from './screens/parent/ActivityReport';
import { ManageContent } from './screens/parent/ManageContent';
import { ScreenTime } from './screens/parent/ScreenTime';
import { Notifications } from './screens/parent/Notifications';
import { Settings } from './screens/parent/Settings';

export const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/publico', element: <AudiencePicker /> },
  { path: '/login', element: <Login /> },
  { path: '/criar-conta', element: <Register /> },
  { path: '/onboarding-crianca', element: <ChildOnboarding /> },

  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: 'historias', element: <StoriesList /> },
      { path: 'historia/:storyId', element: <StoryCover /> },
      { path: 'historia/:storyId/capitulo/:chapterIndex', element: <ChapterReader /> },
      { path: 'historia/:storyId/quiz', element: <Quiz /> },
      { path: 'historia/:storyId/resultado', element: <StoryResult /> },

      { path: 'versiculo', element: <VerseOfDay /> },
      { path: 'estante-versiculos', element: <VerseShelf /> },
      { path: 'album-adesivos', element: <StickerAlbum /> },

      { path: 'desafios', element: <DailyChallenges /> },
      { path: 'bau', element: <RewardChest /> },

      { path: 'missoes', element: <Missions /> },
      { path: 'missoes/discipulos', element: <DisciplesTrail /> },

      { path: 'jogos', element: <GamesHub /> },
      { path: 'jogos/memoria', element: <MemoryGame /> },
      { path: 'jogos/quebra-cabeca', element: <PuzzleGame /> },
      { path: 'jogos/ordem', element: <OrderGame /> },
      { path: 'jogos/caca-palavras', element: <WordSearchGame /> },

      { path: 'ranking', element: <Ranking /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'avatar', element: <Avatar /> },

      { path: 'planos', element: <ParentGuard />, children: [{ index: true, element: <Plans /> }] },
      { path: 'final', element: <FinalCelebration /> },
    ],
  },

  { path: '/pais/pin', element: <ParentPinGate /> },
  {
    path: '/pais',
    element: <ParentGuard />,
    children: [
      { index: true, element: <ParentHome /> },
      { path: 'relatorio', element: <ActivityReport /> },
      { path: 'conteudo', element: <ManageContent /> },
      { path: 'tempo-de-uso', element: <ScreenTime /> },
      { path: 'notificacoes', element: <Notifications /> },
      { path: 'configuracoes', element: <Settings /> },
    ],
  },
], {
  // Acompanha o `base` do Vite: '/' em domínio próprio, '/Reinoup/' no GitHub Pages.
  basename: import.meta.env.BASE_URL,
});
