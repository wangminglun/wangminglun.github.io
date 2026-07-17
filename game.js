/**
 * NEON CYBER TENNIS - CORE GAME LOGIC
 */

// ==========================================================================
// Sound Effects Synthesizer (Web Audio API)
// ==========================================================================
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playHit(isPlayer = true) {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const startFreq = isPlayer ? 350 : 280;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    playBounce() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);
    }

    playNet() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playSmash() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Synth frequency sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);

        // White noise generation
        const bufferSize = this.ctx.sampleRate * 0.22;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
        noise.start(now);
        noise.stop(now + 0.23);
    }

    playScore(isPlayer = true) {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        if (isPlayer) {
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.setValueAtTime(0.2, now + 0.16);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        } else {
            osc.frequency.setValueAtTime(392.00, now); // G4
            osc.frequency.setValueAtTime(349.23, now + 0.1); // F4
            osc.frequency.setValueAtTime(311.13, now + 0.2); // Eb4
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.setValueAtTime(0.2, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        }

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    }

    playWin() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
        });
    }

    playLose() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [220.00, 207.65, 196.00, 146.83];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            gain.gain.setValueAtTime(0.15, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.45);
        });
    }
}

const sfx = new SoundEffects();

// ==========================================================================
// Game Engine Configuration & Constants
// ==========================================================================
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Normalized game physics coordinates
// X: 0 (left boundary) to 800 (right boundary)
// Y: 0 (AI end) to 1000 (Player end). Net is at Y = 500
// Z: 0 (table surface) to height
const GAME_X_MAX = 800;
const GAME_Y_MAX = 1000;
const GAME_NET_Y = 500;

const GRAVITY = 0.22;
const BALL_BOUNCE_RESTITUTION = 0.82;
const MAX_SCORE = 11;

// Perspective parameters
const TABLE_TOP_Y = 210;
const TABLE_BOTTOM_Y = 530;
const TABLE_TOP_WIDTH = 300;
const TABLE_BOTTOM_WIDTH = 640;

// AI Configurations
const AI_DIFFICULTIES = {
    easy: { speed: 4.5, latency: 15, error: 40 },
    medium: { speed: 6.8, latency: 9, error: 22 },
    hard: { speed: 9.5, latency: 4, error: 11 },
    legend: { speed: 14.5, latency: 0, error: 2 }
};

// ==========================================================================
// Game State Classes
// ==========================================================================
class Ball {
    constructor() {
        this.reset();
    }

    reset(serveToPlayer = true) {
        this.x = GAME_X_MAX / 2;
        this.y = serveToPlayer ? 150 : 850;
        this.z = 150; // Serve from in the air
        
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = serveToPlayer ? 6 : -6;
        this.vz = 0;

        this.spinX = 0; // Horizontal spin factor (causes curve)
        this.radius = 8; // Physical radius
        this.isSmash = false;
        
        this.bouncesOnPlayerSide = 0;
        this.bouncesOnAiSide = 0;
        this.lastHitter = serveToPlayer ? 'ai' : 'player';
        this.active = true;
    }

    update() {
        if (!this.active) return;

        // Apply velocities
        this.x += this.vx;
        
        // Apply spin curve in flight
        if (Math.abs(this.spinX) > 0.05) {
            this.vx += this.spinX * 0.05;
            this.spinX *= 0.98; // Spin slowly decays in the air
        }
        
        this.y += this.vy;
        this.vz -= GRAVITY;
        this.z += this.vz;

        // X boundaries (wall bounces outside table area)
        if (this.x < 30) {
            this.x = 30;
            this.vx = -this.vx * 0.85;
            sfx.playBounce();
        } else if (this.x > GAME_X_MAX - 30) {
            this.x = GAME_X_MAX - 30;
            this.vx = -this.vx * 0.85;
            sfx.playBounce();
        }
    }
}

class Paddle {
    constructor(y, color) {
        this.x = GAME_X_MAX / 2;
        this.y = y;
        this.width = 110;
        this.height = 16;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.targetX = GAME_X_MAX / 2;
    }

