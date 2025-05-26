document.addEventListener('DOMContentLoaded', function() {
    // Interactive Background Setup
    const canvas = document.getElementById('interactive-background');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 100; // Adjust for performance/density
    let mouse = {
        x: null,
        y: null,
        radius: 100 // Area of interaction
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize(); // Initial size set

    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`; // Colorful particles
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dxToBase = this.x - this.baseX;
                    this.x -= dxToBase / 10;
                }
                if (this.y !== this.baseY) {
                    let dyToBase = this.y - this.baseY;
                    this.y -= dyToBase / 10;
                }
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particlesArray.push(new Particle(x, y));
        }
    }
    initParticles();

    function connectParticles(){
        let opacityValue = 1;
        for(let a = 0; a < particlesArray.length; a++){
            for(let b = a; b < particlesArray.length; b++){
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if(distance < 50){ // Distance to connect
                    opacityValue = 1 - (distance/50);
                    ctx.strokeStyle = `hsla(${particlesArray[a].color.match(/\d+/)[0]}, 70%, 60%, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
            particlesArray[i].update();
        }
        connectParticles(); // Optional: connect nearby particles
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Original Date Info Logic (ensure it's still here and working)
    // ... (keep existing date logic below or integrate carefully)

    // Make sure the rest of your original script for date calculation is below this line
    // or integrate it if there are dependencies.
    // For now, I'll assume it's separate and just add the background logic above it.


    const currentDateElem = document.getElementById('current-date');
    const dayOfYearElem = document.getElementById('day-of-year');
    const percentageOfYearElem = document.getElementById('percentage-of-year');
    const progressBarElem = document.getElementById('progress-bar');
    const progressTextElem = document.getElementById('progress-text');
    const yearGridElem = document.getElementById('year-grid');

    function updateDateInfo() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const year = now.getFullYear();
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const totalDaysInYear = isLeapYear ? 366 : 365;

        const percentage = (dayOfYear / totalDaysInYear) * 100;

        currentDateElem.textContent = now.toLocaleDateString('zh-CN');
        dayOfYearElem.textContent = dayOfYear;
        percentageOfYearElem.textContent = percentage.toFixed(2) + '%';

        progressBarElem.style.width = percentage.toFixed(2) + '%';
        progressTextElem.textContent = percentage.toFixed(1) + '%';

        // Generate year grid
        yearGridElem.innerHTML = ''; // Clear previous grid
        for (let i = 1; i <= totalDaysInYear; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');

            // Determine the actual date for day i
            const cellDate = new Date(year, 0, i); // Month is 0-indexed, day is 1-indexed

            if (i < dayOfYear) {
                dayCell.classList.add('passed');
            } else if (i === dayOfYear) {
                dayCell.classList.add('today');
                dayCell.classList.add('passed'); // Mark today as passed as well for color consistency
            }

            // Check for month start
            if (cellDate.getDate() === 1) {
                dayCell.classList.add('month-start');
            }

            // Check for week start (Monday, getDay() returns 1 for Monday)
            if (cellDate.getDay() === 1) {
                dayCell.classList.add('week-start');
            }

            dayCell.setAttribute('title', `${year}年${cellDate.getMonth() + 1}月${cellDate.getDate()}日, 第 ${i} 天`); // Add a more detailed tooltip
            yearGridElem.appendChild(dayCell);
        }
    }

    updateDateInfo();
});