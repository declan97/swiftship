/**
 * Swift Abstract Syntax Tree Types
 *
 * These types represent Swift code structures that can be
 * deterministically converted to source code.
 */

// ============================================================================
// Base Types
// ============================================================================

export type SwiftNode =
  | ImportDecl
  | StructDecl
  | ClassDecl
  | EnumDecl
  | FunctionDecl
  | PropertyDecl
  | ViewBuilderExpr
  | FunctionCallExpr
  | IdentifierExpr
  | StringLiteralExpr
  | IntLiteralExpr
  | BoolLiteralExpr
  | ArrayLiteralExpr
  | ClosureExpr
  | MemberAccessExpr
  | IfExpr
  | ForEachExpr;

// ============================================================================
// Declarations
// ============================================================================

export interface ImportDecl {
  kind: 'import';
  module: string;
}

export interface StructDecl {
  kind: 'struct';
  name: string;
  conformances: string[];
  members: (PropertyDecl | FunctionDecl)[];
  accessLevel?: AccessLevel;
}

export interface ClassDecl {
  kind: 'class';
  name: string;
  superclass?: string;
  conformances: string[];
  members: (PropertyDecl | FunctionDecl)[];
  accessLevel?: AccessLevel;
}

export interface EnumDecl {
  kind: 'enum';
  name: string;
  cases: { name: string; rawValue?: string }[];
  conformances: string[];
  accessLevel?: AccessLevel;
}

export interface FunctionDecl {
  kind: 'function';
  name: string;
  parameters: FunctionParameter[];
  returnType?: string;
  isAsync: boolean;
  throws: boolean;
  body: SwiftNode[];
  accessLevel?: AccessLevel;
  attributes?: string[];
}

export interface PropertyDecl {
  kind: 'property';
  name: string;
  type: string;
  wrapper?: PropertyWrapper;
  defaultValue?: SwiftNode;
  isComputed: boolean;
  getter?: SwiftNode[];
  setter?: SwiftNode[];
  accessLevel?: AccessLevel;
}

// ============================================================================
// Expressions
// ============================================================================

export interface ViewBuilderExpr {
  kind: 'view-builder';
  viewName: string;
  arguments?: FunctionArgument[];
  trailingClosure?: SwiftNode[];
  modifiers?: ModifierCall[];
}

export interface FunctionCallExpr {
  kind: 'function-call';
  name: string;
  arguments: FunctionArgument[];
  trailingClosure?: SwiftNode[];
}

export interface IdentifierExpr {
  kind: 'identifier';
  name: string;
}

export interface StringLiteralExpr {
  kind: 'string-literal';
  value: string;
  isMultiline?: boolean;
}

export interface IntLiteralExpr {
  kind: 'int-literal';
  value: number;
}

export interface BoolLiteralExpr {
  kind: 'bool-literal';
  value: boolean;
}

export interface ArrayLiteralExpr {
  kind: 'array-literal';
  elements: SwiftNode[];
}

export interface ClosureExpr {
  kind: 'closure';
  parameters?: string[];
  body: SwiftNode[];
}

export interface MemberAccessExpr {
  kind: 'member-access';
  base: SwiftNode | null; // null for implicit (e.g., .leading)
  member: string;
}

export interface IfExpr {
  kind: 'if';
  condition: SwiftNode;
  then: SwiftNode[];
  else?: SwiftNode[];
}

export interface ForEachExpr {
  kind: 'foreach';
  collection: SwiftNode;
  itemName: string;
  body: SwiftNode[];
}

// ============================================================================
// Supporting Types
// ============================================================================

export type AccessLevel = 'private' | 'fileprivate' | 'internal' | 'public' | 'open';

export interface FunctionParameter {
  label?: string; // External parameter name
  name: string; // Internal parameter name
  type: string;
  defaultValue?: SwiftNode;
}

export interface FunctionArgument {
  label?: string;
  value: SwiftNode;
}

export interface PropertyWrapper {
  name: string; // e.g., 'State', 'Binding', 'Observable'
  arguments?: FunctionArgument[];
}

export interface ModifierCall {
  name: string;
  arguments?: FunctionArgument[];
}
