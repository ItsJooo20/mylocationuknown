/* ===================================================
   Location Unknown — Script
   Stars, neural network, music player, synced lyrics
   =================================================== */

(function () {
  'use strict';

  // ─── Stars Canvas ──────────────────────────────────
  const starsCanvas = document.getElementById('starsCanvas');
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 200;

  function resizeStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars(time) {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    for (const s of stars) {
      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
      starsCtx.beginPath();
      starsCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      starsCtx.fillStyle = 'rgba(224, 231, 255,' + (s.opacity * twinkle) + ')';
      starsCtx.fill();

      // subtle movement
      s.y -= s.speed;
      if (s.y < -5) {
        s.y = starsCanvas.height + 5;
        s.x = Math.random() * starsCanvas.width;
      }
    }
  }

  // ─── Neural Network Canvas ─────────────────────────
  const netCanvas = document.getElementById('networkCanvas');
  const netCtx = netCanvas.getContext('2d');
  let nodes = [];
  const NODE_COUNT = 40;
  const CONNECTION_DIST = 180;

  function resizeNetwork() {
    netCanvas.width = window.innerWidth;
    netCanvas.height = window.innerHeight;
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * netCanvas.width,
        y: Math.random() * netCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function drawNetwork() {
    netCtx.clearRect(0, 0, netCanvas.width, netCanvas.height);

    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
          netCtx.beginPath();
          netCtx.moveTo(nodes[i].x, nodes[i].y);
          netCtx.lineTo(nodes[j].x, nodes[j].y);
          netCtx.strokeStyle = 'rgba(124, 58, 237,' + alpha + ')';
          netCtx.lineWidth = 0.6;
          netCtx.stroke();
        }
      }
    }

    // nodes
    for (const n of nodes) {
      netCtx.beginPath();
      netCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      netCtx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      netCtx.fill();

      // glow
      netCtx.beginPath();
      netCtx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
      netCtx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      netCtx.fill();

      // move
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > netCanvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > netCanvas.height) n.vy *= -1;
    }
  }

  // ─── Animation Loop ────────────────────────────────
  function animate(time) {
    drawStars(time);
    drawNetwork();
    requestAnimationFrame(animate);
  }

  function handleResize() {
    resizeStars();
    resizeNetwork();
    initStars();
    initNodes();
  }

  window.addEventListener('resize', handleResize);
  handleResize();
  requestAnimationFrame(animate);

  // ─── Parallax on Mouse Move ────────────────────────
  document.addEventListener('mousemove', function (e) {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    starsCanvas.style.transform = 'translate(' + (mx * -6) + 'px,' + (my * -6) + 'px)';
    netCanvas.style.transform = 'translate(' + (mx * -3) + 'px,' + (my * -3) + 'px)';
  });

  // ─── Intro ─────────────────────────────────────────
  var intro = document.getElementById('intro');
  var enterBtn = document.getElementById('enterBtn');
  var mainContent = document.getElementById('mainContent');

  enterBtn.addEventListener('click', function () {
    intro.classList.add('fade-out');
    setTimeout(function () {
      intro.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, 800);
  });

  // ─── Music Player ─────────────────────────────────
  var audio = document.getElementById('audioPlayer');
  var playBtn = document.getElementById('playBtn');
  var playIcon = playBtn.querySelector('.play-icon');
  var pauseIcon = playBtn.querySelector('.pause-icon');
  var progressTrack = document.getElementById('progressTrack');
  var progressFill = document.getElementById('progressFill');
  var progressHandle = document.getElementById('progressHandle');
  var currentTimeEl = document.querySelector('.current-time');
  var durationEl = document.querySelector('.duration');
  var volumeSlider = document.getElementById('volumeSlider');
  var playerContainer = document.querySelector('.player-container');

  audio.volume = 0.7;

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  playBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {
        /* no audio file available — silently ignore */
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', function () {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playerContainer.classList.add('playing');
  });

  audio.addEventListener('pause', function () {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playerContainer.classList.remove('playing');
  });

  audio.addEventListener('loadedmetadata', function () {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', function () {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    progressHandle.style.left = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    highlightLyric(audio.currentTime);
  });

  progressTrack.addEventListener('click', function (e) {
    if (!audio.duration) return;
    var rect = progressTrack.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  volumeSlider.addEventListener('input', function () {
    audio.volume = parseFloat(volumeSlider.value);
  });

  // ─── Lyrics Data (time in seconds) ────────────────
  var lyricsData = [
    { time: 0,   text: '♪ ♪ ♪' },
    { time: 14,  text: "I don't know where you're going" },
    { time: 18,  text: 'But do you got room for one more troubled soul?' },
    { time: 23,  text: "I don't know where I'm going" },
    { time: 27,  text: "But I don't think I'm coming home" },
    { time: 31,  text: "And I said, I'll check in tomorrow if I don't wake up dead" },
    { time: 36,  text: 'This is the road to ruin' },
    { time: 39,  text: "And we're starting at the end" },
    { time: 43,  text: '' },
    { time: 45,  text: "Say yeah, let's be alone together" },
    { time: 49,  text: "We could stay young forever" },
    { time: 53,  text: 'Scream it from the top of your lungs, lungs, lungs' },
    { time: 58,  text: "Say yeah, let's be alone together" },
    { time: 62,  text: 'We could stay young forever' },
    { time: 66,  text: "We'll stay young, young, young, young, young" },
    { time: 71,  text: '' },
    { time: 73,  text: 'Location unknown' },
    { time: 77,  text: "Tell me, tell me where you're going" },
    { time: 81,  text: "Ooh, but I'm the one" },
    { time: 85,  text: "I'll be lying next to you" },
    { time: 89,  text: '' },
    { time: 91,  text: "I'm not gonna tell you what's right" },
    { time: 95,  text: "It's late at night, I'm calling" },
    { time: 99,  text: "Is this what you wanted?" },
    { time: 103, text: "Where'd you go?" },
    { time: 107, text: '' },
    { time: 109, text: "Location unknown, and I'm on my own" },
    { time: 114, text: 'Where did you go? Where did you go?' },
    { time: 119, text: '' },
    { time: 121, text: "I don't know where you're going" },
    { time: 125, text: "But do you got room for one more troubled soul?" },
    { time: 130, text: "I don't know where I'm going" },
    { time: 134, text: "But I don't think I'm coming home" },
    { time: 138, text: '' },
    { time: 140, text: 'Location unknown' },
    { time: 145, text: "Your location's unknown" },
    { time: 150, text: "And I'm the one who should be next to you" },
    { time: 155, text: '' },
    { time: 157, text: 'Searching for your signal in the dark...' },
    { time: 165, text: '♪ ♪ ♪' },
  ];

  // ─── Build Lyrics DOM ──────────────────────────────
  var lyricsContainer = document.getElementById('lyricsContainer');

  lyricsData.forEach(function (item) {
    var line = document.createElement('div');
    line.className = 'lyric-line' + (item.text === '' ? ' spacer' : '');
    line.textContent = item.text;
    lyricsContainer.appendChild(line);
  });

  var lyricEls = lyricsContainer.querySelectorAll('.lyric-line');

  function highlightLyric(currentTime) {
    var activeIdx = -1;
    for (var i = lyricsData.length - 1; i >= 0; i--) {
      if (currentTime >= lyricsData[i].time) {
        activeIdx = i;
        break;
      }
    }
    lyricEls.forEach(function (el, idx) {
      el.classList.remove('active', 'past');
      if (idx === activeIdx) {
        el.classList.add('active');
      } else if (idx < activeIdx) {
        el.classList.add('past');
      }
    });

    // auto-scroll to active lyric
    if (activeIdx >= 0 && lyricEls[activeIdx]) {
      lyricEls[activeIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ─── Intersection Observer for fade-in on scroll ──
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.lyric-line').forEach(function (el) {
    observer.observe(el);
  });
})();
