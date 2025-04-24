export const exposeEvaluatePositionExpression = `
function evaluatePositionValue(positionValue, percentageMul) {
  function percentageToPx(value) {
    return { type: "px", value: value.value * percentageMul };
  }

  function evaluateCalc(value) {
    if (value.expression.type === "px") {
      return value.expression;
    }

    if (value.expression.type === "%") {
      return percentageToPx(value.expression);
    }

    if (value.expression.type === "binary-expression") {
      const left = evaluatePositionValue(value.expression.left, percentageMul);
      if (!left) {
        return null;
      }

      const right = evaluatePositionValue(
        value.expression.right,
        percentageMul
      );
      if (!right) {
        return null;
      }

      if (value.op === "+") {
        if (left.type === "number" && right.type === "number") {
          return { type: "number", value: left.value + right.value };
        }

        if (left.type === "px" && right.type === "px") {
          return { type: "px", value: left.value + right.value };
        }

        app.echoToOE("Error:Should not happen.");
        return null;
      }

      if (value.op === "-") {
        if (left.type === "number" && right.type === "number") {
          return { type: "number", value: left.value - right.value };
        }

        if (left.type === "px" && right.type === "px") {
          return { type: "px", value: left.value - right.value };
        }

        app.echoToOE("Error:Should not happen.");
        return null;
      }

      if (value.op === "*") {
        if (
          (left.type === "number" && right.type === "px") ||
          (left.type === "px" && right.type === "number")
        ) {
          return { type: "px", value: left.value * right.value };
        }

        app.echoToOE("Error:Should not happen.");
        return null;
      }

      if (value.op === "/") {
        if (left.type === "px" && right.type === "number") {
          return { type: "px", value: left.value / right.value };
        }

        app.echoToOE("Error:Should not happen.");
        return null;
      }
    }
  }

  if (positionValue.type === "number") {
    return positionValue;
  }

  if (positionValue.type === "px") {
    return positionValue;
  }

  if (positionValue.type === "%") {
    return percentageToPx(positionValue);
  }

  if (position.type === "calc") {
    return evaluateCalc(positionValue);
  }

  app.echoToOE("Error:Should not happen.");
  return null;
}
  
`;
