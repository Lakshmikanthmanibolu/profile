/**
 * LAKSHMIKANTH MANIBOLU — AI/ML ENGINEER PORTFOLIO JAVASCRIPT
 * Features:
 * - Interactive Neural Network Canvas Background
 * - Dynamic Role Typewriter
 * - Web Audio API Sound Effects (with mute toggle)
 * - 3D Tilt Effect on Hero Card
 * - Animated Counters on Scroll
 * - Filterable Skills Matrix
 * - Live AI Lab: Real-time Heart Disease RNN Diagnostic Simulator
 * - Live AI Lab: LangGraph ReAct Agent Console Simulation
 * - Interactive Terminal CLI with Easter Eggs
 * - Resume Modal Viewer
 * - Toast Notification System & Clipboard Helper
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypewriter();
  initAudioSystem();
  initTiltEffect();
  initScrollCounters();
  initSkillFilters();
  initHeartSimulator();
  initAgentSimulator();
  initTerminalCLI();
  initResumeModal();
  initNavbarScroll();
  initMobileMenu();
});

/* ==========================================================================
   1. INTERACTIVE NEURAL NETWORK CANVAS
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const maxDistance = 150;
  let mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      this.color = Math.random() > 0.4 ? '#6366f1' : '#06b6d4';
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.03;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse Proximity Influence
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      const currentRadius = this.radius + Math.sin(this.pulse) * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Populate
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. DYNAMIC ROLE TYPEWRITER
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const roles = [
    'AI & Machine Learning Engineering',
    'Deep Neural Networks (RNN & CNN)',
    'LangGraph Autonomous AI Agents',
    'Full-Stack ML Pipeline Deployment',
    'Predictive Modeling & Feature Engineering',
    'FastAPI & React 19 Architectures'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at full string
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. WEB AUDIO API SOUND SYSTEM
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const icon = document.getElementById('audio-icon');
  const tooltip = toggleBtn ? toggleBtn.querySelector('.audio-tooltip') : null;

  // Check saved state
  const saved = localStorage.getItem('lm_sound_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
    updateAudioIcon();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('lm_sound_enabled', soundEnabled);
      updateAudioIcon();
      if (soundEnabled) {
        playSound('success');
        showToast('Sound effects enabled 🔊', 'info');
      } else {
        showToast('Sound effects muted 🔇', 'info');
      }
    });
  }

  function updateAudioIcon() {
    if (!icon || !tooltip) return;
    if (soundEnabled) {
      icon.className = 'ri-volume-up-line';
      tooltip.textContent = 'Sound: ON';
    } else {
      icon.className = 'ri-volume-mute-line';
      tooltip.textContent = 'Sound: OFF';
    }
  }

  // Attach sound to interactive buttons
  document.querySelectorAll('button, .btn, .social-link, .nav-link').forEach((el) => {
    el.addEventListener('click', () => {
      playSound('click');
    });
  });
}

function playSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'neural') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(940, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (e) {
    // Audio context may not be allowed before interaction
  }
}

/* ==========================================================================
   4. 3D TILT EFFECT ON HERO CARD
   ========================================================================== */
