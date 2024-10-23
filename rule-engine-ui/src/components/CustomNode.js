import React, { useEffect, useState } from "react";

export default function CustomNode({ nodeDatum, toggleNode }) {
  const [textLines, setTextLines] = useState([]);

  useEffect(() => {
    const lines = wrapText(nodeDatum.name, 25);
    setTextLines(lines);
  }, [nodeDatum]);

  const wrapText = (text, maxCharsPerLine) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine.trim());
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines;
  };

  const nodeType = getNodeType(nodeDatum.name);
  const { bgColor, textColor } = getNodeStyles(nodeType);
  const hasChildNodes = nodeDatum.children && nodeDatum.children.length > 0;

  return (
    <g
      onClick={hasChildNodes ? toggleNode : undefined}
      className={`${hasChildNodes ? "cursor-pointer" : "cursor-default"}`}
    >
      <rect
        width={200}
        height={textLines.length * 24 + 20}
        x={-100}
        y={-(textLines.length * 12 + 10)}
        className={`${bgColor} stroke-black stroke-1`}
        rx={10}
        ry={10}
      />
      {textLines.map((line, index) => (
        <text
          key={index}
          className={`${textColor} text-sm font-bold`}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={0}
          y={-((textLines.length - 1) * 12) + index * 24}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function getNodeType(name) {
  if (name.startsWith("AND")) return "AND";
  if (name.startsWith("OR")) return "OR";
  if (name.startsWith("")) return "operand";
  return "unknown";
}

function getNodeStyles(type) {
  switch (type) {
    case "AND":
      return { bgColor: "fill-blue-200", textColor: "fill-black" };
    case "OR":
      return { bgColor: "fill-red-200", textColor: "fill-black" };
    case "operand":
      return { bgColor: "fill-green-200", textColor: "fill-black" };
    default:
      return { bgColor: "fill-gray-200", textColor: "fill-black" };
  }
}
