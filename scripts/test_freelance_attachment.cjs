// scripts/test_freelance_attachment.cjs
// Tests freelance form submission with company, target platform, and PDF attachment

async function testFreelanceAttachment() {
  console.log('--- TESTING FREELANCE CONTACT FORM WITH PDF ATTACHMENT ---');

  // Create sample dummy PDF base64 (representing a Game Design Document / brief)
  const dummyPdfContent = '%PDF-1.4 sample game design document and freelance brief for Ashrut Tiwari';
  const base64Pdf = Buffer.from(dummyPdfContent).toString('base64');

  const payload = {
    name: 'Sarah Connor',
    email: 'sarah@cyberdynegames.com',
    company: 'Cyberdyne Interactive Studios',
    contact_handle: 'discord: @sarah_cyberdyne',
    project_type: 'Game Development',
    target_platform: 'Unreal Engine 5',
    budget_range: '$3,000 – $7,500',
    timeline: '1 – 2 Months',
    message: 'We are developing a fast-paced stylized cyberpunk boss rush game and need Ashrut to implement boss AI state machines, movement mechanics, and custom Niagara visual effects.',
    attachment: {
      fileName: 'Cyberdyne_BossRush_GDD_Brief.pdf',
      fileSize: Buffer.byteLength(dummyPdfContent),
      fileType: 'application/pdf',
      base64: `data:application/pdf;base64,${base64Pdf}`,
    },
  };

  console.log('Sending freelance inquiry with PDF brief to http://localhost:3000/api/contact ...');
  const res = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Response Status:', res.status);
  const data = await res.json();
  console.log('Response JSON:', JSON.stringify(data, null, 2));

  if (res.status === 200 && data.success && data.targetEmail === 'ashrut.tiwari2004@gmail.com') {
    console.log('✓ SUCCESS: Freelance brief received and processed for ashrut.tiwari2004@gmail.com!');
    if (data.attachmentSaved) {
      console.log('✓ SUCCESS: PDF brief attachment saved to disk at:', data.attachmentUrl);
    }
  } else {
    console.error('✗ FAILED: Unexpected response:', data);
    process.exit(1);
  }
}

testFreelanceAttachment().catch((err) => {
  console.error('Test crashed:', err);
  process.exit(1);
});
