document.addEventListener("DOMContentLoaded", () => {
  // API endpoints
  const API_BASE_URL =
    "https://mirchidigital.com/gravityeducation/wp-json/custom/v1";
  const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;
  const PROGRAMS_ENDPOINT = `${API_BASE_URL}/programs`;
  const COURSES_ENDPOINT = `${API_BASE_URL}/courses`;

  // DOM elements
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
  const filterButtonsContainer = document.getElementById("filter-buttons");
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error-message");
  const retryButton = document.getElementById("retry-btn");

  // Breadcrumb elements
  const breadcrumbContainer = document.getElementById("breadcrumb-container");
  const breadcrumbHome = document.getElementById("breadcrumb-home");
  const breadcrumbProgram = document.getElementById("breadcrumb-program");

  // State variables
  let categories = [];
  let programs = [];
  let courses = [];
  let currentFilter = "all";
  let searchQuery = "";
  let currentView = "programs";
  let selectedProgram = null;
  let selectedProgramSlug = null;
  let filterBtns = [];

  // Initialize the application
  initApp();

  // Event listeners
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  clearSearchBtn.addEventListener("click", clearSearch);

  // Breadcrumb navigation
  breadcrumbHome.addEventListener("click", (e) => {
    e.preventDefault();
    showProgramsView();
  });

  retryButton.addEventListener("click", initApp);

  // Functions
  async function initApp() {
    showLoading();
    hideError();

    try {
      // Fetch all data in parallel
      const [categoriesData, programsData, coursesData] = await Promise.all([
        fetchCategories(),
        fetchPrograms(),
        fetchCourses(),
      ]);

      // Store data
      categories = categoriesData;
      programs = programsData;
      courses = coursesData;

      // Initialize filter buttons
      initFilterButtons();

      // Show programs view
      hideLoading();
      showProgramsView();
    } catch (error) {
      console.error("Error initializing app:", error);
      hideLoading();
      showError();
    }
  }

  async function fetchCategories() {
    const response = await fetch(CATEGORIES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async function fetchPrograms() {
    const response = await fetch(PROGRAMS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch programs: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async function fetchCourses() {
    const response = await fetch(COURSES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  function initFilterButtons() {
    // Clear existing buttons except "All"
    while (filterButtonsContainer.children.length > 1) {
      filterButtonsContainer.removeChild(filterButtonsContainer.lastChild);
    }

    // Add category buttons
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "filter-btn";
      button.setAttribute("data-filter", category.slug.toLowerCase());
      button.textContent = category.title;
      filterButtonsContainer.appendChild(button);
    });

    // Get all filter buttons and add event listeners
    filterBtns = document.querySelectorAll(".filter-btn");
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
          renderCourses(selectedProgram, selectedProgramSlug);
        }
      });
    });
  }

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
      showCoursesView(selectedProgram, selectedProgramSlug);
    }
  }

  function performGlobalSearch() {
    // Hide other views and show global search view
    programsView.classList.add("hidden");
    coursesView.classList.add("hidden");
    globalSearchView.classList.remove("hidden");

    // Update breadcrumbs for search
    updateBreadcrumbs("search");

    // Search programs
    const matchingPrograms = programs.filter((program) => {
      const titleMatch = program.title.toLowerCase().includes(searchQuery);
      const levelMatch =
        currentFilter === "all" ||
        program.levels.some((level) => level.toLowerCase() === currentFilter);
      return titleMatch && levelMatch;
    });

    // Search courses
    const matchingCourses = courses.filter((course) => {
      const titleMatch = course.title.toLowerCase().includes(searchQuery);

      // Check if course has categories that match the current filter
      const levelMatch =
        currentFilter === "all" ||
        course.categories.some(
          (cat) => cat.title.toLowerCase() === currentFilter
        );

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
        currentFilter === "all" ||
        program.levels.some((level) => level.toLowerCase() === currentFilter);

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

    // Create tags for program levels
    const tagsHTML = program.levels
      .map((level) => {
        const levelSlug = level.toLowerCase();
        return `<span class="course-tag ${levelSlug}">${level}</span>`;
      })
      .join("");

    programCard.innerHTML = `
      <div class="course-tags">
        ${tagsHTML}
      </div>
      <h3 class="course-title">${program.title}</h3>
      <button class="view-details-btn" data-program="${program.title}" data-slug="${program.slug}">View Details</button>
    `;

    // Add click event to the View Details button
    const viewDetailsBtn = programCard.querySelector(".view-details-btn");
    viewDetailsBtn.addEventListener("click", function () {
      const programTitle = this.getAttribute("data-program");
      const programSlug = this.getAttribute("data-slug");
      showCoursesView(programTitle, programSlug);
    });

    return programCard;
  }

  function renderCourses(programTitle, programSlug) {
    // Clear the container
    coursesContainer.innerHTML = "";

    // Get courses for the selected program
    const programCourses = courses.filter((course) =>
      course.programs.some(
        (prog) => prog.title === programTitle || prog.slug === programSlug
      )
    );

    // Filter courses based on current filter
    const filteredCourses = programCourses.filter((course) => {
      // Filter by level/category
      const levelMatch =
        currentFilter === "all" ||
        course.categories.some(
          (cat) => cat.title.toLowerCase() === currentFilter
        );

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

    // Create tags for course categories
    const categoryTags = course.categories
      .map((category) => {
        const categorySlug = category.title.toLowerCase();
        return `<span class="course-tag ${categorySlug}">${category.title}</span>`;
      })
      .join("");

    let cardHTML = `
      <div class="course-tags">
        ${categoryTags}
      </div>
      <h3 class="course-title">${course.title}</h3>
    `;

    // Add program name for global search results
    if (showProgram && course.programs.length > 0) {
      const programNames = course.programs.map((prog) => prog.title).join(", ");
      cardHTML += `<div class="program-name">Program: ${programNames}</div>`;
    }

    cardHTML += `<button class="view-details-btn" data-link="${course.link}">View Details</button>`;

    courseCard.innerHTML = cardHTML;

    // Add click event to the View Details button
    const viewDetailsBtn = courseCard.querySelector(".view-details-btn");
    viewDetailsBtn.addEventListener("click", function () {
      const courseLink = this.getAttribute("data-link");
      if (courseLink) {
        window.open(courseLink, "_blank");
      }
    });

    return courseCard;
  }

  function updateBreadcrumbs(view, programTitle = "") {
    // Show breadcrumbs
    breadcrumbContainer.classList.remove("hidden");

    // Reset breadcrumb items
    breadcrumbProgram.textContent = "";
    breadcrumbProgram.classList.remove("active");

    if (view === "programs" || view === "search") {
      // For programs view or search view, only show Home as active
      breadcrumbHome.parentElement.classList.add("active");

      if (view === "search") {
        // For search view, add "Search Results" as the active item
        breadcrumbProgram.textContent = "Search Results";
        breadcrumbProgram.classList.add("active");
        breadcrumbHome.parentElement.classList.remove("active");
      }
    } else if (view === "courses" && programTitle) {
      // For courses view, show Home and Program
      breadcrumbHome.parentElement.classList.remove("active");
      breadcrumbProgram.textContent = programTitle;
      breadcrumbProgram.classList.add("active");
    }
  }

  function showProgramsView() {
    hideLoading(); // Make sure loading is hidden
    programsView.classList.remove("hidden");
    programsView.style.display = "grid"; // Explicitly set display to grid
    coursesView.classList.add("hidden");
    globalSearchView.classList.add("hidden");
    currentView = "programs";
    selectedProgram = null;
    selectedProgramSlug = null;

    // Update breadcrumbs
    updateBreadcrumbs("programs");

    renderPrograms();
  }

  function showCoursesView(programTitle, programSlug) {
    programsView.classList.add("hidden");
    coursesView.classList.remove("hidden");
    globalSearchView.classList.add("hidden");
    currentView = "courses";
    selectedProgram = programTitle;
    selectedProgramSlug = programSlug;

    // Update breadcrumbs
    updateBreadcrumbs("courses", programTitle);

    renderCourses(programTitle, programSlug);
  }

  function showLoading() {
    loadingElement.classList.remove("hidden");
    programsView.classList.add("hidden");
    coursesView.classList.add("hidden");
    globalSearchView.classList.add("hidden");
    breadcrumbContainer.classList.add("hidden");
  }

  function hideLoading() {
    loadingElement.classList.add("hidden");
    // Make sure the loading element is actually hidden
    loadingElement.style.display = "none";
  }

  function showError() {
    errorElement.classList.remove("hidden");
    breadcrumbContainer.classList.add("hidden");
  }

  function hideError() {
    errorElement.classList.add("hidden");
  }
});
