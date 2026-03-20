<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CcsDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ccs.edu',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'user_id' => 'ADMIN001',
        ]);

        // Create Sample Students
        $programs = ['BS Computer Science', 'BS Information Technology', 'BS Multimedia Arts'];
        for ($i = 1; $i <= 20; $i++) {
            Student::create([
                'student_id' => 'STU' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'program' => $programs[array_rand($programs)],
                'year_level' => rand(1, 5),
                'section' => chr(rand(65, 69)), // A-E
                'gpa' => round(rand(75, 100) / 25, 2), // 3.00-4.00
                'academic_status' => 'active',
                'enrollment_status' => 'enrolled',
                'honors' => ['Dean\'s Lister', 'With Honors'],
                'special_skills' => ['Programming', 'Graphic Design'],
                'certifications' => ['AWS Cloud Practitioner'],
                'club_memberships' => ['Computer Society'],
            ]);
        }

        // Create Sample Faculty
        $roles = ['Program Chair', 'Instructor', 'Assistant Professor', 'Associate Professor'];
        for ($i = 1; $i <= 10; $i++) {
            Faculty::create([
                'faculty_id' => 'FAC' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'degrees' => ['MS Computer Science', 'PhD Information Technology'],
                'ccs_role' => $roles[array_rand($roles)],
                'employment_status' => 'full_time',
                'teaching_load' => rand(9, 18),
                'expertise_areas' => ['Software Development', 'Data Science'],
                'research_areas' => ['Machine Learning', 'Cybersecurity'],
            ]);
        }

        // Create Sample Courses
        $courses = [
            ['course_code' => 'CS101', 'title' => 'Introduction to Programming', 'units' => 3, 'year' => 1],
            ['course_code' => 'CS102', 'title' => 'Object-Oriented Programming', 'units' => 3, 'year' => 1],
            ['course_code' => 'CS201', 'title' => 'Data Structures and Algorithms', 'units' => 3, 'year' => 2],
            ['course_code' => 'CS301', 'title' => 'Database Management Systems', 'units' => 3, 'year' => 3],
            ['course_code' => 'CS401', 'title' => 'Capstone Project I', 'units' => 3, 'year' => 4],
        ];

        foreach ($courses as $course) {
            Course::create([
                'course_id' => 'CRS' . str_pad(array_search($course, $courses) + 1, 4, '0', STR_PAD_LEFT),
                'course_code' => $course['course_code'],
                'course_title' => $course['title'],
                'program' => 'BS Computer Science',
                'units' => $course['units'],
                'year_level' => $course['year'],
                'semester' => '1st',
                'learning_outcomes' => ['Understand programming concepts', 'Apply problem-solving skills'],
            ]);
        }

        // Create Sample Events
        Event::create([
            'event_name' => 'CCS Orientation Program',
            'event_type' => 'curricular',
            'category' => 'Academic',
            'date' => now()->addDays(7),
            'venue' => 'CCS Auditorium',
            'organizer' => 'CCS Dean\'s Office',
            'outcome' => 'Successful orientation for new students',
        ]);

        Event::create([
            'event_name' => 'Coding Competition 2026',
            'event_type' => 'extra_curricular',
            'category' => 'Competition',
            'date' => now()->addDays(30),
            'venue' => 'Computer Lab 1',
            'organizer' => 'Computer Society',
            'outcome' => 'Promote coding skills among students',
        ]);
    }
}
