const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const dotenv = require('dotenv');
const cors = require("cors");
const multer = require('multer');
const fs = require('fs');

//Admin Router
const adminRoute = require("./src/admin/route/routers"); 
const frontRoute = require("./src/front/route/routes")
const { Country, State } = require('country-state-city');
// const india = Country('IN', { states: true });
//console.log(india)
dotenv.config()
const PORT = process.env.PORT;
const { Parser } = require('json2csv');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


app.use("/api/admin", adminRoute);
app.use("/api", frontRoute);



app.use(cors({
    origin: '*', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
// Sample data
const data = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Sam Brown', age: 35 },
    { id: 4, name: 'Sams Brown', age: 35 },

];
app.get('/export-csv', (req, res) => {
    try {
        // Define fields and create parser
        const fields = ['id', 'name', 'age'];
        const parser = new Parser({ fields });

        // Convert JSON to CSV
        const csv = parser.parse(data);

        // Optional: Save CSV file to the server
        // Ensure the directory exists
        const dirPath = path.join(__dirname, '/uploads/export');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create directories recursively
        }

        // Save the CSV file to the directory
        const filePath = path.join(dirPath, 'output.csv');
        fs.writeFileSync(filePath, csv); fs.writeFileSync(filePath, csv);

        // Send CSV as a download
        res.header('Content-Type', 'text/csv');
        res.attachment('data.csv');
        return res.send(csv);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error exporting CSV');
    }
});
app.listen(PORT, () => {
    console.log(`Server is Running on PORT No.  ${PORT}.`)
});