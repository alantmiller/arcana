import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { symbolMap } from './arcana.js';

export class CharacterTransformation {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3a3a52);

    this.camera = new THREE.PerspectiveCamera(
      75, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    this.camera.position.z = 15;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    this.particles = [];
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.particles.forEach((particle, i) => {
      particle.rotation.x += 0.01;
      particle.rotation.y += 0.01;
      particle.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
    });

    this.renderer.render(this.scene, this.camera);
  }

  onTextInput(text) {
    this.particles.forEach(p => this.scene.remove(p));
    this.particles = [];

    if (!text) return;

    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);

    bytes.forEach((byte, i) => {
      const hex = byte.toString(16).padStart(2, '0');
      const symbol1 = symbolMap[hex[0]];
      const symbol2 = symbolMap[hex[1]];

      [symbol1, symbol2].forEach((symbol, j) => {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({
          color: j === 0 ? 0x8b5cf6 : 0x06b6d4,
          emissive: j === 0 ? 0x8b5cf6 : 0x06b6d4,
          emissiveIntensity: 0.3,
        });

        const particle = new THREE.Mesh(geometry, material);
        const angle = (i * 2 + j) * 0.5;
        const radius = 5;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.y = (i * 2 + j) * 0.8 - 5;
        particle.position.z = Math.sin(angle) * radius;

        this.scene.add(particle);
        this.particles.push(particle);
      });
    });
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.particles.forEach(p => this.scene.remove(p));
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export class HexPipeline {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3a3a52);

    this.camera = new THREE.PerspectiveCamera(
      75, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    this.camera.position.set(10, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.pipeline = new THREE.Group();
    this.scene.add(this.pipeline);

    const stage1 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.2 })
    );
    stage1.position.x = -6;
    this.pipeline.add(stage1);

    const stage2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 2, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.2 })
    );
    stage2.position.x = 0;
    this.pipeline.add(stage2);

    const stage3 = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.2),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.2 })
    );
    stage3.position.x = 6;
    this.pipeline.add(stage3);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 10, 10);
    this.scene.add(pointLight);

    this.animate();
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.pipeline.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
  }

  onTextInput(text) {}

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export class SymbolAssembly {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3a3a52);

    this.camera = new THREE.PerspectiveCamera(
      75, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.symbolMeshes = new Map();

    const symbols = Object.values(symbolMap);
    symbols.forEach((symbol, i) => {
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4a4a62,
        emissive: 0x4a4a62,
        emissiveIntensity: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const angle = (i / symbols.length) * Math.PI * 2;
      const radius = 10;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;
      mesh.position.z = -5;

      this.scene.add(mesh);
      this.symbolMeshes.set(symbol, mesh);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight);

    this.animate();
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.symbolMeshes.forEach((mesh) => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    });

    this.renderer.render(this.scene, this.camera);
  }

  onTextInput(text) {
    this.symbolMeshes.forEach((mesh) => {
      mesh.material.emissive.setHex(0x4a4a62);
      mesh.material.emissiveIntensity = 0.1;
    });

    if (!text) return;

    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const usedSymbols = new Set(hex.split('').map(h => symbolMap[h]));

    usedSymbols.forEach(symbol => {
      const mesh = this.symbolMeshes.get(symbol);
      if (mesh) {
        mesh.material.emissive.setHex(0x06b6d4);
        mesh.material.emissiveIntensity = 0.5;
      }
    });
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
