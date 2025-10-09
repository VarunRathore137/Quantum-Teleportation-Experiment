import { useState } from 'react';
import { Settings, X, Palette, Globe, Accessibility, Volume2, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { useUIStore } from '@/state/ui';

interface SettingsModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const THEMES = [
  { id: 'dark', label: 'Dark Matter', description: 'Deep space quantum theme' },
  { id: 'light', label: 'Quantum Light', description: 'Bright laboratory theme' }
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

export const SettingsModal = ({ isOpen, onOpenChange, trigger }: SettingsModalProps) => {
  const [audioVolume, setAudioVolume] = useState([75]);
  
  const {
    theme,
    language,
    reducedMotion,
    setTheme,
    setLanguage,
    setReducedMotion
  } = useUIStore();

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
      aria-label="Open settings"
    >
      <Settings className="h-5 w-5" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto holo-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-quantum bg-gradient-to-r from-quantum-cyan via-quantum-purple to-quantum-magenta bg-clip-text text-transparent">
            Quantum Lab Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="font-quantum text-lg font-semibold">Appearance</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEMES.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id as 'dark' | 'light')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    theme === themeOption.id
                      ? 'border-primary bg-primary/10 neon-bloom-cyan'
                      : 'border-border/30 hover:border-primary/50 hover:bg-card/50'
                  }`}
                >
                  <div className="font-quantum font-medium mb-1">{themeOption.label}</div>
                  <div className="text-sm text-muted-foreground">{themeOption.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-secondary" />
              <h3 className="font-quantum text-lg font-semibold">Language</h3>
            </div>
            
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <p className="text-xs text-muted-foreground">
              * Some languages are work in progress and may have incomplete translations
            </p>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Accessibility className="h-5 w-5 text-accent" />
              <h3 className="font-quantum text-lg font-semibold">Accessibility</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">Reduced Motion</div>
                  <div className="text-sm text-muted-foreground">
                    Minimize animations and transitions for better accessibility
                  </div>
                </div>
                <Switch
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                  aria-label="Toggle reduced motion"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">High Contrast Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Enhance visual contrast for better readability
                  </div>
                </div>
                <Switch
                  defaultChecked={false}
                  aria-label="Toggle high contrast mode"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">Screen Reader Support</div>
                  <div className="text-sm text-muted-foreground">
                    Enhanced ARIA labels and descriptions
                  </div>
                </div>
                <Switch
                  defaultChecked={true}
                  aria-label="Toggle screen reader support"
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-quantum-gold" />
              <h3 className="font-quantum text-lg font-semibold">Audio</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-quantum font-medium">Master Volume</div>
                  <div className="text-sm text-muted-foreground font-quantum">
                    {audioVolume[0]}%
                  </div>
                </div>
                <Slider
                  value={audioVolume}
                  onValueChange={setAudioVolume}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label="Master volume"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">Sound Effects</div>
                  <div className="text-sm text-muted-foreground">
                    Quantum interactions and UI feedback sounds
                  </div>
                </div>
                <Switch
                  defaultChecked={true}
                  aria-label="Toggle sound effects"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">Narration</div>
                  <div className="text-sm text-muted-foreground">
                    Guided tour voice narration
                  </div>
                </div>
                <Switch
                  defaultChecked={false}
                  aria-label="Toggle narration"
                />
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-quantum-purple" />
              <h3 className="font-quantum text-lg font-semibold">Performance</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">GPU Acceleration</div>
                  <div className="text-sm text-muted-foreground">
                    Use GPU for 3D rendering and particle effects
                  </div>
                </div>
                <Switch
                  defaultChecked={true}
                  aria-label="Toggle GPU acceleration"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">Particle Effects</div>
                  <div className="text-sm text-muted-foreground">
                    Quantum field animations and visual effects
                  </div>
                </div>
                <Switch
                  defaultChecked={true}
                  aria-label="Toggle particle effects"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                <div>
                  <div className="font-quantum font-medium">Auto-Save Progress</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically save simulation state and progress
                  </div>
                </div>
                <Switch
                  defaultChecked={true}
                  aria-label="Toggle auto-save"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground font-quantum">
            Settings are automatically saved • Quantum Lab v1.0.0
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};