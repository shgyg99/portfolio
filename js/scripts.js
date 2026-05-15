const modalLinks = document.querySelectorAll('.projects__list-modal');
const closeButtons = document.querySelectorAll('.modal__close-button');
const modals = document.querySelectorAll('.modal');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const typingEl = document.querySelector('.header__content-title');

const openModal = modal => {
  if (!modal) return;
  modal.classList.add('show');
  requestAnimationFrame(() => modal.classList.add('visible'));
  document.body.style.overflow = 'hidden';
};

const closeModal = modal => {
  if (!modal) return;
  modal.classList.remove('visible');
  modal.addEventListener(
    'transitionend',
    function handleTransition() {
      modal.classList.remove('show');
      modal.removeEventListener('transitionend', handleTransition);
    },
    { once: true }
  );
  document.body.style.overflow = '';
};

modalLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const modalId = this.dataset.modal;
    const modal = document.getElementById(modalId);
    openModal(modal);
  });
});

closeButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    const modal = this.closest('.modal');
    closeModal(modal);
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', function (e) {
    if (e.target === this) {
      closeModal(this);
    }
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    modals.forEach(closeModal);
  }
});

const revealTargets = document.querySelectorAll('header, main section, .card, .articles article, .work, .skill_list li');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach(target => {
  target.classList.add('reveal');
  revealObserver.observe(target);
});

const typedWords = typingEl?.dataset?.typing ? JSON.parse(typingEl.dataset.typing) : [];
let typeIndex = 0;
let charIndex = 0;
let deleting = false;

const typeLoop = () => {
  if (!typingEl || typedWords.length === 0) return;
  const currentWord = typedWords[typeIndex];
  
  let currentText;
  if (deleting) {
    currentText = currentWord.slice(0, charIndex - 1);
  } else {
    currentText = currentWord.slice(0, charIndex + 1);
  }
  
  typingEl.textContent = currentText;

  if (!deleting && charIndex + 1 === currentWord.length) {
    deleting = true;
    setTimeout(typeLoop, 1200); 
    return;
  }

  if (deleting && charIndex - 1 === 0) {
    deleting = false;
    typeIndex = (typeIndex + 1) % typedWords.length;
    setTimeout(typeLoop, 30);
    return;
  }

  if (deleting) {
    charIndex = charIndex - 1;
  } else {
    charIndex = charIndex + 1;
  }
  
  const delay = deleting ? 30 : 40;
  setTimeout(typeLoop, delay);
};

charIndex = -1;
typeLoop();

const articleCards = document.querySelectorAll('.articles article');
articleCards.forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const rotateX = (y / rect.height) * -12;
    const rotateY = (x / rect.width) * 12;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('active', window.scrollY > 300);
});

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
