---
title: 'Implementing Dark Mode: Best Practices and Common Pitfalls'
description: 'Learn how to implement dark mode in web applications the right way. Avoid common pitfalls like FOUC and ensure a smooth user experience.'
pubDate: 2025-01-05
updatedDate: 2025-01-08
category: 'Frontend'
tags: ['css', 'dark-mode', 'web-development', 'ux', 'accessibility']
lang: 'en'
---

## The Dark Mode Revolution

Dark mode has become a standard feature in modern web applications. Users love it for reducing eye strain, saving battery life on OLED screens, and just looking cool. But implementing dark mode correctly is trickier than it seems.

## Common Pitfalls

### The Flash of Unstyled Content (FOUC)

The most common issue is the "flash" - where the page loads in light mode for a split second before switching to dark mode. This happens because:

1. HTML loads and renders
2. JavaScript loads and checks for theme preference
3. JavaScript applies the dark mode class

By step 3, the user has already seen the flash!

### Storing Theme Incorrectly

Another mistake is only storing the theme without considering system preferences. Users expect their choice to persist, but also want automatic switching when their system theme changes.

## The Solution

Here's a robust approach to dark mode implementation:

## Step 1: CSS Setup with Tailwind

First, configure Tailwind CSS for class-based dark mode:

```javascript
// tailwind.config.mjs
export default {
  darkMode: 'class',
  // ... rest of config
};
```

## Step 2: Preventing FOUC

The key is to apply the theme **before** the page renders. We do this with an inline script in the `<head>`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- This script runs BEFORE page paint -->
    <script is:inline>
      const getThemePreference = () => {
        // Check localStorage first
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
          return localStorage.getItem('theme');
        }
        // Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      };

      // Apply theme immediately
      const isDark = getThemePreference() === 'dark';
      document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    </script>
  </head>
  <!-- rest of HTML -->
</html>
```

### Why This Works

1. The `is:inline` directive in Astro tells the build tool not to bundle this script
2. Inline scripts in `<head>` run before the page paints
3. The theme is applied before any content renders

## Step 3: Syncing Across Tabs

When a user changes their theme in one tab, other tabs should update too. Use a storage event listener:

```html
<script is:inline>
  // ... previous code ...

  // Listen for changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      const isDark = e.newValue === 'dark';
      document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    }
  });
</script>
```

## Step 4: Creating the Toggle Component

Here's a complete dark mode toggle button:

```astro
<!-- DarkModeToggle.astro -->
<button id="theme-toggle" aria-label="Toggle dark mode">
  <!-- Sun icon (shown in dark mode) -->
  <svg id="sun-icon" class="hidden" ...>...</svg>

  <!-- Moon icon (shown in light mode) -->
  <svg id="moon-icon" class="hidden" ...>...</svg>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  const getCurrentTheme = () => {
    return localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };

  const updateIcons = (theme) => {
    if (theme === 'dark') {
      moonIcon.classList.remove('hidden');
      sunIcon.classList.add('hidden');
    } else {
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
    }
  };

  // Initialize icons
  updateIcons(getCurrentTheme());

  // Toggle theme
  toggle.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update DOM
    document.documentElement.classList[newTheme === 'dark' ? 'add' : 'remove']('dark');

    // Save to localStorage
    localStorage.setItem('theme', newTheme);

    // Update icons
    updateIcons(newTheme);
  });
</script>
```

## Step 5: Styling for Both Themes

When styling your components, always provide colors for both light and dark modes:

```html
<!-- Tailwind classes -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <!-- Content -->
</div>
```

### CSS Variables Approach

For more complex theming, use CSS variables:

```css
:root {
  --bg-primary: white;
  --text-primary: #1f2937;
}

.dark {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}

.my-element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

## Accessibility Considerations

### Color Contrast

Always maintain sufficient contrast ratios in both themes:

- Normal text: At least 4.5:1
- Large text: At least 3:1

### Respect User Preferences

Consider the `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  /* Default to dark mode if user hasn't set a preference */
}
```

## Testing Your Implementation

### Manual Testing Checklist

- [ ] Page loads in correct theme (no flash)
- [ ] Toggle works in both directions
- [ ] Preference persists across page reloads
- [ ] Preference syncs across tabs
- [ ] System preference changes are respected
- [ ] All content is readable in both themes

### Automated Testing

```typescript
// Example test with Playwright
test('dark mode persistence', async ({ page }) => {
  await page.goto('/');

  // Toggle dark mode
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveClass(/dark/);

  // Reload and verify persistence
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

## Common Issues and Solutions

### Issue: Theme resets on page navigation

**Solution:** Make sure the initialization script is in a shared layout that all pages extend.

### Issue: Icons don't update on initial load

**Solution:** Call your update function immediately after defining it, not just in event listeners.

### Issue: Flash during hydration in frameworks

**Solution:** For React/Vue/etc., use framework-specific patterns like `useEffect` with cleanup or lifecycle hooks.

## Performance Considerations

The inline script approach is performant because:

1. **Small payload:** The script is only a few hundred bytes
2. **Non-blocking:** It doesn't prevent other resources from loading
3. **Runs once:** Only executes once per page view

## Alternative Approach: CSS-Only

For a purely CSS-based solution (without JavaScript):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #111827;
    --text-color: #f9fafb;
  }
}

/* For manual toggle, you still need JS */
[data-theme="dark"] {
  --bg-color: #111827;
  --text-color: #f9fafb;
}
```

However, this doesn't allow persistent user choice without JavaScript.

## Conclusion

Implementing dark mode correctly requires attention to:

1. **Performance:** Prevent FOUC with inline scripts
2. **Persistence:** Save user preference to localStorage
3. **Sync:** Update all tabs when theme changes
4. **Accessibility:** Maintain contrast ratios in both themes

The code patterns shown in this guide provide a solid foundation for any dark mode implementation.

## Resources

- [MDN: Color schemes](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Tailwind CSS: Dark mode](https://tailwindcss.com/docs/dark-mode)
- [A11y Project: Color Contrast](https://www.a11yproject.com/posts/2016-01-09-color-contrast/)
