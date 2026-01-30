const fs = require("fs");
const csv = require("csv-parser");

let data = [];

// Loads Housing.csv into memory

const loadCSV = async () => {
  return new Promise((resolve, reject) => {
    try {
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
        })
        .on("error", (err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Returns loaded CSV data

const getData = () => data;

module.exports = { loadCSV, getData };
