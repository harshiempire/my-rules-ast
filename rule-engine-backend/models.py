# models.py
from extensions import db

class Rule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rule_string = db.Column(db.Text, nullable=False)
    ast_json = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Rule {self.id}>'