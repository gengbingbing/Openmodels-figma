/** Copy text to clipboard, falling back to execCommand when Clipboard API is blocked. */
export function copyText(text: string): void {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(text).catch(() => execCommandCopy(text));
  } else {
    execCommandCopy(text);
  }
}

function execCommandCopy(text: string): void {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try { document.execCommand("copy"); } catch (_) { /* silent */ }
  document.body.removeChild(el);
}
