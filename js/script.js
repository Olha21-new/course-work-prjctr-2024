"use strict";

const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active");
    });
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    target.classList.add("active");
    tab.classList.add("active");
  });
});

// DOM variables tab 1
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const presetButtons = document.querySelectorAll(".time-span .button");
const countButton = document.querySelector(".count__button");
const resultsList = document.querySelector(".result-history");
const daySelect = document.getElementById("selectDays");
const timeUnitSelect = document.getElementById("selectUnits");

// Function to retrieve the last 10 results from local storage
function getLastTenResults() {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  return results.slice(-10); // Retrieve the last 10 results
}

// Function to display the last 10 results in a list format
function displayResultsList() {
  const results = getLastTenResults();
  const resultList = document.getElementById("resultsTable");
  resultList.innerHTML = ""; // Clear existing list items

  results.forEach((result) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${result.startDate} - ${result.endDate}: ${result.result}`;
    resultList.appendChild(listItem);
  });
}

displayResultsList();

// Event functions tab 1
startDateInput.addEventListener("input", () => {
  const startDateValue = new Date(startDateInput.value);
  endDateInput.removeAttribute("disabled");
  console.log(startDateValue);
});

startDateInput.addEventListener("input", () => {
  const startDateValue = startDateInput.value;
  endDateInput.min = startDateValue;
});

endDateInput.addEventListener("input", () => {
  const endDateValue = new Date(endDateInput.value);
  console.log(endDateValue);
});

presetButtons.forEach((button) => {
  button.addEventListener("click", handlePresetButtonClick);
});

function handlePresetButtonClick(event) {
  const preset = event.target.getAttribute("data-preset");
  console.log("Preset:", preset);

  // Update start date
  const startDate = new Date(startDateInput.value);

  switch (preset) {
    case "week":
      endDateInput.value = addWeek(startDate);
      break;
    case "month":
      endDateInput.value = addMonth(startDate);
      break;
    default:
      break;
  }
}

// Function to add a week
function addWeek(newStartDate) {
  const endDate = new Date(newStartDate);
  endDate.setDate(endDate.getDate() + 7);
  return endDate.toISOString().split("T")[0];
}

// Function to add a month
function addMonth(newStartDate) {
  const endDate = new Date(newStartDate);
  endDate.setMonth(endDate.getMonth() + 1);
  return endDate.toISOString().split("T")[0];
}

daySelect.addEventListener("change", () => {
  console.log(daySelect.value);
});

timeUnitSelect.addEventListener("change", () => {
  console.log(timeUnitSelect.value);
});

// Calculations
function calculateTimeInterval() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  // Weekdays and Weekends
  const dayOption = daySelect.value;
  let timeDifference;
  switch (dayOption) {
    case "all":
      timeDifference = endDate - startDate;
      break;
    case "weekdays":
      timeDifference =
        countWeekdays(startDate, endDate, "weekdays") * (1000 * 60 * 60 * 24);
      break;
    case "weekends":
      timeDifference =
        countWeekends(startDate, endDate, "weekends") * (1000 * 60 * 60 * 24);
      break;
    default:
      timeDifference = endDate - startDate;
  }

  // TimeUnits Converting
  const timeUnit = timeUnitSelect.value;
  let result;
  switch (timeUnit) {
    case "milliseconds":
      result = timeDifference;
      break;
    case "seconds":
      result = timeDifference / 1000;
      break;
    case "minutes":
      result = timeDifference / (1000 * 60);
      break;
    case "hours":
      result = timeDifference / (1000 * 60 * 60);
      break;
    case "days":
      result = timeDifference / (1000 * 60 * 60 * 24);
      break;
    default:
      result = "Invalid time unit";
  }

  function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

 function countWeekends(startDate, endDate) {
    let currentDate = new Date(startDate);
    let finishDate = new Date(endDate);
    let count = 0;

    while (currentDate < finishDate) {
      if (isWeekend(currentDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  function countWeekdays(startDate, endDate) {
    let currentDate = new Date(startDate);
    let finishDate = new Date(endDate);
    let count = 0;

    while (currentDate < finishDate) {
      if (!isWeekend(currentDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  // Display positive values in resuts
  const positiveResult = Math.abs(result);

  const li = document.createElement("li");
  li.textContent = `${startDateInput.value} - ${endDateInput.value}: ${positiveResult} ${timeUnit}`;
  resultsList.append(li);

  // Store the result in local storage
  const resultObject = {
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    result: `${positiveResult} ${timeUnit}`,
  };

  storeResult(resultObject);
}

// EventListener to count
countButton.addEventListener("click", calculateTimeInterval);

// Function to store the result in local storage
function storeResult(resultObject) {
  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push(resultObject);
  localStorage.setItem("results", JSON.stringify(results));
}

// Tab 2
const API_KEY = "LZKVil0EfTJ5PAV5PXOsUaMQDSJt137T";
const API_URL = "https://calendarific.com/api/v2";

// Function to display error message
function displayError(errorMessage) {
  const errorBlock = document.createElement("div");
  errorBlock.classList.add("error-block");
  errorBlock.textContent = errorMessage;

  // Error message
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.appendChild(errorBlock);
}

async function getCountries() {
  try {
    const response = await fetch(`${API_URL}/countries?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const {
      response: { countries },
    } = await response.json();
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    displayError("Error fetching countries. Please try again later.");
  }
}

