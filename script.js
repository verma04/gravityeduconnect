document.addEventListener("DOMContentLoaded", () => {
  // Programs data
  const programs = [
    {
      id: 1,
      title: "Business",
      levels: ["graduate", "undergraduate"],
    },
    {
      id: 2,
      title: "Cybersecurity",
      levels: ["graduate", "undergraduate"],
    },
    {
      id: 3,
      title: "Computer & Information Systems",
      levels: ["graduate", "undergraduate"],
    },
    {
      id: 4,
      title: "Education",
      levels: ["graduate", "undergraduate", "doctoral"],
    },
    {
      id: 5,
      title: "Engineering",
      levels: ["graduate", "undergraduate"],
    },
    {
      id: 6,
      title: "Leadership",
      levels: ["graduate", "undergraduate"],
    },
    {
      id: 7,
      title: "Nursing",
      levels: ["graduate", "undergraduate", "doctoral"],
    },
    {
      id: 8,
      title: "Psychology",
      levels: ["graduate", "undergraduate"],
    },
    {
      id: 9,
      title: "Healthcare Science",
      levels: ["graduate"],
    },
    {
      id: 10,
      title: "Communications",
      levels: ["undergraduate"],
    },
    {
      id: 11,
      title: "Criminal Justice",
      levels: ["undergraduate"],
    },
    {
      id: 12,
      title: "English",
      levels: ["undergraduate"],
    },
    {
      id: 13,
      title: "Interdisciplinary",
      levels: ["undergraduate"],
    },
    {
      id: 14,
      title: "Mathematics",
      levels: ["undergraduate"],
    },
    {
      id: 15,
      title: "Media Arts",
      levels: ["undergraduate"],
    },
    {
      id: 16,
      title: "Science",
      levels: ["undergraduate"],
    },
    {
      id: 17,
      title: "Health",
      levels: ["undergraduate"],
    },
    {
      id: 18,
      title: "Social Sciences",
      levels: ["undergraduate"],
    },
    {
      id: 19,
      title: "Computer & Information Systems",
      levels: ["doctoral"],
    },
  ];

  // Courses data for Business program
  const businessCourses = [
    {
      id: 1,
      title: "Master of Business Administration",
      level: "graduate",
      category: "business",
      program: "Business",
    },
    {
      id: 2,
      title: "MBA in Business Analytics",
      level: "graduate",
      category: "business",
      program: "Business",
    },
    {
      id: 3,
      title: "Business Administration B.S. (Accounting)",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
    {
      id: 4,
      title: "Business Administration B.S. (Finance)",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
    {
      id: 5,
      title: "Business Administration B.S. (Management)",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
    {
      id: 6,
      title: "Business Administration B.S. (Marketing & Management)",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
    {
      id: 7,
      title: "Business Administration B.S. (Marketing)",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
    {
      id: 8,
      title: "Business Administration B.S. (Sport Management)",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
    {
      id: 9,
      title: "Financial Planning B.S.B.A.",
      level: "undergraduate",
      category: "business",
      program: "Business",
    },
  ];

  // Sample courses data for other programs (simplified for demo)
  const cybersecurityCourses = [
    {
      id: 1,
      title: "Master of Cybersecurity",
      level: "graduate",
      category: "cybersecurity",
      program: "Cybersecurity",
    },
    {
      id: 2,
      title: "Cybersecurity B.S.",
      level: "undergraduate",
      category: "cybersecurity",
      program: "Cybersecurity",
    },
    {
      id: 3,
      title: "Network Security Certificate",
      level: "graduate",
      category: "cybersecurity",
      program: "Cybersecurity",
    },
    {
      id: 4,
      title: "Ethical Hacking B.S.",
      level: "undergraduate",
      category: "cybersecurity",
      program: "Cybersecurity",
    },
  ];

  const computerCourses = [
    {
      id: 1,
      title: "Master of Computer Science",
      level: "graduate",
      category: "computer-science",
      program: "Computer & Information Systems",
    },
    {
      id: 2,
      title: "Information Systems B.S.",
      level: "undergraduate",
      category: "computer-science",
      program: "Computer & Information Systems",
    },
    {
      id: 3,
      title: "Ph.D. in Computer Science",
      level: "doctoral",
      category: "computer-science",
      program: "Computer & Information Systems",
    },
    {
      id: 4,
      title: "Software Engineering M.S.",
      level: "graduate",
      category: "computer-science",
      program: "Computer & Information Systems",
    },
    {
      id: 5,
      title: "Web Development B.S.",
      level: "undergraduate",
      category: "computer-science",
      program: "Computer & Information Systems",
    },
  ];

  // Combine all courses for global search
  const allCourses = [
    ...businessCourses,
    ...cybersecurityCourses,
    ...computerCourses,
    // Add more courses as needed
  ];

  // Program courses mapping
  const programCourses = {
    Business: businessCourses,
    Cybersecurity: cybersecurityCourses,
    "Computer & Information Systems": computerCourses,
    // Add more program courses as needed
  };

  const programsView = document.getElementById("programs-view");
  const coursesView = document.getElementById("courses-view");
  const globalSearchView = document.getElementById("global-search-view");
  const coursesContainer = document.getElementById("courses-container");
  const programResultsContainer = document.getElementById(
    "program-results-container"
  );
  const courseResultsContainer = document.getElementById(
    "course-results-container"
  );
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const clearSearchBtn = document.getElementById("clear-search");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const backToPrograms = document.getElementById("back-to-programs");

  let currentFilter = "all";
  let searchQuery = "";
  let currentView = "programs";
  let selectedProgram = null;

  // Initialize the page
  renderPrograms();

  // Add event listeners
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  clearSearchBtn.addEventListener("click", clearSearch);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Update filter and render appropriate view
      currentFilter = this.getAttribute("data-filter");

      if (searchQuery) {
        performGlobalSearch();
      } else if (currentView === "programs") {
        renderPrograms();
      } else {
        renderCourses(selectedProgram);
      }
    });
  });

  backToPrograms.addEventListener("click", (e) => {
    e.preventDefault();
    showProgramsView();
  });

  function handleSearch() {
    searchQuery = searchInput.value.trim().toLowerCase();

    if (searchQuery) {
      performGlobalSearch();
    } else {
      clearSearch();
    }
  }

  function clearSearch() {
    searchInput.value = "";
    searchQuery = "";

    // Return to the appropriate view
    if (currentView === "programs") {
      showProgramsView();
    } else {
      showCoursesView(selectedProgram);
    }
  }

  function performGlobalSearch() {
    // Hide other views and show global search view
    programsView.classList.add("hidden");
    coursesView.classList.add("hidden");
    globalSearchView.classList.remove("hidden");

    // Search programs
    const matchingPrograms = programs.filter((program) => {
      const titleMatch = program.title.toLowerCase().includes(searchQuery);
      const levelMatch =
        currentFilter === "all" || program.levels.includes(currentFilter);
      return titleMatch && levelMatch;
    });

    // Search courses
    const matchingCourses = allCourses.filter((course) => {
      const titleMatch = course.title.toLowerCase().includes(searchQuery);
      const levelMatch =
        currentFilter === "all" || course.level === currentFilter;
      return titleMatch && levelMatch;
    });

    // Render program results
    programResultsContainer.innerHTML = "";
    if (matchingPrograms.length > 0) {
      matchingPrograms.forEach((program) => {
        const programCard = createProgramCard(program);
        programResultsContainer.appendChild(programCard);
      });
    } else {
      programResultsContainer.innerHTML =
        '<p class="no-results">No matching programs found</p>';
    }

    // Render course results
    courseResultsContainer.innerHTML = "";
    if (matchingCourses.length > 0) {
      matchingCourses.forEach((course) => {
        const courseCard = createCourseCard(course, true);
        courseResultsContainer.appendChild(courseCard);
      });
    } else {
      courseResultsContainer.innerHTML =
        '<p class="no-results">No matching courses found</p>';
    }
  }

  function renderPrograms() {
    // Clear the container
    programsView.innerHTML = "";

    // Filter programs based on current filter and search query
    const filteredPrograms = programs.filter((program) => {
      // Filter by level
      const levelMatch =
        currentFilter === "all" || program.levels.includes(currentFilter);

      // Filter by search query (if any)
      const titleMatch =
        !searchQuery || program.title.toLowerCase().includes(searchQuery);

      return levelMatch && titleMatch;
    });

    // Render filtered programs
    filteredPrograms.forEach((program) => {
      const programCard = createProgramCard(program);
      programsView.appendChild(programCard);
    });

    // Show message if no programs found
    if (filteredPrograms.length === 0) {
      programsView.innerHTML =
        '<p class="no-results">No programs found matching your criteria.</p>';
    }
  }

  function createProgramCard(program) {
    const programCard = document.createElement("div");
    programCard.className = "course-card";

    // Create tags
    const tagsHTML = program.levels
      .map(
        (level) =>
          `<span class="course-tag ${level}">${capitalizeFirstLetter(
            level
          )}</span>`
      )
      .join("");

    programCard.innerHTML = `
      <div class="course-tags">
        ${tagsHTML}
      </div>
      <h3 class="course-title">${program.title}</h3>
      <button class="view-details-btn" data-program="${program.title}">View Details</button>
    `;

    // Add click event to the View Details button
    const viewDetailsBtn = programCard.querySelector(".view-details-btn");
    viewDetailsBtn.addEventListener("click", function () {
      const programTitle = this.getAttribute("data-program");
      showCoursesView(programTitle);
    });

    return programCard;
  }

  function renderCourses(programTitle) {
    // Clear the container
    coursesContainer.innerHTML = "";

    // Get courses for the selected program
    const courses = programCourses[programTitle] || [];

    // Filter courses based on current filter and search query
    const filteredCourses = courses.filter((course) => {
      // Filter by level
      const levelMatch =
        currentFilter === "all" || course.level === currentFilter;

      // Filter by search query (if any)
      const titleMatch =
        !searchQuery || course.title.toLowerCase().includes(searchQuery);

      return levelMatch && titleMatch;
    });

    // Render filtered courses
    filteredCourses.forEach((course) => {
      const courseCard = createCourseCard(course, false);
      coursesContainer.appendChild(courseCard);
    });

    // Show message if no courses found
    if (filteredCourses.length === 0) {
      coursesContainer.innerHTML =
        '<p class="no-results">No courses found matching your criteria.</p>';
    }
  }

  function createCourseCard(course, showProgram) {
    const courseCard = document.createElement("div");
    courseCard.className = "course-card";

    let cardHTML = `
      <div class="course-tags">
        <span class="course-tag ${course.level}">${capitalizeFirstLetter(
      course.level
    )}</span>
        <span class="course-tag ${course.category}">${capitalizeFirstLetter(
      course.category
    )}</span>
      </div>
      <h3 class="course-title">${course.title}</h3>
    `;

    // Add program name for global search results
    if (showProgram) {
      cardHTML += `<div class="program-name">Program: ${course.program}</div>`;
    }

    cardHTML += `<button class="view-details-btn">View Details</button>`;

    courseCard.innerHTML = cardHTML;

    // Add click event to the View Details button if needed
    const viewDetailsBtn = courseCard.querySelector(".view-details-btn");
    if (showProgram) {
      viewDetailsBtn.addEventListener("click", () => {
        showCoursesView(course.program);
      });
    }

    return courseCard;
  }

  function showProgramsView() {
    programsView.classList.remove("hidden");
    coursesView.classList.add("hidden");
    globalSearchView.classList.add("hidden");
    currentView = "programs";
    selectedProgram = null;
    renderPrograms();
  }

  function showCoursesView(programTitle) {
    programsView.classList.add("hidden");
    coursesView.classList.remove("hidden");
    globalSearchView.classList.add("hidden");
    currentView = "courses";
    selectedProgram = programTitle;
    renderCourses(programTitle);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
