'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FloatingOrbs } from './FloatingOrbs';
import { IconDock } from './IconDock';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { ResponsiveNavTabs } from './ResponsiveNavTabs';
import { SettingsWindow } from './SettingsWindow';
import { ProfileWindow } from '../windows/ProfileWindow';
import { SkillsWindow } from '../windows/SkillsWindow';
import { ProjectsWindow } from '../windows/ProjectsWindow';
import { AchievementsWindow } from '../windows/AchievementsWindow';
import { HobbiesWindow } from '../windows/HobbiesWindow';
import { PixelRunnerGame } from '../game/PixelRunnerGame';
import { ResumeWindow } from '../windows/ResumeWindow';
import { ContactWindow } from '../windows/ContactWindow';
import { 
  ProfileSettings, 
  Skill, 
  Project, 
  Achievement, 
  WindowId, 
  UISettings 
} from '@/types';
import { 
  getInitialUISettings, 
  saveUISettings, 
  applyUISettingsToDOM, 
  DEFAULT_UI_SETTINGS 
} from '@/lib/settings';

interface DesktopExperienceProps {
  initialProfile: ProfileSettings;
  initialSkills: Skill[];
  initialProjects: Project[];
  initialAchievements: Achievement[];
}

interface WindowConfig {
  id: WindowId;
  title: string;
  width: number;
  height?: number;
  headerColor: string;
  defaultOpen: boolean;
}

