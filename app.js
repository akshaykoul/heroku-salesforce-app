const express = require("express");
const jsforce = require("jsforce");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let contacts = [];

// Salesforce Connection
const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL,
});

// Login to Salesforce
conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, (err, userInfo) => {
    if (err) {
        console.error("Salesforce login error:", err);
        return;
    }
    console.log("Salesforce login successful:", userInfo);

    // Query Contacts
//  conn.query("SELECT Name, CreatedDate, IsActive__c FROM Contact", (err, result) => {
    conn.query("SELECT Name, Santa_Status__c,LastModifiedDate FROM Contact ORDER BY LastModifiedDate DESC", (err, result) => {
        if (err) {
            console.error("Error fetching contacts:", err);
            return;
        }
        contacts = result.records.map((record) => ({
            name: record.Name, 
            status: record.Santa_Status__c,
            addedDate: record.LastModifiedDate
//          status: record.IsActive__c ? "Yes" : "No",
        }));
    });
});

app.get("/", (req, res) => {
    res.render("index", { contacts });
});

app.listen(process.env.PORT || 3000, () =>
    console.log("Server running on port", process.env.PORT || 3000)
);
