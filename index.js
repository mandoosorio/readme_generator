const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const showBanner = require("node-banner");

(async() => {
    await showBanner("README Generator", "", "blue");
    start();
})();

const writeFileAsync = util.promisify(fs.writeFile);

const repoTitle = [];

function start() {
    inquirer.prompt([
        {
            type: "checkbox",
            name: "existingRepo",
            message: "Is this README for an existing repository?",
            choices: [
                "yes",
                "no"
            ]
        }
    ]).then(function({ existingRepo }) {
        console.log(existingRepo);
        if (existingRepo == "yes") {
            promptAccount();
        } else if (existingRepo == "no") {
            createNewRepo();
        }
    });
};

function promptAccount() {
    inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Enter your GitHub username:"
        },
        {
            type: "input",
            name: "repoName",
            message: "Enter your repository's name:"
        }
    ]).then(function(answers){
        const queryUrl = `https://api.github.com/users/${answers.username}/repos?per_page=100`;
        const badgeUrl = `https://img.shields.io/github/issues/${answers.username}/${answers.repoName}`;

        axios.get(queryUrl).then(function(res){
            const repoNames = res.data.map(function(repo){
                if (repo.name === answers.repoName) {
                    repoTitle.push(`# ${repo.name}`);
                    repoTitle.push("");
                    repoTitle.push(`![Issues Badge](${badgeUrl})`);
                    repoTitle.push("");

                    var repoNamesStr = repoTitle.join("\n");

                    fs.writeFile("README.md", repoNamesStr, function(err){
                        if (err) {
                            throw err;
                        }
                    })

                    if (repo.description === null) {
                        createUserStory();
                    } else {
                        repoTitle.push(`## Description\n${repo.description}`);
                        repoTitle.push("");

                        var repoNamesStr = repoTitle.join("\n");

                        fs.writeFile("README.md", repoNamesStr, function(err){
                            if (err) {
                                throw err;
                            }
                        });

                        createTable();
                    }
                }
            });
        });
    });
}

function createNewRepo() {
    inquirer.prompt([
        {
            type: "input",
            name: "newRepoName",
            message: "Enter the name of your new project:"
        },
        {
            type: "input",
            name: "role",
            message: "Input your role/job position"
        },
        {
            type: "input",
            name: "capability",
            message: "What do you want your program to do? 'I want a program that will:"
        },
        {
            type: "input",
            name: "benefit",
            message: "A 'so' statement-- 'I want my program to do THIS so that:"
        },
        {
            type: "input",
            name: "resources",
            message: "How will you achieve this? Using what tools/processes? 'In order to do THIS, I will:"
        }
    ]).then(function(answers){
        repoTitle.push(`# ${answers.newRepoName}`);
        repoTitle.push("");

        const description = `As a ${answers.role}, I have created an application that will ${answers.capability}. I have created this application so that ${answers.benefit}. In order to achieve this, I will ${answers.resources}.`;

        repoTitle.push(`## Description\n${description}`);
        repoTitle.push("");

        var repoNamesStr = repoTitle.join("\n");

        fs.writeFile("README.md", repoNamesStr, function(err){
            if (err) {
                throw err;
            }
        });
        createTable();
    });
}

function createUserStory() {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "Input your role/job position"
        },
        {
            type: "input",
            name: "capability",
            message: "What do you want your program to do? 'I want a program that will:"
        },
        {
            type: "input",
            name: "benefit",
            message: "A 'so' statement-- 'I want my program to do THIS so that:"
        },
        {
            type: "input",
            name: "resources",
            message: "How will you achieve this? Using what tools/processes? 'In order to do THIS, I will:"
        }
    ]).then(function(answer) {
        const description = `As a ${answer.role}, I have created an application that will ${answer.capability}. I have created this application so that ${answer.benefit}. In order to achieve this, I will ${answer.resources}.`;

        repoTitle.push(`## Description\n${description}`);
        repoTitle.push("");

        var repoNamesStr = repoTitle.join("\n");

        fs.writeFile("README.md", repoNamesStr, function(err){
            if (err) {
                throw err;
            }
        });
        createTable();
    });
}