async function getHolidays(country, year) {
  try {
    const response = await fetch(
      `${API_URL}/holidays?&api_key=${API_KEY}&country=${country}&year=${year}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const {
      response: { holidays },
    } = await response.json();
    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    displayError("Error fetching holidays. Please try again later.");
  }
}

async function populateCountries() {
  const selectCountry = document.getElementById("selectCountry");
  try {
    const countries = await getCountries();

    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country["iso-3166"];
      option.text = country.country_name;
      selectCountry.appendChild(option);
    });

    populateYears();
  } catch (error) {
    console.error("Error fetching countries:", error);
    displayError("Error fetching countries. Please try again later.");
  }
}

populateCountries();

function populateYears() {
  const selectYear = document.getElementById("selectYear");
  const currentYear = new Date().getFullYear();
  for (let year = 2001; year <= 2049; year++) {
    const option = document.createElement("option");
    option.text = year;
    option.value = year;
    selectYear.add(option);
  }
  selectYear.value = currentYear;
}

populateYears();

document.getElementById("selectYear").disabled = true;

// Event listener for country dropdown change
document
  .getElementById("selectCountry")
  .addEventListener("change", function () {
    const selectYear = document.getElementById("selectYear");
    selectYear.disabled = false;
  });

// Event listener for button click
document
  .querySelector(".holidays__button")
  .addEventListener("click", async () => {
    const selectCountry = document.getElementById("selectCountry");
    const selectYear = document.getElementById("selectYear");
    const country = selectCountry.value;
    const year = selectYear.value;

    if (country && year) {
      try {
        const holidays = await getHolidays(country, year);
        displayHolidaysList(holidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        displayError("Error fetching holidays. Please try again later.");
      }
    } else {
      console.error("Please select both country and year");
      displayError("Please select both country and year.");
    }
  });

// Function to display holidays
function displayHolidaysList(holidays) {
  const resultList = document.querySelector(".result-history--holidays");

  resultList.innerHTML = "";

  if (holidays && holidays.length > 0) {
    holidays.forEach((holiday) => {
      const listItem = document.createElement("li");
      listItem.classList.add("result-history--holidays-list");

      const dateSpan = document.createElement("span");
      dateSpan.textContent = holiday.date.iso;
      listItem.appendChild(dateSpan);

      const nameSpan = document.createElement("span");
      nameSpan.textContent = holiday.name;
      listItem.appendChild(nameSpan);

      resultList.appendChild(listItem);
    });

    console.log("List items added:", resultList.innerHTML);
  } else {
    const noResultsMessage = document.createElement("li");
    noResultsMessage.textContent =
      "No holidays found for the selected country and year.";
    resultList.appendChild(noResultsMessage);

    console.error("No holidays found for the selected country and year.");
  }
}

document.getElementById("sortByNameButton").addEventListener("click", () => {
  sortHolidaysByName();
});
let sortByNameAsc = true;

// Function to sort holidays
function sortHolidaysByName() {
  const resultList = document.querySelector(".result-history--holidays");
  const holidayItems = Array.from(resultList.children);
  const holidayNames = holidayItems.map((item) => item.children[1].textContent);

  const sortedHolidayNames = sortByNameAsc
    ? holidayNames.sort()
    : holidayNames.sort().reverse();

  sortByNameAsc = !sortByNameAsc;

  resultList.innerHTML = "";

  sortedHolidayNames.forEach((holidayName) => {
    const listItem = holidayItems.find(
      (item) => item.children[1].textContent === holidayName
    );
    resultList.appendChild(listItem);
  });
}