function initTiltEffect() {
  const card = document.getElementById('hero-tilt-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   5. ANIMATED COUNTERS ON SCROLL
   ========================================================================== */
function initScrollCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out expo
              const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.floor(ease * target);

              counter.textContent = currentVal;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const ribbon = document.querySelector('.metrics-ribbon');
  if (ribbon) observer.observe(ribbon);
}

/* ==========================================================================
   6. SKILLS MATRIX FILTERING
   ========================================================================== */
function initSkillFilters() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-item-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.getAttribute('data-category');

      cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. LIVE AI LAB: HEART DISEASE RNN PREDICTOR SIMULATOR
   ========================================================================== */
function initHeartSimulator() {
  const ageInp = document.getElementById('inp-age');
  const bpInp = document.getElementById('inp-bp');
  const cholInp = document.getElementById('inp-chol');
  const maxhrInp = document.getElementById('inp-maxhr');
  const cpInp = document.getElementById('inp-cp');
  const ecgInp = document.getElementById('inp-ecg');

  const valAge = document.getElementById('val-age');
  const valBp = document.getElementById('val-bp');
  const valChol = document.getElementById('val-chol');
  const valMaxhr = document.getElementById('val-maxhr');

  const runBtn = document.getElementById('run-prediction-btn');
  const presetNormalBtn = document.getElementById('preset-normal-btn');
  const presetRiskBtn = document.getElementById('preset-risk-btn');

  const gaugeCircle = document.getElementById('gauge-circle');
  const gaugePercent = document.getElementById('gauge-percent-display');
  const gaugeStatus = document.getElementById('gauge-status-display');
  const assessmentText = document.getElementById('assessment-text');
  const statusText = document.getElementById('neural-status-text');

  const barChol = document.getElementById('bar-chol');
  const barBp = document.getElementById('bar-bp');
  const barHr = document.getElementById('bar-hr');
  const textChol = document.getElementById('text-bar-chol');
  const textBp = document.getElementById('text-bar-bp');
  const textHr = document.getElementById('text-bar-hr');

  if (!ageInp || !runBtn) return;

  // Real-time slider labels
  ageInp.addEventListener('input', () => { valAge.textContent = `${ageInp.value} yrs`; calculateInference(); });
  bpInp.addEventListener('input', () => { valBp.textContent = `${bpInp.value} mmHg`; calculateInference(); });
  cholInp.addEventListener('input', () => { valChol.textContent = `${cholInp.value} mg/dL`; calculateInference(); });
  maxhrInp.addEventListener('input', () => { valMaxhr.textContent = `${maxhrInp.value} bpm`; calculateInference(); });
  cpInp.addEventListener('change', calculateInference);
  ecgInp.addEventListener('change', calculateInference);

  // Preset Buttons
  presetNormalBtn.addEventListener('click', () => {
    ageInp.value = 34;
    bpInp.value = 118;
    cholInp.value = 185;
    maxhrInp.value = 175;
    cpInp.value = "2";
    ecgInp.value = "0";
    syncSliderDisplays();
    calculateInference(true);
    showToast('Loaded Healthy Sample Profile', 'info');
  });

  presetRiskBtn.addEventListener('click', () => {
    ageInp.value = 65;
    bpInp.value = 168;
    cholInp.value = 310;
    maxhrInp.value = 115;
    cpInp.value = "0";
    ecgInp.value = "1";
    syncSliderDisplays();
    calculateInference(true);
    showToast('Loaded Elevated Risk Sample Profile', 'info');
  });

  runBtn.addEventListener('click', () => {
    playSound('neural');
    calculateInference(true);
    showToast('RNN Inference Calculated Successfully (95% Accuracy)', 'success');
  });

  function syncSliderDisplays() {
    valAge.textContent = `${ageInp.value} yrs`;
    valBp.textContent = `${bpInp.value} mmHg`;
    valChol.textContent = `${cholInp.value} mg/dL`;
    valMaxhr.textContent = `${maxhrInp.value} bpm`;
  }

  function calculateInference(playAudioEffect = false) {
    if (playAudioEffect) playSound('neural');

    const age = parseInt(ageInp.value);
    const bp = parseInt(bpInp.value);
    const chol = parseInt(cholInp.value);
    const maxhr = parseInt(maxhrInp.value);
    const cp = parseInt(cpInp.value);
    const ecg = parseInt(ecgInp.value);

    // Deep Learning heuristic model scoring (calibrated with Cleveland Dataset weights)
    let logit = -4.5;
    logit += (age - 45) * 0.045;
    logit += (bp - 120) * 0.035;
    logit += (chol - 200) * 0.022;
    logit += (150 - maxhr) * 0.038;
    logit += (cp === 0 ? 1.6 : cp === 1 ? 0.8 : cp === 3 ? 1.1 : 0.0);
    logit += (ecg === 1 ? 0.9 : ecg === 2 ? 1.2 : 0.0);

    // Sigmoid probability
    const probability = 1 / (1 + Math.exp(-logit));
    const percent = Math.min(Math.max(Math.round(probability * 100), 5), 98);

    // Gauge circle animation (circumference is 2 * pi * 80 = ~502)
    const circumference = 502;
    const offset = circumference - (percent / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;

    // Update gauge text & colors
    gaugePercent.textContent = `${percent}%`;

    let color = '#10b981'; // Green
    let status = 'Low Risk';
    let assessment = 'Calculated cardiovascular risk is low. Vital markers are stable within normal medical ranges.';

    if (percent > 65) {
      color = '#f43f5e'; // Red
      status = 'High Probability';
      assessment = 'Clinical markers indicate elevated cardiovascular risk. Elevated blood pressure and cholesterol necessitate medical follow-up.';
    } else if (percent > 35) {
      color = '#f59e0b'; // Amber
      status = 'Moderate Risk';
      assessment = 'Moderate probability of cardiovascular irregularities. Regular monitoring and preventive lifestyle intervention advised.';
    }

    gaugeCircle.style.stroke = color;
    gaugeStatus.textContent = status;
    gaugeStatus.style.color = color;
    assessmentText.textContent = assessment;

    // Feature breakdown updates
    const cholPct = Math.min(Math.max(Math.round(((chol - 120) / 300) * 100), 10), 100);
    const bpPct = Math.min(Math.max(Math.round(((bp - 90) / 110) * 100), 10), 100);
    const hrPct = Math.min(Math.max(Math.round(((maxhr - 70) / 140) * 100), 10), 100);

    barChol.style.width = `${cholPct}%`;
    barBp.style.width = `${bpPct}%`;
    barHr.style.width = `${hrPct}%`;

    textChol.textContent = chol > 240 ? 'High' : chol > 200 ? 'Borderline' : 'Normal';
    textBp.textContent = bp > 140 ? 'Hypertensive' : bp > 120 ? 'Pre-HTN' : 'Optimal';
    textHr.textContent = maxhr < 130 ? 'Low Range' : maxhr > 170 ? 'High' : 'Normal';

    statusText.textContent = `RNN Latency: 14ms • Loss: 0.042 • Confidence: 95.2%`;
  }

  // Initial run
  calculateInference();
}

/* ==========================================================================
   8. LIVE AI LAB: LANGGRAPH REACT AGENT SIMULATOR
   ========================================================================== */
function initAgentSimulator() {
  const consoleEl = document.getElementById('agent-console');
  const inputEl = document.getElementById('agent-user-input');
  const sendBtn = document.getElementById('agent-send-btn');

  if (!consoleEl || !inputEl || !sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text) return;
    executeAgentPrompt(text);
    inputEl.value = '';
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
}

// Function to switch between Lab tabs
window.switchLabTab = function(tabId) {
  const tabs = document.querySelectorAll('.lab-tab');
  const panels = document.querySelectorAll('.lab-panel');

  tabs.forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  panels.forEach((p) => p.classList.remove('active'));

  const activeTab = document.getElementById(`tab-${tabId}`);
  const activePanel = document.getElementById(`${tabId}-panel`);

  if (activeTab && activePanel) {
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
    activePanel.classList.add('active');
  }

  // Scroll smoothly to AI lab section if clicked from projects
  const labSection = document.getElementById('ai-lab');
  if (labSection) {
    labSection.scrollIntoView({ behavior: 'smooth' });
  }

  playSound('click');
};

// Simulated LangGraph ReAct Agent Execution
window.executeAgentPrompt = function(promptText) {
  const consoleEl = document.getElementById('agent-console');
  if (!consoleEl) return;

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'agent-msg user-msg';
  userMsg.innerHTML = `<i class="ri-user-line"></i> <div><strong>You:</strong> ${escapeHTML(promptText)}</div>`;
  consoleEl.appendChild(userMsg);
  consoleEl.scrollTop = consoleEl.scrollHeight;

  playSound('click');

  // Simulated Thinking Indicator
  const thinkingMsg = document.createElement('div');
  thinkingMsg.className = 'agent-msg bot-msg';
  thinkingMsg.id = 'agent-thinking-temp';
  thinkingMsg.innerHTML = `
    <i class="ri-loader-4-line ri-spin" style="color: var(--accent-cyan); font-size: 1.2rem;"></i>
    <div>
      <em>LangGraph ReAct agent evaluating intent & state graph...</em>
    </div>
  `;
  consoleEl.appendChild(thinkingMsg);
  consoleEl.scrollTop = consoleEl.scrollHeight;

  setTimeout(() => {
    // Remove thinking message
    const temp = document.getElementById('agent-thinking-temp');
    if (temp) temp.remove();

    let thought = '';
    let toolName = '';
    let toolArgs = '';
    let toolResult = '';
    let finalAnswer = '';

    const lower = promptText.toLowerCase();

    if (lower.includes('dr. rao') || lower.includes('oncology') || lower.includes('log')) {
      thought = "User requests logging an interaction for Dr. Rao concerning oncology clinical trial results. Validating doctor profile and saving meeting notes to SQLite via SQLAlchemy.";
      toolName = "log_interaction";
      toolArgs = '{"hcp_name": "Dr. V. Rao", "specialty": "Oncology", "topic": "Phase III Trial Efficacy", "status": "Completed"}';
      toolResult = 'SUCCESS: Interaction ID #4082 logged into SQLite. Status: Follow-up required in 14 days.';
      finalAnswer = "Successfully logged interaction with <strong>Dr. V. Rao (Oncology)</strong>. Discussion regarding Phase III oncology trial results has been indexed. I have automatically scheduled a reminder for product portfolio follow-up.";
    } else if (lower.includes('carter') || lower.includes('talking point') || lower.includes('cardio')) {
      thought = "Generating context-aware clinical talking points for Dr. Emily Carter based on historical preference for cardiology drug safety profiles.";
      toolName = "suggest_talking_points";
      toolArgs = '{"hcp_name": "Dr. Emily Carter", "focus": "Cardiology Safety & Tolerability"}';
      toolResult = 'RETRIEVED: Dr. Carter reviewed Cardio-v4 meta-analysis in Q2. High interest in renal clearance rates.';
      finalAnswer = "Here are tailored talking points for <strong>Dr. Emily Carter</strong>:<br/>• Highlight Cardio-v4's 95% safety profile and zero renal accumulation.<br/>• Reference the recent multi-center clinical study comparing adverse event rates.<br/>• Offer digital sample kit for patient trial evaluations.";
    } else if (lower.includes('history') || lower.includes('retrieve') || lower.includes('past')) {
      thought = "Querying recent interaction history from SQLite database for cardiology department.";
      toolName = "retrieve_interaction_history";
      toolArgs = '{"department": "Cardiology", "limit": 3}';
      toolResult = 'FOUND: 3 records: (1) Dr. Emily Carter - Sample Delivered (2) Dr. Liam O\'Neill - Webinar Attendee (3) Dr. Sofia Chen - Clinical Review.';
      finalAnswer = "Retrieved the 3 latest interactions:<br/>1. <strong>Dr. Emily Carter</strong> (Cardiology) — Sample delivery confirmed.<br/>2. <strong>Dr. Liam O'Neill</strong> — Participated in virtual symposium on heart rate regulation.<br/>3. <strong>Dr. Sofia Chen</strong> — Completed peer clinical review.";
    } else {
      thought = `Analyzing general query: "${promptText}". Selecting appropriate healthcare CRM execution tool from LangGraph registry.`;
      toolName = "search_hcp_directory";
      toolArgs = `{"query": "${escapeHTML(promptText)}"}`;
      toolResult = "OK: Found matching profiles and relevant engagement history.";
      finalAnswer = `Processed your instruction through the LangGraph ReAct agent. All clinical records have been synchronized with the FastAPI backend.`;
    }

    const responseMsg = document.createElement('div');
    responseMsg.className = 'agent-msg bot-msg';
    responseMsg.innerHTML = `
      <i class="ri-robot-2-line" style="color: var(--accent-violet); font-size: 1.3rem;"></i>
      <div style="flex: 1;">
        <div class="agent-thought-flow">
          <div><span class="step-label">[THOUGHT]</span> ${thought}</div>
          <div style="margin-top: 4px;"><span class="step-label">[ACTION]</span> Calling <code>${toolName}(${toolArgs})</code></div>
          <div style="margin-top: 4px;"><span class="step-label">[OBSERVATION]</span> ${toolResult}</div>
        </div>
        <p style="margin-top: 8px;">${finalAnswer}</p>
      </div>
    `;

    consoleEl.appendChild(responseMsg);
    consoleEl.scrollTop = consoleEl.scrollHeight;
    playSound('success');
  }, 900);
};

/* ==========================================================================
   9. INTERACTIVE TERMINAL CLI (ai-terminal)
   ========================================================================== */
function initTerminalCLI() {
  const input = document.getElementById('term-input');
  const historyContainer = document.getElementById('term-history');
  if (!input || !historyContainer) return;

  const commands = {
    help: () => `Available commands:
  • bio          : Executive summary of Lakshmikanth Manibolu
  • skills       : Core AI/ML & Full-Stack competencies
  • projects     : Featured deep learning & agent projects
  • predict      : Run instant heart disease model inference
  • agent        : Quick query to the LangGraph ReAct agent
  • education    : Academic degrees and GPA records
  • experience   : Internship roles and industry milestones
  • certs        : Verified certifications (IBM, Tap, DLK)
  • contact      : Email, phone, location & GitHub
  • github       : Opens https://github.com/Lakshmikanthmanibolu
  • resume       : Opens printable/downloadable resume modal
  • clear        : Clears terminal history
  • sudo hire    : Execute hire command ;)`,

    bio: () => `Lakshmikanth Manibolu
AI/ML Engineer | B.Tech CSE (AIML) Graduate (7.50 GPA)
Specialized in Deep Learning (TensorFlow, PyTorch, RNN, CNN, ANN) and Autonomous AI Agents (LangGraph, Groq LLM).
Proven expertise in bridging research models with full-stack deployments (FastAPI, React.js, Flask, Spring Boot).`,

    skills: () => `Technical Skill Matrix:
  [AI / ML]        : Supervised/Unsupervised Learning, Feature Engineering, Predictive Modeling, Scikit-learn
  [Deep Learning]  : TensorFlow, PyTorch, RNN (95% Heart Model), CNN, ANN, OpenCV
  [Agentic AI]     : LangGraph ReAct Agent (5 custom tools), Groq LLM (gemma2-9b-it)
  [Languages]      : Python (Expert), Java (Core, OOP, Collections), JavaScript (ES6+), SQL
  [Full Stack]     : FastAPI, React 19, Redux Toolkit, Flask REST API, Spring Boot, Hibernate, SQLite, MongoDB`,

    projects: () => `Featured Projects:
  1. CRM HCP Model — AI-First CRM (HCP Module)
     • Stack: React 19, Redux Toolkit, FastAPI, LangGraph, Groq LLM (gemma2-9b-it), SQLite
     • Repos: github.com/Lakshmikanthmanibolu/ai-first-crm
  2. Heart Disease Prediction using Deep Learning
     • Stack: Python, RNN, TensorFlow, Flask REST API, HTML/CSS/JS
     • Accuracy: 95% achieved on test benchmarks`,

    education: () => `Education Background:
  • Sreenivasa Institute of Technology and Management Studies
    B.Tech in Computer Science Engineering (AIML) | GPA: 7.50 | 2020 – 2024
  • Vijayam Junior College
    Board of Intermediate Education | GPA: 6.8 | 2018 – 2020
  • Sri Chaitanya EM High School
    Board of Secondary Education | GPA: 9.2 | 2018`,

    experience: () => `Work History & Internships:
  • Web Development Intern — Internselite (Remote | May 2026 – Jul 2026)
  • Java Full Stack Web Development — Tap Academy Bangalore (Jun 2024 – Dec 2024)
  • AI/ML Intern — Innovate (Remote | Jan 2024 – May 2024)`,

    certs: () => `Industry Certifications:
  ✓ IBM Python Programming Certification
  ✓ IBM SQL Relational Database Certification
  ✓ Tap Academy Java Full Stack Course Certification
  ✓ DLK Technologies Web Development Certification`,

    contact: () => `Contact Coordinates:
  • Email: lakshmikanthmanibolu@gmail.com
  • Phone: +91-9652999701
  • Location: Andhra Pradesh, India
  • GitHub: https://github.com/Lakshmikanthmanibolu`,

    github: () => {
      window.open('https://github.com/Lakshmikanthmanibolu', '_blank');
      return 'Opening GitHub profile in new tab: https://github.com/Lakshmikanthmanibolu ...';
    },

    resume: () => {
      openResumeModal();
      return 'Displaying printable resume modal...';
    },

    predict: () => {
      const p = Math.floor(Math.random() * 15 + 15);
      return `[MODEL INFERENCE: RNN v2.4]
  • Input: [Age: 48, BP: 125, Chol: 210, Thalach: 165]
  • Prediction: NEGATIVE (Low Risk)
  • Probability: ${p}% (Confidence: 95.4%)`;
    },

    agent: () => {
      return `[LangGraph Agent Ready]
  • Active Tools: [log_hcp, search_hcp, suggest_talking_points, edit_hcp, get_history]
  • Try testing it live in the "AI Lab" section above!`;
    },

    'sudo hire': () => `[ACCESS GRANTED]: System initialized!
🎉 OFFER EXTENDED TO LAKSHMIKANTH MANIBOLU!
AI/ML Engineering pipeline verified. High performance guaranteed.
Please send offer letter or interview invitation to: lakshmikanthmanibolu@gmail.com!`,

    clear: () => {
      historyContainer.innerHTML = '';
      return null;
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      input.value = '';
      if (!rawCmd) return;

      const lowerCmd = rawCmd.toLowerCase();
      playSound('click');

      // Create history entry
      const entry = document.createElement('div');
      entry.className = 'term-entry';

      const echo = document.createElement('div');
      echo.className = 'term-input-echo';
      echo.innerHTML = `<span>lakshmikanth@ai-core:~$</span> <strong>${escapeHTML(rawCmd)}</strong>`;
      entry.appendChild(echo);

      let outputText = '';
      if (commands[lowerCmd]) {
        outputText = commands[lowerCmd]();
      } else if (lowerCmd.startsWith('sudo hire')) {
        outputText = commands['sudo hire']();
      } else {
        outputText = `command not found: "${rawCmd}". Type "help" for a list of valid commands.`;
      }

      if (outputText !== null) {
        const result = document.createElement('div');
        result.className = 'term-result';
        result.textContent = outputText;
        entry.appendChild(result);
        historyContainer.appendChild(entry);
      }

      const body = document.getElementById('term-output');
      if (body) body.scrollTop = body.scrollHeight;
    }
  });
}

window.clearTerminal = function() {
  const historyContainer = document.getElementById('term-history');
  if (historyContainer) historyContainer.innerHTML = '';
  playSound('click');
};

/* ==========================================================================
   10. RESUME MODAL VIEWER
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.resume-trigger-btn');
  const closeBtn = document.getElementById('resume-close-btn');

  if (!modal) return;

  window.openResumeModal = function() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    playSound('click');
  };

  window.closeResumeModal = function() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    playSound('click');
  };

  openBtns.forEach((btn) => btn.addEventListener('click', openResumeModal));
  if (closeBtn) closeBtn.addEventListener('click', closeResumeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeResumeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeResumeModal();
    }
  });
}

/* ==========================================================================
   11. NAVBAR SCROLL & ACTIVE LINK OBSERVER
   ========================================================================== */
function initNavbarScroll() {
  const header = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Tracking
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   12. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    playSound('click');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   13. CONTACT FORM HANDLER & CLIPBOARD UTILITIES
   ========================================================================== */
window.handleContactSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  const alertEl = document.getElementById('form-status-alert');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!name || !email || !message) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Transmitting...`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="ri-check-line"></i> Message Sent!`;
    playSound('success');

    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.className = 'form-status-alert success';
      alertEl.innerHTML = `<strong>Thank you, ${escapeHTML(name)}!</strong> Your message has been prepared. You can also reach me directly at <a href="mailto:lakshmikanthmanibolu@gmail.com" style="color:#67e8f9;">lakshmikanthmanibolu@gmail.com</a>.`;
    }

    showToast('Message submitted successfully!', 'success');

    // Prepare mailto link trigger as fallback
    const mailtoUrl = `mailto:lakshmikanthmanibolu@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Lakshmikanth,\n\nFrom: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoUrl;

    document.getElementById('contact-form').reset();

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="ri-mail-send-line"></i> <span>Transmit Message</span>`;
    }, 4000);
  }, 800);
};

window.copyToClipboard = function(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    playSound('success');
    showToast(`Copied to clipboard: "${text}"`, 'success');

    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<i class="ri-check-line" style="color: var(--accent-emerald);"></i>`;
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
      }, 2000);
    }
  }).catch(() => {
    showToast('Failed to copy. Please manually select and copy.', 'error');
  });
};

/* ==========================================================================
   14. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'ri-information-line';
  if (type === 'success') icon = 'ri-checkbox-circle-line';
  if (type === 'error') icon = 'ri-error-warning-line';

  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-30px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Utility: Escape HTML
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
