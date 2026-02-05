const fs = require("fs");
const csv = require("csv-parser");

let data = [];

const normalize = (v) => (v ? v.trim().toLowerCase() : "");

// load csv
const loadCSV = async () => {
  data = []; // reset on restart
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream("data/Housing.csv")
        .pipe(csv())
        .on("data", (row) => {
          const city = row.City;
          const area = row["Area Locality"];
          const bhk = Number(row.BHK);
          const size = Number(row.Size);
          const bathroom = Number(row.Bathroom);
          const rent = Number(row.Rent);

          // Remove row  if ANY field is missing or invalid
          if (
            !city ||
            !area ||
            !bhk ||
            !size ||
            !bathroom ||
            !rent ||
            Number.isNaN(bhk) ||
            Number.isNaN(size) ||
            Number.isNaN(bathroom) ||
            Number.isNaN(rent)
          ) {
            return; // skip row
          }

          // Only clean, valid rows enter the system
          data.push({
            city: normalize(city),
            area: normalize(area),
            bhk,
            size,
            bathroom,
            rent,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`CSV Loaded: ${data.length} valid records`);
  } catch (error) {
    console.error("CSV Load Failed:", error.message);
    throw error;
  }
};

// get loaded data
const getData = () => {
  if (!data.length) {
    throw new Error("CSV data not loaded yet");
  }
  return data;
};

// fixed: return the loaded data
const getRows = () => data;

module.exports = { loadCSV, getRows, getData };
