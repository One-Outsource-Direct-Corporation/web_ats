"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Check, X } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const getPerformanceColor = (performance: string) => {
  switch (performance.toLowerCase()) {
    case "excellent":
    case "outstanding":
      return "text-green-600"
    case "good":
      return "text-blue-600"
    case "moderate":
      return "text-yellow-600"
    case "poor":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

const getVerdictInfo = (score: number) => {
  if (score >= 45) return { level: "Exceptional", description: "Ready for leadership; minimal guidance needed" }
  if (score >= 40) return { level: "Strong", description: "Hire with slight upskilling in 1-2 areas" }
  if (score >= 35) return { level: "Moderate", description: "Needs coaching; may lack lead experience" }
  return { level: "Not Ready", description: "Requires significant upskilling" }
}

// Update the ExamForm component to get the applicant ID from the URL params
export default function ExamForm() {
  const navigate = useNavigate()
  const { jobtitle, applicantId } = useParams<{ jobtitle: string; applicantId: string }>()
  const [showFullExam, setShowFullExam] = useState(false)

  // You can use the applicantId to fetch specific data for this applicant
  // For now, we'll use the mock data, but you can replace this with actual data fetching
  const mockExamData = {
    candidateName: getApplicantName(applicantId), // You'll need to implement this function
    jobTitle: formatJobTitle(jobtitle),
    assessmentType: "Technical Assessment",
    totalScore: 42,
    maxScore: 50,
    percentage: 84,
    verdict: "Strong Hire",
    sections: [
      {
        name: "Multiple Choice (MCQ)",
        description: "Fundamental concepts and theory",
        maxScore: 20,
        candidateScore: 16,
        performance: "Good",
        remarks:
          "Strong understanding of core concepts with minor gaps in advanced topics. Missed questions on design patterns and optimization techniques.",
      },
      {
        name: "Coding (Algorithm + Architecture)",
        description: "Problem-solving and system design",
        maxScore: 20,
        candidateScore: 18,
        performance: "Excellent",
        remarks:
          "Demonstrated excellent problem-solving skills and clean code practices. Minor deduction for not considering edge cases in one solution.",
      },
      {
        name: "Checkbox (Best Practices, Debugging, Security)",
        description: "Industry standards and security awareness",
        maxScore: 10,
        candidateScore: 8,
        performance: "Good",
        remarks:
          "Good knowledge of best practices and security principles. Missed some advanced debugging techniques and security considerations.",
      },
    ],
  }

  // Helper function to get applicant name (you can replace this with actual data fetching)
  function getApplicantName(id?: string) {
    const applicants = {
      "001": "John Doe",
      "002": "Sarah Johnson",
      "003": "Mike Chen",
      "004": "Emily Rodriguez",
      "005": "David Kim",
      "006": "Lisa Wang",
      "007": "Alex Thompson",
      "008": "Maria Garcia",
    }
    return applicants[id as keyof typeof applicants] || "Unknown Applicant"
  }

  function formatJobTitle(slug?: string) {
    const titleMap: Record<string, string> = {
      leaddeveloper: "Lead Developer",
      projectmanager: "Project Manager",
      socialcontentmanager: "Social Content Manager",
      senioruiuxdesigner: "Senior UI/UX Designer",
      customersupport: "Customer Support",
      qaengineer: "QA Engineer",
      humanresourcescoordinator: "Human Resources Coordinator",
      operationsmanager: "Operations Manager",
      socialmediamanager: "Social Media Manager",
      marketingspecialist: "Marketing Specialist",
      seniorsoftwareengineer: "Senior Software Engineer",
    }
    return slug ? titleMap[slug.toLowerCase()] || slug.replace(/([a-z])([A-Z])/g, "$1 $2") : "Unknown Job"
  }

  const verdictInfo = getVerdictInfo(mockExamData.totalScore)

  if (showFullExam) {
    return <FullExamResult onBack={() => setShowFullExam(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <img
          src="/OODC logo2.png"
          alt="OODC Logo"
          className="h-32 mx-auto"
          
        />
        <div className="hidden text-2xl font-bold text-gray-800">OODC</div>
      </div>

      {/* Paper Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Back Button */}
        <div className="p-6 pb-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(`/job/${jobtitle}/assessments`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Applicant Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                {mockExamData.jobTitle} {mockExamData.assessmentType} - Evaluation Report
              </h3>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Candidate Name:</span> {mockExamData.candidateName}
                </p>
                <p>
                  <span className="font-semibold">Total Score:</span> {mockExamData.totalScore}/{mockExamData.maxScore}
                  <span className="ml-2 text-sm">
                    ({mockExamData.percentage}% - {verdictInfo.level})
                  </span>
                </p>
                <button
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                  onClick={() => setShowFullExam(true)}
                >
                  View Full Exam Result
                </button>
              </div>
            </div>

            {/* Right Column - Grading Scale */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Grading Scale:</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">45-50:</span> Exceptional (Ready for leadership; minimal guidance
                  needed)
                </p>
                <p>
                  <span className="font-medium">40-44:</span> Strong (Hire with slight upskilling in 1-2 areas)
                </p>
                <p>
                  <span className="font-medium">35-39:</span> Moderate (Needs coaching; may lack lead experience)
                </p>
                <p>
                  <span className="font-medium">&lt;35:</span> Not Ready (Requires significant upskilling)
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Results Table */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Section</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Number of Items</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Candidate Score</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Performance</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {mockExamData.sections.map((section) => (
                    <tr key={section.name} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-sm text-gray-600">{section.description}</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{section.maxScore}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                        {section.candidateScore}
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-3 text-center font-medium ${getPerformanceColor(section.performance)}`}
                      >
                        {section.performance}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{section.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Recommendations */}
          <div className="bg-gray-50 p-6 rounded-lg relative">
            <h3 className="font-semibold mb-4">Final Recommendations:</h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">Overall Score:</span> {mockExamData.totalScore}/{mockExamData.maxScore}{" "}
                ({mockExamData.percentage}%)
              </p>
              <p>
                <span className="font-semibold">Recommendation:</span> {mockExamData.verdict} -{" "}
                {verdictInfo.description}
              </p>
              <p>
                The candidate demonstrates strong technical capabilities with excellent coding skills and good
                understanding of fundamental concepts. While there are minor areas for improvement in advanced topics
                and security practices, the overall performance indicates readiness for the role with minimal onboarding
                support required.
              </p>
            </div>

            {/* Ask AI Button */}
            <Button className="absolute bottom-4 right-4 flex items-center gap-2" size="sm">
              Ask AI
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Full Exam Result Component
export function FullExamResult({ onBack }: { onBack: () => void }) {
  const mcqQuestions = [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      userAnswer: 1,
      points: 2,
    },
    {
      id: 2,
      question: "Which design pattern is used to create objects without specifying their concrete classes?",
      options: ["Singleton", "Factory", "Observer", "Strategy"],
      correctAnswer: 1,
      userAnswer: 0,
      points: 2,
    },
    {
      id: 3,
      question: "What does REST stand for?",
      options: [
        "Representational State Transfer",
        "Remote State Transfer",
        "Relational State Transfer",
        "Resource State Transfer",
      ],
      correctAnswer: 0,
      userAnswer: 0,
      points: 2,
    },
    {
      id: 4,
      question: "Which HTTP method is idempotent?",
      options: ["POST", "PUT", "PATCH", "DELETE"],
      correctAnswer: 1,
      userAnswer: 1,
      points: 2,
    },
    {
      id: 5,
      question: "What is the purpose of a foreign key in a database?",
      options: ["Primary identification", "Data validation", "Referential integrity", "Index optimization"],
      correctAnswer: 2,
      userAnswer: 2,
      points: 2,
    },
    {
      id: 6,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: 1,
      userAnswer: 1,
      points: 2,
    },
    {
      id: 7,
      question: "What is the main advantage of using microservices architecture?",
      options: ["Faster development", "Better scalability", "Reduced complexity", "Lower costs"],
      correctAnswer: 1,
      userAnswer: 1,
      points: 2,
    },
    {
      id: 8,
      question: "Which principle is NOT part of SOLID principles?",
      options: ["Single Responsibility", "Open/Closed", "Dependency Inversion", "Don't Repeat Yourself"],
      correctAnswer: 3,
      userAnswer: 3,
      points: 2,
    },
    {
      id: 9,
      question: "What is the purpose of indexing in databases?",
      options: ["Data backup", "Query optimization", "Data encryption", "Schema validation"],
      correctAnswer: 1,
      userAnswer: 0,
      points: 2,
    },
    {
      id: 10,
      question: "Which data structure is best for implementing a LRU cache?",
      options: ["Array", "Linked List", "Hash Map + Doubly Linked List", "Binary Tree"],
      correctAnswer: 2,
      userAnswer: 2,
      points: 2,
    },
  ]

  const checkboxQuestions = [
    {
      id: 1,
      question: "Which of the following are best practices for secure coding? (Select all that apply)",
      options: [
        "Input validation",
        "Using hardcoded passwords",
        "SQL injection prevention",
        "Regular security audits",
        "Storing passwords in plain text",
      ],
      correctAnswers: [0, 2, 3],
      userAnswers: [0, 2, 3],
      points: 2,
    },
    {
      id: 2,
      question: "Which debugging techniques are effective? (Select all that apply)",
      options: [
        "Print statements",
        "Using debugger breakpoints",
        "Code review",
        "Ignoring error messages",
        "Unit testing",
      ],
      correctAnswers: [0, 1, 2, 4],
      userAnswers: [0, 1, 2],
      points: 2,
    },
    {
      id: 3,
      question: "What are characteristics of clean code? (Select all that apply)",
      options: [
        "Self-documenting",
        "Complex nested structures",
        "Meaningful variable names",
        "Single responsibility functions",
        "Long parameter lists",
      ],
      correctAnswers: [0, 2, 3],
      userAnswers: [0, 2, 3],
      points: 2,
    },
    {
      id: 4,
      question: "Which are common security vulnerabilities? (Select all that apply)",
      options: [
        "SQL Injection",
        "Cross-Site Scripting (XSS)",
        "Proper authentication",
        "Buffer overflow",
        "Strong encryption",
      ],
      correctAnswers: [0, 1, 3],
      userAnswers: [0, 1],
      points: 2,
    },
    {
      id: 5,
      question: "What are benefits of version control? (Select all that apply)",
      options: ["Track changes", "Collaboration", "Backup and recovery", "Slower development", "Branch management"],
      correctAnswers: [0, 1, 2, 4],
      userAnswers: [0, 1, 2, 4],
      points: 2,
    },
  ]

  const mcqScore = mcqQuestions.reduce((total, q) => total + (q.correctAnswer === q.userAnswer ? q.points : 0), 0)
  const codingScore = 18 // Mock coding score
  const checkboxScore = checkboxQuestions.reduce((total, q) => {
    const correctCount = q.correctAnswers.filter((ans) => q.userAnswers.includes(ans)).length
    const incorrectCount = q.userAnswers.filter((ans) => !q.correctAnswers.includes(ans)).length

    if (correctCount === q.correctAnswers.length && incorrectCount === 0) {
      return total + q.points
    }
    return total
  }, 0)

  const totalScore = mcqScore + codingScore + checkboxScore
  const percentage = Math.round((totalScore / 50) * 100)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <img
          src="/OODC logo2.png"
          alt="OODC Logo"
          className="h-32 mx-auto"
          
        />
        <div className="hidden text-2xl font-bold text-gray-800">OODC</div>
      </div>

      {/* Paper Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Back Button */}
        <div className="p-6 pb-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Grading Scale */}
        {/* Right Column - Grading Scale */}
<div className="flex justify-end">
  <div className="bg-gray-50 p-4 rounded-lg space-y-2 w-full max-w-md">
    <h3 className="font-semibold">Grading Scale:</h3>
    <p className="text-sm">
      <span className="font-medium">45-50:</span> Exceptional (Ready for leadership; minimal guidance needed)
    </p>
    <p className="text-sm">
      <span className="font-medium">40-44:</span> Strong (Hire with slight upskilling in 1–2 areas)
    </p>
    <p className="text-sm">
      <span className="font-medium">35-39:</span> Moderate (Needs coaching; may lack lead experience)
    </p>
    <p className="text-sm">
      <span className="font-medium">&lt;35:</span> Not Ready (Requires significant upskilling)
    </p>
  </div>
</div>


        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Column - MCQ Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-4">Section 1: Multiple Choice (MCQ) - 20 points</h2>

              <div className="space-y-4">
                {mcqQuestions.map((question) => (
                  <div key={question.id} className="border-b pb-4">
                    <p className="font-medium mb-2">
                      Q{question.id}. {question.question}
                    </p>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <span className="w-6">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && question.userAnswer === question.correctAnswer && (
                            <div className="flex items-center gap-1 text-green-600 ml-auto">
                              <Check className="h-4 w-4" />
                              <span className="text-sm">(Correct)</span>
                            </div>
                          )}
                          {optionIndex === question.userAnswer && question.userAnswer !== question.correctAnswer && (
                            <div className="flex items-center gap-1 text-red-600 ml-auto">
                              <X className="h-4 w-4" />
                              <span className="text-sm">(Incorrect)</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded">
                <p className="font-semibold">Candidate Score in MCQ: {mcqScore}/20</p>
                <p className="text-sm text-gray-600 mt-1">Missed Q2 & Q9</p>
              </div>
            </div>
          </div>

          {/* Right Column - Coding and Checkbox Sections */}
          <div className="space-y-8">
            {/* Coding Section */}
            <div>
              <h2 className="text-lg font-bold mb-4">Section 2: Coding - 20 points</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">Task:</p>
                  <p className="text-sm text-gray-700 mb-4">
                    Implement a function to find the longest palindromic substring in a given string. Also design a
                    simple REST API architecture for a user management system.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">Evaluation Criteria:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Algorithm correctness (8 points)</li>
                    <li>• Code quality and readability (4 points)</li>
                    <li>• API design principles (4 points)</li>
                    <li>• Error handling (2 points)</li>
                    <li>• Time/space complexity consideration (2 points)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Solution:</p>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    <pre>{`function longestPalindrome(s) {
  let longest = "";
  for (let i = 0; i < s.length; i++) {
    // Check odd length palindromes
    let odd = expandAroundCenter(s, i, i);
    // Check even length palindromes  
    let even = expandAroundCenter(s, i, i + 1);
    let current = odd.length > even.length ? odd : even;
    if (current.length > longest.length) {
      longest = current;
    }
  }
  return longest;
}`}</pre>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-semibold">Candidate Score: 18/20</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Excellent implementation with clean code. Minor deduction (-2) for not handling edge case of empty
                    string input.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox Section */}
            <div>
              <h2 className="text-lg font-bold mb-4">Section 3: Checkbox - 10 points</h2>
              <p className="text-sm text-gray-600 mb-4">Select All Correct Answers | 2 points each</p>

              <div className="space-y-4">
                {checkboxQuestions.map((question) => (
                  <div key={question.id} className="border-b pb-4">
                    <p className="font-medium mb-2">
                      Q{question.id}. {question.question}
                    </p>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                            {question.userAnswers.includes(optionIndex) && <Check className="h-3 w-3 text-blue-600" />}
                          </div>
                          <span className="text-sm">{option}</span>
                          {question.correctAnswers.includes(optionIndex) &&
                            question.userAnswers.includes(optionIndex) && (
                              <Check className="h-4 w-4 text-green-600 ml-auto" />
                            )}
                          {question.correctAnswers.includes(optionIndex) &&
                            !question.userAnswers.includes(optionIndex) && (
                              <div className="flex items-center gap-1 text-red-600 ml-auto">
                                <X className="h-4 w-4" />
                                <span className="text-xs">(Missed by candidate)</span>
                              </div>
                            )}
                          {!question.correctAnswers.includes(optionIndex) &&
                            question.userAnswers.includes(optionIndex) && (
                              <div className="flex items-center gap-1 text-red-600 ml-auto">
                                <X className="h-4 w-4" />
                                <span className="text-xs">(Incorrect)</span>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded">
                <p className="font-semibold">Candidate Score: {checkboxScore}/10</p>
                <p className="text-sm text-gray-600 mt-1">
                  Missed some debugging techniques in Q2 and security vulnerabilities in Q4
                </p>
              </div>
            </div>

            {/* Final Score & Evaluation */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Final Score & Evaluation</h3>

              <div className="space-y-2 mb-4">
                <p>MCQ: {mcqScore}/20</p>
                <p>Coding: {codingScore}/20</p>
                <p>Checkbox: {checkboxScore}/10</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded mb-4">
                <p className="text-2xl font-bold text-red-600">{totalScore}/50</p>
                <p className="text-lg font-semibold text-red-600">{percentage}%</p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <p className="font-semibold text-green-600 mb-2">Verdict: Strong Hire</p>
                <p className="text-sm text-gray-700">
                  The candidate demonstrates excellent technical skills with strong coding abilities and good
                  understanding of fundamental concepts. Performance indicates readiness for the role with minimal
                  additional training required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
