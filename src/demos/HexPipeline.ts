import * as THREE from 'three';

export class HexPipeline {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private pipeline: THREE.Group;
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
    this.camera.position.set(10, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Create pipeline stages
    this.pipeline = new THREE.Group();
    this.scene.add(this.pipeline);

    // Stage 1: Text (blue cubes)
    const stage1 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.2 })
    );
    stage1.position.x = -6;
    this.pipeline.add(stage1);

    // Stage 2: Hex (orange cylinders)
    const stage2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 2, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.2 })
    );
    stage2.position.x = 0;
    this.pipeline.add(stage2);

    // Stage 3: Symbols (purple shapes)
    const stage3 = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.2),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.2 })
    );
    stage3.position.x = 6;
    this.pipeline.add(stage3);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 10, 10);
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

    // Rotate pipeline slowly
    this.pipeline.rotation.y += 0.005;

    this.renderer.render(this.scene, this.camera);
  }

  public onTextInput(text: string) {
    // Pipeline visualization doesn't change with input (it's the process visualization)
    // Could add flowing particles here in future
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
