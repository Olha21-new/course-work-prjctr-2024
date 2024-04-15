"use strict";

// Tabs change
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
