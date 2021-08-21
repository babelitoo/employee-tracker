const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

// MAIN MENU PROMPT
const menu = [
    {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS",
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES",
            },
            {
                name: "View All Employees",
                value: "VIEW_EMPLOYEES",
            },
            {
                name: "Add a Department",
                value: "ADD_DEPARTMENT",
            },
            {
                name: "Add a Role",
                value: "ADD_ROLE",
            },
            {
                name: "Add an Employee",
                value: "ADD_EMPLOYEE",
            },
            {
                name: "Update an Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE",
            },
            {
                name: "Quit",
                value: "QUIT",
            },
        ],
    },
];

// CALL INIT FXN TO START PROGRAM
init();

// INIT PROGRAM, RUN mainMenu()
function init() {
    mainMenu();
}

// GENERATE MAIN MENU, APPLY CHOICE TO SWITCH CASE
function mainMenu() {
    prompt(menu).then((res) => {
        let choice = res.choice;
        switch (choice) {
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            default:
                quit();
        }
    });
}

// VIEW ALL DEPARTMENTS
function viewDepartments() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => mainMenu());
}

// VIEW ALL ROLES
function viewRoles() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => mainMenu());
}

// VIEW ALL EMPLOYEES
function viewEmployees() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => mainMenu());
}

// ADD A DEPARTMENT
function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?",
        },
    ]).then((res) => {
        let name = res;
        db.createDepartment(name)
            .then(() => console.log(`Added ${name.name} to the database`))
            .then(() => mainMenu());
    });
}

// ADD A ROLE
function addRole() {
    db.findAllDepartments().then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id,
        }));

        prompt([
            {
                name: "title",
                message: "What is the name of the role?",
            },
            {
                name: "salary",
                message: "What is the salary of the role?",
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departmentChoices,
            },
        ]).then((role) => {
            db.createRole(role)
                .then(() => console.log(`Added ${role.title} to the database`))
                .then(() => mainMenu());
        });
    });
}

// ADD AN EMPLOYEE
function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            name: "last_name",
            message: "What is the employee's last name?",
        },
    ]).then((res) => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.findAllRoles().then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id,
            }));

            prompt({
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices,
            }).then((res) => {
                let roleId = res.roleId;

                db.findAllEmployees().then(([rows]) => {
                    let employees = rows;
                    const managerChoices = employees.map(
                        ({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        })
                    );

                    managerChoices.unshift({ name: "None", value: null });

                    prompt({
                        type: "list",
                        name: "managerId",
                        message: "Who is the employee's manager?",
                        choices: managerChoices,
                    })
                        .then((res) => {
                            let employee = {
                                manager_id: res.managerId,
                                role_id: roleId,
                                first_name: firstName,
                                last_name: lastName,
                            };

                            db.createEmployee(employee);
                        })
                        .then(() =>
                            console.log(
                                `Added ${firstName} ${lastName} to the database`
                            )
                        )
                        .then(() => mainMenu());
                });
            });
        });
    });
}

// UPDATE AN EMPLOYEE ROLE
function updateEmployeeRole() {
    db.findAllEmployees().then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(
            ({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
            })
        );

        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices,
            },
        ]).then((res) => {
            let employeeId = res.employeeId;
            db.findAllRoles().then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));

                prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message:
                            "Which role do you want to assign the selected employee?",
                        choices: roleChoices,
                    },
                ])
                    .then((res) =>
                        db.updateEmployeeRole(employeeId, res.roleId)
                    )
                    .then(() => console.log("Updated employee's role"))
                    .then(() => mainMenu());
            });
        });
    });
}

// EXIT APPLICATION
function quit() {
    console.log("Goodbye!");
    process.exit();
}