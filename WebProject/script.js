document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const totalSlides = dots.length;

    // Function to move to a specific slide
    function goToSlide(index) {
        currentIndex = index;
        const offset = -index * (100 / totalSlides);
        slider.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
    }, 5000);

    // Simple Hamburger Click Log
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        console.log("Menu Opened");
        // You can add a side-drawer menu toggle here later
    });
});

// Smooth Scroll to Top
document.getElementById('back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});