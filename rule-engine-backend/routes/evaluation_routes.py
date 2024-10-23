# rule-engine-backend/routes/evaluation_routes.py

from flask import Blueprint, request, jsonify
from models import Rule
from evaluator import evaluate_ast
from utils import dict_to_ast
import json

# Define the blueprint here
evaluation_bp = Blueprint('evaluation_bp', __name__)

@evaluation_bp.route('/evaluate_rule', methods=['POST'])
def evaluate_rule():
    data = request.get_json()
    rule_id = data.get('rule_id')
    input_data = data.get('data')
    try:
        rule = Rule.query.get(rule_id)
        if not rule:
            return jsonify({'error': 'Rule not found'}), 404
        ast_dict = json.loads(rule.ast_json)
        ast = dict_to_ast(ast_dict)
        result = evaluate_ast(ast, input_data)
        return jsonify({'result': result})
    except Exception as e:
        print(f"Error evaluating rule: {e}")
        return jsonify({'error': str(e)}), 400