// GPA Calculator JavaScript
// Developed by Eng. Trez Kweka

class GPACalculator {
    constructor() {
        this.courses = [];
        this.gradeValues = {
            'A': 5,
            'B+': 4,
            'B': 3,
            'C': 2,
            'D': 1,
            'E': 0.5
        };
        
        this.initializeEventListeners();
        this.addInteractiveEffects();
    }

    initializeEventListeners() {
        document.getElementById('setupCoursesBtn').addEventListener('click', () => {
            this.setupCourses();
        });

        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateGPA();
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });

        document.getElementById('courseCount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setupCourses();
            }
        });
    }

    setupCourses() {
        const courseCount = parseInt(document.getElementById('courseCount').value);
        
        if (!courseCount || courseCount < 1 || courseCount > 20) {
            this.showNotification('Please enter a valid number of courses (1-20)', 'error');
            return;
        }

        this.createCourseInputs(courseCount);
        this.showCard('courseDetailsCard');
        this.hideCard('courseNumberCard');
    }

    createCourseInputs(count) {
        const container = document.getElementById('coursesContainer');
        container.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            const courseRow = document.createElement('div');
            courseRow.className = 'course-row';
            courseRow.innerHTML = `
                <div class="course-inputs">
                    <div class="form-group">
                        <label class="form-label course-label">Course ${i}</label>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Credits</label>
                        <input type="number" class="form-input course-credits" 
                               placeholder="e.g., 3" min="0.5" max="10" step="0.5" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Grade</label>
                        <select class="form-select course-grade" required>
                            <option value="">Select Grade</option>
                            <option value="A">A (5.0)</option>
                            <option value="B+">B+ (4.0)</option>
                            <option value="B">B (3.0)</option>
                            <option value="C">C (2.0)</option>
                            <option value="D">D (1.0)</option>
                            <option value="E">E (0.5)</option>
                        </select>
                    </div>
                </div>
            `;
            container.appendChild(courseRow);

            setTimeout(() => {
                courseRow.style.animation = 'slideIn 0.5s ease-out';
            }, i * 100);
        }
    }

    calculateGPA() {
        const courseRows = document.querySelectorAll('.course-row');
        const courses = [];
        let totalCredits = 0;
        let totalGradePoints = 0;
        let isValid = true;

        courseRows.forEach((row, index) => {
            const credits = parseFloat(row.querySelector('.course-credits').value);
            const grade = row.querySelector('.course-grade').value;

            if (!credits || !grade) {
                this.showNotification(`Please fill all fields for Course ${index + 1}`, 'error');
                isValid = false;
                return;
            }

            if (credits < 0.5 || credits > 10) {
                this.showNotification(`Invalid credits for Course ${index + 1}. Must be between 0.5 and 10`, 'error');
                isValid = false;
                return;
            }

            const gradeValue = this.gradeValues[grade];
            const gradePoints = credits * gradeValue;

            courses.push({
                name: `Course ${index + 1}`,
                credits,
                grade,
                gradeValue,
                gradePoints
            });

            totalCredits += credits;
            totalGradePoints += gradePoints;
        });

        if (!isValid) return;

        const gpa = totalGradePoints / totalCredits;
        this.displayResults(gpa, totalCredits, totalGradePoints, courses);
    }

    displayResults(gpa, totalCredits, totalGradePoints, courses) {
        document.getElementById('gpaValue').textContent = gpa.toFixed(2);
        document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
        document.getElementById('totalGradePoints').textContent = totalGradePoints.toFixed(1);

        this.showCard('resultsCard');
        this.hideCard('courseDetailsCard');

        if (gpa >= 4.0) {
            this.celebrateHighGPA();
        }

        this.showNotification(`GPA calculated successfully: ${gpa.toFixed(2)}`, 'success');
    }

    showCard(cardId) {
        const card = document.getElementById(cardId);
        card.classList.remove('hidden');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    hideCard(cardId) {
        document.getElementById(cardId).classList.add('hidden');
    }

    goBack() {
        this.showCard('courseNumberCard');
        this.hideCard('courseDetailsCard');
    }

    reset() {
        document.getElementById('courseCount').value = '';
        document.getElementById('coursesContainer').innerHTML = '';
        
        this.showCard('courseNumberCard');
        this.hideCard('courseDetailsCard');
        this.hideCard('resultsCard');

        this.showNotification('Calculator reset successfully', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius)',
            color: 'hsl(var(--foreground))',
            fontWeight: '500',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '300px',
            boxShadow: 'var(--shadow-deep)',
            animation: 'slideIn 0.3s ease-out'
        });

        const backgrounds = {
            success: 'linear-gradient(135deg, hsl(120 60% 50% / 0.9), hsl(120 60% 40% / 0.9))',
            error: 'linear-gradient(135deg, hsl(0 60% 50% / 0.9), hsl(0 60% 40% / 0.9))',
            info: 'linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--primary-glow) / 0.9))'
        };
        
        notification.style.background = backgrounds[type] || backgrounds.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    celebrateHighGPA() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createCelebrationParticle();
            }, i * 100);
        }
    }

    createCelebrationParticle() {
        const particle = document.createElement('div');
        particle.innerHTML = '🎉';
        
        Object.assign(particle.style, {
            position: 'fixed',
            left: Math.random() * window.innerWidth + 'px',
            top: window.innerHeight + 'px',
            fontSize: '2rem',
            zIndex: '999',
            pointerEvents: 'none',
            animation: 'celebrate 3s ease-out forwards'
        });

        document.body.appendChild(particle);

        setTimeout(() => {
            document.body.removeChild(particle);
        }, 3000);
    }

    addInteractiveEffects() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', this.createRipple);
        });

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-input') || e.target.classList.contains('form-select')) {
                e.target.style.boxShadow = '0 0 20px hsl(var(--primary) / 0.3)';
                setTimeout(() => {
                    e.target.style.boxShadow = '';
                }, 300);
            }
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        Object.assign(ripple.style, {
            position: 'absolute',
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none'
        });

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

const additionalStyles = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes celebrate {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', () => {
    new GPACalculator();
    
    setTimeout(() => {
        const calculator = new GPACalculator();
        calculator.showNotification('Welcome to the GPA Calculator! Enter your number of courses to get started.', 'info');
    }, 1000);
});