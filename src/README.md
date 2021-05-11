# rabin---task-app

Task app is a to do list app in which a person can create their account and create tasks.

## How it works

The server is created using NodeJS and ExpressJS. It authenticates with the MongoDB where all the data is stored. JSON Web Token and OAuth2 are used for diffrent authorization processes.<br/>
Currently, this is only the backend of the app with frontend under development.<br/>
Meanwhile, you can test the backend using postman or alternatives. Instructions are also listed for using backend.

### API Requests for using backend using postman

**Import [this](https://drive.google.com/file/d/13z3xc_F-9BDM3JpP2hynPyhfS6XJnQiH/view?usp=sharing) file into postman**

**Refer to this image**<br/>
![postman](/src/images/postman.png)

1. For Creating new Account<br/>

    - URL = **leave it as it is**
    - Body ->
        ```
        {
            "name":"your name",
            "password":"enter your password here",
            "email":"enter your email here"
        }
        ```
        Name,Passowrd and Email are required to make an account. Age is optional.

    * Tests ->
        ```
        if(pm.response.code===201){
            pm.environment.set('authToken',pm.response.json().token)
        }
        ```
    * **Hit Send**
      Now your account has been created using credentials provided under body section.<br/>
      You will recieve email.

        _**You dont need to login after you have created an account. You are automatically logged in after creating an account.**_

2. For logging into your account<br/>

    - URL = **leave it as it is**
    - Body ->
        ```
        {
            "password":"enter your password here",
            "email":"enter your email here"
        }
        ```

    * Tests ->
        ```
        if(pm.response.code===201){
            pm.environment.set('authToken',pm.response.json().token)
        }
        ```
    * **Hit Send**

3. Your account details<br/>

    - URL = **leave it as it is**

    * **Hit Send**

4. Logout<br/>

    - URL = **leave it as it is**

    * **Hit Send**

5. Logout from all devicec<br/>

    - URL = **leave it as it is**

    * **Hit Send**

6. update account details<br/>

    - URL = **leave it as it is**

    * Body->
        ```
        {
            "name":"if you want to change it, otherwise remove it",
            "email":"if you want to change it, otherwise remove it",
            "password":"if you want to change it, otherwise remove it",
            "age":"if you want to change it, otherwise remove it",
        }
        ```
    * **Hit Send**

7. Delete your account<br/>

    - URL = **leave it as it is**

    * **Hit Send**

8. Creating a Task<br/>

    - URL = **leave it as it is**

    * Body->
        ```
        {
            "description":"enter description here",
            "completed":true/false (optional, false by default)
        }
        ```
    * **Hit Send**

9. Reading all tasks<br/>

    - a. URL = `https://rabin-task-app.herokuapp.com/tasks` _Shows all tasks_ <br/>
      b. URL = `https://rabin-task-app.herokuapp.com/tasks?sortBy=createdAt:asc/desc` _Filter the data recieved by date created_<br/>
      c. URL = `https://rabin-task-app.herokuapp.com/tasks?completed=false` _Filter the data by completed status using_<br/>
      d. URL = `https://rabin-task-app.herokuapp.com/tasks?sortBy=createdAt:asc&completed=false` _or you can mix both_

    * **Hit Send**

10. Updating Task<br/>

    - URL =`https://rabin-task-app.herokuapp.com/tasks/id of the task you want update`

    * Body->
        ```
        {
            "description":"enter description here",
            "completed":true/false (optional, false by default)
        }
        ```
    * **Hit Send**

11. Deleting task <br/>
    - URL =`https://rabin-task-app.herokuapp.com/tasks/id of the task you want update`
    * **Hit Send**
