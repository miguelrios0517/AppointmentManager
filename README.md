# Appointment Manager

Appointment Manager is available online: https://appointment-management-s-df6d3.web.app/

*Email and password are for authentication only. You may use a fake email if you'd prefer (nothing will be emailed to you) *

Use Appointment Manager to keep track of your interpreting appointments! This program was originally designed and developed for a medical interpreter who needed a more efficient way to manage their patients, appointments, providers, documentation and more. 

The following features are inlcluded...
1) appointment manager 
2) patient directory 
3) calendar
4) dashboard
5) create & edit user profile

This application was created with React JavaScrict. The user data is stored in a Google Firebase database. Firebase also provides the site hosting for the app. 

What I learned from designing/making this app...
1) Forms (error handling and validation, dynamic forms that autopopulate fields based on what the user inputs)
2) Designing the database architecture (i.e., collections, documents, keys and values, foreign keys, queries)
3) CRUD operations for backend w/firebase 
4) React (useState, useEffect, useRef, useContext, and more)
5) Authentication setup w/firebase (create profile/signup, login, update)
6) Navigation bar
7) User Centered Design/UX*

*having a background in UX, I believe, truly helped developed this app. When testing out the features, I tried to place myself in the shoes of the user and think of every possible use case there is. Depending on the user, they may desired a certain experience. This thought really stuck with me while I was developing the forms for new patient and new appointment. In order to submit an appointment, the user must select from a drop-down list of patients that were already created. However, if the patient is new, the user must create a new patient. I thought this seemed like a very tedious process for the user (needing to go on two seperate pages and two seperate forms just to submit one appointment for a new patient). I aimed to design the experience in a way that optimizes user flexibility and ease, so in the appointment form, i added another item in the drop down options for the patient field, "create a new patient". 

These forms are located in different pages which .  Just as an example, there are seperate forms for creating appointments and patients, once a patient is created it appears as a drop down option in the appointment form. However, if the user did not see their patient they would have to create a new patient. would be time consuming 


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# AppointmentManager
