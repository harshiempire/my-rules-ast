
# Rule Engine Application


Welcome to the Rule Engine Application! This application allows users to create, combine, and evaluate logical rules using a userfriendly interface. It supports complex rule creation with logical operators, efficient rule combination, and visualization of rules as Abstract Syntax Trees (ASTs).

## Table of Contents


* [Features](#features)
* [Demo](#demo)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Project Structure](#projectstructure)
* [Usage](#usage)
* [Examples](#examples)


## Features


* Create Rules: Define logical rules using attributes, comparison operators, and constants.
* Combine Rules: Efficiently combine multiple rules into a single optimized rule.
* Evaluate Rules: Input data and evaluate rules to get boolean results.
* Rule Visualization: Visualize rules as Abstract Syntax Trees (ASTs) for better understanding.
* Optimized Rule Engine: Minimizes redundant checks by merging common conditions.
* UserFriendly Interface: Intuitive frontend built with React.js.
* RESTful API: Backend API built with Flask for rule management and evaluation.

## Demo


(Screenshot showcasing the main features of the application)

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

#### d. Run the Flask Application

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


## Usage


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

## Test Cases

1. Use `create_rule` to generate individual rules from examples and verify their AST representation.	
	* Creating the rules by taking a rule string 
2. Use `combine_rules` to merge example rules and ensure the resulting AST reflects the combined logic.
3. Implement sample JSON data and test `evaluate_rule` for different scenarios.
4. Experiment with combining additional rules and test the functionality.

