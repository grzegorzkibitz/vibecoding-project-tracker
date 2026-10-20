import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useProjects } from '@/hooks/useProjects';
import { useTeams } from '@/hooks/useTeams';
import { teamFor } from '@/lib/teams';
import { Toaster, toast } from '@/components/ui/sonner';
import Sidebar from '@/components/Sidebar';
import ProjectWorkspace from '@/components/ProjectWorkspace';
import ProjectDialog from '@/components/ProjectDialog';
import TeamsDialog from '@/components/TeamsDialog';

/**
 * Vibecoding Project Tracker.
 *
 * Shell: sidebar (with the project switcher) + the open project's workspace
 * (deliverable links above its Kanban board).
 */
export default function App() {
  const projects = useProjects();
  const teams = useTeams();
  const team = teamFor(teams.teams, projects.current);
  const [collapsed, setCollapsed] = useLocalStorage('vibetracker.sidebarCollapsed', false);
  // Sidebar dialogs: null, 'lists' or 'teams'.
  const [sidebarDialog, setSidebarDialog] = useState(null);
  // null = closed, 'new' = create, 'settings' = rename / delete the open project.
  const [projectDialog, setProjectDialog] = useState(null);

  const openProject = (id) => {
    // Undo buttons on old toasts belong to the previous project.
    toast.dismiss();
    projects.open(id);
  };

  return (
    <div className="flex h-full">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Sidebar
        teamName={team.name}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onAction={setSidebarDialog}
        projects={projects.projects}
        currentProject={projects.current}
        onOpenProject={openProject}
        onNewProject={() => setProjectDialog('new')}
        onProjectSettings={() => setProjectDialog('settings')}
      />

      <ProjectWorkspace
        key={projects.current.id}
        project={projects.current}
        team={team}
        managingLists={sidebarDialog === 'lists'}
        onCloseLists={() => setSidebarDialog(null)}
      />

      {projectDialog && (
        <ProjectDialog
          mode={projectDialog}
          project={projects.current}
          manager={projects}
          teams={teams.teams}
          currentTeamId={team.id}
          onClose={() => setProjectDialog(null)}
          onDone={() => toast.dismiss()}
        />
      )}

      {sidebarDialog === 'teams' && (
        <TeamsDialog
          manager={teams}
          projects={projects.projects}
          initialTeamId={team.id}
          onClose={() => setSidebarDialog(null)}
        />
      )}

      <Toaster />
    </div>
  );
}
