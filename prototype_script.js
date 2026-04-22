document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Active State Toggling
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');
        });
    });

    // 2. Animate Circular Progress Bar on Load
    // We set a small delay so the animation smoothly plays after rendering
    setTimeout(() => {
        const progressCircle = document.querySelector('.circular-progress circle.progress');
        if (progressCircle) {
            // 78% of 283 circumference = ~220. 283 - 220 = 63 stroke-dashoffset
            progressCircle.style.strokeDashoffset = '62';
        }
    }, 100);

    // 3. Simple Search Interaction simulation
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value;
                if (query.trim() !== '') {
                    console.log(`Searching for: ${query}`);
                    // simulate loading
                    const btn = document.querySelector('.search-bar i');
                    btn.classList.remove('fa-search');
                    btn.classList.add('fa-spinner', 'fa-spin');
                    
                    setTimeout(() => {
                        btn.classList.remove('fa-spinner', 'fa-spin');
                        btn.classList.add('fa-search');
                        alert(`Search results for "${query}" would appear here.`);
                    }, 800);
                }
            }
        });
    }

    // 4. Interactive buttons mock
    const allBtns = document.querySelectorAll('button');
    allBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Prevents immediate actions if none are defined
            if (!this.classList.contains('notification-btn')) {
                // Add tiny click feedback effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }
        });
    });
});
