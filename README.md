
# Rule Engine Application


Welcome to the Rule Engine Application! This application allows users to create, combine, and evaluate logical rules using a userfriendly interface. It supports complex rule creation with logical operators, efficient rule combination, and visualization of rules as Abstract Syntax Trees (ASTs).

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Demo](#demo)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
   1. [1. Clone the Repository](#1-clone-the-repository)
   2. [2. Backend Setup (Flask)](#2-backend-setup-flask)
      - [a. Navigate to the Backend Directory](#a-navigate-to-the-backend-directory)
      - [b. Create a Virtual Environment and Activate the Virtual Environment](#b-create-a-virtual-environment-and-activate-the-virtual-environment)
      - [c. Install Dependencies](#c-install-dependencies)
      - [d. Setting up `.env`](#d-setting-up-env)
      - [e. Run the Flask Application](#e-run-the-flask-application)
   3. [3. Frontend Setup (React.js)](#3-frontend-setup-reactjs)
      - [a. Navigate to the Frontend Directory](#a-navigate-to-the-frontend-directory)
      - [b. Install Dependencies](#b-install-dependencies-1)
      - [c. Start the React Application](#c-start-the-react-application)
6. [Project Structure](#project-structure)
   - [Backend (`rule-engine-backend/`)](#backend-rule-engine-backend)
   - [Frontend (`rule-engine-ui/`)](#frontend-rule-engine-ui)
7. [Functionality](#functionality)
   1. [1. Create a Rule](#1-create-a-rule)
   2. [2. View Rules](#2-view-rules)
   3. [3. Combine Rules](#3-combine-rules)
   4. [4. Evaluate a Rule](#4-evaluate-a-rule)
8. [Examples](#examples)
   - [Example Rule Creation](#example-rule-creation)
   - [Example Rule Evaluation](#example-rule-evaluation)
   - [Combining Rules](#combining-rules)
9. [Dependencies](#dependencies)
   - [Backend Dependencies](#backend-dependencies)
   - [Frontend Dependencies](#frontend-dependencies)
10. [Environment Variables](#environment-variables)
11. [Non-Functional Enhancements](#non-functional-enhancements)
    - [Security](#security)
    - [Performance](#performance)
    - [Scalability](#scalability)
    - [Maintainability](#maintainability)
12. [Test Cases](#test-cases)


## Features


* Create Rules: Define logical rules using attributes, comparison operators, and constants.
* Combine Rules: Efficiently combine multiple rules into a single optimized rule.
* Evaluate Rules: Input data and evaluate rules to get boolean results.
* Rule Visualization: Visualize rules as Abstract Syntax Trees (ASTs) for better understanding.
* Optimized Rule Engine: Minimizes redundant checks by merging common conditions.
* UserFriendly Interface: Intuitive frontend built with React.js.
* RESTful API: Backend API built with Flask for rule management, evaluation, local database for ease of use.

## Demo

### Rule List
![Rule List](./screenshots/Rule%20List.png)

### Create Rule Page
![Create Rule](./screenshots/Create%20Rule.png)

### Rule Evaluator Page
![Rule Evaluator](./screenshots/Rule%20Evaluate.png)

### Rule Conmbiner Page
![Rule Combiner](./screenshots/Rule%20Combiner.png)

## Prerequisites


* Python
* Node.js and npm

## Installation


### 1. Clone the Repository

```bash
git clone https://github.com/harshiempire/my-rules-ast.git
cd my-rules-ast
```

### 2. Backend Setup (Flask)

#### a. Navigate to the Backend Directory

```bash
cd rule-engine-backend
```

#### b. Create a Virtual Environment and Activate the Virtual Environment

```bash
python -m venv env
source env/bin/activate
```

#### c. Install Dependencies

```bash
pip install -r requirements.txt
```

#### d. Setting up .env

```env
DB_URI=sqlite:///rules.db
SQLALCHEMY_TRACK_MODIFICATIONS=False
```
- Local Database for easy of setup, Cloud Database can also be used
	* postgresql://advpaytm_owner:************@ep-red-sea-a5iikmd9.us-east-2.aws.neon.tech/advpaytm?sslmode=require

#### e. Run the Flask Application

```bash
python app.py
```

The backend server will start on http://localhost:5001.

### 3. Frontend Setup (React.js)

#### a. Navigate to the Frontend Directory

```bash
cd ../rule-engine-ui
```

#### b. Install Dependencies

```bash
npm install
```

#### c. Start the React Application

```bash
npm start
```

The frontend application will start on http://localhost:3000.

## Project Structure


```markdown
my-rules-ast/
├── rule-engine-backend/
│   ├── app.py
│   ├── evaluator.py
│   ├── extensions.py
│   ├── models.py
│   ├── node.py
│   ├── parser.py
│   ├── requirements.txt
│   ├── utils.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── rule_routes.py
│   │   └── evaluation_routes.py
│   └── instance/
│       └── rules.db
├── rule-engine-ui/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RuleCreator.js
│   │   │   ├── RuleEvaluator.js
│   │   │   ├── RuleList.js
│   │   │   ├── RuleTree.js
│   │   │   └── ... (other components)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── ... (other frontend files)
└── README.md
```
### Backend (rule-engine-backend/)

*	**app.py**: Entry point of the Flask application. Initializes the app, configures settings, registers blueprints, and starts the server.
*	**extensions.py**: Initializes and configures Flask extensions such as SQLAlchemy for database interactions.
*	**models.py**: Defines the database models using SQLAlchemy. In this project, it includes the Rule model representing the rules stored in the database.
*	**parser.py**: Contains the rule parser built with pyparsing. Transforms rule strings into Abstract Syntax Trees (ASTs).
*	**evaluator.py**: Evaluates the ASTs against input data to determine if the data satisfies the defined rules.
*	**node.py**: Defines the Node class used to represent elements of the AST, including operators and operands.
*	**utils.py**: Provides utility functions for AST manipulation, such as converting between ASTs and dictionaries, simplifying ASTs, and combining multiple ASTs.
*	**routes/**

	+	**__init__.py**: Imports and aggregates all blueprint modules (rule_routes and evaluation_routes) for easy registration in the main application.
	+	**rule_routes.py**: Defines routes related to rule management, including creating, retrieving, combining, and validating rules.
	+	**evaluation_routes.py**: Defines routes for evaluating rules against provided data inputs.
*	**requirements.txt**: Lists all Python dependencies required to run the backend application. Use this file to install dependencies via pip.
*	**instance/rules.db**: SQLite database file that stores all the rules. Automatically created when the application runs if it doesn’t exist.

### Frontend (rule-engine-ui/)

*	**src/components/**
	+	**RuleCreator.js**: React component that provides a user interface for creating new rules.
	+	**RuleEvaluator.js**: React component that allows users to evaluate existing rules against input data.
	+	**RuleList.js**: React component that displays a list of all created rules, allowing users to view or select specific rules.
	+	**RuleTree.js**: React component that visualizes the Abstract Syntax Tree (AST) of a selected rule for better understanding and debugging.
*	**src/App.js**: Main React component that integrates all other components and manages the overall layout and routing of the frontend application.
*	**src/index.js**: Entry point of the React application. Renders the App component into the DOM and sets up the React environment.
*	**public/**: Contains static assets like index.html, images, and other resources that are publicly accessible.
*	**package.json**: Lists all JavaScript dependencies, scripts, and project metadata. Use this file to install dependencies via npm.


## Functionality


### 1. Create a Rule

* Navigate to the Create Rule page.
* Enter a rule using logical expressions.
* Example: `age > 30 AND department = 'Sales'`
* Click Save Rule.
* The rule is parsed, stored in the database, and visualized as an AST.

### 2. View Rules

* Navigate to the Rule List page.
* View all created rules along with their AST visualizations.

### 3. Combine Rules

* Navigate to the Combine Rules page.
* Select multiple rules to combine.
* Choose a combining operator (AND or OR).
* Click Combine Selected Rules.
* The combined rule is optimized to minimize redundant checks.

### 4. Evaluate a Rule

* Navigate to the Evaluate Rule page.
* Select a rule to evaluate.
* Enter values for the required attributes.
* Click Evaluate.
* View the evaluation result (true or false).

## Examples


### Example Rule Creation

* Rule: `(age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')`
* Attributes Used:
	+ `age`
	+ `department`

### Example Rule Evaluation

* Input Data:
	+ `age`: 32
	+ `department`: Sales
* Evaluation Result: `true`



### Combining Rules

* Rules to Combine:
	1. `age > 30 AND department = 'Sales'`
	2. `salary > 50000 OR experience > 5`
* Combined Rule: Uses the most frequent operator (AND or OR) and merges common conditions.



### Backend Dependencies

* Flask: Web framework
* FlaskCORS: Handling CrossOrigin Resource Sharing (CORS)
* SQLAlchemy: Database ORM
* PyParsing: Parsing logical expressions
* Other Packages: As listed in requirements.txt

### Frontend Dependencies

* React.js: Frontend library
* axios: HTTP client for making API requests
* reactd3tree: Tree visualization component
* Other Packages: As listed in package.json

### Environment Variables

* PORT: Port number for the backend server (default is 5001)
* DATABASE_URI: URI for the database (default is sqlite:///rules.db)

## Non-Functional Enhancements


### Security

* **Input Validation**: Thorough input validation has been implemented on both the frontend and backend to prevent injection attacks and ensure data integrity. This includes validating rule strings, user inputs, and API request data.
* **CORS Configuration**: Configured Cross-Origin Resource Sharing (CORS) policies using Flask-CORS to control and secure API access from the frontend application.
* **Error Handling**: Standardized error responses with appropriate HTTP status codes and messages to prevent leakage of sensitive information. This helps in gracefully handling exceptions and providing meaningful feedback to the user.

### Performance

* **AST Simplification Optimization**: Improved the Abstract Syntax Tree (AST) simplification algorithm to reduce redundant nodes and enhance evaluation speed. This optimization minimizes the computational overhead during rule evaluation.
* **Lazy Loading**: Implemented lazy loading of components in the frontend to reduce initial load time and improve user experience.

### Scalability

* **Modular Architecture**: Designed the application with a modular architecture, separating concerns between parsing, evaluation, and rule management. This facilitates scaling individual components independently.
* **Stateless Backend**: Ensured that the backend remains stateless where possible, allowing for horizontal scaling by adding more server instances behind a load balancer.
* **Database Optimization**: Optimized database interactions using SQLAlchemy ORM features, reducing query times and improving scalability.

### Maintainability

* **Code Documentation**: Added comprehensive docstrings and comments throughout the codebase to aid future developers in understanding the code logic and structure.
* **Code Formatting and Linting**: Used code linters and formatters such as flake8 and black for Python, and ESLint and Prettier for JavaScript, to maintain a consistent code style and catch potential issues early.
* **Type Annotations**: Utilized type annotations in Python code to improve code readability and facilitate static analysis tools.
* **Separation of Concerns**: Adhered to the principles of separation of concerns and single responsibility in code design, making the codebase easier to navigate and maintain.


## Test Cases

```bash
1. Use `create_rule` to generate individual rules from examples and verify their AST representation.
```
* Creating the rules by taking a rule string and generating individual rules. Segregated the implementation of `create_rules` into `parse_rule` function and `create_rule_endpoint` endpoint
```
2. Use `combine_rules` to merge example rules and ensure the resulting AST reflects the combined logic.
```
* Merging selected rule strings, converting them to ast, storing the new rule. Implemented using `combine_asts` function and `combine_rules_endpoint` endpoint
```
3. Implement sample JSON data and test `evaluate_rule` for different scenarios.
```
* Evaluated different scenarios which involve true and false
```
4. Experiment with combining additional rules and test the functionality.
```
* Also tested combining merged rules

