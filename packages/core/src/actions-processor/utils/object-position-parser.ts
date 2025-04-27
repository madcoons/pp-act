import { ValidationError } from "../../errors/validation-error.js";

type Token = {
  type:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "%"
    | "px"
    | "number"
    | "calc"
    | "+"
    | "-"
    | "*"
    | "/"
    | "("
    | ")"
    | "white-space";
  value: string;
};

const tokenize = (input: string): Token[] => {
  const matchers: { regex: RegExp; type: Token["type"] }[] = [
    { regex: /top/y, type: "top" },
    { regex: /bottom/y, type: "bottom" },
    { regex: /left/y, type: "left" },
    { regex: /right/y, type: "right" },
    { regex: /center/y, type: "center" },
    { regex: /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?%/y, type: "%" },
    { regex: /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?px/y, type: "px" },
    { regex: /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y, type: "number" },
    { regex: /calc/y, type: "calc" },
    { regex: /[+]/y, type: "+" },
    { regex: /[-]/y, type: "-" },
    { regex: /[*]/y, type: "*" },
    { regex: /[/]/y, type: "/" },
    { regex: /[(]/y, type: "(" },
    { regex: /[)]/y, type: ")" },
    { regex: /[ \t]+/y, type: "white-space" },
  ];

  const tokens: Token[] = [];
  let lastIndex = 0;

  while (lastIndex < input.length) {
    let matched = false;
    for (let i = 0; i < matchers.length && !matched; i++) {
      const { regex, type } = matchers[i];

      regex.lastIndex = lastIndex;
      const match = regex.exec(input);
      if (match) {
        lastIndex = regex.lastIndex;
        tokens.push({ type: type, value: match[0] });
        matched = true;
      }
    }

    if (!matched) {
      throw new ValidationError(
        `Position '${input}' is not in a valid format.`
      );
    }
  }

  return tokens;
};

class ParserState {
  offset: number = 0;

  constructor(public tokens: Token[]) {}

  skipWhiteSpace() {
    while (
      this.offset < this.tokens.length &&
      this.tokens[this.offset].type === "white-space"
    ) {
      this.offset++;
    }
  }

  peek(): Token | null {
    if (this.offset < this.tokens.length) {
      return this.tokens[this.offset];
    }

    return null;
  }

  pop(): Token | null {
    if (this.offset < this.tokens.length) {
      return this.tokens[this.offset++];
    }

    return null;
  }
}

export type Position =
  | PositionSingleCorner
  | PositionDoubleCorner
  | PositionDoubleCornerWithValues;

const tryParsePosition = (state: ParserState): Position | null => {
  const offset = state.offset;

  const doubleCornerWithValues = tryParsePositionDoubleCornerWithValues(state);
  if (doubleCornerWithValues) {
    return doubleCornerWithValues;
  }

  state.offset = offset;

  const doubleCorner = tryParsePositionDoubleCorner(state);
  if (doubleCorner) {
    return doubleCorner;
  }

  state.offset = offset;

  const singleCorner = tryParsePositionSingleCorner(state);
  if (singleCorner) {
    return singleCorner;
  }

  state.offset = offset;
  return null;
};

export type PositionSingleCorner = {
  type: "position-single-corner";
  corner: PositionValue | PositionKeyword;
};

const tryParsePositionSingleCorner = (
  state: ParserState
): PositionSingleCorner | null => {
  const offset = state.offset;

  const keyword = tryParsePositionKeyword(state);
  if (keyword) {
    return {
      type: "position-single-corner",
      corner: keyword,
    };
  }

  state.offset = offset;

  const positionValue = tryParsePositionValue(state);
  if (positionValue) {
    return {
      type: "position-single-corner",
      corner: positionValue,
    };
  }

  state.offset = offset;
  return null;
};

export type PositionDoubleCorner = {
  type: "position-double-corner";
  corner1: PositionSingleCorner;
  corner2: PositionSingleCorner;
};

const tryParsePositionDoubleCorner = (
  state: ParserState
): PositionDoubleCorner | null => {
  const offset = state.offset;

  const corner1 = tryParsePositionSingleCorner(state);
  if (!corner1) {
    state.offset = offset;
    return null;
  }

  state.skipWhiteSpace();

  const corner2 = tryParsePositionSingleCorner(state);
  if (!corner2) {
    state.offset = offset;
    return null;
  }

  return {
    type: "position-double-corner",
    corner1: corner1,
    corner2: corner2,
  };
};

export type PositionDoubleCornerWithValues = {
  type: "position-double-corner-with-values";
  corner1: PositionKeywordWithValue;
  corner2: PositionKeywordWithValue;
};

