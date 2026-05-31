const ROOT_ID = "xbr-root";
const RECENT_CLICK_MS = 1400;

let lastShownAt = 0;

function closestPost(element) {
  return element.closest('article[data-testid="tweet"], article[role="article"]');
}

function isBookmarkButton(element) {
  const button = element.closest('button, [role="button"]');
  if (!button) return false;

  const label = [
    button.getAttribute("aria-label"),
    button.getAttribute("data-testid"),
    button.textContent
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return label.includes("bookmark") && !label.includes("bookmarked") && !label.includes("remove");
}

function extractPostData(button) {
  const article = closestPost(button);
  const author =
    article?.querySelector('[data-testid="User-Name"]')?.innerText?.trim() ||
    article?.querySelector('a[href^="/"][role="link"]')?.innerText?.trim() ||
    "Bookmarked post";

  const text =
    article?.querySelector('[data-testid="tweetText"]')?.innerText?.trim() ||
    article?.innerText?.split("\n").slice(0, 8).join(" ").trim() ||
    "Review this bookmarked X post.";

  const statusLink = article?.querySelector('a[href*="/status/"]')?.href || location.href;
  const canonicalUrl = normalizePostUrl(statusLink);

  return {
    author: collapseWhitespace(author).slice(0, 120),
    text: collapseWhitespace(text).slice(0, 600),
    url: canonicalUrl
  };
}

function collapseWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizePostUrl(url) {
  try {
    const parsed = new URL(url, location.origin);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return location.href;
  }
}

function createRoot() {
  const existing = document.getElementById(ROOT_ID);
  if (existing) return existing;

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.hidden = true;
  root.innerHTML = `
    <section class="xbr-panel" role="dialog" aria-modal="true" aria-labelledby="xbr-title">
      <header class="xbr-header">
        <div>
          <h1 class="xbr-title" id="xbr-title">Put it on your reminder.</h1>
        </div>
        <button class="xbr-close" type="button" aria-label="Close reminder">×</button>
      </header>
      <div class="xbr-body">
        <div class="xbr-post">
          <p class="xbr-author"></p>
          <p class="xbr-text"></p>
        </div>
        <div class="xbr-actions" aria-label="Schedule reminder">
          <button class="xbr-button" type="button" data-minutes="60">In 1 hour</button>
          <button class="xbr-button" type="button" data-minutes="1440">Tomorrow</button>
          <button class="xbr-button" type="button" data-minutes="10080">Next week</button>
          <button class="xbr-button secondary" type="button" data-minutes="0">Choose in Calendar</button>
        </div>
      </div>
    </section>
  `;

  root.addEventListener("click", (event) => {
    if (event.target === root || event.target.closest(".xbr-close")) hideReminder();
    const scheduleButton = event.target.closest("[data-minutes]");
    if (scheduleButton) openCalendar(Number(scheduleButton.dataset.minutes));
  });

  document.documentElement.append(root);
  return root;
}

function showReminder(post) {
  const now = Date.now();
  if (now - lastShownAt < RECENT_CLICK_MS) return;
  lastShownAt = now;

  const root = createRoot();
  root.dataset.url = post.url;
  root.dataset.text = post.text;
  root.querySelector(".xbr-author").textContent = post.author;
  root.querySelector(".xbr-text").textContent = post.text;
  root.hidden = false;
}

function hideReminder() {
  const root = document.getElementById(ROOT_ID);
  if (root) root.hidden = true;
}

function openCalendar(minutesFromNow) {
  const root = document.getElementById(ROOT_ID);
  const text = root?.dataset.text || "Review bookmarked X post.";
  const url = root?.dataset.url || location.href;
  const start = new Date(Date.now() + minutesFromNow * 60 * 1000);
  const end = new Date(start.getTime() + 25 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Review bookmarked X post",
    details: `${text}\n\n${url}`,
    dates: `${formatCalendarDate(start)}/${formatCalendarDate(end)}`
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
  hideReminder();
}

function formatCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

document.addEventListener(
  "click",
  (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!isBookmarkButton(target)) return;

    const post = extractPostData(target);
    window.setTimeout(() => showReminder(post), 180);
  },
  true
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideReminder();
});
