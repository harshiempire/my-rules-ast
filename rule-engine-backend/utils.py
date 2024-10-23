from node import Node
from collections import Counter
from typing import List, Optional

def ast_to_dict(ast: Node) -> Optional[dict]:
    """Convert an Abstract Syntax Tree (AST) node to a JSON-like dictionary"""
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

def dict_to_ast(ast_dict: dict) -> Node:
    """Convert a JSON-like dictionary to an Abstract Syntax Tree (AST) node"""
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

def simplify_ast(node: Node) -> Node:
    """Apply simplification rules to an Abstract Syntax Tree (AST) node"""
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

def ast_to_rule_string(node: Node) -> str:
    """Convert an Abstract Syntax Tree (AST) node to a string"""
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

def combine_asts(asts: List[Node]) -> Node:
    """Combine multiple Abstract Syntax Trees (ASTs) into a single AST"""
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
