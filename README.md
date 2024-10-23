
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
git clone https://github.com/yourusername/ruleengineapp.git
cd ruleengineapp
```

### 2. Backend Setup (Flask)

#### a. Navigate to the Backend Directory

```bash
cd rule-engine-backend
```

#### b. Create a Virtual Environment and Install Dependencies

```bash
python -m venv env
pip install
```

#### c. Activate the Virtual Environment

```bash
source env/bin/activate
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
ruleengineapp/
├── rule-engine-backend/
│   ├── app.py
│   ├── evaluator.py
│   ├── extensions.py
│   ├── models.py
│   ├── node.py
│   ├── parser.py
│   ├── requirements.txt
│   └── ... (other backend files)
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
