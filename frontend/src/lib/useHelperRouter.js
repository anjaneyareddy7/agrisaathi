import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolvePageIntent, isYes, isNo } from './pageRouter';

// Returns { pending, handleRouterTurn }.
// handleRouterTurn(text) returns:
//   { handled: true, reply: "..." }   -> router consumed this turn, show `reply`, do NOT call the AI
//   { handled: false }                -> not a routing turn, pass to your normal AI chat
export function useHelperRouter() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(null); // the route awaiting yes/no confirmation

  const handleRouterTurn = useCallback((text) => {
    // 1. If we're waiting on a yes/no for a previously suggested page:
    if (pending) {
      if (isYes(text)) {
        const route = pending;
        setPending(null);
        navigate(route.path);
        return { handled: true, reply: `Opening ${route.label}.` };
      }
      if (isNo(text)) {
        setPending(null);
        return { handled: true, reply: 'Okay, not opening that. What are you looking for?' };
      }
      // User didn't answer yes/no — they probably named a different page. Fall through
      // and re-resolve against the new text instead of forcing a yes/no.
      setPending(null);
    }

    // 2. Try to resolve this turn to a page.
    const route = resolvePageIntent(text);
    if (route) {
      setPending(route);
      return { handled: true, reply: `${route.label} is where you'd do that. Open it?` };
    }

    // 3. No page match — let the normal AI chat handle it.
    return { handled: false };
  }, [pending, navigate]);

  return { pending, handleRouterTurn };
}

// Call this directly from the "open it" quick-reply button's onClick.
// Do NOT send "open it" back through the chat as free text.
export function confirmPending(pending, navigate, setPending) {
  if (!pending) return null;
  navigate(pending.path);
  setPending(null);
  return `Opening ${pending.label}.`;
}
