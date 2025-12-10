"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { useCliStatus } from "./settings-view/hooks/use-cli-status";
import { useScrollTracking } from "./settings-view/hooks/use-scroll-tracking";
import { NAV_ITEMS } from "./settings-view/config/navigation";
import { SettingsHeader } from "./settings-view/components/settings-header";
import { KeyboardMapDialog } from "./settings-view/components/keyboard-map-dialog";
import { DeleteProjectDialog } from "./settings-view/components/delete-project-dialog";
import { SettingsNavigation } from "./settings-view/components/settings-navigation";
import { ApiKeysSection } from "./settings-view/api-keys/api-keys-section";
import { ClaudeCliStatus } from "./settings-view/cli-status/claude-cli-status";
import { CodexCliStatus } from "./settings-view/cli-status/codex-cli-status";
import { AppearanceSection } from "./settings-view/appearance/appearance-section";
import { KanbanDisplaySection } from "./settings-view/kanban-display/kanban-display-section";
import { KeyboardShortcutsSection } from "./settings-view/keyboard-shortcuts/keyboard-shortcuts-section";
import { FeatureDefaultsSection } from "./settings-view/feature-defaults/feature-defaults-section";
import { DangerZoneSection } from "./settings-view/danger-zone/danger-zone-section";

export function SettingsView() {
  const {
    setCurrentView,
    theme,
    setTheme,
    setProjectTheme,
    kanbanCardDetailLevel,
    setKanbanCardDetailLevel,
    defaultSkipTests,
    setDefaultSkipTests,
    useWorktrees,
    setUseWorktrees,
    showProfilesOnly,
    setShowProfilesOnly,
    currentProject,
    moveProjectToTrash,
  } = useAppStore();

  // Compute the effective theme for the current project
  const effectiveTheme = currentProject?.theme || theme;

  // Handler to set theme - saves to project if one is selected, otherwise to global
  const handleSetTheme = (newTheme: typeof theme) => {
    if (currentProject) {
      setProjectTheme(currentProject.id, newTheme);
    } else {
      setTheme(newTheme);
    }
  };

  // Use CLI status hook
  const {
    claudeCliStatus,
    codexCliStatus,
    isCheckingClaudeCli,
    isCheckingCodexCli,
    handleRefreshClaudeCli,
    handleRefreshCodexCli,
  } = useCliStatus();

  // Use scroll tracking hook
  const { activeSection, scrollToSection, scrollContainerRef } =
    useScrollTracking(NAV_ITEMS, currentProject);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showKeyboardMapDialog, setShowKeyboardMapDialog] = useState(false);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden content-bg"
      data-testid="settings-view"
    >
      {/* Header Section */}
      <SettingsHeader />

      {/* Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sticky Side Navigation */}
        <SettingsNavigation
          navItems={NAV_ITEMS}
          activeSection={activeSection}
          currentProject={currentProject}
          onNavigate={scrollToSection}
        />

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6 pb-96">
            {/* API Keys Section */}
            <ApiKeysSection />

            {/* Claude CLI Status Section */}
            {claudeCliStatus && (
              <ClaudeCliStatus
                status={claudeCliStatus}
                isChecking={isCheckingClaudeCli}
                onRefresh={handleRefreshClaudeCli}
              />
            )}

            {/* Codex CLI Status Section */}
            {codexCliStatus && (
              <CodexCliStatus
                status={codexCliStatus}
                isChecking={isCheckingCodexCli}
                onRefresh={handleRefreshCodexCli}
              />
            )}

            {/* Appearance Section */}
            <AppearanceSection
              effectiveTheme={effectiveTheme}
              currentProject={currentProject}
              onThemeChange={handleSetTheme}
            />

            {/* Kanban Card Display Section */}
            <KanbanDisplaySection
              detailLevel={kanbanCardDetailLevel}
              onChange={setKanbanCardDetailLevel}
            />

            {/* Keyboard Shortcuts Section */}
            <KeyboardShortcutsSection
              onOpenKeyboardMap={() => setShowKeyboardMapDialog(true)}
            />

            {/* Feature Defaults Section */}
            <FeatureDefaultsSection
              showProfilesOnly={showProfilesOnly}
              defaultSkipTests={defaultSkipTests}
              useWorktrees={useWorktrees}
              onShowProfilesOnlyChange={setShowProfilesOnly}
              onDefaultSkipTestsChange={setDefaultSkipTests}
              onUseWorktreesChange={setUseWorktrees}
            />

            {/* Danger Zone Section - Only show when a project is selected */}
            <DangerZoneSection
              project={currentProject}
              onDeleteClick={() => setShowDeleteDialog(true)}
            />

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => setCurrentView("welcome")}
                className="bg-secondary hover:bg-accent text-secondary-foreground border border-border"
                data-testid="back-to-home"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Map Dialog */}
      <KeyboardMapDialog
        open={showKeyboardMapDialog}
        onOpenChange={setShowKeyboardMapDialog}
      />

      {/* Delete Project Confirmation Dialog */}
      <DeleteProjectDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        project={currentProject}
        onConfirm={moveProjectToTrash}
      />
    </div>
  );
}
