<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = $this->generateStudents(1000);
        $created = 0;
        
        foreach ($students as $student) {
            // Only create if student_id doesn't exist
            Student::firstOrCreate(
                ['student_id' => $student['student_id']],
                $student
            );
            $created++;
        }
        
        $this->command->info('1000 students seeded successfully!');
    }

    private function generateStudents($count): array
    {
        $students = [];
        
        $programs = [
            'BS Information Technology',
            'BS Computer Science',
            'BS Engineering',
            'BS Business Administration'
        ];

        $firstNames = ['Juan', 'Maria', 'Pedro', 'Ana', 'Jose', 'Carmen', 'Miguel', 'Sofia', 'Carlos', 'Isabella', 'Luis', 'Gabriela', 'Rafael', 'Valentina', 'Andres', 'Lucia', 'Diego', 'Camila', 'Fernando', 'Daniela'];
        $lastNames = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Gonzalez', 'Hernandez', 'Perez', 'Torres', 'Rivera', 'Gomez', 'Diaz', 'Flores', 'Ramos', 'Castillo', 'Mendoza', 'Morales'];
        
        $skills = [
            ['name' => 'Python', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'JavaScript', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Java', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'C++', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Basketball', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Swimming', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Graphic Design', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Public Speaking', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Photography', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Volleyball', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Web Development', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Data Analysis', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
            ['name' => 'Mobile Development', 'proficiency_levels' => ['Beginner', 'Intermediate', 'Advanced', 'Expert']],
        ];

        $affiliations = [
            ['type' => 'organization', 'names' => ['Student Council', 'IEEE', 'ACS', 'Honor Society']],
            ['type' => 'sports', 'names' => ['Basketball Team', 'Volleyball Team', 'Swimming Team', 'Track and Field']],
            ['type' => 'club', 'names' => ['Coding Club', 'Debate Club', 'Photography Club', 'Robotics Club', 'Chess Club', 'Music Club']],
        ];

        $activities = [
            ['event_name' => 'Annual Hackathon', 'type' => 'Competition'],
            ['event_name' => 'Sports Festival', 'type' => 'Sports'],
            ['event_name' => 'Tech Seminar', 'type' => 'Seminar'],
            ['event_name' => 'Community Service', 'type' => 'Volunteer'],
            ['event_name' => 'Coding Workshop', 'type' => 'Workshop'],
            ['event_name' => 'Leadership Training', 'type' => 'Training'],
            ['event_name' => 'Science Fair', 'type' => 'Competition'],
            ['event_name' => 'Cultural Festival', 'type' => 'Cultural'],
        ];

        $violations = [
            ['type' => 'Minor', 'description' => 'Tardy', 'sanction' => 'Warning'],
            ['type' => 'Minor', 'description' => 'Dress code violation', 'sanction' => 'Verbal warning'],
            ['type' => 'Major', 'description' => 'Academic dishonesty', 'sanction' => 'Suspension'],
            ['type' => 'Major', 'description' => 'Misconduct', 'sanction' => 'Probation'],
        ];

        $sections = ['A', 'B', 'C', 'D', 'E'];
        $academicStatuses = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'probation', 'graduated', 'dropped']; // 70% active
        $disciplineStatuses = ['clean', 'clean', 'clean', 'clean', 'clean', 'minor_violation', 'major_violation']; // mostly clean

        for ($i = 0; $i < $count; $i++) {
            $studentId = '202' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $program = $programs[array_rand($programs)];
            $yearLevel = rand(1, 4);
            $section = $sections[array_rand($sections)];
            $gpa = round(rand(15, 50) / 10, 2); // 1.5 to 5.0
            $academicStatus = $academicStatuses[array_rand($academicStatuses)];
            $disciplineStatus = $disciplineStatuses[array_rand($disciplineStatuses)];

            // Generate skills (1-4 skills per student)
            $studentSkills = [];
            $numSkills = rand(1, 4);
            $selectedSkills = array_rand($skills, $numSkills);
            if (!is_array($selectedSkills)) $selectedSkills = [$selectedSkills];
            
            foreach ($selectedSkills as $skillIndex) {
                $skill = $skills[$skillIndex];
                $studentSkills[] = [
                    'name' => $skill['name'],
                    'proficiency_level' => $skill['proficiency_levels'][array_rand($skill['proficiency_levels'])],
                    'certifications' => rand(0, 1) ? ['Certified ' . $skill['name'] . ' Developer'] : []
                ];
            }

            // Generate affiliations (0-3 affiliations per student)
            $studentAffiliations = [];
            if (rand(0, 10) > 3) { // 70% have affiliations
                $numAffiliations = rand(1, 3);
                for ($j = 0; $j < $numAffiliations; $j++) {
                    $affiliationType = $affiliations[array_rand($affiliations)];
                    $studentAffiliations[] = [
                        'type' => $affiliationType['type'],
                        'name' => $affiliationType['names'][array_rand($affiliationType['names'])],
                        'role' => ['Member', 'Officer', 'President', 'Vice President'][array_rand(['Member', 'Officer', 'President', 'Vice President'])],
                        'year_joined' => rand(2020, 2024),
                        'status' => 'Active'
                    ];
                }
            }

            // Generate activities (1-5 activities per student)
            $studentActivities = [];
            $numActivities = rand(1, 5);
            $selectedActivities = array_rand($activities, min($numActivities, count($activities)));
            if (!is_array($selectedActivities)) $selectedActivities = [$selectedActivities];
            
            foreach ($selectedActivities as $activityIndex) {
                $activity = $activities[$activityIndex];
                $studentActivities[] = [
                    'event_name' => $activity['event_name'],
                    'type' => $activity['type'],
                    'date' => '2024-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                    'role' => ['Participant', 'Volunteer', 'Organizer', 'Winner'][array_rand(['Participant', 'Volunteer', 'Organizer', 'Winner'])],
                    'hours_participated' => rand(2, 40)
                ];
            }

            // Generate violations (only if discipline_status is not clean)
            $studentViolations = [];
            if ($disciplineStatus !== 'clean') {
                $numViolations = rand(1, 2);
                for ($k = 0; $k < $numViolations; $k++) {
                    $violation = $violations[array_rand($violations)];
                    $studentViolations[] = [
                        'type' => $violation['type'],
                        'description' => $violation['description'],
                        'date' => '2024-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                        'status' => ['Resolved', 'Pending'][array_rand(['Resolved', 'Pending'])],
                        'sanction' => $violation['sanction']
                    ];
                }
            }

            $students[] = [
                'student_id' => $studentId,
                'personal_info' => [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'middle_name' => substr($lastNames[array_rand($lastNames)], 0, 1) . '.',
                    'email' => strtolower($firstName) . '.' . strtolower($lastName) . '@university.edu',
                    'phone' => '09' . str_pad(rand(100000000, 999999999), 9, '0', STR_PAD_LEFT),
                    'date_of_birth' => '200' . rand(0, 5) . '-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                    'gender' => ['Male', 'Female'][array_rand(['Male', 'Female'])],
                    'address' => [
                        'street' => rand(100, 999) . ' ' . ['Rizal', 'Mabini', 'Bonifacio', 'Aguinaldo', 'Del Pilar'][array_rand(['Rizal', 'Mabini', 'Bonifacio', 'Aguinaldo', 'Del Pilar'])] . ' St.',
                        'city' => ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig'][array_rand(['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig'])],
                        'province' => 'Metro Manila',
                        'zip_code' => str_pad(rand(1000, 1999), 4, '0', STR_PAD_LEFT)
                    ],
                    'emergency_contact' => [
                        'name' => $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)],
                        'relationship' => ['Parent', 'Guardian', 'Sibling'][array_rand(['Parent', 'Guardian', 'Sibling'])],
                        'phone' => '09' . str_pad(rand(100000000, 999999999), 9, '0', STR_PAD_LEFT)
                    ]
                ],
                'academic' => [
                    'program' => $program,
                    'year_level' => $yearLevel,
                    'section' => $section,
                    'gpa' => $gpa,
                    'academic_status' => $academicStatus,
                    'enrollment_status' => $academicStatus === 'graduated' ? 'graduated' : ($academicStatus === 'dropped' ? 'dropped' : 'enrolled'),
                    'honors' => $gpa >= 4.5 ? ["Dean's Lister", 'Cum Laude'] : ($gpa >= 4.0 ? ["Dean's Lister"] : []),
                    'scholarships' => rand(0, 10) > 7 ? ['Academic Scholarship', 'Sports Scholarship', 'Financial Aid'][array_rand(['Academic Scholarship', 'Sports Scholarship', 'Financial Aid'])] : [],
                    'academic_history' => [
                        [
                            'semester' => '1st Semester',
                            'year' => '2023-2024',
                            'courses_taken' => rand(5, 8),
                            'gpa' => round($gpa - 0.2, 2)
                        ]
                    ]
                ],
                'skills' => $studentSkills,
                'affiliations' => $studentAffiliations,
                'activities' => $studentActivities,
                'violations' => $studentViolations,
                'attendance_status' => ['excellent', 'excellent', 'good', 'good', 'fair'][array_rand(['excellent', 'excellent', 'good', 'good', 'fair'])],
                'discipline_status' => $disciplineStatus,
            ];
        }

        return $students;
    }
}
