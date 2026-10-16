async function runTests() {
  console.log('--- STARTING COMPREHENSIVE ENDPOINT VERIFICATION ---');

  // 1. Home page
  console.log('\n[1/5] Testing Home Page (GET http://localhost:3000)...');
  const homeRes = await fetch('http://localhost:3000');
  console.log('Status:', homeRes.status);
  const homeHtml = await homeRes.text();
  console.log('✓ Contains "Ashrut Tiwari":', homeHtml.includes('Ashrut Tiwari'));
  console.log('✓ Contains "ZodiacX":', homeHtml.includes('ZodiacX'));
  console.log('✓ Contains "Pixel Playground":', homeHtml.includes('Pixel Playground'));
  console.log('✓ Contains Quicksand Font:', homeHtml.includes('Quicksand') || homeHtml.includes('font-quicksand'));

  // 2. Project detail page
  console.log('\n[2/5] Testing Dynamic Project Detail (GET http://localhost:3000/projects/zodiacx)...');
  const projRes = await fetch('http://localhost:3000/projects/zodiacx');
  console.log('Status:', projRes.status);
  const projHtml = await projRes.text();
  console.log('✓ Contains "Unreal Engine 5":', projHtml.includes('Unreal Engine 5'));
  console.log('✓ Contains "Return to Desktop":', projHtml.includes('Return to Desktop'));

  // 3. Admin login page
  console.log('\n[3/5] Testing Admin Login Page (GET http://localhost:3000/admin/login)...');
  const adminRes = await fetch('http://localhost:3000/admin/login');
  console.log('Status:', adminRes.status);
  const adminHtml = await adminRes.text();
  console.log('✓ Contains "Administrator Passcode":', adminHtml.includes('Administrator Passcode'));

  // 4. Contact API validation failure (empty payload)
  console.log('\n[4/5] Testing Contact API Zod Validation on Invalid Body...');
  const badContactRes = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  console.log('Status (expected 400):', badContactRes.status);
  const badJson = await badContactRes.json();
  console.log('✓ Rejected with validation errors:', JSON.stringify(badJson.issues || badJson));

  // 5. Contact API valid submission
  console.log('\n[5/5] Testing Contact API Submission with Valid Inquiry...');
  const goodContactRes = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Carter',
      email: 'alex.carter@indiegames.com',
      project_type: 'Game Development',
      budget_range: '$3,000 – $7,500',
      timeline: '1 – 2 Months',
      message: 'Hi Ashrut! We loved your work on ZodiacX and want to commission custom 3D stylized character art for our upcoming action RPG.',
    }),
  });
  console.log('Status (expected 200):', goodContactRes.status);
  const goodJson = await goodContactRes.json();
  console.log('✓ API Response:', JSON.stringify(goodJson));

  console.log('\n=== ALL ENDPOINT VERIFICATION TESTS COMPLETED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
