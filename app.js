const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEdEfRWnrn8_e-PEao4aS_bvs2xtNGTG6wgdOx2Tnz2O03Vjvm_v8-WJaUDthX6ef0xs47hhReMKHi/pub?output=csv";

async function fetchGoogleSheetData(url) {
  let response = await fetch(url);
  return await response.text();
}

function parseCSV(stringData) {
  let parsedData = Papa.parse(stringData, { header: true });
  if (parsedData.errors.length === 0) {
    return parsedData.data;
  }
  return [];
}

function createHeaderRow(data) {
  let rowEl = document.createElement("tr");

  for (let key in data[0]) {
    let headerEl = document.createElement("th");
    headerEl.innerText = key === "Timestamp" ? "Date added" : key;
    rowEl.appendChild(headerEl);
  }

  return rowEl;
}

function createRow(row) {
  let rowEl = document.createElement("tr");

  for (let key in row) {
    let tdEl = document.createElement("td");
    tdEl.innerText = key === "Timestamp" ? row[key].split(" ")[0] : row[key];
    rowEl.appendChild(tdEl);
  }

  return rowEl;
}

function displayData(data, parentElement) {
  let tableEl = document.createElement("table");
  parentElement.appendChild(tableEl);

  tableEl.appendChild(createHeaderRow(data));

  data.forEach((row) => {
    tableEl.appendChild(createRow(row));
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  let data = await fetchGoogleSheetData(SHEET_URL);
  let parsedData = parseCSV(data);

  let dataDiv = document.getElementById("sheet-data");
  if (dataDiv) {
    displayData(parsedData, dataDiv);
  }
});