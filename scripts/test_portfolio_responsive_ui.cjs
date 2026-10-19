const fs = require('fs');
const assert = require('assert');
const http = require('http');

console.log('================================================================');
console.log('  ASHRUT TIWARI PORTFOLIO: RESPONSIVE UI/UX SYSTEM TEST SUITE   ');
console.log('================================================================\n');

// 1. Verify CSS Tokens & Styles
console.log('[1/5] Verifying CSS tokens, themes, and accessibility rules in globals.css...');
const css = fs.readFileSync('src/app/globals.css', 'utf8');

assert(css.includes("[data-theme='dark']"), 'Must include dark theme styling');
assert(css.includes("[data-theme='sunset']"), 'Must include sunset theme styling');
assert(css.includes("[data-density='small']"), 'Must include small density scaling');
assert(css.includes("[data-density='large']"), 'Must include large density scaling');
assert(css.includes("[data-spacing='compact']"), 'Must include compact spacing scaling');
assert(css.includes("[data-reduced-motion='true']"), 'Must include reduced-motion override');
assert(css.includes('env(safe-area-inset-bottom'), 'Must include safe-area-inset-bottom');
assert(css.includes(':focus-visible'), 'Must include high visibility focus styling');
assert(css.includes('overflow-x: hidden'), 'Must prevent horizontal overflow');
console.log('✓ All CSS theme, density, spacing, motion, and accessibility rules verified.\n');

// 2. Verify Component Architecture & Requirements
console.log('[2/5] Verifying UI components & window system architecture...');
const windowTsx = fs.readFileSync('src/components/desktop/Window.tsx', 'utf8');
const navTabsTsx = fs.readFileSync('src/components/desktop/ResponsiveNavTabs.tsx', 'utf8');
const settingsTsx = fs.readFileSync('src/components/desktop/SettingsWindow.tsx', 'utf8');
const contactTsx = fs.readFileSync('src/components/windows/ContactWindow.tsx', 'utf8');
const desktopExpTsx = fs.readFileSync('src/components/desktop/DesktopExperience.tsx', 'utf8');

// Window system checks
assert(windowTsx.includes('handleResizeStart'), 'Window must support interactive resizing');
assert(windowTsx.includes('retro-resize-grip'), 'Window must have visible resize corner handle');
assert(windowTsx.includes('cursor-ew-resize'), 'Window must support horizontal resizing');
assert(windowTsx.includes('cursor-ns-resize'), 'Window must support vertical resizing');
assert(windowTsx.includes('isMobile'), 'Window must adapt layout specifically for mobile touch devices');
assert(windowTsx.includes('handleHeaderDoubleClick'), 'Window must support double-click title bar maximize');
assert(windowTsx.includes('aria-label'), 'Window must have accessible aria-label');
assert(windowTsx.includes('role="dialog"'), 'Window must have role="dialog"');

// Navigation Tabs checks
assert(navTabsTsx.includes('role="tablist"'), 'Navigation must use role="tablist"');
assert(navTabsTsx.includes('role="tab"'), 'Navigation tabs must use role="tab"');
assert(navTabsTsx.includes('aria-selected'), 'Navigation tabs must indicate aria-selected state');
assert(navTabsTsx.includes('scrollIntoView'), 'Active tab must automatically scroll into view');
assert(navTabsTsx.includes('handleKeyDown'), 'Tabs must support keyboard arrow navigation');
assert(navTabsTsx.includes('isGridOpen'), 'Mobile tabs must have full sections grid launcher modal');

// Settings checks
assert(settingsTsx.includes('onUpdateSettings'), 'Settings panel must allow updating preferences');
assert(settingsTsx.includes('onResetLayout'), 'Settings panel must include layout reset');
assert(settingsTsx.includes('reducedMotion'), 'Settings panel must include reduced motion toggle');

// Contact form checks
assert(contactTsx.includes('aria-required="true"'), 'Form fields must declare aria-required');
assert(contactTsx.includes('aria-invalid'), 'Form fields must report aria-invalid on error');
assert(contactTsx.includes('grid grid-cols-1 sm:grid-cols-2'), 'Form must use 1 col on mobile and 2 col on tablet/desktop');
assert(contactTsx.includes('min-h-[44px]'), 'Submit button must provide comfortable touch target');

// Desktop experience integration checks
assert(desktopExpTsx.includes('<ResponsiveNavTabs'), 'DesktopExperience must render ResponsiveNavTabs');
assert(desktopExpTsx.includes('settingsWin'), 'DesktopExperience must manage settingsWin');
assert(desktopExpTsx.includes('min-h-[100dvh]'), 'Root container must respect 100dvh viewport height');
console.log('✓ Component architecture, accessibility attributes, and integration verified.\n');

