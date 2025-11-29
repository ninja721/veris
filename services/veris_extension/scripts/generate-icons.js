/**
 * Generate professional extension icons
 */
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Premium gradient colors (inspired by Apple, Google, Uber)
const colors = {
  primary: '#667eea',    // Purple
  secondary: '#764ba2',  // Deep purple
  accent: '#f093fb',     // Pink
  highlight: '#4facfe'   // Blue
};

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(0.5, colors.secondary);
  gradient.addColorStop(1, colors.accent);

  // Draw rounded rectangle background
  const radius = size * 0.2;
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.fill();

  // Add subtle shine effect
  const shine = ctx.createLinearGradient(0, 0, 0, size * 0.5);
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = shine;
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.fill();

  // Draw icon symbol (lightning bolt for "fast")
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = size * 0.05;
  ctx.shadowOffsetY = size * 0.02;

  const centerX = size / 2;
  const centerY = size / 2;
  const scale = size / 100;

  // Lightning bolt path
  ctx.beginPath();
  ctx.moveTo(centerX + 8 * scale, centerY - 25 * scale);
  ctx.lineTo(centerX - 5 * scale, centerY + 5 * scale);
  ctx.lineTo(centerX + 5 * scale, centerY + 5 * scale);
  ctx.lineTo(centerX - 8 * scale, centerY + 25 * scale);
  ctx.lineTo(centerX + 15 * scale, centerY - 5 * scale);
  ctx.lineTo(centerX + 5 * scale, centerY - 5 * scale);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Generate icons
const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '..', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(iconsDir, `${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Generated ${size}x${size} icon`);
});

console.log('🎉 All icons generated successfully!');
