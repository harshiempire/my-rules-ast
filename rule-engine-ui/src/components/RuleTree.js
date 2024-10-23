import React, { useState, useRef, useEffect } from "react";
import Tree from "react-d3-tree";
import CustomNode from "./CustomNode";

function RuleTree({ ast }) {
  const [treeData, setTreeData] = useState(null);
  const treeContainer = useRef(null);

  const formatAstToTreeData = (node) => {
    if (!node) return null;
    let nodeName = "";
    if (node.type === "operator") {
      nodeName = `${node.value}`;
    } else if (node.type === "operand") {
      nodeName = `${node.attribute} ${node.operator} ${node.constant}`;
    } else {
      nodeName = "Unknown node type";
    }
    return {
      name: nodeName,
      children: [node.left, node.right]
        .filter(Boolean)
        .map(formatAstToTreeData),
    };
  };

  useEffect(() => {
    if (ast) {
      const formattedData = formatAstToTreeData(ast);
      setTreeData(formattedData);
    }
  }, [ast]);

  const containerStyles = {
    width: "100%",
    height: "500px",
  };

  const nodeSize = { x: 250, y: 200 }; // Increase node size
  const separation = { siblings: 1, nonSiblings: 1 };

  const textLayout = {
    textAnchor: "start",
    x: 20,
    y: -10,
    transform: undefined,
  };

  if (!treeData) return <p>No AST data available.</p>;

  return (
    <div style={containerStyles} ref={treeContainer}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 400, y: 50 }}
        pathFunc="straight"
        nodeSize={nodeSize}
        separation={separation}
        zoomable={true}
        collapsible={true}
        renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} />}
      />
    </div>
  );
}

export default RuleTree;
