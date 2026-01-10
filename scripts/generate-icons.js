const sharp = require('sharp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Create a minimalist "K" icon with newspaper aesthetic
async function generateIcons() {
  // Main icon SVG - Clean, bold "K" on white background
  const iconSvg = `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" fill="#FFFFFF"/>
      <text x="512" y="680" 
            font-family="Georgia, Times, serif" 
            font-size="600" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="#000000">K</text>
      <line x1="200" y1="850" x2="824" y2="850" stroke="#000000" stroke-width="12"/>
      <line x1="200" y1="890" x2="650" y2="890" stroke="#000000" stroke-width="8"/>
    </svg>
  `;

  // Adaptive icon foreground (transparent background, just the K)
  const adaptiveSvg = `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <text x="512" y="620" 
            font-family="Georgia, Times, serif" 
            font-size="500" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="#000000">K</text>
      <line x1="262" y1="750" x2="762" y2="750" stroke="#000000" stroke-width="10"/>
      <line x1="262" y1="785" x2="600" y2="785" stroke="#000000" stroke-width="6"/>
    </svg>
  `;

  // Splash icon - centered K with minimal design
  const splashSvg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="260" 
            font-family="Georgia, Times, serif" 
            font-size="220" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="#000000">K</text>
      <line x1="80" y1="320" x2="320" y2="320" stroke="#000000" stroke-width="6"/>
      <line x1="80" y1="345" x2="250" y2="345" stroke="#000000" stroke-width="4"/>
    </svg>
  `;

  // Favicon
  const faviconSvg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="#FFFFFF"/>
      <text x="24" y="35" 
            font-family="Georgia, Times, serif" 
            font-size="32" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="#000000">K</text>
    </svg>
  `;

  try {
    // Generate main icon (1024x1024)
    await sharp(Buffer.from(iconSvg))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(ASSETS_DIR, 'icon.png'));
    console.log('✓ Generated icon.png (1024x1024)');

    // Generate adaptive icon foreground (1024x1024)
    await sharp(Buffer.from(adaptiveSvg))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));
    console.log('✓ Generated adaptive-icon.png (1024x1024)');

    // Generate splash icon (400x400)
    await sharp(Buffer.from(splashSvg))
      .resize(400, 400)
      .png()
      .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
    console.log('✓ Generated splash-icon.png (400x400)');

    // Generate favicon (48x48)
    await sharp(Buffer.from(faviconSvg))
      .resize(48, 48)
      .png()
      .toFile(path.join(ASSETS_DIR, 'favicon.png'));
    console.log('✓ Generated favicon.png (48x48)');

    console.log('\n🎉 All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

