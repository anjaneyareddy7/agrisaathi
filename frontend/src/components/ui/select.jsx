import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const SelectContext = createContext(null);

export const Select = ({
  children,
  value,
  onValueChange,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        triggerRef,
      }}
    >
      <div className="relative w-full" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({
  children,
  className = '',
  ...props
}) => {
  const {
    open,
    setOpen,
    triggerRef,
  } = useContext(SelectContext);

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      className={`w-full px-4 py-2 border border-gray-300 rounded-xl
        focus:ring-2 focus:ring-green-500 focus:border-transparent
        flex items-center justify-between bg-white ${className}`}
      onClick={() => setOpen((current) => !current)}
      {...props}
    >
      <span className="min-w-0 truncate text-left">
        {children}
      </span>

      <span
        aria-hidden="true"
        className={`ml-2 shrink-0 text-gray-400 transition-transform ${
          open ? 'rotate-180' : ''
        }`}
      >
        ▼
      </span>
    </button>
  );
};

export const SelectValue = ({
  placeholder,
  ...props
}) => {
  const { value } = useContext(SelectContext);

  return (
    <span {...props}>
      {value || placeholder}
    </span>
  );
};

export const SelectContent = ({
  children,
  className = '',
  ...props
}) => {
  const {
    open,
    setOpen,
    triggerRef,
  } = useContext(SelectContext);

  const [position, setPosition] = useState(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const GAP = 6;
    const VIEWPORT_PADDING = 8;
    const DESIRED_MAX_HEIGHT = 240;
    const MIN_MENU_HEIGHT = 120;

    const spaceBelow =
      viewportHeight - rect.bottom - VIEWPORT_PADDING;

    const spaceAbove =
      rect.top - VIEWPORT_PADDING;

    /*
     * Prefer below when there is enough room.
     * Otherwise open upward.
     */
    const openUp =
      spaceBelow < MIN_MENU_HEIGHT &&
      spaceAbove > spaceBelow;

    const availableHeight = openUp
      ? Math.max(MIN_MENU_HEIGHT, spaceAbove - GAP)
      : Math.max(MIN_MENU_HEIGHT, spaceBelow - GAP);

    const maxHeight = Math.min(
      DESIRED_MAX_HEIGHT,
      availableHeight
    );

    /*
     * Keep dropdown inside horizontal viewport.
     */
    const width = Math.min(
      rect.width,
      viewportWidth - VIEWPORT_PADDING * 2
    );

    const left = Math.min(
      Math.max(rect.left, VIEWPORT_PADDING),
      viewportWidth - width - VIEWPORT_PADDING
    );

    if (openUp) {
      setPosition({
        left,
        width,
        bottom: viewportHeight - rect.top + GAP,
        top: 'auto',
        maxHeight,
        placement: 'top',
      });
    } else {
      setPosition({
        left,
        width,
        top: rect.bottom + GAP,
        bottom: 'auto',
        maxHeight,
        placement: 'bottom',
      });
    }
  }, [triggerRef]);

  /*
   * Calculate position immediately when opened.
   */
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    updatePosition();
  }, [open, updatePosition]);

  /*
   * Follow scrolling and resizing.
   */
  useEffect(() => {
    if (!open) return undefined;

    const handleMove = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleMove);
    window.addEventListener('scroll', handleMove, true);

    return () => {
      window.removeEventListener('resize', handleMove);
      window.removeEventListener('scroll', handleMove, true);
    };
  }, [open, updatePosition]);

  /*
   * Close when clicking outside the trigger/dropdown.
   */
  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      const trigger = triggerRef.current;

      if (
        trigger &&
        !trigger.contains(event.target)
      ) {
        const dropdown = document.querySelector(
          '[data-agrisaathi-select-content="true"]'
        );

        if (
          dropdown &&
          !dropdown.contains(event.target)
        ) {
          setOpen(false);
        }
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
    };
  }, [open, setOpen, triggerRef]);

  /*
   * Escape closes the dropdown.
   */
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [open, setOpen, triggerRef]);

  if (!open || !position) {
    return null;
  }

  return createPortal(
    <div
      data-agrisaathi-select-content="true"
      role="listbox"
      className={`fixed z-[99999]
        bg-white
        border border-gray-200
        rounded-xl
        shadow-2xl
        overflow-y-auto
        overscroll-contain
        py-1
        ${className}`}
      style={{
        left: position.left,
        width: position.width,
        top: position.top,
        bottom: position.bottom,
        maxHeight: position.maxHeight,
      }}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
};

export const SelectItem = ({
  children,
  value,
  ...props
}) => {
  const {
    onValueChange,
    setOpen,
  } = useContext(SelectContext);

  return (
    <button
      type="button"
      role="option"
      className="block w-full text-left px-4 py-2
        hover:bg-green-50
        active:bg-green-100
        cursor-pointer
        transition-colors
        text-sm"
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
};
