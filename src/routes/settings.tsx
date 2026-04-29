import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Save, Sliders, Bell } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/primitives";
import { useTheme } from "@/lib/theme-provider";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    theme: theme,
    notifications: true,
    riskThreshold: 80,
  });

  useEffect(() => {
    // Sync local state if global theme changes
    setSettings(s => ({ ...s, theme }));
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("trustguard_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(s => ({ ...s, ...parsed, theme: theme }));
      } catch (e) {}
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme = settings.theme === "dark" ? "light" : "dark";
    setSettings(s => ({ ...s, theme: newTheme }));
    // Live switching requirement: update immediately after toggle
    setTheme(newTheme);
  };

  const handleSave = () => {
    // Persist other settings
    localStorage.setItem("trustguard_settings", JSON.stringify({
      notifications: settings.notifications,
      riskThreshold: settings.riskThreshold
    }));
    // Theme is already saved by ThemeProvider, but we can re-affirm it
    setTheme(settings.theme);
    toast.success("Settings Saved Successfully");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your application preferences.</p>
      </div>

      <GlassCard className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2 mb-4">
            <Bell className="h-4 w-4" /> Global Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Theme</div>
                <div className="text-xs text-muted-foreground">Enable dark mode for the dashboard</div>
              </div>
              <button
                onClick={handleToggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.theme === "dark" ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${settings.theme === "dark" ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Real-time Notifications</div>
                <div className="text-xs text-muted-foreground">Receive browser toasts for alerts</div>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.notifications ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${settings.notifications ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2 mb-4 mt-8">
            <Sliders className="h-4 w-4" /> AI Decision Thresholds
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Fraud Block Threshold</div>
                <div className="font-semibold">{settings.riskThreshold}%</div>
              </div>
              <div className="text-xs text-muted-foreground mb-3">Scores above this generate automatic blocked actions.</div>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={settings.riskThreshold}
                onChange={(e) => setSettings(s => ({ ...s, riskThreshold: parseInt(e.target.value) }))}
                className="w-full accent-primary h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl gradient-brand px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
