/**
 * ====================================================================
 * ARIFULLAH PORTFOLIO - 3D ENGINE & BACKGROUND EFFECTS
 * ====================================================================
 * High-performance, lightweight Three.js 3D Constellation & Starfield
 * with automatic 2D Canvas fallback, visibility pause, and mobile
 * particle optimization.
 */

(function () {
  'use strict';

  const container = document.getElementById('bg-canvas-container');
  if (!container) return;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PARTICLE_COUNT = isMobile ? 35 : 90;
  const MAX_DISTANCE = isMobile ? 80 : 130;
  const ROTATION_SPEED = prefersReducedMotion ? 0.0002 : 0.0007;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let isRunning = true;

  window.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    isRunning = !document.hidden;
  });

  function initThreeJS() {
    if (typeof THREE === 'undefined') {
      initCanvas2DFallback();
      return;
    }

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 250;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
      container.appendChild(renderer.domElement);

      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const velocities = [];
      const particleRadius = isMobile ? 180 : 280;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * particleRadius * 2;
        positions[i3 + 1] = (Math.random() - 0.5) * particleRadius * 1.5;
        positions[i3 + 2] = (Math.random() - 0.5) * particleRadius;

        velocities.push({
          x: (Math.random() - 0.5) * 0.35,
          y: (Math.random() - 0.5) * 0.35,
          z: (Math.random() - 0.5) * 0.2
        });
      }

      const colors = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        if (i % 2 === 0) {
          // Neon Cyan: #22D3EE
          colors[i3] = 0.133;
          colors[i3 + 1] = 0.827;
          colors[i3 + 2] = 0.933;
        } else {
          // Electric Violet: #8B5CF6
          colors[i3] = 0.545;
          colors[i3 + 1] = 0.361;
          colors[i3 + 2] = 0.965;
        }
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 2.5 : 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particleSystem);

      const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6);
      const lineColors = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6);
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
      lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

      const lineMaterial = new THREE.LineSegmentsMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
      });

      const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lineMesh);

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener('resize', onWindowResize, { passive: true });

      function animate() {
        requestAnimationFrame(animate);
        if (!isRunning) return;

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        scene.rotation.y += ROTATION_SPEED + mouseX * 0.02;
        scene.rotation.x += (mouseY - scene.rotation.x) * 0.02;

        const posAttr = particleGeometry.attributes.position;
        const posArray = posAttr.array;

        let vertexCount = 0;
        let colorCount = 0;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          posArray[i3] += velocities[i].x;
          posArray[i3 + 1] += velocities[i].y;
          posArray[i3 + 2] += velocities[i].z;

          const limitX = particleRadius;
          const limitY = particleRadius * 0.8;
          const limitZ = particleRadius * 0.6;

          if (posArray[i3] < -limitX || posArray[i3] > limitX) velocities[i].x *= -1;
          if (posArray[i3 + 1] < -limitY || posArray[i3 + 1] > limitY) velocities[i].y *= -1;
          if (posArray[i3 + 2] < -limitZ || posArray[i3 + 2] > limitZ) velocities[i].z *= -1;

          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const j3 = j * 3;
            const dx = posArray[i3] - posArray[j3];
            const dy = posArray[i3 + 1] - posArray[j3 + 1];
            const dz = posArray[i3 + 2] - posArray[j3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < MAX_DISTANCE) {
              const alpha = 1.0 - dist / MAX_DISTANCE;

              linePositions[vertexCount++] = posArray[i3];
              linePositions[vertexCount++] = posArray[i3 + 1];
              linePositions[vertexCount++] = posArray[i3 + 2];

              linePositions[vertexCount++] = posArray[j3];
              linePositions[vertexCount++] = posArray[j3 + 1];
              linePositions[vertexCount++] = posArray[j3 + 2];

              const r1 = (i % 2 === 0) ? 0.133 : 0.545;
              const g1 = (i % 2 === 0) ? 0.827 : 0.361;
              const b1 = (i % 2 === 0) ? 0.933 : 0.965;

              const r2 = (j % 2 === 0) ? 0.133 : 0.545;
              const g2 = (j % 2 === 0) ? 0.827 : 0.361;
              const b2 = (j % 2 === 0) ? 0.933 : 0.965;

              lineColors[colorCount++] = r1 * alpha;
              lineColors[colorCount++] = g1 * alpha;
              lineColors[colorCount++] = b1 * alpha;

              lineColors[colorCount++] = r2 * alpha;
              lineColors[colorCount++] = g2 * alpha;
              lineColors[colorCount++] = b2 * alpha;
            }
          }
        }

        posAttr.needsUpdate = true;
        lineGeometry.setDrawRange(0, vertexCount / 3);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;

        renderer.render(scene, camera);
      }

      animate();

    } catch (err) {
      console.warn('WebGL initialization failed, switching to 2D Canvas fallback:', err);
      initCanvas2DFallback();
    }
  }

  function initCanvas2DFallback() {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.className = 'canvas-2d-bg';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const points = [];
    const count = isMobile ? 30 : 60;

    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1
      });
    }

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    function draw2D() {
      if (!isRunning) {
        requestAnimationFrame(draw2D);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.75)' : 'rgba(139, 92, 246, 0.75)';
        ctx.fill();
      }

      requestAnimationFrame(draw2D);
    }

    draw2D();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
  } else {
    initThreeJS();
  }
})();
