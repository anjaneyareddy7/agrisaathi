// Lets any detail page (Crop Encyclopedia, Animal Encyclopedia, etc.)
// register its main readable text so Agri Helper can read it aloud on
// request ("read this page"), without the widget needing to know each
// page's internal structure.
let current = null;

export function registerReadableContent(title, text) {
  current = { title, text };
}

export function clearReadableContent() {
  current = null;
}

export function getReadableContent() {
  return current;
}