function createTable() {
    inquirer.prompt([
        {
            type: "checkbox",
            name: "tableContents",
            message: "Would you like to include a table of contents?(Recommended for longer README files.)",
            choices: [
                "yes",
                "no"
            ]
        }
    ]).then(function({ tableContents }){
        if (tableContents == "yes") {
            inquirer.prompt([
                {
                    type: "checkbox",
                    name: "contents",
                    message: "Which sections would you like to add to your table of contents:",
                    choices: [
                        "Title",
                        "Description",
                        "Installation",
                        "Usage",
                        "License",
                        "Contributing",
                        "Tests",
                    ]
                },
                {
                    type: "input",
                    name: "installation",
                    message: "What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running."
                },
                {
                    type: "input",
                    name: "usage",
                    message: "Provide instructions for use:"
                },
                {
                    type: "input",
                    name: "license",
                    message: "Include your licenses:"
                },
                {
                    type: "input",
                    name: "contributors",
                    message: "List any contributing people:"
                },
                {
                    type: "input",
                    name: "tests",
                    message: "Go the extra mile and write tests for your application. Then provide examples on how to run them."
                },
                {
                    type: "input",
                    name: "email",
                    message: "Your user GitHub email will be displayed for any questions:"
                },
                {
                    type: "input",
                    name: "username",
                    message: "Enter your GitHub username:"
                }
            ]).then(function(answers){
                repoTitle.push(`## Table of Contents`);

                for (i = 0; i < answers.contents.length; i++) {
                    repoTitle.push(`* [${answers.contents[i]}](#${answers.contents[i]})`);
                }
                
                repoTitle.push("");

                var repoNamesStr = repoTitle.join("\n");
    
                fs.writeFile("README.md", repoNamesStr, function(err){
                    if (err) {
                        throw err;
                    }
                });
                if (answers.installation !== "") {
                    repoTitle.push(`## Installation\n${answers.installation}`);
                    repoTitle.push("");
                }
                if (answers.usage !== "") {
                    repoTitle.push(`## Usage\n${answers.usage}`);
                    repoTitle.push("");
                }
                if (answers.license !== "") {
                    repoTitle.push(`## License\n${answers.license}`);
                    repoTitle.push("");
                }
                if (answers.contributors !== "") {
                    repoTitle.push(`## Contributors\n${answers.contributors}`);
                    repoTitle.push("");
                }
                if (answers.tests !== "") {
                    repoTitle.push(`## Tests\n${answers.tests}`);
                    repoTitle.push("");
                }
                if (answers.email !== null) {
                    repoTitle.push(`## Questions\n${answers.email}`);
                    repoTitle.push("");
                }
                if (answers.username !== null) {
                    const queryUrl = `https://api.github.com/users/${answers.username}`;

                    axios.get(queryUrl).then(function(res){
                        const profilePic = res.avatar_url;

                        repoTitle.push(profilePic);
                        repoTitle.push("");
                    });
                }
        
                var repoNamesStr = repoTitle.join("\n");
                    fs.writeFile("README.md", repoNamesStr, function(err){
                        if (err) {
                            throw err;
                        }
                    });

                    const queryUrl = `https://api.github.com/users/${answers.username}`;
                    axios.get(queryUrl).then(function(res){
                        const profilePic = res.data.avatar_url;

                        repoTitle.push(`![Profile Image](${profilePic}/to/img.png)`);
                        repoTitle.push("");

                        var repoNamesStr = repoTitle.join("\n");
                        fs.writeFile("README.md", repoNamesStr, function(err){
                            if (err) {
                                throw err;
                            }
                        });
                    });
            });
        } else if (tableContents == "no") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "installation",
                    message: "What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running."
                },
                {
                    type: "input",
                    name: "usage",
                    message: "Provide instructions for use:"
                },
                {
                    type: "input",
                    name: "license",
                    message: "Include your licenses:"
                },
                {
                    type: "input",
                    name: "contributors",
                    message: "List any contributing people:"
                },
                {
                    type: "input",
                    name: "tests",
                    message: "Go the extra mile and write tests for your application. Then provide examples on how to run them."
                },
                {
                    type: "input",
                    name: "email",
                    message: "Your user GitHub email will be displayed for any questions:"
                },
                {
                    type: "input",
                    name: "username",
                    message: "Enter your GitHub username:"
                }
            ]).then(function(answers){
                if (answers.installation !== null) {
                    repoTitle.push(`## Installation\n${answers.installation}`);
                    repoTitle.push("");
                }
                if (answers.usage !== null) {
                    repoTitle.push(`## Usage\n${answers.usage}`);
                    repoTitle.push("");
                }
                if (answers.license !== null) {
                    repoTitle.push(`## License\n${answers.license}`);
                    repoTitle.push("");
                }
                if (answers.contributors !== null) {
                    repoTitle.push(`## Contributors\n${answers.contributors}`);
                    repoTitle.push("");
                }
                if (answers.tests !== null) {
                    repoTitle.push(`## Tests\n${answers.tests}`);
                    repoTitle.push("");
                }
                if (answers.email !== null) {
                    repoTitle.push(`## Questions\n${answers.email}`);
                    repoTitle.push("");
                }
                if (answers.username !== null) {
                    const queryUrl = `https://api.github.com/users/${answers.username}`;

                    axios.get(queryUrl).then(function(res){
                        const profilePic = res.data.avatar_url;

                        repoTitle.push(`![Profile Image](${profilePic}/to/img.png)`);
                        repoTitle.push("");
                    });
                }
        
                var repoNamesStr = repoTitle.join("\n");
                    fs.writeFile("README.md", repoNamesStr, function(err){
                        if (err) {
                            throw err;
                        }
                    });
            });
        }
    });
}