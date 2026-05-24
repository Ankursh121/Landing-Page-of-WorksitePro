import * as THREE from 'three';
import { HoloPanels } from './HoloPanels.js';

export class SceneManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scroll = { y: 0, targetY: 0 };

    this.initScene();
    this.initLighting();
    this.initGridFloor();
    this.initParticles();
    this.initHoloPanels();
    this.initCentralStructure();
    
    this.setupEvents();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();

    // Subtle dark blue fog to fade elements into distance
    this.scene.fog = new THREE.FogExp2(0x050714, 0.015);

    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Group to hold all interactive floating objects (except grid/particles)
    this.holoGroup = new THREE.Group();
    this.scene.add(this.holoGroup);
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    // Neon blue light from top left
    this.cyanLight = new THREE.PointLight(0x00f2fe, 2, 50);
    this.cyanLight.position.set(-10, 10, 5);
    this.scene.add(this.cyanLight);

    // Neon purple light from top right
    this.purpleLight = new THREE.PointLight(0x9b51e0, 2, 50);
    this.purpleLight.position.set(10, 10, 5);
    this.scene.add(this.purpleLight);

    // Spotlight pointing at central elements
    this.spotLight = new THREE.SpotLight(0xffffff, 1.5, 30, Math.PI / 6, 0.5, 1);
    this.spotLight.position.set(0, 5, 10);
    this.scene.add(this.spotLight);
  }

  initGridFloor() {
    const gridSize = 250;
    const gridDivisions = 80;
    
    // Custom grid with electric blue and deep purple lines
    this.grid = new THREE.GridHelper(gridSize, gridDivisions, 0x00f2fe, 0x120e2e);
    this.grid.position.y = -6;
    this.grid.position.z = 0;
    
    // Set material opacity for grid
    this.grid.material.transparent = true;
    this.grid.material.opacity = 0.25;
    this.scene.add(this.grid);
  }

  initParticles() {
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count * 3; i += 3) {
      // Wide scattering
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 50;

      speeds.push(0.02 + Math.random() * 0.05);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSpeeds = speeds;

    // Small glowing cyan squares/dots
    const material = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  initHoloPanels() {
    this.holoPanelsInst = new HoloPanels();
    this.panels = [];

    // Create textures
    const attData = this.holoPanelsInst.createAttendanceTexture();
    const payData = this.holoPanelsInst.createPaymentsTexture();
    const monData = this.holoPanelsInst.createMonitoringTexture();
    const secData = this.holoPanelsInst.createSecurityTexture();

    // Map info for panels
    const panelConfigs = [
      { 
        texture: attData.texture, 
        canvas: attData.canvas,
        type: 'attendance',
        pos: { x: 3.5, y: 1.8, z: -1 }, 
        rot: { x: -0.05, y: -0.3, z: 0.02 } 
      },
      { 
        texture: payData.texture, 
        canvas: payData.canvas,
        type: 'payments',
        pos: { x: 5.0, y: -1.5, z: 0.5 }, 
        rot: { x: 0.1, y: -0.4, z: -0.05 } 
      },
      { 
        texture: monData.texture, 
        canvas: monData.canvas,
        type: 'monitoring',
        pos: { x: 2.2, y: -2.2, z: 2.0 }, 
        rot: { x: 0.15, y: -0.2, z: 0.05 } 
      },
      { 
        texture: secData.texture, 
        canvas: secData.canvas,
        type: 'security',
        pos: { x: 4.5, y: 3.2, z: -3.0 }, 
        rot: { x: -0.1, y: -0.4, z: 0.0 } 
      }
    ];

    const planeGeom = new THREE.PlaneGeometry(3.6, 3.6);

    panelConfigs.forEach((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        map: cfg.texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(planeGeom, mat);
      mesh.position.set(cfg.pos.x, cfg.pos.y, cfg.pos.z);
      mesh.rotation.set(cfg.rot.x, cfg.rot.y, cfg.rot.z);
      
      // Store reference to animate textures or float
      mesh.userData = {
        type: cfg.type,
        canvas: cfg.canvas,
        texture: cfg.texture,
        initialY: cfg.pos.y,
        floatSpeed: 0.8 + Math.random() * 0.6,
        floatAmplitude: 0.15 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2
      };

      this.holoGroup.add(mesh);
      this.panels.push(mesh);
    });

    this.adjustLayoutForScreen();
  }

  initCentralStructure() {
    this.structureGroup = new THREE.Group();
    // Center it on the right side with the panels
    this.structureGroup.position.set(4, 0, 0);
    this.holoGroup.add(this.structureGroup);

    // Glowing construction wireframe cylinder (like a high-tech scaffolding tower)
    const geom = new THREE.CylinderGeometry(1.2, 1.6, 4.5, 6, 4, true);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x0072ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    this.tower = new THREE.Mesh(geom, mat);
    this.structureGroup.add(this.tower);

    // Floating rings around the tower (gyroscopic look)
    this.rings = [];
    const ringColors = [0x00f2fe, 0x9b51e0, 0x39ff14];
    const ringRadii = [2.0, 2.5, 3.0];
    
    ringRadii.forEach((radius, idx) => {
      const ringGeom = new THREE.RingGeometry(radius - 0.04, radius + 0.04, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx % ringColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      // Randomize initial tilt
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      
      ring.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.005,
        rotSpeedY: (Math.random() - 0.5) * 0.005
      };

      this.structureGroup.add(ring);
      this.rings.push(ring);
    });
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.adjustLayoutForScreen();
  }

  adjustLayoutForScreen() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Position the 3D holograms lower in the mobile viewport to sit beautifully behind/below the left-aligned hero text
      this.holoGroup.position.set(0, -2, -2.5);
      this.holoGroup.scale.set(0.75, 0.75, 0.75);

      if (this.structureGroup) {
        this.structureGroup.position.set(0, -2, -2.5);
        this.structureGroup.scale.set(0.65, 0.65, 0.65);
      }

      // Arrange panels to float elegantly with a higher, premium opacity
      this.panels.forEach((p) => {
        p.material.opacity = 0.7; // Crisp but readable background opacity
        if (p.userData.type === 'attendance') p.position.set(-1.0, 1.8, -1.5);
        if (p.userData.type === 'payments') p.position.set(1.2, 0.5, -0.8);
        if (p.userData.type === 'monitoring') p.position.set(-0.8, -0.8, 0.2);
        if (p.userData.type === 'security') p.position.set(1.0, -2.2, -2.0);
        p.rotation.set(0, 0, 0); // Keep them parallel to the viewport for clarity
      });

    } else {
      // Desktop positioning (pushed to the right side of the screen)
      this.holoGroup.position.set(0, 0, 0);
      this.holoGroup.scale.set(1.0, 1.0, 1.0);

      if (this.structureGroup) {
        this.structureGroup.position.set(4, 0, 0);
        this.structureGroup.scale.set(1.0, 1.0, 1.0);
      }

      this.panels.forEach((p) => {
        p.material.opacity = 0.9;
        // Reset positions
        if (p.userData.type === 'attendance') {
          p.position.set(3.5, 1.8, -1);
          p.rotation.set(-0.05, -0.3, 0.02);
        }
        if (p.userData.type === 'payments') {
          p.position.set(5.0, -1.5, 0.5);
          p.rotation.set(0.1, -0.4, -0.05);
        }
        if (p.userData.type === 'monitoring') {
          p.position.set(2.2, -2.2, 2.0);
          p.rotation.set(0.15, -0.2, 0.05);
        }
        if (p.userData.type === 'security') {
          p.position.set(4.5, 3.2, -3.0);
          p.rotation.set(-0.1, -0.4, 0.0);
        }
      });
    }
  }

  onMouseMove(e) {
    // Normalize coordinates (-1 to 1)
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onScroll() {
    this.scroll.targetY = window.scrollY;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = Date.now() * 0.001;

    // 1. Smoothly interpolate mouse for parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Apply mouse parallax to the entire group
    this.holoGroup.rotation.y = this.mouse.x * 0.15;
    this.holoGroup.rotation.x = -this.mouse.y * 0.12;

    // Also tilt camera slightly for dynamic depth
    this.camera.position.x = this.mouse.x * 0.5;
    this.camera.position.y = this.mouse.y * 0.5;

    // 2. Infinite scrolling grid
    if (this.grid) {
      // Shift grid Z position relative to scroll speed or constant speed
      this.grid.position.z = (this.grid.position.z + 0.02) % 3.125; // 3.125 is the grid cell width spacing
    }

    // 3. Floating effect for panels
    this.panels.forEach((p) => {
      const uData = p.userData;
      p.position.y = uData.initialY + Math.sin(time * uData.floatSpeed + uData.phase) * uData.floatAmplitude;
      
      // Gentle self-wobble
      p.rotation.z += Math.sin(time * 0.2 + uData.phase) * 0.0003;
      p.rotation.x += Math.cos(time * 0.15 + uData.phase) * 0.0002;

      // Dynamic Canvas Redraws
      if (uData.type === 'monitoring' && uData.canvas) {
        // Redraw radar sweep
        const ctx = uData.canvas.getContext('2d');
        const w = uData.canvas.width;
        const h = uData.canvas.height;
        const rx = w / 2;
        const ry = h / 2 + 30;
        const maxRadius = 130;

        // Clear only center radar sweep area
        ctx.fillStyle = 'rgba(5, 7, 20, 0.1)'; // sweep persistence trails
        ctx.beginPath();
        ctx.arc(rx, ry, maxRadius, 0, Math.PI * 2);
        ctx.fill();

        // Redraw sweep line
        const scanAngle = (Date.now() / 1500) % (Math.PI * 2);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f2fe';
        
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + Math.cos(scanAngle) * maxRadius, ry + Math.sin(scanAngle) * maxRadius);
        ctx.stroke();

        // Notify Three.js to reload texture
        uData.texture.needsUpdate = true;
      }
    });

    // 4. Rotate Central Construction Structure
    if (this.tower) {
      this.tower.rotation.y = time * 0.15;
    }

    if (this.rings) {
      this.rings.forEach((ring) => {
        ring.rotation.x += ring.userData.rotSpeedX;
        ring.rotation.y += ring.userData.rotSpeedY;
      });
    }

    // 5. Scroll-linked camera modifications
    // Smooth scroll interpolation
    this.scroll.y += (this.scroll.targetY - this.scroll.y) * 0.06;
    
    // Map scroll.y to camera position & grid depth
    // At scrollY = 0, camera.z = 8.
    // As we scroll, push camera down and tilt it, showing depth
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 2000;
    const scrollPercent = this.scroll.y / maxScroll;
    
    // Camera moves down and slightly rotates
    this.camera.position.z = 8 - scrollPercent * 2.5; // zooms in slightly as we scroll
    this.camera.position.y = -scrollPercent * 6; // slides down with scroll
    
    // Keep camera looking at the shifting center
    this.camera.lookAt(0, -scrollPercent * 6, 0);

    // 6. Slow drift for particles
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const count = positions.length;
      
      for (let i = 0; i < count; i += 3) {
        // Slowly move upward
        positions[i + 1] += this.particleSpeeds[i / 3] * 0.1;
        // Drift in wind (X-axis)
        positions[i] += Math.sin(time + i) * 0.002;

        // Reset if particles go too high or too far
        if (positions[i + 1] > 20) {
          positions[i + 1] = -20;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
