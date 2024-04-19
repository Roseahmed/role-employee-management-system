# Role employee management system

This backend service is to authenticate employee and create role based on user roles.

# Table of contents:
 1. Technologies used.
 2. Local Setup Requirements.
 3. RESTful API services.
 4. API documentation

1. Technologies used:
   - Typescript.
   - Node Js + express Js.
   - MongoDB.(no sql database)
   - Swagger and postman for API documentation.

2. Local setup:
   - Requirements
     . Node latest version installed in your system.
     . Typescript latest verion.
   N.B: Incase unable to install, kindly visit the official pages of each Technologies for installation..

   - Start the service:
    . npm install
    . npm run build:strart or npm start

3. RESTful API:
   -Authenticaiton API
   -CRUD API for employees.
   -CRUD API for roles.

Note: 
1. On server start admin user is created.
1. By default admin user have access to the API's but for regular users, access is based on permissions.

4. API documentation:
  -Access the swagger documentation: http://localhost:8000/api-docs
  -Postman scripts: import the scripts in postman along with all the global environment variable in scripts directory.
   