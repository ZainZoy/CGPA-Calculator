class CGPACalculator {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('cgpa_students')) || [];
        this.currentStudent = null;
        this.courses = [];

        this.initializeEventListeners();
        this.loadStudents();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Student management
        document.getElementById('add-student-btn').addEventListener('click', () => this.openStudentModal());
        document.getElementById('student-select').addEventListener('change', (e) => this.selectStudent(e.target.value));
        document.getElementById('save-student').addEventListener('click', () => this.saveStudent());
        document.getElementById('cancel-student').addEventListener('click', () => this.closeStudentModal());
        document.getElementById('delete-student-btn').addEventListener('click', () => this.deleteStudent());

        // Course management - inline
        document.getElementById('add-course-inline').addEventListener('click', () => this.addCourseInline());
        document.getElementById('credits-select').addEventListener('change', (e) => this.toggleCustomCredits(e.target.value));
        document.getElementById('grade-select').addEventListener('change', (e) => this.toggleCustomGPA(e.target.value));
        document.getElementById('clear-all-courses-btn').addEventListener('click', () => this.clearAllCourses());

        // Edit course modal
        document.getElementById('save-edit-course').addEventListener('click', () => this.saveEditCourse());
        document.getElementById('cancel-edit-course').addEventListener('click', () => this.closeEditCourseModal());
        document.getElementById('edit-credits-select').addEventListener('change', (e) => this.toggleEditCustomCredits(e.target.value));
        document.getElementById('edit-grade-select').addEventListener('change', (e) => this.toggleEditCustomGPA(e.target.value));

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.remove('active');
            });
        });

        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Modal backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Enter key for inline course addition
        document.getElementById('course-name-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addCourseInline();
        });

        // Mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMobileTab(e.currentTarget.dataset.mobileTab));
        });

        // Mobile functionality
        this.initializeMobileEventListeners();
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    openStudentModal() {
        document.getElementById('student-modal').classList.add('active');
        document.getElementById('student-name').focus();
    }

    closeStudentModal() {
        document.getElementById('student-modal').classList.remove('active');
        this.clearStudentForm();
    }

    clearStudentForm() {
        document.getElementById('student-name').value = '';
        document.getElementById('current-quality-points').value = '';
        document.getElementById('current-credits').value = '';
    }

    saveStudent() {
        const name = document.getElementById('student-name').value.trim();
        const qualityPoints = parseFloat(document.getElementById('current-quality-points').value) || 0;
        const credits = parseInt(document.getElementById('current-credits').value) || 0;

        if (!name) {
            alert('Please enter a student name.');
            return;
        }

        const student = {
            id: Date.now().toString(),
            name,
            qualityPoints,
            credits,
            courses: []
        };

        this.students.push(student);
        this.saveStudents();
        this.loadStudents();
        this.selectStudent(student.id);
        this.closeStudentModal();
    }

    selectStudent(studentId) {
        this.currentStudent = this.students.find(s => s.id === studentId) || null;
        this.courses = this.currentStudent ? [...this.currentStudent.courses] : [];

        // Sync both selects
        document.getElementById('student-select').value = studentId;
        document.getElementById('mobile-student-select').value = studentId;

        this.updateDisplay();
        this.updateCourseTable();
        this.updateMobileCourseList();
    }

    loadStudents() {
        const select = document.getElementById('student-select');
        const mobileSelect = document.getElementById('mobile-student-select');

        const optionHTML = '<option value="">Choose a student...</option>' +
            this.students.map(student => `<option value="${student.id}">${student.name}</option>`).join('');

        select.innerHTML = optionHTML;
        mobileSelect.innerHTML = optionHTML;
    }

    saveStudents() {
        localStorage.setItem('cgpa_students', JSON.stringify(this.students));
    }

    toggleCustomCredits(value) {
        const customCreditsInput = document.getElementById('custom-credits');
        if (value === 'custom') {
            customCreditsInput.style.display = 'block';
            customCreditsInput.focus();
        } else {
            customCreditsInput.style.display = 'none';
            customCreditsInput.value = '';
        }
    }

    toggleEditCustomCredits(value) {
        const customCreditsInput = document.getElementById('edit-custom-credits');
        if (value === 'custom') {
            customCreditsInput.style.display = 'block';
            customCreditsInput.focus();
        } else {
            customCreditsInput.style.display = 'none';
            customCreditsInput.value = '';
        }
    }

    toggleCustomGPA(value) {
        const customGPAInput = document.getElementById('custom-gpa');
        if (value === 'custom') {
            customGPAInput.style.display = 'block';
            customGPAInput.focus();
        } else {
            customGPAInput.style.display = 'none';
            customGPAInput.value = '';
        }
    }

    toggleEditCustomGPA(value) {
        const customGPAInput = document.getElementById('edit-custom-gpa');
        if (value === 'custom') {
            customGPAInput.style.display = 'block';
            customGPAInput.focus();
        } else {
            customGPAInput.style.display = 'none';
            customGPAInput.value = '';
        }
    }

    addCourseInline() {
        if (!this.currentStudent) {
            alert('Please select a student first.');
            return;
        }

        const name = document.getElementById('course-name-input').value.trim();
        const creditsSelect = document.getElementById('credits-select').value;
        const customCredits = document.getElementById('custom-credits').value;
        const gradeSelect = document.getElementById('grade-select').value;
        const customGPA = document.getElementById('custom-gpa').value;

        if (!name || !gradeSelect) {
            alert('Please fill in course name and grade.');
            return;
        }

        let credits;
        if (creditsSelect === 'custom') {
            credits = parseInt(customCredits);
            if (!credits || credits < 1) {
                alert('Please enter valid custom credits.');
                return;
            }
        } else {
            credits = parseInt(creditsSelect);
        }

        let gradeValue, gradeText;
        if (gradeSelect === 'custom') {
            gradeValue = parseFloat(customGPA);
            if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 4) {
                alert('Please enter a valid GPA between 0.0 and 4.0.');
                return;
            }
            gradeText = `${gradeValue.toFixed(1)} GPA`;
        } else {
            gradeValue = this.getGradeValue(gradeSelect);
            gradeText = gradeSelect;
        }

        const course = {
            id: Date.now().toString(),
            name,
            credits,
            gradeText,
            gradeValue,
            qualityPoints: credits * gradeValue
        };

        this.courses.push(course);
        this.currentStudent.courses = [...this.courses];
        this.saveStudents();
        this.updateDisplay();
        this.updateCourseTable();
        this.clearInlineForm();
    }

    clearInlineForm() {
        document.getElementById('course-name-input').value = '';
        document.getElementById('credits-select').value = '3';
        document.getElementById('custom-credits').style.display = 'none';
        document.getElementById('custom-credits').value = '';
        document.getElementById('grade-select').value = '';
        document.getElementById('custom-gpa').style.display = 'none';
        document.getElementById('custom-gpa').value = '';
    }

    openEditCourseModal(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.editingCourseId = courseId;

        document.getElementById('edit-course-name').value = course.name;

        // Handle credits
        if ([1, 3, 4].includes(course.credits)) {
            document.getElementById('edit-credits-select').value = course.credits.toString();
            document.getElementById('edit-custom-credits').style.display = 'none';
        } else {
            document.getElementById('edit-credits-select').value = 'custom';
            document.getElementById('edit-custom-credits').style.display = 'block';
            document.getElementById('edit-custom-credits').value = course.credits;
        }

        // Handle grades
        if (course.gradeText.includes('GPA')) {
            document.getElementById('edit-grade-select').value = 'custom';
            document.getElementById('edit-custom-gpa').style.display = 'block';
            document.getElementById('edit-custom-gpa').value = course.gradeValue;
        } else {
            document.getElementById('edit-grade-select').value = course.gradeText;
            document.getElementById('edit-custom-gpa').style.display = 'none';
        }

        document.getElementById('edit-course-modal').classList.add('active');
    }

    closeEditCourseModal() {
        document.getElementById('edit-course-modal').classList.remove('active');
        this.editingCourseId = null;
    }

    saveEditCourse() {
        if (!this.editingCourseId) return;

        const name = document.getElementById('edit-course-name').value.trim();
        const creditsSelect = document.getElementById('edit-credits-select').value;
        const customCredits = document.getElementById('edit-custom-credits').value;
        const gradeSelect = document.getElementById('edit-grade-select').value;
        const customGPA = document.getElementById('edit-custom-gpa').value;

        if (!name || !gradeSelect) {
            alert('Please fill in all required fields.');
            return;
        }

        let credits;
        if (creditsSelect === 'custom') {
            credits = parseInt(customCredits);
            if (!credits || credits < 1) {
                alert('Please enter valid custom credits.');
                return;
            }
        } else {
            credits = parseInt(creditsSelect);
        }

        let gradeValue, gradeText;
        if (gradeSelect === 'custom') {
            gradeValue = parseFloat(customGPA);
            if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 4) {
                alert('Please enter a valid GPA between 0.0 and 4.0.');
                return;
            }
            gradeText = `${gradeValue.toFixed(1)} GPA`;
        } else {
            gradeValue = this.getGradeValue(gradeSelect);
            gradeText = gradeSelect;
        }

        const courseIndex = this.courses.findIndex(c => c.id === this.editingCourseId);
        if (courseIndex === -1) return;

        this.courses[courseIndex] = {
            ...this.courses[courseIndex],
            name,
            credits,
            gradeText,
            gradeValue,
            qualityPoints: credits * gradeValue
        };

        this.currentStudent.courses = [...this.courses];
        this.saveStudents();
        this.updateDisplay();
        this.updateCourseTable();
        this.updateMobileCourseList();
        this.closeEditCourseModal();
    }

    deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course?')) {
            this.courses = this.courses.filter(c => c.id !== courseId);
            this.currentStudent.courses = [...this.courses];
            this.saveStudents();
            this.updateDisplay();
            this.updateCourseTable();
            this.updateMobileCourseList();
        }
    }

    clearAllCourses() {
        if (!this.currentStudent) {
            alert('Please select a student first.');
            return;
        }

        if (this.courses.length === 0) {
            alert('No courses to clear.');
            return;
        }

        if (confirm(`Are you sure you want to delete all ${this.courses.length} courses for ${this.currentStudent.name}? This action cannot be undone.`)) {
            this.courses = [];
            this.currentStudent.courses = [];
            this.saveStudents();
            this.updateDisplay();
            this.updateCourseTable();
            this.updateMobileCourseList();
        }
    }

    updateCourseTable() {
        const tbody = document.getElementById('course-table-body');

        if (!this.currentStudent || this.courses.length === 0) {
            tbody.innerHTML = '<tr class="empty-state"><td colspan="5">No courses added yet. Fill in the details above and click "Add Course" to get started.</td></tr>';
            return;
        }

        tbody.innerHTML = this.courses.map(course => `
            <tr>
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td>${course.gradeText || this.getGradeText(course.grade)}</td>
                <td>${course.qualityPoints.toFixed(1)}</td>
                <td>
                    <button class="action-btn edit" onclick="calculator.openEditCourseModal('${course.id}')" title="Edit course">
                        ✏️
                    </button>
                    <button class="action-btn delete" onclick="calculator.deleteCourse('${course.id}')" title="Delete course">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getGradeText(gradeValue) {
        const gradeMap = {
            4.0: 'A (4.0)',
            3.7: 'A- (3.7)',
            3.3: 'B+ (3.3)',
            3.0: 'B (3.0)',
            2.7: 'B- (2.7)',
            2.3: 'C+ (2.3)',
            2.0: 'C (2.0)',
            1.7: 'C- (1.7)',
            1.3: 'D+ (1.3)',
            1.0: 'D (1.0)',
            0.0: 'F (0.0)'
        };
        return gradeMap[gradeValue] || gradeValue.toString();
    }

    getGradeValue(gradeText) {
        const gradeMap = {
            'A': 4.0,
            'A-': 3.7,
            'B+': 3.3,
            'B': 3.0,
            'B-': 2.7,
            'C+': 2.3,
            'C': 2.0,
            'C-': 1.7,
            'D+': 1.3,
            'D': 1.0,
            'F': 0.0
        };
        return gradeMap[gradeText] || 0.0;
    }

    calculateCGPA() {
        if (!this.currentStudent) {
            return {
                totalQualityPoints: 0,
                totalCredits: 0,
                cgpa: 0
            };
        }

        // Current quality points and credits
        let totalQualityPoints = this.currentStudent.qualityPoints;
        let totalCredits = this.currentStudent.credits;

        // Add quality points and credits from courses
        this.courses.forEach(course => {
            totalQualityPoints += course.qualityPoints;
            totalCredits += course.credits;
        });

        const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

        return {
            totalQualityPoints,
            totalCredits,
            cgpa
        };
    }

    deleteStudent() {
        if (!this.currentStudent) {
            alert('Please select a student to delete.');
            return;
        }

        const studentName = this.currentStudent.name;
        const courseCount = this.currentStudent.courses.length;

        let confirmMessage = `Are you sure you want to delete "${studentName}"?`;
        if (courseCount > 0) {
            confirmMessage += `\n\nThis will also delete ${courseCount} course${courseCount > 1 ? 's' : ''}.`;
        }
        confirmMessage += '\n\nThis action cannot be undone.';

        if (confirm(confirmMessage)) {
            // Remove student from array
            this.students = this.students.filter(s => s.id !== this.currentStudent.id);

            // Clear current selection
            this.currentStudent = null;
            this.courses = [];

            // Save changes
            this.saveStudents();

            // Update UI
            this.loadStudents();
            this.updateDisplay();
            this.updateCourseTable();
            this.updateMobileCourseList();

            // Hide delete button
            document.getElementById('delete-student-btn').style.display = 'none';
            document.getElementById('mobile-delete-student-btn').style.display = 'none';
        }
    }

    updateDisplay() {
        const stats = this.calculateCGPA();

        // Update desktop summary
        document.getElementById('total-quality-points').textContent = stats.totalQualityPoints.toFixed(1);
        document.getElementById('credits-earned').textContent = stats.totalCredits;
        document.getElementById('current-cgpa').textContent = stats.cgpa.toFixed(3);

        // Update desktop summary tab
        document.getElementById('summary-quality-points').textContent = stats.totalQualityPoints.toFixed(1);
        document.getElementById('summary-credits').textContent = stats.totalCredits;
        document.getElementById('summary-cgpa').textContent = stats.cgpa.toFixed(3);

        // Update mobile summary
        document.getElementById('mobile-total-quality-points').textContent = stats.totalQualityPoints.toFixed(1);
        document.getElementById('mobile-credits-earned').textContent = stats.totalCredits;
        document.getElementById('mobile-current-cgpa').textContent = stats.cgpa.toFixed(3);

        // Update mobile detailed summary
        document.getElementById('mobile-summary-quality-points').textContent = stats.totalQualityPoints.toFixed(1);
        document.getElementById('mobile-summary-credits').textContent = stats.totalCredits;
        document.getElementById('mobile-summary-cgpa').textContent = stats.cgpa.toFixed(3);

        // Show/hide delete button based on student selection
        const deleteBtn = document.getElementById('delete-student-btn');
        const mobileDeleteBtn = document.getElementById('mobile-delete-student-btn');
        if (this.currentStudent) {
            deleteBtn.style.display = 'inline-flex';
            mobileDeleteBtn.style.display = 'block';
        } else {
            deleteBtn.style.display = 'none';
            mobileDeleteBtn.style.display = 'none';
        }

        // Update welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            if (this.currentStudent) {
                welcomeMessage.innerHTML = `
                    <h2>Welcome, ${this.currentStudent.name}!</h2>
                    <p>Current CGPA: <strong>${stats.cgpa.toFixed(3)}</strong></p>
                    <p>Total Credits: <strong>${stats.totalCredits}</strong></p>
                    <p>Use the Course Management tab to add courses and calculate your projected CGPA.</p>
                `;
            } else {
                welcomeMessage.innerHTML = `
                    <h2>Welcome to CGPA Calculator</h2>
                    <p>Add a student to get started with calculating CGPA.</p>
                `;
            }
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        const themeBtn = document.querySelector('.theme-toggle');
        themeBtn.textContent = isLight ? '☀️' : '🌙';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.querySelector('.theme-toggle').textContent = '☀️';
        }
    }

    initializeMobileEventListeners() {
        // Mobile student management
        document.getElementById('mobile-add-student-btn').addEventListener('click', () => this.openStudentModal());
        document.getElementById('mobile-student-select').addEventListener('change', (e) => this.selectStudent(e.target.value));
        document.getElementById('mobile-delete-student-btn').addEventListener('click', () => this.deleteStudent());

        // Mobile course management
        document.getElementById('mobile-add-course-btn').addEventListener('click', () => this.addMobileCourse());
        document.getElementById('mobile-credits-select').addEventListener('change', (e) => this.toggleMobileCustomCredits(e.target.value));
        document.getElementById('mobile-grade-select').addEventListener('change', (e) => this.toggleMobileCustomGPA(e.target.value));
        document.getElementById('mobile-clear-all-courses-btn').addEventListener('click', () => this.clearAllCourses());
    }

    switchMobileTab(tabName) {
        // Update mobile nav buttons
        document.querySelectorAll('.mobile-nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mobile-tab="${tabName}"]`).classList.add('active');

        // Hide all mobile sections
        document.getElementById('mobile-user-section').style.display = tabName === 'user' ? 'block' : 'none';
        document.getElementById('mobile-summary-section').style.display = tabName === 'user' ? 'block' : 'none';
        document.getElementById('mobile-course-section').style.display = tabName === 'course' ? 'block' : 'none';
        document.getElementById('mobile-detailed-summary-section').style.display = tabName === 'summary' ? 'block' : 'none';
    }

    toggleMobileCustomCredits(value) {
        const customCreditsInput = document.getElementById('mobile-custom-credits');
        if (value === 'custom') {
            customCreditsInput.style.display = 'block';
            customCreditsInput.focus();
        } else {
            customCreditsInput.style.display = 'none';
            customCreditsInput.value = '';
        }
    }

    toggleMobileCustomGPA(value) {
        const customGPAInput = document.getElementById('mobile-custom-gpa');
        if (value === 'custom') {
            customGPAInput.style.display = 'block';
            customGPAInput.focus();
        } else {
            customGPAInput.style.display = 'none';
            customGPAInput.value = '';
        }
    }

    addMobileCourse() {
        if (!this.currentStudent) {
            alert('Please select a student first.');
            return;
        }

        const name = document.getElementById('mobile-course-name').value.trim();
        const creditsSelect = document.getElementById('mobile-credits-select').value;
        const customCredits = document.getElementById('mobile-custom-credits').value;
        const gradeSelect = document.getElementById('mobile-grade-select').value;
        const customGPA = document.getElementById('mobile-custom-gpa').value;

        if (!name || !gradeSelect) {
            alert('Please fill in course name and grade.');
            return;
        }

        let credits;
        if (creditsSelect === 'custom') {
            credits = parseInt(customCredits);
            if (!credits || credits < 1) {
                alert('Please enter valid custom credits.');
                return;
            }
        } else {
            credits = parseInt(creditsSelect);
        }

        let gradeValue, gradeText;
        if (gradeSelect === 'custom') {
            gradeValue = parseFloat(customGPA);
            if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 4) {
                alert('Please enter a valid GPA between 0.0 and 4.0.');
                return;
            }
            gradeText = `${gradeValue.toFixed(1)} GPA`;
        } else {
            gradeValue = this.getGradeValue(gradeSelect);
            gradeText = gradeSelect;
        }

        const course = {
            id: Date.now().toString(),
            name,
            credits,
            gradeText,
            gradeValue,
            qualityPoints: credits * gradeValue
        };

        this.courses.push(course);
        this.currentStudent.courses = [...this.courses];
        this.saveStudents();
        this.updateDisplay();
        this.updateCourseTable();
        this.updateMobileCourseList();
        this.clearMobileForm();
    }

    clearMobileForm() {
        document.getElementById('mobile-course-name').value = '';
        document.getElementById('mobile-credits-select').value = '3';
        document.getElementById('mobile-custom-credits').style.display = 'none';
        document.getElementById('mobile-custom-credits').value = '';
        document.getElementById('mobile-grade-select').value = '';
        document.getElementById('mobile-custom-gpa').style.display = 'none';
        document.getElementById('mobile-custom-gpa').value = '';
    }

    updateMobileCourseList() {
        const courseList = document.getElementById('mobile-course-list');

        if (!this.currentStudent || this.courses.length === 0) {
            courseList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No courses added yet.</div>';
            return;
        }

        courseList.innerHTML = this.courses.map(course => `
            <div class="mobile-course-item">
                <div class="mobile-course-header">
                    <div class="mobile-course-name">${course.name}</div>
                    <div class="mobile-course-actions">
                        <button class="mobile-action-btn edit" onclick="calculator.openEditCourseModal('${course.id}')" title="Edit course">
                            ✏️
                        </button>
                        <button class="mobile-action-btn delete" onclick="calculator.deleteCourse('${course.id}')" title="Delete course">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="mobile-course-details">
                    <div class="mobile-course-detail">
                        <div class="mobile-course-detail-label">Credits</div>
                        <div class="mobile-course-detail-value">${course.credits}</div>
                    </div>
                    <div class="mobile-course-detail">
                        <div class="mobile-course-detail-label">Grade</div>
                        <div class="mobile-course-detail-value">${course.gradeText}</div>
                    </div>
                    <div class="mobile-course-detail">
                        <div class="mobile-course-detail-label">Quality Points</div>
                        <div class="mobile-course-detail-value">${course.qualityPoints.toFixed(1)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize the calculator when the page loads
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new CGPACalculator();
    calculator.loadTheme();
});

// Handle form submissions with Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            if (activeModal.id === 'student-modal') {
                calculator.saveStudent();
            } else if (activeModal.id === 'course-modal') {
                calculator.saveCourse();
            }
        }
    }
});

