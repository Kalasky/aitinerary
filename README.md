<a name="readme-top"></a>

# Triplio ✈️

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#install-guide">Installation Guide</a>
      <ul>
        <li><a href="#make-ubuntu">Make installation (Ubuntu 20.04)</a></li>
        <li><a href="#docker-ubuntu">Docker Setup Guide (Ubuntu 20.04)</a></li>
        <li><a href="#mac-install">Mac Installation</a></li>
        <li><a href="#windows-install">Windows Installation</a></li>
      </ul>
    </li>
    <li><a href="#project-setup">Project Setup</a></li>
    <li><a href="#run-application">Run the application</a></li>
    <li><a href="#schema-architecture">Schema Architecture</a></li>
    <li><a href="#testing-stack">Testing Information</a></li>
  </ol>
</details>
<br />

<div id="install-guide" />

## Installation Guide 🔧

Ensure you have the following installed on your system:

- Docker Engine
- Docker Compose
- GNU Make

<div id="make-ubuntu" />

## GNU Make Installation (Ubuntu 20.04)

```bash
sudo apt update
sudo apt install make
```

<div id="docker-ubuntu" />

<details>
<summary>Docker Engine Installation (Ubuntu 20.04)</summary>
<br>

#### For other Linux distributions, please refer to the official Docker documentation [here](https://docs.docker.com/engine/install/).

1. Before you can install Docker Engine, you must first make sure that any conflicting packages are uninstalled.

- Run the following command to uninstall all conflicting packages:

  ```bash
  for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
  ```

## Install Docker Engine using the apt repository

1. Update the apt package index and install packages to allow apt to use a repository over HTTPS:

   ```bash
   sudo apt-get update
   sudo apt-get install ca-certificates curl gnupg
   ```

2. Add Docker’s official GPG key:

   ```bash
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   ```

3. Use the following command to set up the repository:

   ```bash
   echo \
   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
   "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

## Install Docker Engine

1.  Update the apt package index:

    ```bash
    sudo apt-get update
    ```

2.  Install the latest version of Docker Engine and containerd:

    ```bash
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

3.  Verify that Docker Engine is installed correctly by running the hello-world image:

        ```bash
        sudo docker run hello-world
        ```

    </details>

<div id="mac-install" />

## MacOS

- Docker Engine and Docker Compose: [Download Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/)
- Make: pre-installed on macOS

<div id="windows-install" />

## Windows

- Docker Engine and Docker Compose: [Download Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)
- Make: Download Make for Windows or use WSL (Windows Subsystem for Linux) for a Linux-like environment on Windows

<div id="project-setup" />

## Project Setup ⚙️

1. Clone the repository:

   ```bash
   git clone git@github.com:triplio/triplio_app.git
   cd triplio
   ```

2. Copy the `env.sample` file to `.env` in the root directory:

   ```bash
   cp env.sample .env
   ```

3. Update the `.env` file with your own values.
<p align="right">(<a href="#readme-top">back to top</a>)</p>
<div id="run-application" />

## Run the application 🚀

1.  Build and run the Docker containers for the first time or after you pulled changes from the repository:

    ```bash
    make build
    make start
    ```

2.  If you made changes to the Dockerfiles, .env, or package.json files and need to rebuild the containers:

    ```bash
    make rebuild
    ```

3.  To stop the running containers:

    ```
    make down
    ```

4.  To view the logs of the running containers:

    ```
    make logs
    ```

5.  To start the container without rebuilding:

        ```
        make start
        ```

    <p align="right">(<a href="#readme-top">back to top</a>)</p>

<div id="schema-architecture" />
<details>
<summary>Schema Architecture</summary>

## Schema Architecture 📐

Each schema has a corresponding validation schema that is used to validate the data before it is saved to the database.

#### Trip.js Schema

- `destination`: A required string field that represents the destination of the trip.
- `duration`: A required string field that specifies the duration of the trip.
- `numberOfTravelers`: A required string field indicating the number of travelers participating in the trip.
  `budget`: A required string field representing the budget for the trip.
- `ambience`: An array of strings that stores ambience information related to the trip.
- `theme`: A string field that represents the theme of the trip.
- `itinerary`: An array of objects that stores the itinerary information related to the trip.
- `user`: A reference to the User schema.

```javascript
const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  numberOfTravelers: { type: String, required: true },
  budget: { type: String, required: true },
  ambience: [{ type: String }],
  theme: { type: String },
  itinerary: [
    {
      day: { type: Number },
      activities: { type: String },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Validation schema
const TripValidationSchema = object().shape({
  destination: string().required("Destination is required"),
  duration: string().required("Duration is required"),
  numberOfTravelers: string().required("Number of travelers is required"),
  budget: string().required("Budget is required"),
  ambience: array().of(string()),
  theme: string(),
  itinerary: array().of(
    object({
      day: number(),
      activities: string(),
    })
  ),
  user: string(),
});
```

#### Feedback.js Schema

- `otherProposals`: A number field that holds the count of "other proposals" related to the feedback.
- `budgetNotRespected`: A number field that counts instances where the budget was not respected.
- `themeNotRespected`: A number field that counts instances where the theme was not respected.
- `customFeedback`: A string field that stores custom feedback provided by the user.
- `email`: A string field that represents the email associated with the feedback. This field is optional and can be left blank.
- `user`: A reference to the User schema if the provided email already existed within the DB, otherwise create a new user with the provided email.

```javascript
const FeedbackSchema = new mongoose.Schema({
  otherProposals: { type: Number, default: 0 },
  budgetNotRespected: { type: Number, default: 0 },
  themeNotRespected: { type: Number, default: 0 },
  customFeedback: { type: String, default: "" },
  email: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Validation schema
const FeedbackValidationSchema = object({
  otherProposals: number(),
  budgetNotRespected: number(),
  themeNotRespected: number(),
  customFeedback: string().min(20),
  email: string().email("Invalid email"),
  user: string(),
});
```

#### User.js Schema

- `email`: A required string field that represents the email of the user.
- `whiteListed`: A boolean field that indicates whether the user is white listed or not.
- `savedTrips`: An array of references to the Trip schema that stores the trips saved by the user.

```javascript
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  whiteListed: { type: Boolean, default: false },
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
});

// Validation schema
const UserValidationSchema = object({
  email: string().email().required("Email is required"),
  whiteListed: boolean(),
  savedTrips: array().of(string()),
});
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
</details>

<div id="testing-stack" />

## Testing Stack (Subject to change - UNDER REVIEW) 🧪

There are currently pre-made test `files` for both the frontend and backend.
Technologies that may be used for testing include:

- `Jest` (for writing unit tests, including test runners, assertions, mocking, and code coverage analysis)
- `CircleCI` (for continuous integration and delivery. It can integrate with GitHub to automatically run tests whenever changes are pushed to the repository. CircleCI can be configured to run Jest and Cypress tests automatically)
- `Cypress` (for end-to-end testing web applications. It can write tests that simulate real user interactions in a browser environment)
- `React Testing Library` (provides utilities for rendering React components, querying the rendered elements, and simulating user events. It promotes testing your components based on their behavior and the output they render, rather than focusing on implementation details)
<p align="right">(<a href="#readme-top">back to top</a>)</p>