const tryParsePositionDoubleCornerWithValues = (
  state: ParserState
): PositionDoubleCornerWithValues | null => {
  const offset = state.offset;

  const corner1 = tryParsePositionKeywordWithValue(state);
  if (!corner1) {
    state.offset = offset;
    return null;
  }

  const corner2 = tryParsePositionKeywordWithValue(state);
  if (!corner2) {
    state.offset = offset;
    return null;
  }

  return {
    type: "position-double-corner-with-values",
    corner1: corner1,
    corner2: corner2,
  };
};

export type PositionValue =
  | NumberLiteral
  | PixelsLiteral
  | PercentageLiteral
  | CalcExpression;

const tryParsePositionValue = (state: ParserState): PositionValue | null => {
  const offset = state.offset;

  const numberLiteral = tryParseNumberLiteral(state);
  if (numberLiteral) {
    return numberLiteral;
  }

  state.offset = offset;

  const pixelsLiteral = tryParsePixelsLiteral(state);
  if (pixelsLiteral) {
    return pixelsLiteral;
  }

  state.offset = offset;

  const percentageLiteral = tryParsePercentageLiteral(state);
  if (percentageLiteral) {
    return percentageLiteral;
  }

  state.offset = offset;

  const calcExpression = tryParseCalcExpression(state);
  if (calcExpression) {
    return calcExpression;
  }

  state.offset = offset;
  return null;
};

export type PositionKeyword = {
  type: "top" | "bottom" | "left" | "right" | "center";
};

const tryParsePositionKeyword = (
  state: ParserState
): PositionKeyword | null => {
  const token = state.peek();
  if (!token) {
    return null;
  }

  if (
    token.type === "top" ||
    token.type === "bottom" ||
    token.type === "left" ||
    token.type === "right" ||
    token.type === "center"
  ) {
    state.pop();

    return {
      type: token.type,
    };
  }

  return null;
};

export type PositionKeywordWithValue = {
  type: "kw-with-walue";
  kw: PositionKeyword;
  value: PositionValue;
};

const tryParsePositionKeywordWithValue = (
  state: ParserState
): PositionKeywordWithValue | null => {
  const offset = state.offset;

  const keyword = tryParsePositionKeyword(state);
  if (!keyword) {
    state.offset = offset;
    return null;
  }

  state.skipWhiteSpace();

  const positionValue = tryParsePositionValue(state);
  if (!positionValue) {
    state.offset = offset;
    return null;
  }

  return {
    type: "kw-with-walue",
    kw: keyword,
    value: positionValue,
  };
};

export type NumberLiteral = {
  type: "number";
  value: number;
};

const tryParseNumberLiteral = (state: ParserState): NumberLiteral | null => {
  const token = state.peek();
  if (!token || token.type !== "number") {
    return null;
  }

  state.pop();

  return {
    type: "number",
    value: Number(token.value),
  };
};

export type PixelsLiteral = {
  type: "px";
  value: number;
};

const tryParsePixelsLiteral = (state: ParserState): PixelsLiteral | null => {
  const token = state.peek();
  if (!token || token.type !== "px") {
    return null;
  }

  state.pop();

  return {
    type: "px",
    value: Number(token.value.slice(0, token.value.length - 2)),
  };
};

export type PercentageLiteral = {
  type: "%";
  value: number;
};

const tryParsePercentageLiteral = (
  state: ParserState
): PercentageLiteral | null => {
  const token = state.peek();
  if (!token || token.type !== "%") {
    return null;
  }

  state.pop();

  return {
    type: "%",
    value: Number(token.value.slice(0, token.value.length - 1)),
  };
};

export type CalcExpression = {
  type: "calc";
  expression: PixelsLiteral | PercentageLiteral | BinaryExpression;
};

const tryParseCalcExpression = (state: ParserState): CalcExpression | null => {
  const token = state.peek();
  if (!token || token.type !== "calc") {
    return null;
  }

  //   state.pop();

  //   if (state.peek()?.type !== "(") {
  //     return null;
  //   }

  throw new Error("Calc not implemented.");
};

export type BinaryExpression = {
  type: "binary-expression";
  op: "+" | "-" | "*" | "/";
  left: PositionValue;
  right: PositionValue;
};

const parse = (tokens: Token[]): Position | null => {
  const state = new ParserState(tokens);
  state.skipWhiteSpace();

  const position = tryParsePosition(state);
  if (position) {
    return position;
  }

  return null;
};

export type NormalizedPosition = {
  h: PositionValue;
  v: PositionValue;
};

