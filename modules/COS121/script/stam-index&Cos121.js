const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () =>{
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  
});
