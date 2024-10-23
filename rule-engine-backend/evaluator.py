# evaluator.py

import operator
import re
from node import Node  # Import Node class

operators = {
    '>': operator.gt,
    '<': operator.lt,
    '=': operator.eq,
    '!=': operator.ne,
    '>=': operator.ge,
    '<=': operator.le
}

def evaluate_ast(ast, data):
    if ast.type == 'operand':
        return evaluate_condition(ast, data)
    elif ast.type == 'operator':
        left = evaluate_ast(ast.left, data)
        right = evaluate_ast(ast.right, data)
        if ast.value == 'AND':
            return left and right
        elif ast.value == 'OR':
            return left or right
        else:
            raise ValueError(f'Unknown operator {ast.value}')
    else:
        raise ValueError(f'Unknown node type {ast.type}')
    
def evaluate_condition(node, data):
    attribute = node.attribute
    operator_str = node.operator
    constant = node.constant

    if attribute not in data:
        raise KeyError(f"Attribute '{attribute}' not found in data")
    attribute_value = data[attribute]

    # Convert attribute and constant to appropriate types
    try:
        # Attempt to convert to float
        attribute_value = float(attribute_value)
        constant_value = float(constant)
    except ValueError:
        # If conversion fails, compare as strings
        attribute_value = str(attribute_value)
        constant_value = str(constant).strip("'\"")

    op_func = operators.get(operator_str)
    if not op_func:
        raise ValueError(f"Unsupported operator: {operator_str}")

    return op_func(attribute_value, constant_value)