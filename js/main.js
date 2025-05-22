// --- CONSTANTS ---
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const handImg = document.getElementById('handImage');

    const HUMAN_WIDTH = 1618.9, HUMAN_HEIGHT = 1079;
    const screenInset = { top: 0.0973, left: 0.3760, width: 0.2632, height: 0.8007 };

    // --- CLOCK & DOT ---
    function updateClock() {
      const now = new Date();
      document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Prague'
      }) + " Europe/Prague";
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- BLINKING DOT ---
    setInterval(() => {
      const dot = document.getElementById('clockDot');
      dot.style.opacity = (dot.style.opacity === '0' ? '1' : '0');
    }, 500);

    // --- RESIZE FUNCTION ---
    function resizeAll() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const isMobile = window.innerWidth <= 560;
      const availableHeight = isMobile ? window.innerHeight : window.innerHeight * 0.95;
      const humanHeight = availableHeight;
      const humanWidth = humanHeight * (HUMAN_WIDTH / HUMAN_HEIGHT);
      const humanX = (window.innerWidth - humanWidth) / 2;
      const humanY = window.innerHeight - humanHeight;

      const frame = isMobile ?
        { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight } :
        {
          x: humanX + humanWidth * screenInset.left,
          y: humanY + humanHeight * screenInset.top,
          w: humanWidth * screenInset.width,
          h: humanHeight * screenInset.height
        };

      ['homeContent', 'aboutContent', 'workContent'].forEach(id => {
        const el = document.getElementById(id);
        el.style.left = frame.x + "px";
        el.style.top = frame.y + "px";
        el.style.width = frame.w + "px";
        el.style.height = frame.h + "px";
      });

      handImg.style.left = humanX + "px";
      handImg.style.top = humanY + "px";
      handImg.style.width = humanWidth + "px";
      handImg.style.height = humanHeight + "px";
    }

    // --- DRAW BACKGROUND ---
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bg = new Image();
      bg.src = "images/background.png";
      bg.onload = () => ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', () => {
      resizeAll();
      draw();
    });

    resizeAll();
    draw();

    // --- HAND IMAGE OPTIONS ---
const handOptions = [
  { home: "images/Human.png", about: "images/Human-white.png" },
  { home: "images/Alien.png", about: "images/Alien-white.png" },
  { home: "images/Bones.png", about: "images/Bones-white.png" },
  { home: "images/Cyberpunk.png", about: "images/Cyberpunk-white.png" },
  { home: "images/Grandma.png", about: "images/Grandma-white.png" },
  { home: "images/Robot.png", about: "images/Robot-white.png" },
  { home: "images/Mockup.png", about: "images/Mockup-white.png" },
  { home: "images/Pixel.png", about: "images/Pixel-white.png" },
  { home: "images/Manga.png", about: "images/Manga-white.png" },
  { home: "images/Illustration.png", about: "images/Illustration-white.png" },
  { home: "images/Clay.png", about: "images/Clay-white.png" }
];
const nonMockupOptions = handOptions.filter(h => !h.home.includes("Mockup"));


let selectedHand;

if (!sessionStorage.getItem('seenHand')) {
  // First time ever — show Mockup, but preselect next
  const mockupIndex = handOptions.findIndex(h => h.home.includes("Mockup"));
  sessionStorage.setItem('seenHand', 'true');
  sessionStorage.setItem('lastHandIndex', mockupIndex);

  // Preselect a different one for next time
  let secondIndex;
  do {
    secondIndex = handOptions.indexOf(nonMockupOptions[Math.floor(Math.random() * nonMockupOptions.length)]);

  } while (secondIndex === mockupIndex);
  sessionStorage.setItem('nextHandIndex', secondIndex);

  selectedHand = handOptions[mockupIndex];
} else {
  // Second+ visits: use preselected nextHandIndex and compute the next one
  const currentIndex = parseInt(sessionStorage.getItem('nextHandIndex'), 10);
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * handOptions.length);
  } while (nextIndex === currentIndex);

  sessionStorage.setItem('lastHandIndex', currentIndex);
  sessionStorage.setItem('nextHandIndex', nextIndex);
  selectedHand = handOptions[currentIndex];
}

