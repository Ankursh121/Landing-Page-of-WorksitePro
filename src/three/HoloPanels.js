import * as THREE from 'three';

/**
 * Generates futuristic holographic panel textures using canvas drawing.
 */
export class HoloPanels {
  constructor() {
    this.canvasWidth = 512;
    this.canvasHeight = 512;
  }

  // Draw cyber grid background helper
  drawGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(0, 114, 255, 0.07)';
    ctx.lineWidth = 1;
    const step = 20;
    
    // Vertical lines
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Outer glowing border
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Corner brackets
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 6;
    const bracketSize = 25;
    
    // Top Left
    ctx.beginPath();
    ctx.moveTo(10 + bracketSize, 10);
    ctx.lineTo(10, 10);
    ctx.lineTo(10, 10 + bracketSize);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(w - 10 - bracketSize, 10);
    ctx.lineTo(w - 10, 10);
    ctx.lineTo(w - 10, 10 + bracketSize);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(10 + bracketSize, h - 10);
    ctx.lineTo(10, h - 10);
    ctx.lineTo(10, h - 10 - bracketSize);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(w - 10 - bracketSize, h - 10);
    ctx.lineTo(w - 10, h - 10);
    ctx.lineTo(w - 10, h - 10 - bracketSize);
    ctx.stroke();
  }

  createAttendanceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const ctx = canvas.getContext('2d');
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    // Dark semi-transparent background
    ctx.fillStyle = 'rgba(5, 7, 20, 0.85)';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid(ctx, w, h);

    // Glow effects setup
    ctx.shadowBlur = 15;

    // Header Text
    ctx.shadowColor = '#0072ff';
    ctx.fillStyle = '#0072ff';
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillText('// WORKSITEPRO: ATTENDANCE', 30, 50);

    ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = '#00f2fe';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('STATUS: SECURE_SYNC [ONLINE]', 30, 80);

    // Attendance List
    const workers = [
      { name: 'A. Mercer (Mistri)', status: 'PRESENT', time: '08:30 AM', color: '#39ff14' },
      { name: 'R. Sharma (Labour)', status: 'PRESENT', time: '08:45 AM', color: '#39ff14' },
      { name: 'J. Kumar (Labour)', status: 'PRESENT', time: '08:52 AM', color: '#39ff14' },
      { name: 'M. Ali (Labour)', status: 'PRESENT', time: '09:00 AM', color: '#39ff14' },
      { name: 'V. Singh (Labour)', status: 'ABSENT', time: '--:-- --', color: '#ff3333' }
    ];

    let startY = 140;
    workers.forEach((worker, i) => {
      // Row Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(30, startY - 25, w - 60, 45);

      // Glowing dot status
      ctx.shadowColor = worker.color;
      ctx.fillStyle = worker.color;
      ctx.beginPath();
      ctx.arc(50, startY - 3, 6, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText(worker.name, 75, startY + 2);

      ctx.fillStyle = '#8f9cae';
      ctx.font = '14px "Courier New", monospace';
      ctx.fillText(worker.time, w - 170, startY + 2);

      ctx.fillStyle = worker.color;
      ctx.fillText(worker.status, w - 100, startY + 2);

      startY += 65;
    });

    // Decorative loading block or scanner
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2fe';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, h - 60, w - 60, 30);
    
    ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
    ctx.fillRect(35, h - 55, (w - 70) * 0.72, 20); // 72% Loaded/Scanned
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText('REAL-TIME ATTENDANCE GPS SYNCED (97%)', 45, h - 41);

    const texture = new THREE.CanvasTexture(canvas);
    return { texture, canvas };
  }

  createPaymentsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const ctx = canvas.getContext('2d');
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    ctx.fillStyle = 'rgba(5, 7, 20, 0.85)';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid(ctx, w, h);

    ctx.shadowBlur = 15;

    // Header
    ctx.shadowColor = '#9b51e0';
    ctx.fillStyle = '#9b51e0';
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillText('// PAYOUT DISBURSEMENT', 30, 50);

    ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = '#00f2fe';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('GATEWAY: RAZORPAY INTEGRATED', 30, 80);

    // Large Numbers
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText('₹1,84,500.00', 30, 140);
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#8f9cae';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('TOTAL DISBURSED THIS WEEKS', 30, 165);

    // Mini Chart Area
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 360);
    ctx.lineTo(w - 50, 360);
    ctx.stroke();

    // Chart points
    const points = [
      { x: 50, y: 340, day: 'Mon' },
      { x: 120, y: 280, day: 'Tue' },
      { x: 190, y: 310, day: 'Wed' },
      { x: 260, y: 210, day: 'Thu' },
      { x: 330, y: 250, day: 'Fri' },
      { x: 400, y: 190, day: 'Sat' },
      { x: 462, y: 150, day: 'Sun' }
    ];

    // Draw area fill
    ctx.fillStyle = 'rgba(155, 81, 224, 0.2)';
    ctx.beginPath();
    ctx.moveTo(points[0].x, 360);
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, 360);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#9b51e0';
    ctx.strokeStyle = '#9b51e0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Draw dots and text
    points.forEach((pt) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#8f9cae';
      ctx.font = '12px "Courier New", monospace';
      ctx.fillText(pt.day, pt.x - 10, 380);
    });

    // Status indicators
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#39ff14';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('● TRANS_COMPLETED (100% SECURE)', 30, h - 50);

    const texture = new THREE.CanvasTexture(canvas);
    return { texture, canvas };
  }

  createMonitoringTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const ctx = canvas.getContext('2d');
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    ctx.fillStyle = 'rgba(5, 7, 20, 0.85)';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid(ctx, w, h);

    ctx.shadowBlur = 15;

    // Header
    ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillText('// RADAR: WORKFORCE MAP', 30, 50);

    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#39ff14';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('GPS TRACKING ACTIVE', 30, 80);

    // Draw radar circles in center
    const rx = w / 2;
    const ry = h / 2 + 30;
    const maxRadius = 130;

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;

    for (let r = 30; r <= maxRadius; r += 30) {
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(rx - maxRadius - 10, ry);
    ctx.lineTo(rx + maxRadius + 10, ry);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rx, ry - maxRadius - 10);
    ctx.lineTo(rx, ry + maxRadius + 10);
    ctx.stroke();

    // Radar scan lines (handled statically, animated slightly via rotation in 3D or static here)
    const scanAngle = (Date.now() / 1500) % (Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + Math.cos(scanAngle) * maxRadius, ry + Math.sin(scanAngle) * maxRadius);
    ctx.stroke();

    // Glow radar targets
    const targets = [
      { dx: 30, dy: -50, label: 'L_01' },
      { dx: -70, dy: 30, label: 'M_03' },
      { dx: 45, dy: 60, label: 'L_09' },
      { dx: -20, dy: -80, label: 'A_01' }
    ];

    targets.forEach((tgt) => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#39ff14';
      ctx.fillStyle = '#39ff14';
      ctx.beginPath();
      ctx.arc(rx + tgt.dx, ry + tgt.dy, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "Courier New", monospace';
      ctx.fillText(tgt.label, rx + tgt.dx + 8, ry + tgt.dy - 2);
    });

    // Panel overlay text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(30, h - 80, w - 60, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText('ACTIVE SITES: 04   ACTIVE WORKERS: 38   STABILITY: 99.8%', 45, h - 50);

    const texture = new THREE.CanvasTexture(canvas);
    return { texture, canvas };
  }

  createSecurityTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const ctx = canvas.getContext('2d');
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    ctx.fillStyle = 'rgba(5, 7, 20, 0.85)';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid(ctx, w, h);

    ctx.shadowBlur = 15;

    // Header
    ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillText('// SECURITY AUTH MATRIX', 30, 50);

    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#39ff14';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('ROLE-BASED PORTALS DEPLOYED', 30, 80);

    // Profile Details
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('USER: +91 92357 87767', 40, 140);
    ctx.fillStyle = '#39ff14';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('ACCESS LEVEL: OWNER [MAXIMUM_PRIVILEGES]', 40, 165);

    // User Roles Table
    const roles = [
      { name: 'OWNER', phone: '9235787767', auth: 'OTP SECURE', status: 'AUTHORIZED' },
      { name: 'ADMIN', phone: '1111111111', auth: 'OTP SECURE', status: 'AUTHORIZED' },
      { name: 'MISTRI', phone: '3333333333', auth: 'OTP SECURE', status: 'AUTHORIZED' },
      { name: 'LABOUR', phone: '2222222222', auth: 'OTP SECURE', status: 'AUTHORIZED' }
    ];

    let rY = 220;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(30, rY - 20, w - 60, 25);
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText('ROLE', 40, rY - 3);
    ctx.fillText('OTP PHONE', 110, rY - 3);
    ctx.fillText('METHOD', 230, rY - 3);
    ctx.fillText('GATEWAY STATUS', 340, rY - 3);

    rY += 30;
    roles.forEach((r) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px "Courier New", monospace';
      ctx.fillText(r.name, 40, rY);
      ctx.fillStyle = '#8f9cae';
      ctx.fillText(r.phone, 110, rY);
      ctx.fillText(r.auth, 230, rY);
      ctx.fillStyle = '#39ff14';
      ctx.fillText(r.status, 340, rY);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, rY + 8);
      ctx.lineTo(w - 30, rY + 8);
      ctx.stroke();

      rY += 35;
    });

    // Decorative fingerprint or security ring
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0072ff';
    ctx.strokeStyle = '#0072ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, h - 80, w - 60, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText('SYSTEM OK // MONGO_DB ENCRYPTED SYNC ACTIVE', 45, h - 50);

    const texture = new THREE.CanvasTexture(canvas);
    return { texture, canvas };
  }
}
