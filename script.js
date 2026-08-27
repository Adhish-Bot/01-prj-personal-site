const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsObserver = 'IntersectionObserver' in window;
const revealTargets = document.querySelectorAll('.section, .project-card');
const backToTop = document.querySelector('.back-to-top');
const navLinks = document.querySelectorAll('.nav-link');
const navSections = document.querySelectorAll('#overview, #goals, #featured-work');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});

function updateScrollControls() {
  if (window.scrollY < 80) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#top');
    });
  }

  if (backToTop) {
    backToTop.classList.toggle('is-visible', window.scrollY > 360);
  }
}

window.addEventListener('scroll', updateScrollControls, { passive: true });
updateScrollControls();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

if (!prefersReducedMotion && supportsObserver && revealTargets.length > 0) {
  document.body.classList.add('js-enabled');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px'
  });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (!prefersReducedMotion) {
  const heading = document.querySelector('h1');

  if (heading) {
    const headingText = heading.textContent;
    heading.setAttribute('aria-label', headingText);
    heading.setAttribute('role', 'text');
    heading.innerHTML = headingText.split(' ').map((word, index) => (
      `<span class="hero-heading-word" style="animation-delay: ${index * 45}ms">${word}</span>`
    )).join(' ');
  }

  const supportsTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsTilt) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const xRotation = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
        const yRotation = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
        card.style.transform = `translateY(-4px) scale(1.01) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }
}

if (supportsObserver && navLinks.length > 0 && navSections.length > 0) {
  const navSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
            const linkTarget = link.getAttribute('href') === '#top'
              ? '#overview'
              : link.getAttribute('href');
            link.classList.toggle('is-active', linkTarget === `#${entry.target.id}`);
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -60%'
  });

  navSections.forEach((section) => navSectionObserver.observe(section));
}
