const connection = require("./connection");

class DB {
    // Keeping a reference to the connection on the class in case we need it later
    constructor(connection) {
        this.connection = connection;
    }

    // USED BY viewDepartments(), addEmployee()
    findAllDepartments() {
        return this.connection
            .promise()
            .query("SELECT department.id, department.name FROM department;");
    }

    // USED BY viewRoles(), addEmployee(), updateEmployeeRole()
    findAllRoles() {
        return this.connection
            .promise()
            .query(
                "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
            );
    }

    // USED BY viewEmployees(), addEmployee(), updateEmployeeRole()
    findAllEmployees() {
        return this.connection
            .promise()
            .query(
                "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
            );
    }

    // USED BY addDepartment()
    createDepartment(department) {
        return this.connection
            .promise()
            .query("INSERT INTO department SET ?", department);
    }

    // USED BY addRole()
    createRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    // USED BY addEmployee()
    createEmployee(employee) {
        return this.connection
            .promise()
            .query("INSERT INTO employee SET ?", employee);
    }

    // USED BY updateEmployeeRole()
    updateEmployeeRole(employeeId, roleId) {
        return this.connection
            .promise()
            .query("UPDATE employee SET role_id = ? WHERE id = ?", [
                roleId,
                employeeId,
            ]);
    }
}

module.exports = new DB(connection);