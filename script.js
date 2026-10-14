// Project carousel. Moves each card's screenshots into a fanned stack with
// prev/next controls. Without JS the cards just stack normally.

(function () {
  var work = document.getElementById('work');
  if (!work) return;

  var cards = Array.prototype.slice.call(work.querySelectorAll('.card-frame'));
  var n = cards.length;
  if (n < 2) return;

  var STEPS = [
    { x: 0, scale: 1, opacity: 1, brightness: 1, z: 30 },
    { x: 58, scale: 0.82, opacity: 0.9, brightness: 0.35, z: 20 },
    { x: 100, scale: 0.68, opacity: 0.7, brightness: 0.2, z: 10 },
  ];

  var names = cards.map(function (card) {
    return card.querySelector('h3').textContent.replace('→', '').trim();
  });
  var taglines = cards.map(function (card) {
    var t = card.querySelector('.tagline');
    return t ? t.textContent.replace(/^.*?—\s*/, '').trim() : '';
  });

  work.classList.add('is-carousel');

  // stage
  var stage = document.createElement('div');
  stage.className = 'cf-stage';
  stage.setAttribute('role', 'group');
  stage.setAttribute('aria-roledescription', 'carousel');
  stage.setAttribute('aria-label', 'Projects');
  stage.tabIndex = 0;

  var slides = cards.map(function (card, i) {
    var slide = document.createElement('div');
    slide.className = 'cf-slide';
    var devices = card.querySelector('.devices');
    slide.appendChild(devices);
    slide.addEventListener('click', function (e) {
      if (dragged) { e.preventDefault(); dragged = false; return; }
      if (i !== active) {
        e.preventDefault();
        show(i);
      }
    });
    stage.appendChild(slide);
    return slide;
  });

  // hidden copy of a slide gives the stage its height (slides are absolute)
  var sizer = document.createElement('div');
  sizer.className = 'cf-sizer';
  sizer.setAttribute('aria-hidden', 'true');
  sizer.appendChild(slides[0].firstChild.cloneNode(true));
  stage.insertBefore(sizer, stage.firstChild);

  // caption + controls
  var caption = document.createElement('p');
  caption.className = 'cf-caption';
  caption.setAttribute('aria-live', 'polite');

  var controls = document.createElement('div');
  controls.className = 'cf-controls';

  function arrow(dir) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cf-arrow';
    b.setAttribute('aria-label', dir < 0 ? 'Previous project' : 'Next project');
    b.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      (dir < 0 ? '<path d="M15 5l-7 7 7 7"/>' : '<path d="M9 5l7 7-7 7"/>') +
      '</svg>';
    b.addEventListener('click', function () { go(dir); });
    return b;
  }

  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'cf-dots';
  var dots = names.map(function (name, i) {
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'cf-dot';
    d.setAttribute('aria-label', 'Show ' + name);
    d.addEventListener('click', function () { show(i); });
    dotsWrap.appendChild(d);
    return d;
  });

  controls.appendChild(arrow(-1));
  controls.appendChild(dotsWrap);
  controls.appendChild(arrow(1));

  var label = work.querySelector('.eyebrow');
  label.after(stage, caption, controls);

  // state
  var active = 0;
  var dragged = false;

  function offsetOf(i) {
    var half = Math.floor(n / 2);
    var d = i - active;
    if (d > half) d -= n;
    if (d < -half) d += n;
    return d;
  }

  function show(i) {
    active = (i + n) % n;

    slides.forEach(function (slide, j) {
      var d = offsetOf(j);
      var far = Math.abs(d) >= STEPS.length;
      var step = STEPS[Math.min(Math.abs(d), STEPS.length - 1)];
      slide.style.transform = 'translateX(' + Math.sign(d) * step.x + '%) scale(' + step.scale + ')';
      slide.style.opacity = far ? 0 : step.opacity;
      slide.style.filter = 'brightness(' + step.brightness + ')';
      slide.style.zIndex = step.z;
      slide.classList.toggle('is-front', d === 0);
      // only the front slide is clickable through to the site
      slide.firstChild.inert = d !== 0;
      slide.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    });

    cards.forEach(function (card, j) { card.hidden = j !== active; });

    dots.forEach(function (dot, j) {
      if (j === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    caption.innerHTML =
      '<span class="cf-num">' + String(active + 1).padStart(2, '0') + '</span> ' +
      '<strong>' + names[active] + '</strong>' +
      (taglines[active] ? ' <span class="cf-tag">' + taglines[active] + '</span>' : '');
  }

  function go(delta) { show(active + delta); }

  // arrow keys
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });

  // swipe support; ignore the click that fires at the end of a drag
  var startX = null;
  stage.addEventListener('pointerdown', function (e) { startX = e.clientX; dragged = false; });
  stage.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      dragged = true;
      go(dx < 0 ? 1 : -1);
    }
  });

  show(0);
})();
