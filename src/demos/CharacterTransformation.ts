import * as THREE from 'npm:three@^0.160.0';
import { symbolMap } from '../arcana.ts';

export class CharacterTransformation {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Mesh[] = [];
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
    this.camera.position.z = 15;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    this.animate();

    // Handle resize
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

    // Rotate and float particles
    this.particles.forEach((particle, i) => {
      particle.rotation.x += 0.01;
      particle.rotation.y += 0.01;
      particle.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
    });

    this.renderer.render(this.scene, this.camera);
  }

  public onTextInput(text: string) {
    // Clear existing particles
    this.particles.forEach(p => this.scene.remove(p));
    this.particles = [];

    if (!text) return;

    // Create particles for each character
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);

    bytes.forEach((byte, i) => {
      const hex = byte.toString(16).padStart(2, '0');
      const symbol1 = symbolMap[hex[0] as keyof typeof symbolMap];
      const symbol2 = symbolMap[hex[1] as keyof typeof symbolMap];

      // Create text geometry for symbols
      [symbol1, symbol2].forEach((symbol, j) => {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({
          color: j === 0 ? 0x8b5cf6 : 0x06b6d4,
          emissive: j === 0 ? 0x8b5cf6 : 0x06b6d4,
          emissiveIntensity: 0.3,
        });

        const particle = new THREE.Mesh(geometry, material);

        // Position in a spiral
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

  public destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles.forEach(p => this.scene.remove(p));
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
