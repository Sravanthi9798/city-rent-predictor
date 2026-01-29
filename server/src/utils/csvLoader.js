const fs = require("fs");
const csv = require("csv-parser");

let data = [];

function loadCSV() {
  return new Promise((resolve) => {
    fs.createReadStream("data/Housing.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push({
          city: row.City?.trim().toLowerCase(),
          area: row["Area Locality"]
            ? row["Area Locality"].trim().toLowerCase()
            : "unknown area",
          bhk: Number(row.BHK),
          size: Number(row.Size),
          rent: Number(row.Rent),
        });
      })
      .on("end", () => {
        console.log("CSV Loaded:", data.length);
        resolve();
      });
  });
}

function getData() {
  return data;
}

module.exports = { loadCSV, getData };