export const DesktopExperience: React.FC<DesktopExperienceProps> = ({
  initialProfile,
  initialSkills,
  initialProjects,
  initialAchievements,
}) => {
  const [zCounter, setZCounter] = useState(200);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('profileWin');
  const [uiSettings, setUiSettings] = useState<UISettings>(DEFAULT_UI_SETTINGS);

  // Initialize and apply persistent UI settings
  useEffect(() => {
    const initial = getInitialUISettings();
    setUiSettings(initial);
    applyUISettingsToDOM(initial);
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Partial<UISettings>) => {
    setUiSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveUISettings(updated);
      applyUISettingsToDOM(updated);
      return updated;
    });
  }, []);

  const windowConfigs: WindowConfig[] = [
    {
      id: 'profileWin',
      title: '👾 Ashrut Tiwari · Game Dev & Cinematographer',
      width: 520,
      headerColor: 'bg-pastel-pink',
      defaultOpen: true,
    },
    {
      id: 'projectsWin',
      title: '🎮 Playable Dreams & 3D Creations',
      width: 680,
      headerColor: 'bg-pastel-peach',
      defaultOpen: false,
    },
    {
      id: 'skillsWin',
      title: '🧰 Game Dev & Technical Toolbox',
      width: 540,
      headerColor: 'bg-pastel-mint',
      defaultOpen: false,
    },
    {
      id: 'achievementsWin',
      title: '🏆 Awards & Industry Recognitions',
      width: 500,
      headerColor: 'bg-pastel-lavender',
      defaultOpen: false,
    },
    {
      id: 'hobbiesWin',
      title: '🎬 Cinematography & Storytelling',
      width: 480,
      headerColor: 'bg-pastel-peach',
      defaultOpen: false,
    },
    {
      id: 'gameWin',
      title: '☠️ Haunted House: The Escape · 3D Horror Game',
      width: 860,
      headerColor: 'bg-pastel-pink',
      defaultOpen: false,
    },
    {
      id: 'resumeWin',
      title: '📄 Curriculum Vitae & Experience Timeline',
      width: 580,
      headerColor: 'bg-pastel-lavender',
      defaultOpen: false,
    },
    {
      id: 'contactWin',
      title: '💌 Let’s Connect · Freelance & Commissions',
      width: 520,
      headerColor: 'bg-pastel-pink',
      defaultOpen: false,
    },
    {
      id: 'settingsWin',
      title: '⚙️ System Preferences & Layout Settings',
      width: 480,
      headerColor: 'bg-pastel-peach',
      defaultOpen: false,
    },
  ];

  // Window states: open/closed, minimized, zIndex
  const [windowsState, setWindowsState] = useState<
    Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>
  >(() => {
    const initial: Record<string, { isOpen: boolean; isMinimized: boolean; zIndex: number }> = {};
    windowConfigs.forEach((c, idx) => {
      initial[c.id] = {
        isOpen: c.defaultOpen,
        isMinimized: false,
        zIndex: 200 + idx,
      };
    });
    return initial as Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>;
  });

  const bringToFront = useCallback((id: WindowId) => {
    setActiveWindowId(id);
    setZCounter((prev) => {
      const nextZ = prev + 1;
      setWindowsState((state) => ({
        ...state,
        [id]: {
          ...state[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      }));
      return nextZ;
    });
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    bringToFront(id);
  }, [bringToFront]);

  const handleTabOrDockClick = useCallback((id: WindowId) => {
    setWindowsState((state) => {
      const current = state[id];
      if (!current) return state;

      let maxZ = -1;
      let topWinId: WindowId | null = null;
      Object.entries(state).forEach(([k, st]) => {
        if (st.isOpen && !st.isMinimized && st.zIndex > maxZ) {
          maxZ = st.zIndex;
          topWinId = k as WindowId;
        }
      });

      // If already open, not minimized, and topmost, toggle minimize
      if (topWinId === id) {
        setActiveWindowId(null);
        return {
          ...state,
          [id]: {
            ...current,
            isMinimized: true,
          },
        };
      }

      // Otherwise bring to front and set active
      const nextZ = Math.max(zCounter, maxZ) + 1;
      setZCounter(nextZ);
      setActiveWindowId(id);
      return {
        ...state,
        [id]: {
          ...current,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      };
    });
  }, [zCounter]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindowsState((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: false,
        },
      };

      // Recalculate new topmost active window
      let maxZ = -1;
      let nextActive: WindowId | null = null;
      Object.entries(updated).forEach(([k, st]) => {
        if (st.isOpen && !st.isMinimized && st.zIndex > maxZ) {
          maxZ = st.zIndex;
          nextActive = k as WindowId;
        }
      });
      setActiveWindowId(nextActive);

      return updated;
    });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindowsState((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: true,
        },
      };

      let maxZ = -1;
      let nextActive: WindowId | null = null;
      Object.entries(updated).forEach(([k, st]) => {
        if (st.isOpen && !st.isMinimized && st.zIndex > maxZ) {
          maxZ = st.zIndex;
          nextActive = k as WindowId;
        }
      });
      setActiveWindowId(nextActive);

      return updated;
    });
  }, []);

  const resetWindows = useCallback(() => {
    setZCounter((prev) => {
      let currentZ = prev + 1;
      setWindowsState(() => {
        const reset: Record<string, { isOpen: boolean; isMinimized: boolean; zIndex: number }> = {};
        windowConfigs.forEach((c) => {
          reset[c.id] = {
            isOpen: c.defaultOpen,
            isMinimized: false,
            zIndex: currentZ++,
          };
        });
        return reset as Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>;
      });
      setActiveWindowId('profileWin');
      return currentZ;
    });
  }, []);

  const bringAllFront = useCallback(() => {
    setZCounter((prev) => {
      let currentZ = prev + 1;
      setWindowsState((state) => {
        const updated = { ...state };
        let highestId: WindowId | null = null;
        Object.keys(updated).forEach((key) => {
          const winId = key as WindowId;
          if (updated[winId].isOpen) {
            highestId = winId;
            updated[winId] = {
              ...updated[winId],
              isMinimized: false,
              zIndex: currentZ++,
            };
          }
        });
        if (highestId) setActiveWindowId(highestId);
        return updated;
      });
      return currentZ;
    });
  }, []);

  const minimizeAll = useCallback(() => {
    setWindowsState((state) => {
      const updated = { ...state };
      Object.keys(updated).forEach((key) => {
        const winId = key as WindowId;
        updated[winId] = {
          ...updated[winId],
          isMinimized: true,
        };
      });
      return updated;
    });
    setActiveWindowId(null);
  }, []);

  // Keyboard shortcut: ESC minimizes topmost window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        let topWin: WindowId | null = null;
        let maxZ = -1;
        Object.entries(windowsState).forEach(([id, st]) => {
          if (st.isOpen && !st.isMinimized && st.zIndex > maxZ) {
            maxZ = st.zIndex;
            topWin = id as WindowId;
          }
        });
        if (topWin) {
          closeWindow(topWin);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windowsState, closeWindow]);

  const activeWindowsMap = Object.fromEntries(
    Object.entries(windowsState).map(([id, st]) => [id, st.isOpen && !st.isMinimized])
  ) as Record<WindowId, boolean>;

  return (
    <main className="relative w-full h-full min-h-[100dvh] max-w-full overflow-hidden select-none">
      {/* Dynamic Background */}
      <FloatingOrbs />

      {/* Responsive Navigation Tabs (Header / Strip) */}
      <ResponsiveNavTabs
        activeWindowId={activeWindowId}
        windowsState={windowsState}
        onSelectTab={handleTabOrDockClick}
      />

      {/* Desktop App Icon Dock */}
      <IconDock onOpenWindow={handleTabOrDockClick} activeWindows={activeWindowsMap} />

      {/* Taskbar Controls */}
      <Taskbar
        onResetWindows={resetWindows}
        onBringAllFront={bringAllFront}
        onMinimizeAll={minimizeAll}
        onOpenSettings={() => openWindow('settingsWin')}
      />

      {/* Desktop Windows */}
      {/* 1. Profile Window */}
      <Window
        id="profileWin"
        title="👾 Ashrut Tiwari · Game Dev & Cinematographer"
        isOpen={windowsState.profileWin.isOpen}
        isMinimized={windowsState.profileWin.isMinimized}
        zIndex={windowsState.profileWin.zIndex}
        width={520}
        headerColor="bg-pastel-pink"
        onClose={() => closeWindow('profileWin')}
        onFocus={() => bringToFront('profileWin')}
        onMinimize={() => minimizeWindow('profileWin')}
      >
        <ProfileWindow profile={initialProfile} onNavigate={openWindow} />
      </Window>

      {/* 2. Projects Window */}
      <Window
        id="projectsWin"
        title="🎮 Playable Dreams & 3D Portfolio"
        isOpen={windowsState.projectsWin.isOpen}
        isMinimized={windowsState.projectsWin.isMinimized}
        zIndex={windowsState.projectsWin.zIndex}
        width={720}
        headerColor="bg-pastel-peach"
        onClose={() => closeWindow('projectsWin')}
        onFocus={() => bringToFront('projectsWin')}
        onMinimize={() => minimizeWindow('projectsWin')}
      >
        <ProjectsWindow projects={initialProjects} />
      </Window>

      {/* 3. Skills Window */}
      <Window
        id="skillsWin"
        title="🧰 Technical & Creative Toolbox"
        isOpen={windowsState.skillsWin.isOpen}
        isMinimized={windowsState.skillsWin.isMinimized}
        zIndex={windowsState.skillsWin.zIndex}
        width={560}
        headerColor="bg-pastel-mint"
        onClose={() => closeWindow('skillsWin')}
        onFocus={() => bringToFront('skillsWin')}
        onMinimize={() => minimizeWindow('skillsWin')}
      >
        <SkillsWindow skills={initialSkills} />
      </Window>

      {/* 4. Achievements Window */}
      <Window
        id="achievementsWin"
        title="🏆 Awards & Recognitions"
        isOpen={windowsState.achievementsWin.isOpen}
        isMinimized={windowsState.achievementsWin.isMinimized}
        zIndex={windowsState.achievementsWin.zIndex}
        width={500}
        headerColor="bg-pastel-lavender"
        onClose={() => closeWindow('achievementsWin')}
        onFocus={() => bringToFront('achievementsWin')}
        onMinimize={() => minimizeWindow('achievementsWin')}
      >
        <AchievementsWindow achievements={initialAchievements} />
      </Window>

      {/* 5. Hobbies Window */}
      <Window
        id="hobbiesWin"
        title="🎬 Outside the Engine"
        isOpen={windowsState.hobbiesWin.isOpen}
        isMinimized={windowsState.hobbiesWin.isMinimized}
        zIndex={windowsState.hobbiesWin.zIndex}
        width={480}
        headerColor="bg-pastel-peach"
        onClose={() => closeWindow('hobbiesWin')}
        onFocus={() => bringToFront('hobbiesWin')}
        onMinimize={() => minimizeWindow('hobbiesWin')}
      >
        <HobbiesWindow />
      </Window>

      {/* 6. Pixel Game Window */}
      <Window
        id="gameWin"
        title="⚔️ Pixel Quest & 3D Horror · Playable Games"
        isOpen={windowsState.gameWin.isOpen}
        isMinimized={windowsState.gameWin.isMinimized}
        zIndex={windowsState.gameWin.zIndex}
        width={840}
        headerColor="bg-pastel-sky"
        onClose={() => closeWindow('gameWin')}
        onFocus={() => bringToFront('gameWin')}
        onMinimize={() => minimizeWindow('gameWin')}
      >
        <PixelRunnerGame />
      </Window>

      {/* 7. Resume Window */}
      <Window
        id="resumeWin"
        title="📄 Curriculum Vitae & Experience Timeline"
        isOpen={windowsState.resumeWin.isOpen}
        isMinimized={windowsState.resumeWin.isMinimized}
        zIndex={windowsState.resumeWin.zIndex}
        width={580}
        headerColor="bg-pastel-lavender"
        onClose={() => closeWindow('resumeWin')}
        onFocus={() => bringToFront('resumeWin')}
        onMinimize={() => minimizeWindow('resumeWin')}
      >
        <ResumeWindow profile={initialProfile} />
      </Window>

      {/* 8. Contact Window */}
      <Window
        id="contactWin"
        title="💼 Freelance Studio & Commissions · Ashrut Tiwari"
        isOpen={windowsState.contactWin.isOpen}
        isMinimized={windowsState.contactWin.isMinimized}
        zIndex={windowsState.contactWin.zIndex}
        width={540}
        headerColor="bg-pastel-pink"
        onClose={() => closeWindow('contactWin')}
        onFocus={() => bringToFront('contactWin')}
        onMinimize={() => minimizeWindow('contactWin')}
      >
        <ContactWindow />
      </Window>

      {/* 9. Settings Window */}
      <Window
        id="settingsWin"
        title="⚙️ Appearance & Layout Settings"
        isOpen={windowsState.settingsWin.isOpen}
        isMinimized={windowsState.settingsWin.isMinimized}
        zIndex={windowsState.settingsWin.zIndex}
        width={480}
        headerColor="bg-pastel-peach"
        onClose={() => closeWindow('settingsWin')}
        onFocus={() => bringToFront('settingsWin')}
        onMinimize={() => minimizeWindow('settingsWin')}
      >
        <SettingsWindow
          settings={uiSettings}
          onUpdateSettings={handleUpdateSettings}
          onResetLayout={resetWindows}
        />
      </Window>
    </main>
  );
};
