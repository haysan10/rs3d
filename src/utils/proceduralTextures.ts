// src/utils/proceduralTextures.ts
// Procedural Canvas Texture Generators for Hospital Architecture, Floors, Roads, and Grounds

import * as THREE from 'three';

// Cache generated textures so we don't recreate them on every render
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Seamless Hospital Vinyl/Terrazzo Tile Texture
 * Clean medical tile grid with subtle terrazzo specks and crisp grout lines
 */
export function getHospitalTileTexture(size = 512, tiles = 4, baseColor = '#F8FAFC', groutColor = '#CBD5E1'): THREE.CanvasTexture {
  const key = `tile_${tiles}_${baseColor}_${groutColor}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Fill base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Subtle terrazzo / linoleum noise specks
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Tile grout lines
  ctx.strokeStyle = groutColor;
  ctx.lineWidth = 3;
  const tileSize = size / tiles;
  for (let i = 0; i <= tiles; i++) {
    const pos = i * tileSize;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Operating Room / ICU Antimicrobial Medical Vinyl Texture
 * Hygienic sage green / teal tone with fine non-slip micro-texture
 */
export function getMedicalVinylTexture(color = '#0D9488'): THREE.CanvasTexture {
  const key = `vinyl_${color}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);

  // Add subtle hygienic vinyl flecks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Hospital Exterior Wall Texture
 * Architectural composite panel with subtle vertical seams and clean finish
 */
export function getHospitalWallTexture(): THREE.CanvasTexture {
  const key = 'wall_hospital';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth architectural off-white / light slate
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle architectural facade panel groove lines
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 256) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Warm Natural Wood Texture for Doors & Architectural Panels
 */
export function getWoodDoorTexture(): THREE.CanvasTexture {
  const key = 'wood_door';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Teak / Warm Oak base
  ctx.fillStyle = '#B45309';
  ctx.fillRect(0, 0, 256, 512);

  // Wood grain strokes
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * 512;
    ctx.strokeStyle = i % 2 === 0 ? '#92400E' : '#D97706';
    ctx.lineWidth = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 10);
    ctx.bezierCurveTo(80, y + 15, 180, y - 15, 256, y + 5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Asphalt Road Texture with Aggregate Noise for Hospital Driveway
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  const key = 'asphalt_road';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark asphalt base
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 512, 512);

  // High-frequency aggregate specks
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 24;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Interlocking Concrete Paving Stone Texture for Plazas and Sidewalks
 */
export function getPaverTexture(): THREE.CanvasTexture {
  const key = 'paver_plaza';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(0, 0, 256, 256);

  // Block grid with beveled borders
  const w = 32;
  const h = 64;
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;

  for (let y = 0; y < 256; y += h) {
    const shift = (y / h) % 2 === 0 ? 0 : w / 2;
    for (let x = -w; x < 256 + w; x += w) {
      ctx.strokeRect(x + shift, y, w, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Manicured Lawn Grass Texture for Landscaped Gardens
 */
export function getGrassTexture(): THREE.CanvasTexture {
  const key = 'grass_lawn';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#15803D'; // Rich emerald green
  ctx.fillRect(0, 0, 256, 256);

  // Grass blade variations
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.strokeStyle = Math.random() > 0.5 ? '#16A34A' : '#14532D';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - Math.random() * 6);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache.set(key, texture);
  return texture;
}
