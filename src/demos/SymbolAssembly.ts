import * as THREE from 'npm:three@^0.160.0';
import { symbolMap } from '../arcana.ts';

export class SymbolAssembly {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private symbolMeshes: Map<string, THREE.Mesh> = new Map();
  private animationId: number | null = null;

  constructor(private container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3a3a52);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Create floating symbols (all 16)
    const symbols = Object.values(symbolMap);
    symbols.forEach((symbol, i) => {
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4a4a62,
        emissive: 0x4a4a62,
        emissiveIntensity: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Arrange in a circle
      const angle = (i / symbols.length) * Math.PI * 2;
      const radius = 10;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;
      mesh.position.z = -5;

      this.scene.add(mesh);
      this.symbolMeshes.set(symbol, mesh);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight);

    this.animate();
    window.addEventListener('resize', () => this.onResize());
  }

  private onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Slow rotation of all symbols
    this.symbolMeshes.forEach((mesh) => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    });

    this.renderer.render(this.scene, this.camera);
  }

  public onTextInput(text: string) {
    // Reset all symbols to dim
    this.symbolMeshes.forEach((mesh) => {
      (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x4a4a62);
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
    });

    if (!text) return;

    // Encode text and highlight used symbols
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const usedSymbols = new Set(hex.split('').map(h => symbolMap[h as keyof typeof symbolMap]));

    usedSymbols.forEach(symbol => {
      const mesh = this.symbolMeshes.get(symbol);
      if (mesh) {
        (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x06b6d4);
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
      }
    });
  }

  public destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
