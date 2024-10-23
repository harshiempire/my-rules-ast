from flask import Blueprint, request, jsonify
from models import Rule
from parser import parse_rule
from utils import ast_to_dict, dict_to_ast, simplify_ast, ast_to_rule_string, combine_asts
from extensions import db
import json

# Define the blueprint here
rule_bp = Blueprint('rule_bp', __name__)

@rule_bp.route('/create_rule', methods=['POST'])
def create_rule_endpoint():
    """Create a new rule based on a given rule string."""
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
        print(f"Error creating rule: {e}")
        return jsonify({'error': str(e)}), 400

@rule_bp.route('/rules', methods=['GET'])
def get_rules():
    """Fetch all rules."""
    try:
        rules = Rule.query.all()
        rules_list = [
            {
                'id': rule.id,
                'rule_string': rule.rule_string,
                'ast': json.loads(rule.ast_json),
                'is_combined': 'Combined Rule' in rule.rule_string
            }
            for rule in rules
        ]
        return jsonify({'rules': rules_list})
    except Exception as e:
        print(f"Error fetching rules: {e}")
        return jsonify({'error': str(e)}), 400

@rule_bp.route('/rules/<int:rule_id>', methods=['GET'])
def get_rule(rule_id):
    """Fetch a single rule based on its ID."""
    try:
        rule = Rule.query.get(rule_id)
        if not rule:
            return jsonify({'error': 'Rule not found'}), 404
        rule_data = {
            'id': rule.id,
            'rule_string': rule.rule_string,
            'ast': json.loads(rule.ast_json),
        }
        return jsonify({'rule': rule_data})
    except Exception as e:
        print(f"Error fetching rule: {e}")
        return jsonify({'error': str(e)}), 400

@rule_bp.route('/combine_rules', methods=['POST'])
def combine_rules_endpoint():
    """Combine multiple rules into a single rule."""
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
        print(f"Error combining rules: {e}")
        return jsonify({'error': str(e)}), 400

@rule_bp.route('/validate_rule', methods=['POST'])
def validate_rule():
    """Check if a given rule string is valid."""
    data = request.get_json()
    rule_string = data.get('rule_string')
    try:
        parse_rule(rule_string)
        return jsonify({'valid': True})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 400
