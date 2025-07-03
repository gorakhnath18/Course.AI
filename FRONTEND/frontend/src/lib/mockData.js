export const mockCourse = {
  id: "course_123",
  title: "A Comprehensive Guide to Pointers in C++",
  originalPrompt: "Teach me pointers in C++",
  createdAt: "2023-10-27T10:00:00Z",
  lessons: [
    {
      id: "lesson_1",
      title: "Introduction to Pointers & Memory",
      learningObjectives: [
        "Understand what a pointer is and why it's used.",
        "Learn about memory addresses and the address-of operator (&).",
        "Declare, initialize, and dereference a pointer using (*)."
      ],
      notes: "Pointers are one of the most powerful and feared features of C++. At its core, a pointer is simply a variable that holds the memory address of another variable. Instead of storing a value like an integer or a character, it stores a location. Think of your computer's memory as a massive sequence of numbered mailboxes. A normal variable puts a value inside a mailbox, while a pointer holds the number of that mailbox. We use the ampersand operator (&) to get the address of a variable, and the asterisk operator (*) to declare a pointer and to 'dereference' it—meaning, to access the value at the address the pointer is holding. This concept is crucial for dynamic memory allocation, building complex data structures like linked lists, and passing large data to functions efficiently without copying it.",
      youtubeVideos: [
        { videoId: "W_g-2P3SsmY", title: "Pointers in C++" },
        { videoId: "i_Yd_z4zL6M", title: "C++ Pointers & Memory | C++ Tutorial for Beginners" }
      ],
      quiz: [
        { type: "MCQ", question: "What does a pointer store?", options: ["A value", "A memory address", "A function", "A class"], correctAnswer: "A memory address" },
        { type: "MCQ", question: "Which operator is used to get the memory address of a variable?", options: ["*", "&", "#", "@"], correctAnswer: "&" },
        { type: "MCQ", question: "What is the term for accessing the value at a pointer's stored address?", options: ["Referencing", "Allocating", "Dereferencing", "Pointing"], correctAnswer: "Dereferencing" },
        { type: "Open-Ended", question: "In your own words, explain the purpose of the dereference operator (*).", correctAnswer: "The dereference operator (*) is used to access or modify the value stored at the memory address a pointer is pointing to." }
      ],
      flashcards: [
        { front: "What is the address-of operator?", back: "The ampersand (&) operator, used to get the memory address of a variable." },
        { front: "What does `nullptr` signify?", back: "A pointer that is intentionally pointing to nothing." },
        { front: "What is a dangling pointer?", back: "A pointer that points to a memory location that has been deallocated or freed." }
      ]
    },
    {
      id: "lesson_2",
      title: "Pointers and Arrays",
      notes: "This is a placeholder for the second lesson. Pointers and arrays are closely related in C++. The name of an array often behaves like a pointer to its first element. This allows for powerful and efficient operations like iterating through array elements using pointer arithmetic instead of index-based access.",
      learningObjectives: [
        "Understand the relationship between pointers and arrays.",
        "Use pointer arithmetic to navigate arrays."
      ],
      youtubeVideos: [{ videoId: "p8n0aJ0_bI4", title: "C++ Pointers and Arrays" }],
      quiz: [],
      flashcards: []
    }
  ]
};

export const mockCourseList = [
    { id: "course_123", title: "Pointers in C++", createdAt: "2023-10-27T10:00:00Z" },
    { id: "course_456", title: "Machine Learning Basics", createdAt: "2023-10-25T14:30:00Z" },
    { id: "course_789", title: "React State Management", createdAt: "2023-10-22T09:00:00Z" },
];