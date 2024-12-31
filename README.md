# Angular Project README

## Requirements

To run this project, you need to have the following installed on your system:

- **Node.js** (includes npm)
    - Download the latest stable version of Node.js from the official website: [https://nodejs.org/](https://nodejs.org/).
    - Follow the installation instructions for your operating system.

- **npm** (Node Package Manager)
    - npm is included with Node.js. To verify if npm is installed, run:
    ```bash
    npm -v
    ```

    If not installed, refer to the Node.js installation guide.

- **Angular CLI**
    - Install Angular CLI globally on your system using npm:
    ```bash
    npm install -g @angular/cli
    ```

    Verify the installation by running:
    ```bash
    ng version
    ```

## Project Setup

1. Clone or download this repository to your local machine.

2. Navigate to the project directory in your terminal:
    ```bash
    cd /path/to/your/project
    ```

3. Install project dependencies using npm:
    ```bash
    npm install
    ```

## Running the Project

To start the Angular development server:

- Use the following command to serve the application in private mode:
    ```bash
    ng serve
    ```

If you would like to change the parameters:

- `--host 0.0.0.0`: Makes the server listen on all network interfaces.
- `--port 4200`: Specifies the port for the application (default is 4200).

Open the application in your browser by navigating to: [http://localhost:4200]


## Notes

- For production deployment, build the project using:
    ```bash
    ng build --prod
    ```
    This creates a production-ready version of the application in the `dist` folder.

- Ensure you have the correct versions of Node.js and npm that match the project's requirements (check `package.json` for compatibility).
