# node.py

class Node:
    def __init__(self, type, value=None, left=None, right=None, attribute=None, operator=None, constant=None):
        self.type = type  # 'operator' or 'operand'
        self.value = value  # For 'operator' nodes: 'AND' or 'OR'
        self.left = left
        self.right = right
        self.attribute = attribute  # For 'operand' nodes
        self.operator = operator    # For 'operand' nodes
        self.constant = constant    # For 'operand' nodes

    def __eq__(self, other):
        if not isinstance(other, Node):
            return False
        if self.type != other.type:
            return False
        if self.type == 'operator':
            return (
                self.value == other.value and
                self.left == other.left and
                self.right == other.right
            )
        elif self.type == 'operand':
            return (
                self.attribute == other.attribute and
                self.operator == other.operator and
                self.constant == other.constant
            )
        else:
            return False

    def __hash__(self):
        return hash((self.type, self.value, self.attribute, self.operator, self.constant))

    def __repr__(self):
        if self.type == 'operator':
            return f"Node(type={self.type}, value={self.value}, left={self.left}, right={self.right})"
        elif self.type == 'operand':
            return f"Node(type={self.type}, attribute={self.attribute}, operator={self.operator}, constant={self.constant})"
        else:
            return f"Node(type={self.type})"