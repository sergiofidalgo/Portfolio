// --- CONSTANTS ---
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const handImg = document.getElementById('handImage');
    // Cached DOM Elements
    const clockElement = document.getElementById('clock');
    const clockDotElement = document.getElementById('clockDot');
    const homeContentEl = document.getElementById('homeContent');
    const aboutContentEl = document.getElementById('aboutContent');
    const workContentEl = document.getElementById('workContent');
    const aiDisclaimerEl = document.getElementById('aiDisclaimer');
    const preloaderEl = document.getElementById('preloader'); // For showPageContent

    const HUMAN_WIDTH = 1618.9, HUMAN_HEIGHT = 1079;
    const screenInset = { top: 0.0973, left: 0.3760, width: 0.2632, height: 0.8007 };

    // --- CLOCK & DOT ---
    function updateClock() {
      const now = new Date();
      if (clockElement) { // Check if element exists
        clockElement.innerText = now.toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Prague'
        }) + " Europe/Prague";
      }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- BLINKING DOT ---
    setInterval(() => {
      if (clockDotElement) { // Check if element exists
        clockDotElement.style.opacity = (clockDotElement.style.opacity === '0' ? '1' : '0');
      }
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

      // Use cached elements for content sections
      [homeContentEl, aboutContentEl, workContentEl].forEach(el => {
        if (el) { // Check if element exists
            el.style.left = frame.x + "px";
            el.style.top = frame.y + "px";
            el.style.width = frame.w + "px";
            el.style.height = frame.h + "px";
        }
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
      bg.src = "pics/background.png";
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
  { home: "pics/Human.png", about: "pics/Human-white.png" },
  { home: "pics/Alien.png", about: "pics/Alien-white.png" },
  { home: "pics/Bones.png", about: "pics/Bones-white.png" },
  { home: "pics/Cyberpunk.png", about: "pics/Cyberpunk-white.png" },
  { home: "pics/Grandma.png", about: "pics/Grandma-white.png" },
  { home: "pics/Robot.png", about: "pics/Robot-white.png" },
  { home: "pics/Mockup.png", about: "pics/Mockup-white.png" },
  { home: "pics/Pixel.png", about: "pics/Pixel-white.png" },
  { home: "pics/Manga.png", about: "pics/Manga-white.png" },
  { home: "pics/Illustration.png", about: "pics/Illustration-white.png" },
  { home: "pics/Clay.png", about: "pics/Clay-white.png" }
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
      // Hide homeContentEl
      if (homeContentEl) {
        homeContentEl.style.opacity = '0';
        homeContentEl.style.visibility = 'hidden';
        homeContentEl.style.display = 'none';
      }
      // Hide workContentEl
      if (workContentEl) {
        workContentEl.style.opacity = '0';
        workContentEl.style.visibility = 'hidden';
        workContentEl.style.display = 'none';
      }
      
      // Show aboutContentEl
      if (aboutContentEl) {
        aboutContentEl.style.visibility = 'hidden'; // Start hidden
        aboutContentEl.style.opacity = '0';         // Start transparent
        aboutContentEl.style.display = 'block';     // Make it part of layout
        aboutContentEl.offsetHeight;                // Force reflow
        aboutContentEl.style.visibility = 'visible';// Make it visible
        aboutContentEl.style.opacity = '1';         // Trigger fade-in
        aboutContentEl.scrollTop = 0;
      }
      if (handImg && selectedHand) handImg.src = selectedHand.about;
    }

    function openWork() {
      // Hide homeContentEl
      if (homeContentEl) {
        homeContentEl.style.opacity = '0';
        homeContentEl.style.visibility = 'hidden';
        homeContentEl.style.display = 'none';
      }
      // Hide aboutContentEl
      if (aboutContentEl) {
        aboutContentEl.style.opacity = '0';
        aboutContentEl.style.visibility = 'hidden';
        aboutContentEl.style.display = 'none';
      }

      // Show workContentEl
      if (workContentEl) {
        workContentEl.style.visibility = 'hidden'; // Start hidden
        workContentEl.style.opacity = '0';         // Start transparent
        workContentEl.style.display = 'block';     // Make it part of layout
        workContentEl.offsetHeight;                // Force reflow
        workContentEl.style.visibility = 'visible';// Make it visible
        workContentEl.style.opacity = '1';         // Trigger fade-in
        workContentEl.scrollTop = 0;
      }
      if (handImg && selectedHand) handImg.src = selectedHand.about;
    }

    function backToHome() {
      // Hide aboutContentEl
      if (aboutContentEl) {
        aboutContentEl.style.opacity = '0';
        aboutContentEl.style.visibility = 'hidden';
        aboutContentEl.style.display = 'none';
      }
      // Hide workContentEl
      if (workContentEl) {
        workContentEl.style.opacity = '0';
        workContentEl.style.visibility = 'hidden';
        workContentEl.style.display = 'none';
      }

      // Show homeContentEl
      if (homeContentEl) {
        homeContentEl.style.visibility = 'hidden'; // Start hidden
        homeContentEl.style.opacity = '0';         // Start transparent
        homeContentEl.style.display = 'flex';      // Make it part of layout
        homeContentEl.offsetHeight;                // Force reflow
        homeContentEl.style.visibility = 'visible';// Make it visible
        homeContentEl.style.opacity = '1';         // Trigger fade-in
      }
      if (handImg && selectedHand) handImg.src = selectedHand.home;
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
        if (!activeLink) { // Check 1 from instructions
            clearTimeout(cycleTimeout);
            return;
        }
        if (!sources.length || frameIdx >= sources.length) { // Ensure frameIdx is within bounds
             if (sources.length > 0) frameIdx = 0; // Loop if sources exist
             else { // No sources, reset
                 resetPreview(); 
                 return;
             }
        }

        const source = sources[frameIdx];
        const ext = source.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);

        preview.innerHTML = ''; // Check 1 (modified) from instructions: Clear before adding new media

        if (isImage) {
            const img = new Image();
            img.src = source;
            img.onload = () => {
                if (!activeLink) return; // Check again in async callback
                addMediaElement(img);
                frameIdx = (frameIdx + 1) % sources.length;
                cycleTimeout = setTimeout(stackNextMedia, 10); // Reduced timeout for faster image transition
            };
            img.onerror = () => { // Check 1 from instructions
                if (!activeLink) return;
                console.error("Error loading image:", source);
                frameIdx = (frameIdx + 1) % sources.length;
                cycleTimeout = setTimeout(stackNextMedia, 100); 
            };
        } else if (isVideo) {
            const video = document.createElement('video');
            video.src = source;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            video.controls = false; // Keep controls false as per original

            video.oncanplay = () => {
                if (!activeLink) return; // Check again in async callback
                addMediaElement(video);
                video.play();
            };
            video.onended = () => {
                if (!activeLink) return;
                frameIdx = (frameIdx + 1) % sources.length;
                stackNextMedia(); // Videos transition on onended
            };
            video.onerror = () => { // Check 1 from instructions
                if (!activeLink) return;
                console.error("Error loading video:", source);
                frameIdx = (frameIdx + 1) % sources.length;
                cycleTimeout = setTimeout(stackNextMedia, 100);
            };
        } else {
            // Check 1 from instructions: Handle unknown extensions
            console.warn("Unknown media type:", source);
            frameIdx = (frameIdx + 1) % sources.length;
            cycleTimeout = setTimeout(stackNextMedia, 50);
        }
    }
    
    function startPreview(linkElement) { // Check 3 from instructions
        clearTimeout(cycleTimeout); // Check 3 from instructions

        sources = (linkElement.dataset.sources || '').split(',').map(s => s.trim()).filter(Boolean);
        if (!sources.length) return;

        frameIdx = 0;
        activeLink = linkElement; // Set the new active link

        if (!isMobile) { // Desktop specific dimming
            activeLink.classList.add('active-blend');
            document.querySelectorAll('a.preview-link').forEach(other => {
                if (other !== activeLink) {
                    other.classList.remove('active-blend');
                    other.style.opacity = '0.1';
                }
            });
            document.querySelectorAll('#aboutContent p, #workContent p').forEach(p => { // Check 3 from instructions
                if (!p.contains(activeLink)) p.style.opacity = '0.05';
            });
        } else { // Mobile specific highlighting (if any)
            activeLink.classList.add('active-blend'); // Keep consistent blend mode if used on mobile
        }
        
        preview.innerHTML = ''; // Clear preview before starting
        preview.style.display = 'block';
        stackNextMedia();
    }

    function resetPreview() {
        const previouslyActiveLink = activeLink; // Store for potential class removal
        activeLink = null; // Check 2 from instructions: Set activeLink to null first
        clearTimeout(cycleTimeout);

        if (previouslyActiveLink) previouslyActiveLink.classList.remove('active-blend');
        
        document.querySelectorAll('a.preview-link').forEach(other => other.style.opacity = '');
        document.querySelectorAll('#aboutContent p, #workContent p').forEach(p => p.style.opacity = ''); // Check 2 from instructions
        
        preview.innerHTML = '';
        preview.style.display = 'none';
    }

    // Global tap to close logic (outside the active link)
    if (isMobile) {
        document.body.addEventListener('click', (e) => {
            // Check 6 from instructions
            if (activeLink && !activeLink.contains(e.target) && !preview.contains(e.target)) {
                resetPreview();
            }
        }, true); // capture phase to catch early
    }

    document.querySelectorAll('a.preview-link:not(.no-preview)').forEach(link => {
        if (isMobile) {
            // Check 4 from instructions: Mobile Click Logic
            link.addEventListener('click', (e) => {
                if (activeLink === link) { 
                    resetPreview(); 
                    // Allow default navigation by not calling e.preventDefault() and returning
                    return; 
                }

                e.preventDefault(); 

                if (activeLink && activeLink !== link) { 
                    resetPreview(); // Reset if a *different* link was active
                }
                startPreview(link); // Use link (e.currentTarget)
            });
        } else {
            // Desktop hover behavior
            link.addEventListener('mouseenter', () => {
                if (activeLink && activeLink !== link) { // If another link's preview is active, reset it first
                    resetPreview();
                }
                startPreview(link);
            });

            // Check 5 from instructions: Desktop mouseleave logic
            link.addEventListener('mouseleave', () => {
                if (activeLink === link) { 
                    resetPreview();
                }
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
    // Note: The original code had two functions named closeDisclaimer.
    // Assuming the second one is the intended one to be called by the button.
    // The first one was immediately overwritten.
    
    // This function is defined but immediately overwritten by the one below.
    // function closeDisclaimer() { 
    //   if(aiDisclaimerEl) aiDisclaimerEl.style.display = 'none';
    // }

    // Check if disclaimer has already been dismissed in this session
    if (aiDisclaimerEl) { // Check if element exists
        if (!sessionStorage.getItem('aiDisclaimerDismissed')) {
          aiDisclaimerEl.style.display = 'block';
        } else {
          aiDisclaimerEl.style.display = 'none';
        }
    }

    function closeDisclaimer() { // This is the one that will actually be used
      if (aiDisclaimerEl) aiDisclaimerEl.style.display = 'none';
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


      // Measurement Phase
      tooltip.style.display = 'block';
      tooltip.style.visibility = 'hidden'; // Keep hidden during measurement
      tooltip.style.opacity = '0';         // Ensure fully transparent
      tooltip.style.transform = 'translateY(8px)'; // Reset to its base CSS transform for consistent measurement start
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      // Position Calculation Phase
      const rect = link.getBoundingClientRect();
      const isMobile = window.innerWidth <= 560;
      const margin = 8; // Small margin from viewport edges

      let newTop = rect.bottom + window.scrollY + margin; // Default position below the link
      let newLeft = rect.left + window.scrollX;         // Default left alignment

      if (isMobile) {
          // Adjust newLeft
          if (newLeft < margin) {
              newLeft = margin;
          } else if (newLeft + tooltipWidth > window.innerWidth - margin) {
              newLeft = window.innerWidth - tooltipWidth - margin;
          }

          // Adjust newTop
          if (newTop + tooltipHeight > window.innerHeight + window.scrollY - margin) { // If overflows bottom
              newTop = rect.top + window.scrollY - tooltipHeight - margin; // Try placing above link
              // If it also overflows top when placed above, or if default was already too high
              if (newTop < window.scrollY + margin) { 
                  newTop = window.scrollY + margin; 
                  // Optional: Adjust max-height if still too tall for viewport
                  // if (tooltipHeight > window.innerHeight - 2 * margin) {
                  //     tooltip.style.maxHeight = (window.innerHeight - 2 * margin) + 'px';
                  //     tooltip.style.overflowY = 'auto';
                  // }
              }
          } else {
            // Ensure newTop is not less than scrollY + margin even if it didn't overflow bottom
             if (newTop < window.scrollY + margin) {
                  newTop = window.scrollY + margin;
             }
          }
      } else { // Desktop default positioning (can be refined similarly if needed)
            newLeft = rect.left + window.scrollX;
            newTop = rect.bottom + window.scrollY + 8; // Existing 8px margin for desktop
            // Basic desktop boundary checks (can be expanded)
            if (newLeft + tooltipWidth > window.innerWidth - margin) {
                newLeft = window.innerWidth - tooltipWidth - margin;
            }
            if (newLeft < margin) {
                newLeft = margin;
            }
      }
      
      // Apply Position and Animation
      tooltip.style.top = newTop + 'px';
      tooltip.style.left = newLeft + 'px';
      tooltip.style.visibility = 'visible'; // Make it visible now it's positioned

      // Animate opacity and transform
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

// --- PRELOADER LOGIC ---
function showPageContent() {
    if (preloaderEl) { // Use cached element
        preloaderEl.style.display = 'none';
    }

    if (homeContentEl) { // Use cached element
        // Apply the 6-step pattern for showing homeContentEl
        homeContentEl.style.visibility = 'hidden'; // 1. Start hidden (explicitly, though CSS also does this)
        homeContentEl.style.opacity = '0';         // 2. Start transparent (explicitly, though CSS also does this)
        homeContentEl.style.display = 'flex';      // 3. Ensure it's part of layout (CSS should have this, but confirming is safe)
        homeContentEl.offsetHeight;                // 4. Force reflow
        homeContentEl.style.visibility = 'visible';// 5. Make it visible
        homeContentEl.style.opacity = '1';         // 6. Trigger fade-in (CSS transition handles this)
    }
    
    // Potentially show other content sections if one of them was the active one,
    // but for now, the FOUC fix is primarily for the initial load of homeContent.
    // If aboutContent or workContent were the entry point, they'd need similar treatment.
    // For example, if 'aboutContent' was meant to be visible:
    // const aboutContent = aboutContentEl; // Use cached element
    // if (aboutContent && aboutContent.style.display === 'block') { // Or however its visibility is determined
    //     aboutContent.style.opacity = '1';
    //     aboutContent.style.visibility = 'visible';
    // }

    document.body.classList.add('preload-finished');
}

// Refined Preloader Trigger: Call showPageContent when all resources are loaded
window.onload = showPageContent;
