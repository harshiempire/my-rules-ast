from pyparsing import (
    infixNotation, opAssoc, Word, alphas, nums, Keyword, ParserElement, quotedString, removeQuotes
)
from node import Node

ParserElement.enablePackrat()

# Define basic elements
AND = Keyword("AND", caseless=True)
OR = Keyword("OR", caseless=True)
comparison_op = Word("<>=!", max=2)
identifier = Word(alphas, alphas + nums + "_")
integer = Word(nums)
string_literal = quotedString.setParseAction(removeQuotes)
value = integer | string_literal

# Define expression for a condition
def condition_parse_action(tokens):
    node = Node(
        type='operand',
        attribute=tokens.attribute,
        operator=tokens.operator,
        constant=tokens.value
    )
    print(f"Created operand node: {node}")
    return node

condition = (
    identifier("attribute") +
    comparison_op("operator") +
    value("value")
).setParseAction(condition_parse_action)

# Define the grammar
def binary_op_parse_action(tokens):
    tokens = tokens[0]
    return Node('operator', tokens[1], left=tokens[0], right=tokens[2])

bool_expr = infixNotation(
    condition,
    [
        (AND, 2, opAssoc.LEFT, lambda t: Node('operator', 'AND', left=t[0][0], right=t[0][2])),
        (OR, 2, opAssoc.LEFT, lambda t: Node('operator', 'OR', left=t[0][0], right=t[0][2]))
    ]
)

def parse_rule(rule_string):
    result = bool_expr.parseString(rule_string, parseAll=True)
    return result[0]

# Optional: Function to print the AST for debugging purposes
def print_ast(node, indent=0):
    if node is None:
        return
    print('  ' * indent + f"{node.type}: {node.value if node.value else ''} {node.attribute if node.attribute else ''} {node.operator if node.operator else ''} {node.constant if node.constant else ''}")
    print_ast(node.left, indent + 1)
    print_ast(node.right, indent + 1)

if __name__ == '__main__':
    test_rule = "age > 30 AND department = 'Sales'"
    try:
        ast = parse_rule(test_rule)
        print("Parsing successful!")
        print("AST Structure:")
        print(ast)
    except Exception as e:
        print(f"Error during parsing: {e}")