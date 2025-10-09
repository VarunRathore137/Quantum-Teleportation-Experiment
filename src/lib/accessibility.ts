// Accessibility utilities for the Quantum Teleportation app

/**
 * Keyboard navigation constants
 */
export const KEYBOARD_KEYS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Timeline navigation shortcuts
 */
export const TIMELINE_SHORTCUTS = {
  PLAY_PAUSE: ' ', // Space
  STEP_FORWARD: 'ArrowRight',
  STEP_BACKWARD: 'ArrowLeft',
  RESET: 'r',
  SKIP_TO_END: 'End',
  SKIP_TO_START: 'Home',
  SPEED_UP: 'Shift+ArrowRight',
  SPEED_DOWN: 'Shift+ArrowLeft',
} as const;

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  /**
   * Push current focus to stack and focus new element
   */
  static pushFocus(element: HTMLElement | null) {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus && currentFocus !== document.body) {
      this.focusStack.push(currentFocus);
    }
    
    if (element) {
      element.focus();
    }
  }

  /**
   * Return focus to previous element in stack
   */
  static popFocus() {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }

  /**
   * Clear focus stack
   */
  static clearStack() {
    this.focusStack = [];
  }

  /**
   * Trap focus within container
   */
  static trapFocus(container: HTMLElement, event: KeyboardEvent) {
    if (event.key !== KEYBOARD_KEYS.TAB) return;

    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (!firstElement || !lastElement) return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

/**
 * ARIA live region announcer
 */
export class LiveAnnouncer {
  private static instance: LiveAnnouncer;
  private liveRegion: HTMLElement | null = null;

  static getInstance(): LiveAnnouncer {
    if (!this.instance) {
      this.instance = new LiveAnnouncer();
    }
    return this.instance;
  }

  constructor() {
    this.createLiveRegion();
  }

  private createLiveRegion() {
    if (typeof document === 'undefined') return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('aria-label', 'Live announcements');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.left = '-10000px';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // Clear after announcement to allow repeat announcements
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  /**
   * Announce quantum state changes
   */
  announceQuantumState(phase: string, description: string) {
    this.announce(`Quantum teleportation phase: ${phase}. ${description}`, 'polite');
  }

  /**
   * Announce timeline changes
   */
  announceTimelineChange(position: number, phase: string) {
    const percentage = Math.round(position * 100);
    this.announce(`Timeline at ${percentage}% - Phase: ${phase}`, 'polite');
  }

  /**
   * Announce measurement results
   */
  announceMeasurement(qubit: string, result: string) {
    this.announce(`Qubit ${qubit} measured: ${result}`, 'assertive');
  }
}

/**
 * Reduced motion utilities
 */
export const MotionUtils = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get appropriate animation duration based on motion preference
   */
  getAnimationDuration(normalDuration: number, reducedDuration: number = 0): number {
    return this.prefersReducedMotion() ? reducedDuration : normalDuration;
  },

  /**
   * Apply motion-safe class conditionally
   */
  motionSafeClass(normalClass: string, reducedClass: string = ''): string {
    return this.prefersReducedMotion() ? reducedClass : normalClass;
  }
};

/**
 * Keyboard navigation helper for timeline
 */
export const TimelineKeyboardHandler = {
  /**
   * Handle timeline keyboard navigation
   */
  handleKeydown(
    event: KeyboardEvent,
    callbacks: {
      onPlayPause?: () => void;
      onStepForward?: () => void;
      onStepBackward?: () => void;
      onReset?: () => void;
      onSkipToEnd?: () => void;
      onSkipToStart?: () => void;
      onSpeedUp?: () => void;
      onSpeedDown?: () => void;
    }
  ) {
    const { key, shiftKey } = event;

    switch (key) {
      case TIMELINE_SHORTCUTS.PLAY_PAUSE:
        event.preventDefault();
        callbacks.onPlayPause?.();
        break;

      case TIMELINE_SHORTCUTS.STEP_FORWARD:
        event.preventDefault();
        if (shiftKey) {
          callbacks.onSpeedUp?.();
        } else {
          callbacks.onStepForward?.();
        }
        break;

      case TIMELINE_SHORTCUTS.STEP_BACKWARD:
        event.preventDefault();
        if (shiftKey) {
          callbacks.onSpeedDown?.();
        } else {
          callbacks.onStepBackward?.();
        }
        break;

      case TIMELINE_SHORTCUTS.RESET:
        event.preventDefault();
        callbacks.onReset?.();
        break;

      case TIMELINE_SHORTCUTS.SKIP_TO_END:
        event.preventDefault();
        callbacks.onSkipToEnd?.();
        break;

      case TIMELINE_SHORTCUTS.SKIP_TO_START:
        event.preventDefault();
        callbacks.onSkipToStart?.();
        break;
    }
  },

  /**
   * Get keyboard shortcuts help text
   */
  getShortcutsHelp(): Array<{ key: string; description: string }> {
    return [
      { key: 'Space', description: 'Play/Pause simulation' },
      { key: '→', description: 'Step forward' },
      { key: '←', description: 'Step backward' },
      { key: 'Shift + →', description: 'Increase speed' },
      { key: 'Shift + ←', description: 'Decrease speed' },
      { key: 'R', description: 'Reset to beginning' },
      { key: 'Home', description: 'Go to start' },
      { key: 'End', description: 'Go to end' },
    ];
  }
};

/**
 * High contrast mode utilities
 */
export const HighContrastUtils = {
  /**
   * Check if system is in high contrast mode
   */
  isHighContrast(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  },

  /**
   * Apply high contrast classes
   */
  getHighContrastClass(normalClass: string, highContrastClass: string): string {
    return this.isHighContrast() ? highContrastClass : normalClass;
  }
};