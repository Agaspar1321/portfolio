// Hero card: click (or Enter/Space) flips it to the stats on the back.

(function () {
  var card = document.querySelector('.tcard');
  if (!card) return;

  function flip() {
    var flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    card.querySelector('.tcard-front').setAttribute('aria-hidden', flipped ? 'true' : 'false');
    card.querySelector('.tcard-back').setAttribute('aria-hidden', flipped ? 'false' : 'true');
  }

  card.addEventListener('click', flip);
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
  });
})();

// Hero slab: tilts toward the cursor and moves the glare.

(function () {
  var slab = document.querySelector('.slab');
  if (!slab || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;

  slab.addEventListener('pointermove', function (e) {
    var r = slab.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width;
    var y = (e.clientY - r.top) / r.height;
    slab.classList.add('is-tilting');
    slab.style.setProperty('--tilt-y', (x - 0.5) * 14 + 'deg');
    slab.style.setProperty('--tilt-x', (0.5 - y) * 14 + 'deg');
    slab.style.setProperty('--shine-x', x * 100 + '%');
    slab.style.setProperty('--shine-y', y * 100 + '%');
  });
  slab.addEventListener('pointerleave', function () {
    slab.classList.remove('is-tilting');
    ['--tilt-x', '--tilt-y', '--shine-x', '--shine-y'].forEach(function (p) { slab.style.removeProperty(p); });
  });
})();
