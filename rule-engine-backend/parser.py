from pyparsing import (
    infixNotation, opAssoc, Word, alphas, alphanums, nums, Keyword, ParserElement, quotedString, removeQuotes
)
from node import Node

ParserElement.enablePackrat()

AND = Keyword("AND", caseless=True)
OR = Keyword("OR", caseless=True)
comparison_op = Word("<>=!", max=2)
identifier = Word(alphas, alphanums + "_")
integer = Word(nums)
string_literal = quotedString.setParseAction(removeQuotes)
value = integer | string_literal

def condition_parse_action(tokens):
    """Convert a parsed condition into a Node object"""
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
bool_expr = infixNotation(
    condition,
    [
        (AND, 2, opAssoc.LEFT, lambda t: Node('operator', 'AND', left=t[0][0], right=t[0][2])),
        (OR, 2, opAssoc.LEFT, lambda t: Node('operator', 'OR', left=t[0][0], right=t[0][2]))
    ]
)

def parse_rule(rule_string):
    """Parse a rule-string into an Abstract Syntax Tree"""
    result = bool_expr.parseString(rule_string, parseAll=True)
    return result[0]