handImg.src = selectedHand.home;




    // --- NAVIGATION ---
    function openAbout() {
      document.getElementById('homeContent').style.display = 'none';
      document.getElementById('workContent').style.display = 'none';
      document.getElementById('aboutContent').style.display = 'block';
      document.getElementById('aboutContent').scrollTop = 0;
      handImg.src = selectedHand.about;
    }

    function openWork() {
      document.getElementById('homeContent').style.display = 'none';
      document.getElementById('aboutContent').style.display = 'none';
      document.getElementById('workContent').style.display = 'block';
      document.getElementById('workContent').scrollTop = 0;
      handImg.src = selectedHand.about;
    }

    function backToHome() {
      document.getElementById('aboutContent').style.display = 'none';
      document.getElementById('workContent').style.display = 'none';
      document.getElementById('homeContent').style.display = 'flex';
      handImg.src = selectedHand.home;
    }

    // --- LINKS HOVER PREVIEW ---
    (function () {
    const preview = document.getElementById('hoverPreview');
    if (!preview) return;

    const isMobile = window.innerWidth <= 560;
    let activeLink = null; // track currently previewing link
    let cycleTimeout = null;
    let frameIdx = 0;
    let sources = [];

    function addMediaElement(el) {
        const rotation = (Math.random() * 14 - 7).toFixed(1);
        el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        el.style.position = 'absolute';
        el.style.top = '35%';
        el.style.left = '50%';
        el.style.zIndex = 1999;
        preview.appendChild(el);
    }

    function stackNextMedia() {
        if (!sources.length) return;

        const source = sources[frameIdx];
        const ext = source.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);

        if (isImage) {
            const img = new Image();
            img.src = source;
            img.onload = () => {
                addMediaElement(img);
                frameIdx = (frameIdx + 1) % sources.length;
                cycleTimeout = setTimeout(stackNextMedia, 800); // 0.8s per image
            };
        }

        if (isVideo) {
            const video = document.createElement('video');
            video.src = source;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            video.controls = false;

            video.oncanplay = () => {
                addMediaElement(video);
                video.play();
            };

            video.onended = () => {
                frameIdx = (frameIdx + 1) % sources.length;
                stackNextMedia();
            };
        }
    }

    function resetPreview() {
        if (activeLink) activeLink.classList.remove('active-blend');
        document.querySelectorAll('a.preview-link').forEach(other => other.style.opacity = '');
        document.querySelectorAll('#aboutContent p').forEach(p => p.style.opacity = '');
        preview.innerHTML = '';
        preview.style.display = 'none';
        clearTimeout(cycleTimeout);
        activeLink = null;
    }

    // Global tap to close logic (outside the active link)
    if (isMobile) {
        document.body.addEventListener('click', (e) => {
            if (activeLink && !activeLink.contains(e.target)) {
                resetPreview();
            }
        }, true); // capture phase to catch early
    }

    document.querySelectorAll('a.preview-link:not(.no-preview)').forEach(link => {
        let tappedOnce = false;

        if (isMobile) {
            link.addEventListener('click', (e) => {
                if (activeLink && activeLink !== link) {
                    resetPreview(); // close any previously open previews
                    tappedOnce = false;
                }

                if (!tappedOnce) {
                    e.preventDefault();
                    sources = (link.dataset.sources || '').split(',').map(s => s.trim()).filter(Boolean);
                    if (!sources.length) return;

                    frameIdx = 0;
                    tappedOnce = true;
                    activeLink = link;

                    // Show preview
                    preview.innerHTML = '';
                    preview.style.display = 'block';
                    link.classList.add('active-blend');
                    stackNextMedia();
                } else {
                    // Second tap follows the link
                    tappedOnce = false;
                    resetPreview();
                    window.location.href = link.href;
                }
            });
        } else {
            // Desktop hover behavior
            link.addEventListener('mouseenter', () => {
                sources = (link.dataset.sources || '').split(',').map(s => s.trim()).filter(Boolean);
                frameIdx = 0;

                activeLink = link;
                link.classList.add('active-blend');
                document.querySelectorAll('a.preview-link').forEach(other => {
                    if (other !== link) {
                        other.classList.remove('active-blend');
                        other.style.opacity = '0.1';
                    }
                });
                document.querySelectorAll('#aboutContent p').forEach(p => {
                    if (!p.contains(link)) p.style.opacity = '0.05';
                });

                preview.innerHTML = '';
                preview.style.display = 'block';
                stackNextMedia();
            });

            link.addEventListener('mouseleave', () => {
                resetPreview();
            });
        }
    });
})();







    // --- PARAGRAPH VISIBILITY (IntersectionObserver) ---
    function setupParagraphObservers() {
      ['aboutContent', 'workContent'].forEach(containerID => {
        const container = document.getElementById(containerID);
        const paragraphs = container.querySelectorAll('p');

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else {
              entry.target.classList.remove('visible');
            }
          });
        }, {
          root: container,
          threshold: 0.5,
          rootMargin: "-22% 0px -30% 0px"
        });

        paragraphs.forEach(p => observer.observe(p));
      });
    }

    setupParagraphObservers();


    // Cookie disclaimer
    function closeDisclaimer() {
      document.getElementById('aiDisclaimer').style.display = 'none';
    }

    // Check if disclaimer has already been dismissed in this session
    if (!sessionStorage.getItem('aiDisclaimerDismissed')) {
      document.getElementById('aiDisclaimer').style.display = 'block';
    } else {
      document.getElementById('aiDisclaimer').style.display = 'none';
    }

    function closeDisclaimer() {
      document.getElementById('aiDisclaimer').style.display = 'none';
      sessionStorage.setItem('aiDisclaimerDismissed', 'true');
    }

    // Tooltip V2
    const tooltip = document.getElementById('tooltipCard');
    let hideTimeout = null;
    let lastHoveredLink = null;

    function showTooltip(link) {
      clearTimeout(hideTimeout);

      lastHoveredLink = link;

      // Get data
      const img = link.getAttribute('data-tooltip-img') || '';
      const title = link.getAttribute('data-tooltip-title') || '';
      const text = link.getAttribute('data-tooltip-text') || '';
      const time = link.getAttribute('data-tooltip-time') || '';

      document.getElementById('tooltipImg').src = img;
      document.getElementById('tooltipTitle').textContent = title;
      document.getElementById('tooltipText').textContent = text;
      document.getElementById('tooltipTime').textContent = time;

      // Position
      const rect = link.getBoundingClientRect();
      tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      tooltip.style.left = (rect.left + window.scrollX) + 'px';

      tooltip.style.display = 'block';
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
      });
    }

    function hideTooltip() {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(8px)';
      hideTimeout = setTimeout(() => {
        tooltip.style.display = 'none';
      }, 300);
    }

    document.querySelectorAll('a.preview-link.type-2').forEach(link => {
      link.addEventListener('mouseenter', () => showTooltip(link));
      link.addEventListener('mouseleave', (e) => {
        if (!e.relatedTarget || !tooltip.contains(e.relatedTarget)) {
          hideTooltip();
        }
      });
    });


    // Hide when leaving tooltip area
    tooltip.addEventListener('mouseleave', () => {
      hideTooltip();
    });