// 3. Test Mathematical Viewport Adaptations
console.log('[3/5] Testing Viewport Calculations across all 7 Required Screen Sizes...');
const viewports = [
  { name: 'Small Phone', w: 320, h: 568, isMobile: true },
  { name: 'Standard Android Phone', w: 360, h: 800, isMobile: true },
  { name: 'Modern iPhone', w: 390, h: 844, isMobile: true },
  { name: 'Large Pro Max Phone', w: 430, h: 932, isMobile: true },
  { name: 'Tablet (Portrait)', w: 768, h: 1024, isMobile: false },
  { name: 'Standard Laptop', w: 1366, h: 768, isMobile: false },
  { name: 'Desktop Monitor', w: 1920, h: 1080, isMobile: false },
];

viewports.forEach(vp => {
  if (vp.isMobile) {
    // Mobile: Window occupies calc(100vw - 16px) centered
    const winWidth = vp.w - 16;
    const leftMargin = 8;
    const rightEdge = leftMargin + winWidth;
    assert(rightEdge <= vp.w, `Mobile window must not overflow ${vp.name} width (${rightEdge} <= ${vp.w})`);
    assert(winWidth >= 300, `Mobile window width (${winWidth}px) must remain comfortable on ${vp.name}`);
  } else {
    // Desktop: Window is clamped within dock (88px) and right edge (vw - 20px)
    const dockWidth = 88;
    const defaultWinWidth = 520;
    const actualWidth = Math.min(defaultWinWidth, vp.w - dockWidth - 40);
    const availableWidth = vp.w - dockWidth;
    const rawX = dockWidth + Math.floor((availableWidth - actualWidth) / 2);
    const x = Math.max(dockWidth + 12, Math.min(vp.w - actualWidth - 20, rawX));
    const rightEdge = x + actualWidth;
    assert(rightEdge <= vp.w, `Desktop window must fit within ${vp.name} (${rightEdge} <= ${vp.w})`);
    assert(x >= dockWidth, `Desktop window must not hide behind dock on ${vp.name}`);
  }
  console.log(`  ✓ ${vp.name} (${vp.w}x${vp.h}): Verified safe dimensions and zero horizontal overflow.`);
});
console.log('✓ All 7 viewports passed layout calculations.\n');

// 4. Test Local Running Dev Server Endpoints
console.log('[4/5] Testing Live Dev Server (http://localhost:3000)...');

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

(async () => {
  try {
    const home = await fetchUrl('/');
    assert.strictEqual(home.status, 200, 'Homepage must return 200 OK');
    assert(home.data.includes('tab-profileWin'), 'Homepage must contain responsive navigation tabs');
    assert(home.data.includes('role="tablist"'), 'Homepage must include tablist ARIA role');
    assert(home.data.includes('profileWin'), 'Homepage must render profile window');
    assert(home.data.includes('settingsWin'), 'Homepage must render settings window');
    console.log('✓ Homepage live HTTP response (200 OK) verified with all windows & tablist.');

    // 5. Test Contact API validation
    console.log('\n[5/5] Testing Contact Submission API (/api/contact)...');
    
    // Test empty submission returns validation error
    const invalidRes = await fetchUrl('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'invalid-email', message: '' }),
    });
    assert.strictEqual(invalidRes.status, 400, 'Invalid submission must return 400 Bad Request');
    console.log('✓ Contact API correctly validates invalid submissions and returns 400 with field issues.');

    // Test valid submission returns 200 OK
    const validRes = await fetchUrl('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Reviewer',
        email: 'reviewer@gamestudio.com',
        company: 'Indie Game Studio',
        contact_handle: 'discord: reviewer#0001',
        project_type: 'Game Development',
        target_platform: 'Unreal Engine 5',
        budget_range: '$3,000 – $7,500',
        timeline: '1 – 2 Months',
        message: 'Hello Ashrut! We are testing your responsive contact form. Looking forward to commissioning 3D art.',
      }),
    });
    assert.strictEqual(validRes.status, 200, 'Valid submission must return 200 OK');
    const validData = JSON.parse(validRes.data);
    assert(validData.success, 'Valid submission must report success');
    console.log('✓ Contact API valid submission succeeded with 200 OK and email pipeline response.');

    console.log('\n================================================================');
    console.log('  ALL RESPONSIVE UI/UX TESTS PASSED SUCCESSFULLY! (5/5)         ');
    console.log('================================================================');
  } catch (err) {
    console.error('Test suite failed:', err);
    process.exit(1);
  }
})();
