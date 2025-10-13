let button = document.querySelector('#theme').addEventListener('click', theme);

        function theme(){
            let currentTheme = document.body.className || localStorage.getItem('userTheme') || 'light';
            setTheme(currentTheme);
        }
        // save the user's theme choice
        function setTheme(theme) {
            let inTheme = theme;
            if(inTheme == 'dark'){
                theme = 'light';
            }
            else{
                theme='dark';
            }
            localStorage.setItem('userTheme', theme);
            document.body.className = theme;
        }

        // Load saved theme on page load
        window.addEventListener('load', function() {
            const savedTheme = localStorage.getItem('userTheme') || 'light';
            document.body.className = savedTheme;
        });

        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Toggle menu to spead its legs and close them on button click
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });

        //close menu if you click outside of it
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            navMenu.classList.remove('show');
            }
        });