const normalizePositionSingleCorner = (
  corner: PositionSingleCorner
): PositionValue | null => {
  if (corner.corner.type === "center") {
    return { type: "%", value: 50 };
  }

  if (corner.corner.type === "top" || corner.corner.type === "left") {
    return { type: "%", value: 0 };
  }

  if (corner.corner.type === "bottom" || corner.corner.type === "right") {
    return { type: "%", value: 100 };
  }

  if (
    corner.corner.type === "%" ||
    corner.corner.type === "px" ||
    corner.corner.type === "calc"
  ) {
    return corner.corner;
  }

  if (corner.corner.type === "number") {
    if (corner.corner.value !== 0) {
      return null;
    }

    return { type: "%", value: 0 };
  }

  const type: never = corner.corner.type;
  throw new Error(`Type '${type}' is not supported.`);
};

const normalizePositionKeywordWithValue = (
  position: PositionKeywordWithValue
): PositionValue | null => {
  if (position.kw.type === "center") {
    return null;
  }

  if (position.kw.type === "top" || position.kw.type === "left") {
    if (position.value.type === "number") {
      if (position.value.value !== 0) {
        return null;
      }

      return { type: "%", value: 0 };
    }

    return position.value;
  }

  if (position.kw.type === "bottom" || position.kw.type === "right") {
    if (position.value.type === "number") {
      if (position.value.value !== 0) {
        return null;
      }

      return { type: "%", value: 100 };
    }

    return {
      type: "calc",
      expression: {
        type: "binary-expression",
        op: "-",
        left: { type: "%", value: 100 },
        right: position.value,
      },
    };
  }

  const keyword: never = position.kw.type;
  throw new Error(`Keyword '${keyword}' is not supported.`);
};

const normalizeTree = (position: Position): NormalizedPosition | null => {
  if (position.type === "position-single-corner") {
    const centerPositionValue: PositionValue = {
      type: "%",
      value: 50,
    };

    if (position.corner.type === "top" || position.corner.type === "bottom") {
      const normalized = normalizePositionSingleCorner(position);
      if (!normalized) {
        return null;
      }

      return {
        h: centerPositionValue,
        v: normalized,
      };
    }

    if (
      position.corner.type === "left" ||
      position.corner.type === "right" ||
      position.corner.type === "number" ||
      position.corner.type === "center"
    ) {
      const normalized = normalizePositionSingleCorner(position);
      if (!normalized) {
        return null;
      }

      return {
        h: normalized,
        v: centerPositionValue,
      };
    }

    if (
      position.corner.type === "%" ||
      position.corner.type === "px" ||
      position.corner.type === "calc"
    ) {
      return {
        h: position.corner,
        v: centerPositionValue,
      };
    }

    throw new Error("Something went wrong.");
  }

  if (position.type === "position-double-corner") {
    const corner1 = position.corner1;
    if (corner1.corner.type === "top" || corner1.corner.type === "bottom") {
      return null;
    }

    const corner2 = position.corner2;
    if (corner2.corner.type === "left" || corner2.corner.type === "right") {
      return null;
    }

    const normalizedCorner1 = normalizePositionSingleCorner(corner1);
    if (!normalizedCorner1) {
      return null;
    }

    const normalizedCorner2 = normalizePositionSingleCorner(corner2);
    if (!normalizedCorner2) {
      return null;
    }

    return {
      h: normalizedCorner1,
      v: normalizedCorner2,
    };
  }

  if (position.type === "position-double-corner-with-values") {
    if (
      position.corner1.kw.type === "center" ||
      position.corner2.kw.type === "center"
    ) {
      return null;
    }

    if (
      position.corner1.kw.type === "left" ||
      position.corner1.kw.type === "right"
    ) {
      if (
        position.corner2.kw.type === "left" ||
        position.corner2.kw.type === "right"
      ) {
        return null;
      }

      const normalizedH = normalizePositionKeywordWithValue(position.corner1);
      if (!normalizedH) {
        return null;
      }

      const normalizedV = normalizePositionKeywordWithValue(position.corner2);
      if (!normalizedV) {
        return null;
      }

      return { h: normalizedH, v: normalizedV };
    }

    if (
      position.corner1.kw.type === "top" ||
      position.corner1.kw.type === "bottom"
    ) {
      if (
        position.corner2.kw.type === "top" ||
        position.corner2.kw.type === "bottom"
      ) {
        return null;
      }

      const normalizedH = normalizePositionKeywordWithValue(position.corner2);
      if (!normalizedH) {
        return null;
      }

      const normalizedV = normalizePositionKeywordWithValue(position.corner1);
      if (!normalizedV) {
        return null;
      }

      return { h: normalizedH, v: normalizedV };
    }
  }

  throw new Error("Something went wrong.");
};

export const parseObjectPosition = (value: string): NormalizedPosition => {
  const tokens = tokenize(value);
  const position = parse(tokens);
  if (!position) {
    throw new ValidationError(`Position '${value}' is not in a valid format.`);
  }

  const normalizedPosition = normalizeTree(position);
  if (!normalizedPosition) {
    throw new ValidationError(`Position '${value}' is not in a valid format.`);
  }

  return normalizedPosition;
};
