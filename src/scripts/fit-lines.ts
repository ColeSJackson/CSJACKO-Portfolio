/**
 * Fit-to-measure solver for the display lockups.
 *
 * Sets each display line to exactly the width of its container, so the hero and
 * the contact panel sit flush on both edges.
 *
 * This used to binary-search a variable width axis. Groovy Madness is a static
 * font with no axes, so the fit is done by scaling font-size instead. That is
 * both simpler and exact: rendered width is linear in font-size, so the right
 * scale is just target / natural, with one verification pass to absorb
 * sub-pixel rounding.
 *
 * The trade-off is deliberate and visible: lines of different character counts
 * now end up at different cap heights rather than the same one. With a face
 * this characterful that reads as a justified poster stack, which suits it.
 *
 * Measurement note: the line elements must be shrink-to-fit (width: max-content)
 * or offsetWidth reports the container instead of the text, and every line
 * silently collapses to the same wrong answer.
 */

const MIN_SCALE = 0.05;
const MAX_SCALE = 40;

function naturalWidth(el: HTMLElement): number {
  el.style.setProperty('--fit-scale', '1');
  return el.offsetWidth;
}

function solveLine(el: HTMLElement, target: number): void {
  const natural = naturalWidth(el);
  if (!natural || !target) return;

  let scale = target / natural;

  /* One correction pass. Font rasterisation rounds, and at very large sizes
     that rounding is enough to leave a visible sliver at the right edge. */
  el.style.setProperty('--fit-scale', String(scale));
  const actual = el.offsetWidth;
  if (actual > 0 && Math.abs(actual - target) > 0.5) {
    scale *= target / actual;
  }

  el.style.setProperty(
    '--fit-scale',
    String(Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE)),
  );
}

function fitGroup(group: HTMLElement): void {
  const lines = Array.from(group.querySelectorAll<HTMLElement>('[data-fit]'));
  if (!lines.length) return;

  const target = group.clientWidth;
  if (target <= 0) return;

  lines.forEach((el) => solveLine(el, target));

  /* Marks the group as resolved, which is what reveals it. Doing this here
     rather than in a rAF matters: rAF never fires in a background tab, and the
     hero would stay invisible until the tab was looked at. */
  group.dataset.solved = '';
}

function allGroups(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-fit-group]'));
}

/* The hero and the footer both import this, and on the home page both run. The
   solve itself is idempotent, but the listeners must only bind once. */
let bound = false;

function solveAll(): void {
  /* Solving against the fallback face would produce widths that jump the moment
     the real font arrives. */
  document.fonts.ready.then(() => {
    allGroups().forEach(fitGroup);
  });
}

export function initFit(): void {
  if (!allGroups().length) return;

  solveAll();

  if (bound) return;
  bound = true;

  /* Client-side navigation swaps the DOM without re-running this module, so
     returning to the homepage left the lockup unsolved: --fit-scale was never
     written, the lines fell back to their clamp size, and being max-content
     they sat hard against the left edge. That is the "loses its centring after
     the intro" bug. This listener is registered once and survives every later
     navigation. */
  document.addEventListener('astro:page-load', solveAll);

  let timer = 0;
  let lastWidth = window.innerWidth;

  window.addEventListener(
    'resize',
    () => {
      /* Mobile browser chrome collapsing fires resize on a height change only.
         Re-solving then would be wasted work and a visible flicker. */
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;

      /* A timeout rather than requestAnimationFrame: rAF is tied to the
         compositor and does not fire in every environment, and a missed solve
         here is a visibly broken lockup. */
      clearTimeout(timer);
      timer = window.setTimeout(() => allGroups().forEach(fitGroup), 120);
    },
    { passive: true },
  );
}
