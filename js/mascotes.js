document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((openItem) => {
      if (openItem !== item) openItem.removeAttribute('open');
    });
  });
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.material-track');
  const slides = [...track.children];
  const dots = [...carousel.querySelectorAll('.material-dots button')];
  let current = 0;
  let timer;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
  };

  const startCarousel = () => {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 3200);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startCarousel();
    });
  });

  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', startCarousel);
  startCarousel();
});

const UTM_STORAGE_KEY = 'mascotes_checkout_utms';

const getCheckoutUtms = () => {
  const savedUtms = new URLSearchParams(sessionStorage.getItem(UTM_STORAGE_KEY) || '');
  const currentParams = new URLSearchParams(window.location.search);

  currentParams.forEach((value, key) => {
    if (/^utm_/i.test(key)) savedUtms.set(key, value);
  });

  sessionStorage.setItem(UTM_STORAGE_KEY, savedUtms.toString());
  return savedUtms;
};

const addUtmsToCheckout = (link, utms) => {
  const checkoutUrl = new URL(link.href);
  utms.forEach((value, key) => checkoutUrl.searchParams.set(key, value));
  link.href = checkoutUrl.toString();
};

const checkoutLinks = document.querySelectorAll('a[href*="pay.wiapy.com"]');

checkoutLinks.forEach((link) => {
  addUtmsToCheckout(link, getCheckoutUtms());
  link.addEventListener('click', () => addUtmsToCheckout(link, getCheckoutUtms()));
});
