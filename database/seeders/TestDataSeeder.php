<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Instruction;
use App\Models\Schedule;
use App\Models\Event;
use App\Models\Student;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding test data...');
        
        $this->createFaculty();
        $this->createCourses();
        $this->createInstructions();
        $this->createSchedules();
        $this->createEvents();
        
        $this->command->info('Test data seeding completed!');
    }

    private function createFaculty(): void
    {
        $this->command->info('Creating faculty members...');
        
        $facultyData = [
            [
                'faculty_id' => 'FAC001',
                'first_name' => 'Dr. Maria',
                'last_name' => 'Santos',
                'degrees' => ['PhD Computer Science', 'MS Information Technology'],
                'certifications' => ['Certified Scrum Master', 'AWS Solutions Architect'],
                'expertise_areas' => ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
                'research_areas' => ['Natural Language Processing', 'Computer Vision'],
                'ccs_role' => 'Program Chair',
                'teaching_load' => 18,
                'employment_status' => 'full_time',
            ],
            [
                'faculty_id' => 'FAC002',
                'first_name' => 'Prof. Juan',
                'last_name' => 'Reyes',
                'degrees' => ['MS Computer Science', 'BS Information Technology'],
                'certifications' => ['Microsoft Certified Trainer', 'Oracle Certified Professional'],
                'expertise_areas' => ['Web Development', 'Database Systems', 'Cloud Computing'],
                'research_areas' => ['Distributed Systems', 'IoT'],
                'ccs_role' => 'Professor',
                'teaching_load' => 21,
                'employment_status' => 'full_time',
            ],
            [
                'faculty_id' => 'FAC003',
                'first_name' => 'Dr. Ana',
                'last_name' => 'Garcia',
                'degrees' => ['PhD Information Systems', 'MS Software Engineering'],
                'certifications' => ['Certified Information Systems Security Professional'],
                'expertise_areas' => ['Cybersecurity', 'Network Administration', 'System Architecture'],
                'research_areas' => ['Network Security', 'Blockchain Technology'],
                'ccs_role' => 'Associate Professor',
                'teaching_load' => 15,
                'employment_status' => 'full_time',
            ],
            [
                'faculty_id' => 'FAC004',
                'first_name' => 'Mr. Carlos',
                'last_name' => 'Mendoza',
                'degrees' => ['MS Information Technology', 'BS Computer Science'],
                'certifications' => ['Cisco Certified Network Associate', 'CompTIA Security+'],
                'expertise_areas' => ['Mobile Development', 'UI/UX Design', 'Software Engineering'],
                'research_areas' => ['Human-Computer Interaction', 'Mobile Computing'],
                'ccs_role' => 'Instructor I',
                'teaching_load' => 24,
                'employment_status' => 'full_time',
            ],
            [
                'faculty_id' => 'FAC005',
                'first_name' => 'Ms. Sofia',
                'last_name' => 'Rodriguez',
                'degrees' => ['MS Data Science', 'BS Mathematics'],
                'certifications' => ['Google Data Analytics Professional', 'Tableau Desktop Specialist'],
                'expertise_areas' => ['Data Analytics', 'Statistics', 'Business Intelligence'],
                'research_areas' => ['Predictive Analytics', 'Big Data'],
                'ccs_role' => 'Instructor II',
                'teaching_load' => 21,
                'employment_status' => 'full_time',
            ],
            [
                'faculty_id' => 'FAC006',
                'first_name' => 'Dr. Rafael',
                'last_name' => 'Cruz',
                'degrees' => ['PhD Software Engineering', 'MS Computer Engineering'],
                'certifications' => ['Professional Engineer (PE)', 'Agile Certified Practitioner'],
                'expertise_areas' => ['Software Architecture', 'DevOps', 'Quality Assurance'],
                'research_areas' => ['Software Testing', 'Continuous Integration'],
                'ccs_role' => 'Assistant Professor',
                'teaching_load' => 18,
                'employment_status' => 'full_time',
            ],
        ];

        foreach ($facultyData as $data) {
            Faculty::create($data);
        }

        $this->command->info('Created 6 faculty members');
    }

    private function createCourses(): void
    {
        $this->command->info('Creating courses...');
        
        $courses = [
            // BS Information Technology
            ['course_id' => 'IT101', 'course_code' => 'IT 101', 'course_title' => 'Introduction to Computing', 'program' => 'BS Information Technology', 'units' => 3, 'year_level' => 1, 'semester' => '1st Semester', 'learning_outcomes' => ['Understand computing fundamentals', 'Identify hardware components', 'Use productivity software']],
            ['course_id' => 'IT102', 'course_code' => 'IT 102', 'course_title' => 'Programming Fundamentals', 'program' => 'BS Information Technology', 'units' => 3, 'year_level' => 1, 'semester' => '1st Semester', 'learning_outcomes' => ['Write basic programs', 'Understand variables and data types', 'Use control structures']],
            ['course_id' => 'IT201', 'course_code' => 'IT 201', 'course_title' => 'Web Development', 'program' => 'BS Information Technology', 'units' => 3, 'year_level' => 2, 'semester' => '1st Semester', 'learning_outcomes' => ['Create responsive websites', 'Use HTML, CSS, and JavaScript', 'Implement web forms']],
            ['course_id' => 'IT202', 'course_code' => 'IT 202', 'course_title' => 'Database Management Systems', 'program' => 'BS Information Technology', 'units' => 3, 'year_level' => 2, 'semester' => '2nd Semester', 'learning_outcomes' => ['Design database schemas', 'Write SQL queries', 'Implement normalization']],
            ['course_id' => 'IT301', 'course_code' => 'IT 301', 'course_title' => 'Software Engineering', 'program' => 'BS Information Technology', 'units' => 3, 'year_level' => 3, 'semester' => '1st Semester', 'learning_outcomes' => ['Apply SDLC methodologies', 'Create software requirements', 'Design system architecture']],
            ['course_id' => 'IT302', 'course_code' => 'IT 302', 'course_title' => 'Network Administration', 'program' => 'BS Information Technology', 'units' => 3, 'year_level' => 3, 'semester' => '2nd Semester', 'learning_outcomes' => ['Configure network devices', 'Implement security protocols', 'Troubleshoot network issues']],
            ['course_id' => 'IT401', 'course_code' => 'IT 401', 'course_title' => 'Capstone Project', 'program' => 'BS Information Technology', 'units' => 6, 'year_level' => 4, 'semester' => '1st Semester', 'learning_outcomes' => ['Develop complete software solution', 'Apply project management skills', 'Present technical documentation']],
            
            // BS Computer Science
            ['course_id' => 'CS101', 'course_code' => 'CS 101', 'course_title' => 'Introduction to Computer Science', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 1, 'semester' => '1st Semester', 'learning_outcomes' => ['Understand CS fundamentals', 'Analyze algorithms', 'Apply computational thinking']],
            ['course_id' => 'CS102', 'course_code' => 'CS 102', 'course_title' => 'Object-Oriented Programming', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 1, 'semester' => '2nd Semester', 'learning_outcomes' => ['Implement OOP principles', 'Design class hierarchies', 'Use design patterns']],
            ['course_id' => 'CS201', 'course_code' => 'CS 201', 'course_title' => 'Data Structures and Algorithms', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 2, 'semester' => '1st Semester', 'learning_outcomes' => ['Implement data structures', 'Analyze algorithm complexity', 'Optimize code performance']],
            ['course_id' => 'CS202', 'course_code' => 'CS 202', 'course_title' => 'Discrete Mathematics', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 2, 'semester' => '2nd Semester', 'learning_outcomes' => ['Apply logical reasoning', 'Use set theory', 'Understand graph theory']],
            ['course_id' => 'CS301', 'course_code' => 'CS 301', 'course_title' => 'Artificial Intelligence', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 3, 'semester' => '1st Semester', 'learning_outcomes' => ['Implement AI algorithms', 'Apply machine learning', 'Develop intelligent systems']],
            ['course_id' => 'CS302', 'course_code' => 'CS 302', 'course_title' => 'Operating Systems', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 3, 'semester' => '2nd Semester', 'learning_outcomes' => ['Understand OS concepts', 'Manage processes and memory', 'Implement file systems']],
            ['course_id' => 'CS401', 'course_code' => 'CS 401', 'course_title' => 'Machine Learning', 'program' => 'BS Computer Science', 'units' => 3, 'year_level' => 4, 'semester' => '1st Semester', 'learning_outcomes' => ['Apply ML algorithms', 'Train and evaluate models', 'Implement deep learning']],
            
            // BS Engineering
            ['course_id' => 'ENG101', 'course_code' => 'ENG 101', 'course_title' => 'Engineering Mathematics', 'program' => 'BS Engineering', 'units' => 3, 'year_level' => 1, 'semester' => '1st Semester', 'learning_outcomes' => ['Apply calculus', 'Solve differential equations', 'Use linear algebra']],
            ['course_id' => 'ENG102', 'course_code' => 'ENG 102', 'course_title' => 'Physics for Engineers', 'program' => 'BS Engineering', 'units' => 3, 'year_level' => 1, 'semester' => '2nd Semester', 'learning_outcomes' => ['Apply physics principles', 'Solve mechanics problems', 'Understand electromagnetism']],
            ['course_id' => 'ENG201', 'course_code' => 'ENG 201', 'course_title' => 'Circuit Analysis', 'program' => 'BS Engineering', 'units' => 3, 'year_level' => 2, 'semester' => '1st Semester', 'learning_outcomes' => ['Analyze electrical circuits', 'Apply Kirchhoff laws', 'Design basic circuits']],
            ['course_id' => 'ENG202', 'course_code' => 'ENG 202', 'course_title' => 'Digital Logic Design', 'program' => 'BS Engineering', 'units' => 3, 'year_level' => 2, 'semester' => '2nd Semester', 'learning_outcomes' => ['Design digital circuits', 'Use Boolean algebra', 'Implement logic gates']],
            ['course_id' => 'ENG301', 'course_code' => 'ENG 301', 'course_title' => 'Control Systems', 'program' => 'BS Engineering', 'units' => 3, 'year_level' => 3, 'semester' => '1st Semester', 'learning_outcomes' => ['Design control systems', 'Analyze system stability', 'Implement feedback loops']],
            ['course_id' => 'ENG302', 'course_code' => 'ENG 302', 'course_title' => 'Microprocessors', 'program' => 'BS Engineering', 'units' => 3, 'year_level' => 3, 'semester' => '2nd Semester', 'learning_outcomes' => ['Program microcontrollers', 'Interface peripherals', 'Design embedded systems']],
            ['course_id' => 'ENG401', 'course_code' => 'ENG 401', 'course_title' => 'Engineering Design Project', 'program' => 'BS Engineering', 'units' => 6, 'year_level' => 4, 'semester' => '1st Semester', 'learning_outcomes' => ['Complete engineering design', 'Apply project management', 'Present technical solutions']],
            
            // BS Business Administration
            ['course_id' => 'BA101', 'course_code' => 'BA 101', 'course_title' => 'Principles of Management', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 1, 'semester' => '1st Semester', 'learning_outcomes' => ['Understand management theories', 'Apply leadership skills', 'Analyze organizational behavior']],
            ['course_id' => 'BA102', 'course_code' => 'BA 102', 'course_title' => 'Financial Accounting', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 1, 'semester' => '2nd Semester', 'learning_outcomes' => ['Prepare financial statements', 'Apply accounting principles', 'Analyze financial data']],
            ['course_id' => 'BA201', 'course_code' => 'BA 201', 'course_title' => 'Marketing Management', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 2, 'semester' => '1st Semester', 'learning_outcomes' => ['Develop marketing strategies', 'Conduct market research', 'Create marketing plans']],
            ['course_id' => 'BA202', 'course_code' => 'BA 202', 'course_title' => 'Business Statistics', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 2, 'semester' => '2nd Semester', 'learning_outcomes' => ['Apply statistical methods', 'Analyze business data', 'Make data-driven decisions']],
            ['course_id' => 'BA301', 'course_code' => 'BA 301', 'course_title' => 'Operations Management', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 3, 'semester' => '1st Semester', 'learning_outcomes' => ['Optimize operations', 'Manage supply chains', 'Implement quality control']],
            ['course_id' => 'BA302', 'course_code' => 'BA 302', 'course_title' => 'Human Resource Management', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 3, 'semester' => '2nd Semester', 'learning_outcomes' => ['Manage HR functions', 'Develop recruitment strategies', 'Implement training programs']],
            ['course_id' => 'BA401', 'course_code' => 'BA 401', 'course_title' => 'Business Policy and Strategy', 'program' => 'BS Business Administration', 'units' => 3, 'year_level' => 4, 'semester' => '1st Semester', 'learning_outcomes' => ['Develop business strategies', 'Analyze competitive environment', 'Create strategic plans']],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }

        $this->command->info('Created ' . count($courses) . ' courses');
    }

    private function createInstructions(): void
    {
        $this->command->info('Creating instructions...');
        
        $courses = Course::all();
        
        foreach ($courses as $course) {
            Instruction::create([
                'course_id' => $course->course_id,
                'syllabus' => [
                    'course_description' => 'This course covers ' . strtolower($course->course_title) . ' with focus on practical applications.',
                    'prerequisites' => $course->year_level > 1 ? 'Year ' . ($course->year_level - 1) . ' courses' : 'None',
                    'grading_system' => [
                        'quizzes' => '20%',
                        'assignments' => '20%',
                        'midterm_exam' => '25%',
                        'final_exam' => '25%',
                        'participation' => '10%',
                    ],
                ],
                'lessons' => [
                    ['week' => 1, 'topic' => 'Introduction and Overview', 'activities' => ['Lecture', 'Discussion']],
                    ['week' => 2, 'topic' => 'Fundamental Concepts', 'activities' => ['Lecture', 'Hands-on Exercise']],
                    ['week' => 3, 'topic' => 'Core Principles', 'activities' => ['Lecture', 'Lab Work']],
                    ['week' => 4, 'topic' => 'Advanced Topics', 'activities' => ['Lecture', 'Group Activity']],
                    ['week' => 5, 'topic' => 'Practical Applications', 'activities' => ['Project Work', 'Presentation']],
                    ['week' => 6, 'topic' => 'Midterm Review', 'activities' => ['Review Session', 'Q&A']],
                    ['week' => 7, 'topic' => 'Midterm Examination', 'activities' => ['Exam']],
                    ['week' => 8, 'topic' => 'Case Studies', 'activities' => ['Case Analysis', 'Discussion']],
                    ['week' => 9, 'topic' => 'Industry Practices', 'activities' => ['Guest Lecture', 'Workshop']],
                    ['week' => 10, 'topic' => 'Project Development', 'activities' => ['Project Work', 'Consultation']],
                    ['week' => 11, 'topic' => 'Project Implementation', 'activities' => ['Lab Work', 'Testing']],
                    ['week' => 12, 'topic' => 'Final Review', 'activities' => ['Review Session', 'Practice Exam']],
                    ['week' => 13, 'topic' => 'Project Presentations', 'activities' => ['Student Presentations', 'Peer Review']],
                    ['week' => 14, 'topic' => 'Final Examination', 'activities' => ['Exam']],
                ],
                'teaching_materials' => [
                    'textbook' => $course->course_title . ' Handbook',
                    'references' => ['Online resources', 'Journal articles', 'Video tutorials'],
                    'software_tools' => ['IDE', 'Database Management System', 'Version Control'],
                    'equipment' => ['Computer lab access', 'Internet connection', 'Projector'],
                ],
                'assessment_types' => ['Written exams', 'Practical exams', 'Projects', 'Quizzes', 'Assignments'],
                'grading_rubric' => [
                    'excellent' => '90-100%',
                    'very_good' => '85-89%',
                    'good' => '80-84%',
                    'satisfactory' => '75-79%',
                    'needs_improvement' => 'Below 75%',
                ],
            ]);
        }

        $this->command->info('Created ' . $courses->count() . ' instructions');
    }

    private function createSchedules(): void
    {
        $this->command->info('Creating schedules...');
        
        $courses = Course::all();
        $faculty = Faculty::all()->toArray();
        $rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202', 'Lab A', 'Lab B', 'Lab C'];
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $timeSlots = [
            ['start' => '08:00', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '12:00'],
            ['start' => '13:00', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '17:00'],
        ];
        $sections = ['A', 'B', 'C'];

        $scheduleId = 1;
        foreach ($courses as $course) {
            // Each course gets 1-2 schedule sections
            $numSections = rand(1, 2);
            
            for ($i = 0; $i < $numSections; $i++) {
                $timeSlot = $timeSlots[array_rand($timeSlots)];
                $day1 = $days[array_rand($days)];
                $day2 = $days[array_rand(array_filter($days, fn($d) => $d !== $day1))];
                $randomFaculty = $faculty[array_rand($faculty)];
                
                Schedule::create([
                    'course_id' => $course->course_id,
                    'faculty_id' => $randomFaculty['faculty_id'],
                    'section' => $sections[$i] ?? 'A',
                    'room' => $rooms[array_rand($rooms)],
                    'lab' => strpos($course->course_code, 'Lab') !== false || $course->units > 3 ? 'Yes' : 'No',
                    'day' => $day1 . ', ' . $day2,
                    'time_start' => $timeSlot['start'],
                    'time_end' => $timeSlot['end'],
                    'semester' => $course->semester,
                    'academic_year' => '2024-2025',
                ]);
                
                $scheduleId++;
            }
        }

        $this->command->info('Created ' . ($scheduleId - 1) . ' schedules');
    }

    private function createEvents(): void
    {
        $this->command->info('Creating events...');
        
        $events = [
            [
                'event_name' => 'Annual Hackathon 2024',
                'event_type' => 'Competition',
                'category' => 'Technical',
                'date' => '2024-11-15',
                'time' => '08:00',
                'venue' => 'Computer Lab A',
                'description' => '24-hour coding competition where students build innovative solutions to real-world problems.',
                'max_participants' => 100,
                'status' => 'completed',
                'organizer' => 'CCS Student Council',
                'outcome' => '15 teams participated, 3 winners selected',
            ],
            [
                'event_name' => 'Tech Seminar: AI in Education',
                'event_type' => 'Seminar',
                'category' => 'Academic',
                'date' => '2024-10-20',
                'time' => '13:00',
                'venue' => 'Auditorium',
                'description' => 'Expert talk on how artificial intelligence is transforming education and learning.',
                'max_participants' => 200,
                'status' => 'completed',
                'organizer' => 'CCS Faculty',
                'outcome' => '180 attendees, positive feedback received',
            ],
            [
                'event_name' => 'Sports Festival 2024',
                'event_type' => 'Sports',
                'category' => 'Extracurricular',
                'date' => '2024-09-25',
                'time' => '07:00',
                'venue' => 'University Gymnasium',
                'description' => 'Annual sports competition featuring basketball, volleyball, badminton, and more.',
                'max_participants' => 300,
                'status' => 'completed',
                'organizer' => 'Sports Committee',
                'outcome' => '5 departments competed, IT department won overall championship',
            ],
            [
                'event_name' => 'Coding Workshop: React Basics',
                'event_type' => 'Workshop',
                'category' => 'Technical',
                'date' => '2025-02-10',
                'time' => '09:00',
                'venue' => 'Computer Lab B',
                'description' => 'Hands-on workshop teaching React.js fundamentals for web development.',
                'max_participants' => 50,
                'status' => 'upcoming',
                'organizer' => 'Web Development Club',
                'outcome' => null,
            ],
            [
                'event_name' => 'Career Fair 2025',
                'event_type' => 'Career',
                'category' => 'Professional',
                'date' => '2025-03-05',
                'time' => '10:00',
                'venue' => 'Main Hall',
                'description' => 'Connect with top tech companies and explore career opportunities.',
                'max_participants' => 500,
                'status' => 'upcoming',
                'organizer' => 'Career Services Office',
                'outcome' => null,
            ],
            [
                'event_name' => 'Community Service: Teaching Kids to Code',
                'event_type' => 'Volunteer',
                'category' => 'Community',
                'date' => '2024-08-15',
                'time' => '09:00',
                'venue' => 'Local Elementary School',
                'description' => 'Students volunteer to teach basic programming to elementary school children.',
                'max_participants' => 30,
                'status' => 'completed',
                'organizer' => 'CCS Outreach Program',
                'outcome' => '25 students volunteered, taught 100+ kids',
            ],
            [
                'event_name' => 'Leadership Training Program',
                'event_type' => 'Training',
                'category' => 'Development',
                'date' => '2025-01-20',
                'time' => '08:00',
                'venue' => 'Conference Room',
                'description' => 'Develop leadership skills through workshops and team-building activities.',
                'max_participants' => 40,
                'status' => 'upcoming',
                'organizer' => 'Student Affairs Office',
                'outcome' => null,
            ],
            [
                'event_name' => 'Science and Technology Fair',
                'event_type' => 'Exhibition',
                'category' => 'Academic',
                'date' => '2024-12-10',
                'time' => '09:00',
                'venue' => 'CCS Building',
                'description' => 'Showcase of student research projects and technological innovations.',
                'max_participants' => 150,
                'status' => 'upcoming',
                'organizer' => 'Research Committee',
                'outcome' => null,
            ],
            [
                'event_name' => 'Cybersecurity Awareness Month',
                'event_type' => 'Campaign',
                'category' => 'Awareness',
                'date' => '2024-10-01',
                'time' => '10:00',
                'venue' => 'Online and CCS Building',
                'description' => 'Month-long campaign promoting cybersecurity best practices and awareness.',
                'max_participants' => 1000,
                'status' => 'completed',
                'organizer' => 'IT Security Team',
                'outcome' => '500+ participants, increased awareness survey scores by 40%',
            ],
            [
                'event_name' => 'Cultural Night 2025',
                'event_type' => 'Cultural',
                'category' => 'Entertainment',
                'date' => '2025-04-15',
                'time' => '18:00',
                'venue' => 'University Theater',
                'description' => 'Celebration of diverse cultures through performances, food, and exhibitions.',
                'max_participants' => 400,
                'status' => 'upcoming',
                'organizer' => 'Cultural Affairs Committee',
                'outcome' => null,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }

        $this->command->info('Created ' . count($events) . ' events');
    }
}
