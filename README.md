# Bookmark to Calendar

![Bookmark to Calendar logo](assets/logo.png)

A small Chrome extension that turns X bookmarks into a calendar prompt. Bookmark a post, choose a review time, and it opens a prefilled Google Calendar event with the post text and URL.

## Install

### Humans

1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the repo folder.

### AI Agents

Load the unpacked extension directory in Chrome:

```bash
/path/to/bookmark-to-calendar
```

Then test on `https://x.com/home` by bookmarking an unbookmarked post. The expected result is a modal with `In 1 hour`, `Tomorrow`, `Next week`, and `Pick in Calendar` actions.

## Notes

- Runs only on `x.com` and `twitter.com`.
- Does not create calendar events by itself; it opens Google Calendar with event details filled in.
- No build step.
