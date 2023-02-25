const fs = require('fs');
const XLSX = require('xlsx');

const directoryPath = './languages/locales';
const dataPath = './data/common.xlsx';

fs.readdir(directoryPath,  function(err, files) {
    const workbook = XLSX.readFile(dataPath);
    const sheet_name_list = workbook.SheetNames;
    const dataSheets = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    let languages = {};

    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach((file) => {
        try {
            const data = fs.readFileSync(`${directoryPath}/${file}/common.json`, 'utf8');
            languages[file] = JSON.parse(data);
        } catch (err) {
            console.log(err);
        }
    });


    dataSheets.forEach((sheet) => {
        Object.entries(languages).map(([key, value]) => {
            languages[key] = {...languages[key], [sheet.en]: sheet[key]}
        })
    });

    Object.entries(languages).forEach(([key, value]) => {
        try {
            fs.writeFileSync(`${directoryPath}/${key}/common.json`, JSON.stringify(value));
            console.log(`Exported ${key} successfully!`);
        } catch (err) {
            console.error(err);
        }
    })

});