    update(targetX, targetY = null, maxSpeedX = null, maxSpeedY = null) {
        const prevX = this.x;
        const prevY = this.y;

        // X-axis movement
        if (maxSpeedX !== null) {
            const diffX = targetX - this.x;
            if (Math.abs(diffX) > 1) {
                this.x += Math.sign(diffX) * Math.min(Math.abs(diffX), maxSpeedX);
            }
        } else {
            // Instant movement (for player mouse)
            this.x = targetX;
        }
        // Constrain bounds
        this.x = Math.max(this.width / 2 + 30, Math.min(GAME_X_MAX - this.width / 2 - 30, this.x));
        this.vx = this.x - prevX;

        // Y-axis movement
        if (targetY !== null) {
            if (maxSpeedY !== null) {
                const diffY = targetY - this.y;
                if (Math.abs(diffY) > 1) {
                    this.y += Math.sign(diffY) * Math.min(Math.abs(diffY), maxSpeedY);
                }
            } else {
                this.y = targetY;
            }
            this.vy = this.y - prevY;
        }
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    spawn(x, y, z, color, count = 10, isSmash = false) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * (isSmash ? 8 : 4)) + 1;
            this.particles.push({
                x: x,
                y: y,
                z: z,
                vx: Math.cos(angle) * speed,
                vy: (Math.random() - 0.5) * 3,
                vz: (Math.random() * (isSmash ? 6 : 3)) + 1,
                size: (Math.random() * (isSmash ? 5 : 3)) + 2,
                color: color,
                alpha: 1.0,
                life: 0,
                maxLife: (Math.random() * 20) + 15
            });
        }
    }

    spawnTrail(x, y, z, color, isSmash = false) {
        this.particles.push({
            x: x,
            y: y,
            z: z,
            vx: 0,
            vy: 0,
            vz: 0,
            size: isSmash ? 6 : 4,
            color: color,
            alpha: 0.8,
            life: 0,
            maxLife: isSmash ? 15 : 8
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            if (p.vz !== 0) p.vz -= GRAVITY * 0.5; // lighter gravity on particles
            
            p.life++;
            p.alpha = 1.0 - (p.life / p.maxLife);
            
            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }
}

// ==========================================================================
// Main Game Controller
// ==========================================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // State
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.difficulty = 'medium';
        this.playerScore = 0;
        this.aiScore = 0;

        // Timers & Stats
        this.gameStartTime = 0;
        this.totalGameTime = 0;
        this.rallyCount = 0;
        this.maxRallyCount = 0;
        this.smashCount = 0;
        this.shakeStrength = 0;

        // Entities
        this.ball = new Ball();
        this.player = new Paddle(940, '#00f0ff');
        this.ai = new Paddle(60, '#ff007f');
        this.particles = new ParticleSystem();

        // AI history queue for simulating latency
        this.aiHistory = [];

        // Player controls
        this.mouseX = GAME_X_MAX / 2;
        this.mouseY = CANVAS_HEIGHT * 0.9;
        this.keys = {};
        this.mouseIsDown = false;
        
        this.smashMeter = 0; // 0 to 100
        
        this.setupEventListeners();
        this.resizeCanvas();
        
        // Start loop
        window.addEventListener('resize', () => this.resizeCanvas());
        this.loop();
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
            }
            if (e.code === 'Escape' || e.code === 'KeyP') {
                if (this.state === 'PLAYING') {
                    this.pauseGame();
                } else if (this.state === 'PAUSED') {
                    this.resumeGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse/Touch movement on canvas (supports both X and Y movement)
        const handleMove = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            const relativeX = clientX - rect.left;
            const relativeY = clientY - rect.top;
            
            // Convert to game coordinate system
            this.mouseX = (relativeX / rect.width) * GAME_X_MAX;
            this.mouseY = (relativeY / rect.height) * CANVAS_HEIGHT;
        };

        this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
            e.preventDefault();
        }, { passive: false });

        // Smash/click handlers
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.mouseIsDown = true;
            }
        });
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouseIsDown = false;
            }
        });
        this.canvas.addEventListener('touchstart', (e) => {
            this.mouseIsDown = true;
        });
        this.canvas.addEventListener('touchend', (e) => {
            this.mouseIsDown = false;
        });

        // UI Button Handlers
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resume-btn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.resetMatch());
        document.getElementById('quit-btn').addEventListener('click', () => this.quitToMenu());
        
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetMatch());
        document.getElementById('gameover-quit-btn').addEventListener('click', () => this.quitToMenu());

        // Difficulty Selection
        const diffBtns = document.querySelectorAll('.diff-btn');
        diffBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.diff;
            });
        });

        // Sound Toggle Button
        const soundToggle = document.getElementById('sound-toggle');
        const soundStatusText = document.getElementById('sound-status-text');
        soundToggle.addEventListener('click', () => {
            const enabled = sfx.toggle();
            if (enabled) {
                soundStatusText.textContent = "音效: 開 / SOUND: ON";
                soundToggle.classList.remove('danger-btn');
            } else {
                soundStatusText.textContent = "音效: 關 / SOUND: OFF";
                soundToggle.classList.add('danger-btn');
            }
        });
    }

    resizeCanvas() {
        // Set internal resolution
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
    }

    startGame() {
        sfx.init();
        this.playerScore = 0;
        this.aiScore = 0;
        this.rallyCount = 0;
        this.maxRallyCount = 0;
        this.smashCount = 0;
        this.smashMeter = 0;
        this.gameStartTime = Date.now();
        this.ball.reset(true);
        this.aiHistory = [];
        
        document.getElementById('menu-screen').classList.remove('active');
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('gameover-screen').classList.remove('active');
        
        this.updateHUD();
        this.state = 'PLAYING';
    }

    pauseGame() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        document.getElementById('pause-screen').classList.add('active');
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        document.getElementById('pause-screen').classList.remove('active');
    }

    resetMatch() {
        this.startGame();
    }

    quitToMenu() {
        this.state = 'MENU';
        document.getElementById('menu-screen').classList.add('active');
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('gameover-screen').classList.remove('active');
    }

    triggerGameOver(playerWon) {
        this.state = 'GAMEOVER';
        this.totalGameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        
        const titleEl = document.getElementById('gameover-title');
        if (playerWon) {
            titleEl.textContent = "勝利 / VICTORY!";
            titleEl.className = "game-over-status win";
            sfx.playWin();
        } else {
            titleEl.textContent = "失敗 / DEFEAT";
            titleEl.className = "game-over-status lose";
            sfx.playLose();
        }

        document.getElementById('stat-max-rallies').textContent = this.maxRallyCount;
        document.getElementById('stat-smashes').textContent = this.smashCount;
        document.getElementById('stat-time').textContent = `${this.totalGameTime}s`;

        document.getElementById('gameover-screen').classList.add('active');
    }

    updateHUD() {
        document.getElementById('player-score').textContent = this.playerScore;
        document.getElementById('ai-score').textContent = this.aiScore;
        
        const meter = document.getElementById('smash-meter-inner');
        const meterOuter = meter.parentElement;
        const readyText = document.getElementById('smash-ready-text');
        
        meter.style.width = `${this.smashMeter}%`;
        if (this.smashMeter >= 100) {
            meterOuter.classList.add('full');
            readyText.classList.add('active');
        } else {
            meterOuter.classList.remove('full');
            readyText.classList.remove('active');
        }
    }

    addPlayerScore() {
        this.playerScore++;
        sfx.playScore(true);
        this.updateHUD();
        this.particles.spawn(this.ball.x, this.ball.y, this.ball.z, '#39ff14', 25, true);
        
        if (this.playerScore >= MAX_SCORE) {
            this.triggerGameOver(true);
        } else {
            this.ball.reset(false); // Serve to AI
        }
    }

    addAiScore() {
        this.aiScore++;
        sfx.playScore(false);
        this.updateHUD();
        this.particles.spawn(this.ball.x, this.ball.y, this.ball.z, '#ff007f', 25, true);
        this.shakeStrength = 15;
        
        if (this.aiScore >= MAX_SCORE) {
            this.triggerGameOver(false);
        } else {
            this.ball.reset(true); // Serve to player
        }
    }

    // ==========================================================================
    // Engine Logic Updates
    // ==========================================================================
    update() {
        if (this.state !== 'PLAYING') return;

        // --- 1. Update Player Paddle ---
        let targetPlayerX = this.mouseX;
        
        // Map mouseY (0 to 600) to player game Y range [550, 960]
        let normY = this.mouseY / CANVAS_HEIGHT;
        let activeNormY = Math.max(0.5, Math.min(0.95, normY));
        let targetPlayerY = 550 + ((activeNormY - 0.5) / 0.45) * (960 - 550);

        // Keyboard override if keys are pressed
        const keyboardSpeed = 15;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            targetPlayerX = this.player.x - keyboardSpeed;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            targetPlayerX = this.player.x + keyboardSpeed;
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            targetPlayerY = this.player.y - keyboardSpeed;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            targetPlayerY = this.player.y + keyboardSpeed;
        }

        // Constrain player Y to [550, 960]
        targetPlayerY = Math.max(550, Math.min(960, targetPlayerY));

        this.player.update(targetPlayerX, targetPlayerY);

        // --- 2. Update Ball Position & Physics ---
        this.ball.update();

        // Save AI prediction queue
        this.aiHistory.push(this.ball.x);
        const config = AI_DIFFICULTIES[this.difficulty];
        if (this.aiHistory.length > config.latency + 1) {
            this.aiHistory.shift();
        }

        // --- 3. Update AI Paddle ---
        // AI targets the ball's position with latency and difficulty-based error
        let aiTargetX = GAME_X_MAX / 2;
        if (this.ball.vy < 0) {
            // Ball is moving towards AI, track it
            const latencyIndex = Math.max(0, this.aiHistory.length - 1 - config.latency);
            const rawTargetX = this.aiHistory[latencyIndex] || this.ball.x;
            
            // Add a little wobble error when ball bounces
            if (this.ball.z <= 0 && Math.abs(this.ball.vz) < 1) {
                this.aiWobble = (Math.random() - 0.5) * config.error * 2;
            }
            if (!this.aiWobble) this.aiWobble = 0;
            aiTargetX = rawTargetX + this.aiWobble;
        } else {
            // Ball moving away, AI drifts slowly back to center
            aiTargetX = (GAME_X_MAX / 2) * 0.3 + this.ai.x * 0.7;
        }
        
        this.ai.update(aiTargetX, null, config.speed);

        // --- 4. Ball Collision and Scoring Logic ---
        
        // Bounce on Table
        // Table bounds in Y are roughly: Y = 100 to 900
        // Table bounds in X are normalized: 0 to 800
        if (this.ball.z <= 0) {
            const onTableX = this.ball.x >= 40 && this.ball.x <= GAME_X_MAX - 40;
            const onTableY = this.ball.y >= 80 && this.ball.y <= GAME_Y_MAX - 80;
            
            if (onTableX && onTableY) {
                // Bounce ball up
                this.ball.z = 0;
                this.ball.vz = -this.ball.vz * BALL_BOUNCE_RESTITUTION;
                
                // Cap gravity bouncing to avoid endless micro-bounces
                if (this.ball.vz < 1.0) this.ball.vz = 0;
                
                // Track table bounces
                if (this.ball.y > GAME_NET_Y) {
                    this.ball.bouncesOnPlayerSide++;
                    if (this.ball.bouncesOnPlayerSide > 1) {
                        // Double bounce on player side
                        this.addAiScore();
                        return;
                    }
                } else {
                    this.ball.bouncesOnAiSide++;
                    if (this.ball.bouncesOnAiSide > 1) {
                        // Double bounce on AI side
                        this.addPlayerScore();
                        return;
                    }
                }

                sfx.playBounce();
                // Yellow-green table hit particles
                this.particles.spawn(this.ball.x, this.ball.y, 0, '#39ff14', 8, this.ball.isSmash);
            } else {
                // Ball landed outside table
                if (this.ball.y > GAME_NET_Y) {
                    // Out on player side: if it bounced on player's side already, AI hit it out. If not, player wins.
                    if (this.ball.bouncesOnPlayerSide === 0 && this.ball.lastHitter === 'ai') {
                        // AI hit it directly out
                        this.addPlayerScore();
                    } else {
                        this.addAiScore();
                    }
                } else {
                    // Out on AI side
                    if (this.ball.bouncesOnAiSide === 0 && this.ball.lastHitter === 'player') {
                        // Player hit it directly out
                        this.addAiScore();
                    } else {
                        this.addPlayerScore();
                    }
                }
                return;
            }
        }

        // Net collision check (crossing Net Y = 500)
        // Check if ball crossed the net in this frame
        const prevBallY = this.ball.y - this.ball.vy;
        if ((prevBallY < GAME_NET_Y && this.ball.y >= GAME_NET_Y) || 
            (prevBallY > GAME_NET_Y && this.ball.y <= GAME_NET_Y)) {
            
            // If ball's height Z is below net height (let's say net height is 30)
            if (this.ball.z < 28) {
                sfx.playNet();
                this.particles.spawn(this.ball.x, GAME_NET_Y, this.ball.z, '#ffea00', 12, false);
                
                // Ball hits the net and flops down
                this.ball.vy = -this.ball.vy * 0.25;
                this.ball.vx = this.ball.vx * 0.4;
                this.ball.vz = -0.5;
                
                // Point goes to whoever didn't hit it last
                if (this.ball.lastHitter === 'player') {
                    this.addAiScore();
                } else {
                    this.addPlayerScore();
                }
                return;
            }
        }

        // Hitting: Player Paddle (Y = 940)
        if (this.ball.vy > 0 && Math.abs(this.ball.y - this.player.y) <= 25) {
            // Check horizontal bounds
            const paddleHalfWidth = this.player.width / 2;
            if (this.ball.x >= this.player.x - paddleHalfWidth && this.ball.x <= this.player.x + paddleHalfWidth) {
                // Ball must be in hitting range height (e.g. z < 50)
                if (this.ball.z < 52) {
                    this.ball.y = this.player.y - 5; // reposition slightly above
                    
                    // Boost horizontal speed on hit and ensure minimum speed
                    const hitSpeed = Math.max(8.0, Math.abs(this.ball.vy) * 1.05);
                    this.ball.vy = -hitSpeed;
                    
                    // Ball direction reflects hit location on paddle (adds steering)
                    const offset = (this.ball.x - this.player.x) / paddleHalfWidth; // -1 to 1
                    this.ball.vx = offset * 6.5 + this.player.vx * 0.35;
                    
                    // Add Spin if player paddle was moving
                    this.ball.spinX = this.player.vx * 0.85;

                    // Reset bounces
                    this.ball.bouncesOnPlayerSide = 0;
                    this.ball.bouncesOnAiSide = 0;
                    this.ball.lastHitter = 'player';

                    // Check Smash condition: Key pressed and meter is full and ball is at a good smash height
                    const wantsSmash = this.mouseIsDown || this.keys['Space'];
                    if (wantsSmash && this.smashMeter >= 100 && this.ball.z > 15) {
                        // SMASH!
                        this.ball.isSmash = true;
                        this.ball.vy = -hitSpeed * 1.85;
                        this.ball.vx *= 1.4;
                        this.ball.vz = 4.2 + Math.random() * 0.6; // low trajectory smash that still clears the net
                        
                        this.smashMeter = 0;
                        this.smashCount++;
                        this.shakeStrength = 12;
                        sfx.playSmash();
                        this.particles.spawn(this.ball.x, this.ball.y, this.ball.z, '#ffc400', 25, true);
                    } else {
                        // Normal Hit
                        this.ball.isSmash = false;
                        this.ball.vz = 6.8 + Math.random() * 1.2; // nice high arc to clear the net cleanly
                        sfx.playHit(true);
                        this.particles.spawn(this.ball.x, this.ball.y, this.ball.z, '#00f0ff', 12, false);
                        
                        // Recharge meter
                        this.smashMeter = Math.min(100, this.smashMeter + 25);
                    }

                    this.rallyCount++;
                    if (this.rallyCount > this.maxRallyCount) {
                        this.maxRallyCount = this.rallyCount;
                    }
                    
                    this.updateHUD();
                }
            }
        }

        // Hitting: AI Paddle (Y = 60)
        if (this.ball.vy < 0 && Math.abs(this.ball.y - this.ai.y) <= 25) {
            const paddleHalfWidth = this.ai.width / 2;
            if (this.ball.x >= this.ai.x - paddleHalfWidth && this.ball.x <= this.ai.x + paddleHalfWidth) {
                if (this.ball.z < 52) {
                    this.ball.y = this.ai.y + 5; // reposition slightly below
                    
                    // Boost horizontal speed on hit and ensure minimum speed
                    const hitSpeed = Math.max(8.0, Math.abs(this.ball.vy) * 1.05);
                    this.ball.vy = hitSpeed;
                    
                    // Ball direction reflects hit location on paddle
                    const offset = (this.ball.x - this.ai.x) / paddleHalfWidth; // -1 to 1
                    
                    // Legend difficulty AI makes smarter shots
                    const speedMultiplier = this.difficulty === 'legend' ? 1.2 : 1.0;
                    this.ball.vx = offset * 6.5 * speedMultiplier;
                    
                    // AI can also return smash randomly on Legend difficulty
                    if (this.difficulty === 'legend' && Math.random() < 0.25) {
                        this.ball.isSmash = true;
                        this.ball.vy = hitSpeed * 1.6;
                        this.ball.vz = 4.2 + Math.random() * 0.6; // AI smash clears the net
                        sfx.playSmash();
                        this.particles.spawn(this.ball.x, this.ball.y, this.ball.z, '#ff007f', 18, true);
                    } else {
                        this.ball.isSmash = false;
                        this.ball.vz = 6.8 + Math.random() * 1.2; // AI normal return clears the net cleanly
                        sfx.playHit(false);
                        this.particles.spawn(this.ball.x, this.ball.y, this.ball.z, '#ff007f', 12, false);
                    }

                    // Reset bounces
                    this.ball.bouncesOnPlayerSide = 0;
                    this.ball.bouncesOnAiSide = 0;
                    this.ball.lastHitter = 'ai';
                }
            }
        }

        // Check if ball passed baseline without hitting
        if (this.ball.y > GAME_Y_MAX + 50) {
            // Player missed
            this.addAiScore();
        } else if (this.ball.y < -50) {
            // AI missed
            this.addPlayerScore();
        }

        // --- 5. Particles Update ---
        this.particles.update();
        
        // Spawn tail trailing particles for the ball
        if (this.ball.active && Math.random() < 0.8) {
            let tailColor = '#fffb00'; // Default yellow
            if (this.ball.isSmash) {
                tailColor = '#ff6c00'; // Orange fire for smash
            } else if (Math.abs(this.ball.spinX) > 1.5) {
                tailColor = '#a800ff'; // Purple for spin
            }
            this.particles.spawnTrail(this.ball.x, this.ball.y, this.ball.z, tailColor, this.ball.isSmash);
        }
    }

    // ==========================================================================
    // Projection & Render Logic (2.5D Rendering)
    // ==========================================================================
    
    // Project Y from normalized space [0, 1000] to screen space [210, 530]
    projectY(gameY) {
        const t = gameY / GAME_Y_MAX;
        return TABLE_TOP_Y + t * (TABLE_BOTTOM_Y - TABLE_TOP_Y);
    }

    // Project X from normalized space [0, 800] to screen space [left, right]
    projectX(gameX, gameY) {
        const t = gameY / GAME_Y_MAX;
        const tableWidth = TABLE_TOP_WIDTH + t * (TABLE_BOTTOM_WIDTH - TABLE_TOP_WIDTH);
        const leftX = (CANVAS_WIDTH - tableWidth) / 2;
        
        const nx = gameX / GAME_X_MAX;
        return leftX + nx * tableWidth;
    }

    projectRadius(baseRadius, gameY, gameZ) {
        const t = gameY / GAME_Y_MAX;
        // Ball gets larger as it comes closer (t approaches 1) and higher in Z
        const zFactor = 1 + (gameZ / 150);
        const distFactor = 0.6 + t * 0.9;
        return baseRadius * distFactor * zFactor;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#03010a';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Apply screen shake
        this.ctx.save();
        if (this.shakeStrength > 0.1) {
            const shakeX = (Math.random() - 0.5) * this.shakeStrength;
            const shakeY = (Math.random() - 0.5) * this.shakeStrength;
            this.ctx.translate(shakeX, shakeY);
            this.shakeStrength *= 0.88; // decay
        }

        this.drawBackgroundGrid();
        this.drawTable();
        this.drawNet();
        this.drawPaddle(this.ai, this.ai.y);
        this.drawBallShadow();
        this.drawParticles();
        this.drawPaddle(this.player, this.player.y);
        this.drawBall();

        this.ctx.restore();
    }

    drawBackgroundGrid() {
        // Draw grid lines radiating outwards to amplify perspective
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
        this.ctx.lineWidth = 1;

        // Vertical radiating lines
        for (let i = 0; i <= 10; i++) {
            const topGridX = 100 + i * 60;
            const bottomGridX = -100 + i * 100;
            this.ctx.beginPath();
            this.ctx.moveTo(topGridX, 0);
            this.ctx.lineTo(bottomGridX, CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let j = 0; j <= 8; j++) {
            const gridY = 80 + j * 60;
            this.ctx.beginPath();
            this.ctx.moveTo(0, gridY);
            this.ctx.lineTo(CANVAS_WIDTH, gridY);
            this.ctx.stroke();
        }
    }

    drawTable() {
        const x1 = this.projectX(0, 0);
        const y1 = this.projectY(0);
        const x2 = this.projectX(GAME_X_MAX, 0);
        const y2 = this.projectY(0);
        const x3 = this.projectX(GAME_X_MAX, GAME_Y_MAX);
        const y3 = this.projectY(GAME_Y_MAX);
        const x4 = this.projectX(0, GAME_Y_MAX);
        const y4 = this.projectY(GAME_Y_MAX);

        // 1. Draw Table Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.moveTo(x1 - 10, y1 + 10);
        this.ctx.lineTo(x2 + 10, y2 + 10);
        this.ctx.lineTo(x3 + 20, y3 + 20);
        this.ctx.lineTo(x4 - 20, y4 + 20);
        this.ctx.closePath();
        this.ctx.fill();

        // 2. Draw Table Face
        const gradient = this.ctx.createLinearGradient(400, y1, 400, y3);
        gradient.addColorStop(0, '#090520');
        gradient.addColorStop(0.5, '#0e0b35');
        gradient.addColorStop(1, '#0c0730');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.lineTo(x4, y4);
        this.ctx.closePath();
        this.ctx.fill();

        // 3. Neon Cyber Borders
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x4, y4);
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ff007f';
        this.ctx.shadowColor = '#ff007f';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.beginPath();
        this.ctx.moveTo(x4, y4);
        this.ctx.lineTo(x3, y3);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0; // reset glow

        // 4. White boundaries & Center Line
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Outer boundaries inset slightly
        this.ctx.moveTo(this.projectX(20, 20), this.projectY(20));
        this.ctx.lineTo(this.projectX(GAME_X_MAX - 20, 20), this.projectY(20));
        this.ctx.lineTo(this.projectX(GAME_X_MAX - 20, GAME_Y_MAX - 20), this.projectY(GAME_Y_MAX - 20));
        this.ctx.lineTo(this.projectX(20, GAME_Y_MAX - 20), this.projectY(20 + GAME_Y_MAX - 40));
        this.ctx.closePath();
        this.ctx.stroke();

        // Center line
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.projectX(GAME_X_MAX / 2, 20), this.projectY(20));
        this.ctx.lineTo(this.projectX(GAME_X_MAX / 2, GAME_Y_MAX - 20), this.projectY(GAME_Y_MAX - 20));
        this.ctx.stroke();
        this.ctx.setLineDash([]); // reset
    }

    drawNet() {
        const netY = GAME_NET_Y;
        const leftX = this.projectX(0, netY) - 15;
        const rightX = this.projectX(GAME_X_MAX, netY) + 15;
        const screenY = this.projectY(netY);
        
        const netHeight = 22;

        // Net posts (supports)
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#ff007f';
        this.ctx.shadowColor = '#ff007f';
        this.ctx.shadowBlur = 4;
        
        this.ctx.beginPath();
        this.ctx.moveTo(leftX, screenY);
        this.ctx.lineTo(leftX, screenY - netHeight);
        this.ctx.moveTo(rightX, screenY);
        this.ctx.lineTo(rightX, screenY - netHeight);
        this.ctx.stroke();

        // Net screen body
        this.ctx.fillStyle = 'rgba(100, 100, 255, 0.25)';
        this.ctx.fillRect(leftX, screenY - netHeight, rightX - leftX, netHeight);

        // Grid mesh lines on the net
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.beginPath();
        const totalNetLines = 45;
        const spacing = (rightX - leftX) / totalNetLines;
        for (let i = 0; i <= totalNetLines; i++) {
            const lineX = leftX + i * spacing;
            this.ctx.moveTo(lineX, screenY);
            this.ctx.lineTo(lineX, screenY - netHeight);
        }
        this.ctx.stroke();

        // Net top binding line
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(leftX, screenY - netHeight);
        this.ctx.lineTo(rightX, screenY - netHeight);
        this.ctx.stroke();
    }

    drawPaddle(paddle, gameY) {
        const leftX = this.projectX(paddle.x - paddle.width / 2, gameY);
        const rightX = this.projectX(paddle.x + paddle.width / 2, gameY);
        const screenY = this.projectY(gameY);
        
        const renderWidth = rightX - leftX;
        const renderHeight = 8 + (gameY / GAME_Y_MAX) * 8; // thicker at bottom

        // Neon Glow
        this.ctx.shadowColor = paddle.color;
        this.ctx.shadowBlur = 12;
        this.ctx.fillStyle = paddle.color;

        // Draw as rounded capsule
        this.ctx.beginPath();
        this.ctx.roundRect(leftX, screenY - renderHeight / 2, renderWidth, renderHeight, renderHeight / 2);
        this.ctx.fill();

        // Draw center reflection highlight
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 0;
        this.ctx.beginPath();
        this.ctx.roundRect(leftX + 4, screenY - renderHeight / 4, renderWidth - 8, renderHeight / 2, renderHeight / 4);
        this.ctx.fill();
    }

    drawBallShadow() {
        if (!this.ball.active) return;
        
        const shadowX = this.projectX(this.ball.x, this.ball.y);
        const shadowY = this.projectY(this.ball.y);
        
        // Shadow size scales with ball height
        const zFactor = Math.max(0.1, 1 - (this.ball.z / 320));
        const shadowWidth = this.projectRadius(this.ball.radius * 2.2, this.ball.y, 0) * zFactor;
        const shadowHeight = shadowWidth * 0.4;

        this.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * zFactor})`;
        this.ctx.beginPath();
        this.ctx.ellipse(shadowX, shadowY, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBall() {
        if (!this.ball.active) return;

        const screenX = this.projectX(this.ball.x, this.ball.y);
        const rawY = this.projectY(this.ball.y);
        
        // Z-axis shifts the ball vertically upwards on screen
        const t = this.ball.y / GAME_Y_MAX;
        const screenY = rawY - this.ball.z * (0.35 + t * 0.55);
        const renderRadius = this.projectRadius(this.ball.radius, this.ball.y, this.ball.z);

        // Core colors & glows
        let glowColor = '#fffb00';
        let coreColor = '#ffffff';
        
        if (this.ball.isSmash) {
            glowColor = '#ff3c00';
            coreColor = '#ffea00';
        } else if (Math.abs(this.ball.spinX) > 1.5) {
            glowColor = '#cc00ff';
        }

        // Draw Glow
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = 16;
        this.ctx.fillStyle = glowColor;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, renderRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw Core
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = coreColor;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, renderRadius * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawParticles() {
        const ps = this.particles.particles;
        for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            const screenX = this.projectX(p.x, p.y);
            const rawY = this.projectY(p.y);
            const t = p.y / GAME_Y_MAX;
            const screenY = rawY - p.z * (0.35 + t * 0.55);
            
            const radius = Math.max(0.5, p.size * (0.5 + t * 0.6) * (1 + p.z / 150));

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0; // reset
    }

    // ==========================================================================
    // Master Game Loop
    // ==========================================================================
    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }
}

// Instantiate engine when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
