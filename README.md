Admin:
  - All CRUD tasks
  - All CRUD users
    
User:
  - GetAll (can only perform their own tasks), getById and update tasks
  - GetAll ad getyd users

+ In data.sql, an admin and a user are created automatically.
+ The maximum tasks that can be assigned to each user are kept with the max_task_per_user (currently 3) variable.
+ Passwords are not yet encrypted with Bcrypt, they are kept in plaintext for testing
