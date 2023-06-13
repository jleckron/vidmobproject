# VidMob Project

### Backend: NestJS, Mongoose and MongoDB

Find source files in backend/src/users

###### To Start:

1. cd into /vidmobproject/backend/
2. npm run start:dev

###### Or:

1. In /vidmobproject/ execute shell script with "./runbackend"

It should launch on localhost:3000 - this is important as this is the port the frontend will send requests to. Although it can be easily changed in one place at /frontend/src/utils/constants/endpoints.ts:(line2) if a conflict exists

### Frontend: React and Material UI

Find source files in frontend/src/components

###### To Start

1. cd into /vidmobproject/frontend/
2. npm start

###### Or:

1. In new terminal window, /vidmobproject/ shell script "./runfrontend"

Should launch browser on port localhost:3001

##### Features

- Add, Edit, Delete, and Search Users
- Use Material UI TablePagination to select page size / number
- Leverage browser network throttling to see some loading animations on table loading, form submission, and user delete
