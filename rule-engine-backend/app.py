# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from extensions import db
from models import Rule
from parser import parse_rule
from evaluator import evaluate_ast
from node import Node
import json
from collections import Counter  # <-- Ensure this import is present

app = Flask(__name__)

# Configure CORS to allow requests from http://localhost:3000
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rules.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/create_rule', methods=['POST'])
def create_rule_endpoint():
    data = request.get_json()
    rule_string = data.get('rule_string')
    try:
        ast = parse_rule(rule_string)
        ast_json = json.dumps(ast_to_dict(ast))
        new_rule = Rule(rule_string=rule_string, ast_json=ast_json)
        db.session.add(new_rule)
        db.session.commit()
        return jsonify({'message': 'Rule created', 'rule_id': new_rule.id}), 201
    except Exception as e:
        app.logger.error(f"Error creating rule: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/rules', methods=['GET'])
def get_rules():
    rules = Rule.query.all()
    rules_list = [
        {
            'id': rule.id,
            'rule_string': rule.rule_string,
            'ast': json.loads(rule.ast_json),  # Include the AST
            'is_combined': 'Combined Rule' in rule.rule_string  # Simple indicator
        }
        for rule in rules
    ]
    return jsonify({'rules': rules_list})


@app.route('/rules/<int:rule_id>', methods=['GET'])
def get_rule(rule_id):
    rule = Rule.query.get(rule_id)
    if not rule:
        return jsonify({'error': 'Rule not found'}), 404
    rule_data = {
        'id': rule.id,
        'rule_string': rule.rule_string,
        'ast': json.loads(rule.ast_json),
    }
    return jsonify({'rule': rule_data})

@app.route('/evaluate_rule', methods=['POST'])
def evaluate_rule():
    data = request.get_json()
    rule_id = data.get('rule_id')
    input_data = data.get('data')
    try:
        # Convert input data values to appropriate types if necessary
        # For example, ensure numeric fields are numbers
        # This depends on how your evaluator expects the data

        rule = Rule.query.get(rule_id)
        if not rule:
            return jsonify({'error': 'Rule not found'}), 404
        ast_dict = json.loads(rule.ast_json)
        ast = dict_to_ast(ast_dict)
        result = evaluate_ast(ast, input_data)
        return jsonify({'result': result})
    except Exception as e:
        app.logger.error(f"Error evaluating rule: {e}")
        return jsonify({'error': str(e)}), 400
    
def ast_to_rule_string(node):
    if node is None:
        return ''
    if node.type == 'operand':
        # Handle strings appropriately
        constant = f"'{node.constant}'" if isinstance(node.constant, str) and not node.constant.isdigit() else node.constant
        return f"{node.attribute} {node.operator} {constant}"
    elif node.type == 'operator':
        left_str = ast_to_rule_string(node.left)
        right_str = ast_to_rule_string(node.right)
        # Add parentheses to preserve logical structure
        return f"({left_str} {node.value} {right_str})"
    else:
        return ''

@app.route('/combine_rules', methods=['POST'])
def combine_rules_endpoint():
    data = request.get_json()
    rule_ids = data.get('rule_ids')

    try:
        rules = Rule.query.filter(Rule.id.in_(rule_ids)).all()
        if len(rules) != len(rule_ids):
            return jsonify({'error': 'One or more rules not found'}), 404

        # Get the ASTs directly from the rules
        asts = [dict_to_ast(json.loads(rule.ast_json)) for rule in rules]

        # Combine the ASTs using the optimized function
        combined_ast = combine_asts(asts)

        # Generate the combined rule string from the combined AST
        combined_rule_string = ast_to_rule_string(combined_ast)

        # Save the new combined rule
        combined_rule = Rule(
            rule_string=combined_rule_string,
            ast_json=json.dumps(ast_to_dict(combined_ast))
        )
        db.session.add(combined_rule)
        db.session.commit()

        return jsonify({'message': 'Rules combined', 'rule_id': combined_rule.id}), 201

    except Exception as e:
        app.logger.error(f"Error combining rules: {e}")
        return jsonify({'error': str(e)}), 400
    
@app.route('/validate_rule', methods=['POST'])
def validate_rule():
    data = request.get_json()
    rule_string = data.get('rule_string')
    try:
        parse_rule(rule_string)  # Use your existing parser
        return jsonify({'valid': True})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 400

def ast_to_dict(ast):
    if ast is None:
        return None
    return {
        'type': ast.type,
        'value': ast.value,
        'attribute': ast.attribute,
        'operator': ast.operator,
        'constant': ast.constant,
        'left': ast_to_dict(ast.left),
        'right': ast_to_dict(ast.right)
    }

def dict_to_ast(ast_dict):
    if ast_dict is None:
        return None
    node = Node(
        type=ast_dict['type'],
        value=ast_dict.get('value'),
        attribute=ast_dict.get('attribute'),
        operator=ast_dict.get('operator'),
        constant=ast_dict.get('constant')
    )
    node.left = dict_to_ast(ast_dict.get('left'))
    node.right = dict_to_ast(ast_dict.get('right'))
    return node

def simplify_ast(node):
    if node is None:
        return None

    # Recursively simplify left and right subtrees
    node.left = simplify_ast(node.left)
    node.right = simplify_ast(node.right)

    # Apply simplification rules
    if node.type == 'operator':
        # Idempotent Law: A AND A = A
        if node.left == node.right:
            print(f"Applying Idempotent Law on node: {node}")
            return node.left

        # Absorption Law: A AND (A OR B) = A
        if node.value == 'AND':
            # Check for A AND (A OR B)
            if node.right and node.right.type == 'operator' and node.right.value == 'AND':
                right_left = node.right.left
                right_right = node.right.right
                if right_left and right_left.type == 'operator' and right_left.value == 'OR':
                    if node.left == right_left.left or node.left == right_left.right:
                        print(f"Applying Absorption Law on node: {node}")
                        new_node = Node(
                            type='operator',
                            value='AND',
                            left=node.left,
                            right=right_right
                        )
                        return simplify_ast(new_node)

    return node

def combine_asts(asts):
    if not asts:
        return None

    # Step 1: Collect all operators to determine the most frequent one
    all_operators = []

    def collect_operators(node):
        if node is None:
            return
        if node.type == 'operator':
            all_operators.append(node.value)
        collect_operators(node.left)
        collect_operators(node.right)

    for ast in asts:
        collect_operators(ast)

    # Determine the most frequent operator
    operator_counts = Counter(all_operators)
    if operator_counts:
        primary_operator = operator_counts.most_common(1)[0][0]
    else:
        primary_operator = 'OR'  # Default operator if none found

    # Step 2: Identify and merge common conditions
    condition_map = {}

    def flatten_ast(node):
        if node is None:
            return
        if node.type == 'operand':
            key = (node.attribute, node.operator, node.constant)
            condition_map.setdefault(key, []).append(node)
        flatten_ast(node.left)
        flatten_ast(node.right)

    for ast in asts:
        flatten_ast(ast)

    # Step 3: Create unique operand nodes to avoid redundancy
    unique_operands = {}
    for key, nodes in condition_map.items():
        first_node = nodes[0]
        unique_operands[key] = first_node  # Use the existing node

    # Step 4: Reconstruct ASTs with shared operand nodes
    def replace_operands_with_unique(node):
        if node is None:
            return None
        if node.type == 'operand':
            key = (node.attribute, node.operator, node.constant)
            return unique_operands.get(key, node)
        else:
            return Node(
                type=node.type,
                value=node.value,
                left=replace_operands_with_unique(node.left),
                right=replace_operands_with_unique(node.right)
            )

    reconstructed_asts = [replace_operands_with_unique(ast) for ast in asts]

    # Step 5: Combine all ASTs using the primary operator
    combined_ast = reconstructed_asts[0]
    for ast in reconstructed_asts[1:]:
        combined_ast = Node(
            type='operator',
            value=primary_operator,
            left=combined_ast,
            right=ast
        )

    # Step 6: Simplify the combined AST
    combined_ast = simplify_ast(combined_ast)

    return combined_ast

if __name__ == '__main__':
    app.run(debug=True, port=5001)