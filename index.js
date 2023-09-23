
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl =
    "https://gist.githubusercontent.com/harsh3195/b441881e0020817b84e34d27ba448418/raw/c4fde6f42310987a54ae1bc3d9b8bfbafac15617/demo-json-data.json";
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const studentTable = document.getElementById("student-table");
  const resultsContainer = document.getElementById("results");

  let studentData = []; // To store the fetched student data
  let femaleStudents = [];
  let maleStudents = [];
  // Fetch data from the URL and populate the table
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      studentData = data;
      populateTable(studentData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Function to populate the table with student data
  function populateTable(data) {
    const tableBody = studentTable.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear the existing table rows

    data.forEach((student) => {
      const fullName = `${student.first_name} ${student.last_name}`;
      const status = student.passing ? "Passing" : "Failed";

      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${student.id}</td>
            <td><img src="${student.img_src}" alt="${fullName} Image" id="im"  style="border-radius: 1000px;
            border: 1px solid #000;width:40px">  ${fullName}</td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${status}</td>
            <td>${student.email}</td>
            `;
           

      tableBody.appendChild(row);
    });
  }

 
  // Function to perform search and update the table
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredData = studentData.filter((student) => {
      const fullName = `${student.first_name} ${student.last_name}`;
      return (
        fullName.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
      );
    });

    populateTable(filteredData);
  }

  // Handle search button click event
  searchButton.addEventListener("click", performSearch);

  // Optionally, handle the Enter key press in the search input field
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  function performSort(sortCriteria) {
    let sortedData = [...studentData]; // Create a copy of the original data

    switch (sortCriteria) {
      case "AtoZ":
        sortedData.sort((a, b) => {
          const fullNameA = `${a.first_name} ${a.last_name}`;
          const fullNameB = `${b.first_name} ${b.last_name}`;
          return fullNameA.localeCompare(fullNameB);
        });
        break;
      case "ZtoA":
        sortedData.sort((a, b) => {
          const fullNameA = `${a.first_name} ${a.last_name}`;
          const fullNameB = `${b.first_name} ${b.last_name}`;
          return fullNameB.localeCompare(fullNameA);
        });
        break;
      case "byMarks":
        sortedData.sort((a, b) => a.marks - b.marks);
        break;
      case "byPassing":
        sortedData = sortedData.filter((student) => student.passing);
        break;
      case "byClass":
        sortedData.sort((a, b) => a.class - b.class);
        break;
      case "byGender":
        femaleStudents = studentData.filter(
          (student) => student.gender === "female"
        );
        maleStudents = studentData.filter(
          (student) => student.gender === "male"
        );
        break;
      default:
        break;
    }

    populateTable(sortedData);
  }

  // Handle sorting buttons click events
  const sortingButtons = document.querySelectorAll(".sort-button");
  sortingButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const sortCriteria = this.getAttribute("data-sort");
      performSort(sortCriteria);
    });
  });
  // Handle "Sort by Gender" button click event
  const sortByGenderButton = document.getElementById("sort-by-gender");
  sortByGenderButton.addEventListener("click", function () {
    
    displayGenderTables();
  });

  // Function to display female and male student tables
  function displayGenderTables() {
    const maleStudents = studentData.filter(student => student.gender.toLowerCase() === 'male');
    const femaleStudents = studentData.filter(student => student.gender.toLowerCase() === 'female');
    
    // Display both tables (male and female) one below the other
    const combinedStudents = [...maleStudents, ...femaleStudents];
    displayStudents(combinedStudents);
  }
});
