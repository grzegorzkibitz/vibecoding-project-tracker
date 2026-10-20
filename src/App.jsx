import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useProjects } from '@/hooks/useProjects';
import { TEAM_NAME } from '@/lib/defaults';
import { Toaster, toast } from '@/components/ui/sonner';
import Sidebar from '@/components/Sidebar';
import ProjectWorkspace from '@/components/ProjectWorkspace';
import ProjectDialog from '@/components/ProjectDialog';

/**
 * Vibecoding Project Tracker.
 *
 * Shell: sidebar (with the project switcher) + the open project's workspace
 * (deliverable links above its Kanban board).
 */
export default function App() {
  const projects = useProjects();
  const [collapsed, setCollapsed] = useLocalStorage('vibetracker.sidebarCollapsed', false);
  const [managingLists, setManagingLists] = useState(false);
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
        teamName={TEAM_NAME}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onManageLists={() => setManagingLists(true)}
        projects={projects.projects}
        currentProject={projects.current}
        onOpenProject={openProject}
        onNewProject={() => setProjectDialog('new')}
        onProjectSettings={() => setProjectDialog('settings')}
      />

      <ProjectWorkspace
        key={projects.current.id}
        project={projects.current}
        managingLists={managingLists}
        onCloseLists={() => setManagingLists(false)}
      />

      {projectDialog && (
        <ProjectDialog
          mode={projectDialog}
          project={projects.current}
          manager={projects}
          onClose={() => setProjectDialog(null)}
          onDone={() => toast.dismiss()}
        />
      )}

      <Toaster />
    </div>
  );
}
