/**
 * Swift Code Printer
 *
 * Converts Swift AST nodes to formatted source code.
 * This is deterministic - same input always produces same output.
 */

import type {
  SwiftNode,
  ImportDecl,
  StructDecl,
  PropertyDecl,
  FunctionDecl,
  ViewBuilderExpr,
  FunctionCallExpr,
  FunctionArgument,
  ModifierCall,
  MemberAccessExpr,
  ClosureExpr,
  ForEachExpr,
  IfExpr,
} from './types';

const INDENT = '    '; // 4 spaces

export class SwiftPrinter {
  private indentLevel = 0;

  print(nodes: SwiftNode[]): string {
    return nodes.map((node) => this.printNode(node)).join('\n');
  }

  printNode(node: SwiftNode): string {
    switch (node.kind) {
      case 'import':
        return this.printImport(node);
      case 'struct':
        return this.printStruct(node);
      case 'property':
        return this.printProperty(node);
      case 'function':
        return this.printFunction(node);
      case 'view-builder':
        return this.printViewBuilder(node);
      case 'function-call':
        return this.printFunctionCall(node);
      case 'identifier':
        return node.name;
      case 'string-literal':
        return node.isMultiline ? `"""\n${node.value}\n"""` : `"${this.escapeString(node.value)}"`;
      case 'int-literal':
        return node.value.toString();
      case 'bool-literal':
        return node.value.toString();
      case 'array-literal':
        return `[${node.elements.map((e) => this.printNode(e)).join(', ')}]`;
      case 'closure':
        return this.printClosure(node);
      case 'member-access':
        return this.printMemberAccess(node);
      case 'if':
        return this.printIf(node);
      case 'foreach':
        return this.printForEach(node);
      default:
        throw new Error(`Unknown node kind: ${(node as SwiftNode).kind}`);
    }
  }

  private printImport(node: ImportDecl): string {
    return `import ${node.module}`;
  }

  private printStruct(node: StructDecl): string {
    const lines: string[] = [];

    // Declaration
    let decl = '';
    if (node.accessLevel && node.accessLevel !== 'internal') {
      decl += `${node.accessLevel} `;
    }
    decl += `struct ${node.name}`;
    if (node.conformances.length > 0) {
      decl += `: ${node.conformances.join(', ')}`;
    }
    decl += ' {';
    lines.push(decl);

    // Members
    this.indentLevel++;
    for (const member of node.members) {
      lines.push(this.indent(this.printNode(member)));
      lines.push(''); // Blank line between members
    }
    this.indentLevel--;

    // Remove trailing blank line
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }

    lines.push('}');
    return lines.join('\n');
  }

  private printProperty(node: PropertyDecl): string {
    let result = '';

    // Property wrapper (e.g., @State, @Binding)
    if (node.wrapper) {
      result += `@${node.wrapper.name}`;
      if (node.wrapper.arguments && node.wrapper.arguments.length > 0) {
        result += `(${this.printArguments(node.wrapper.arguments)})`;
      }
      result += ' ';
    }

    // Access level
    if (node.accessLevel && node.accessLevel !== 'internal') {
      result += `${node.accessLevel} `;
    }

    // var/let
    const keyword = node.isComputed || node.wrapper ? 'var' : 'var';
    result += `${keyword} ${node.name}`;

    // Type annotation
    result += `: ${node.type}`;

    // Computed property
    if (node.isComputed && node.getter) {
      result += ' {\n';
      this.indentLevel++;
      for (const stmt of node.getter) {
        result += this.indent(this.printNode(stmt)) + '\n';
      }
      this.indentLevel--;
      result += this.indent('}');
      return result;
    }

    // Default value
    if (node.defaultValue) {
      result += ` = ${this.printNode(node.defaultValue)}`;
    }

    return result;
  }

  private printFunction(node: FunctionDecl): string {
    const lines: string[] = [];

    // Attributes (e.g., @MainActor)
    for (const attr of node.attributes || []) {
      lines.push(`@${attr}`);
    }

    // Declaration
    let decl = '';
    if (node.accessLevel && node.accessLevel !== 'internal') {
      decl += `${node.accessLevel} `;
    }
    decl += `func ${node.name}(`;
    decl += node.parameters
      .map((p) => {
        let param = '';
        if (p.label !== undefined) {
          param += `${p.label} `;
        }
        param += `${p.name}: ${p.type}`;
        if (p.defaultValue) {
          param += ` = ${this.printNode(p.defaultValue)}`;
        }
        return param;
      })
      .join(', ');
    decl += ')';

    if (node.isAsync) decl += ' async';
    if (node.throws) decl += ' throws';
    if (node.returnType) decl += ` -> ${node.returnType}`;

    decl += ' {';
    lines.push(decl);

    // Body
    this.indentLevel++;
    for (const stmt of node.body) {
      lines.push(this.indent(this.printNode(stmt)));
    }
    this.indentLevel--;

    lines.push('}');
    return lines.join('\n');
  }

  private printViewBuilder(node: ViewBuilderExpr): string {
    let result = node.viewName;

    // Arguments
    if (node.arguments && node.arguments.length > 0) {
      result += `(${this.printArguments(node.arguments)})`;
    }

    // Trailing closure (content)
    if (node.trailingClosure && node.trailingClosure.length > 0) {
      result += ' {\n';
      this.indentLevel++;
      for (const child of node.trailingClosure) {
        result += this.indent(this.printNode(child)) + '\n';
      }
      this.indentLevel--;
      result += this.indent('}');
    }

    // Modifiers
    if (node.modifiers) {
      for (const modifier of node.modifiers) {
        result += '\n' + this.indent(this.printModifier(modifier));
      }
    }

    return result;
  }

  private printFunctionCall(node: FunctionCallExpr): string {
    let result = node.name;

    // Arguments
    if (node.arguments.length > 0 || !node.trailingClosure) {
      result += `(${this.printArguments(node.arguments)})`;
    }

    // Trailing closure
    if (node.trailingClosure && node.trailingClosure.length > 0) {
      result += ' {\n';
      this.indentLevel++;
      for (const stmt of node.trailingClosure) {
        result += this.indent(this.printNode(stmt)) + '\n';
      }
      this.indentLevel--;
      result += this.indent('}');
    }

    return result;
  }

  private printClosure(node: ClosureExpr): string {
    let result = '{';

    if (node.parameters && node.parameters.length > 0) {
      result += ` ${node.parameters.join(', ')} in`;
    }

    if (node.body.length === 1) {
      result += ` ${this.printNode(node.body[0])} }`;
    } else {
      result += '\n';
      this.indentLevel++;
      for (const stmt of node.body) {
        result += this.indent(this.printNode(stmt)) + '\n';
      }
      this.indentLevel--;
      result += this.indent('}');
    }

    return result;
  }

  private printMemberAccess(node: MemberAccessExpr): string {
    if (node.base === null) {
      return `.${node.member}`;
    }
    return `${this.printNode(node.base)}.${node.member}`;
  }

  private printIf(node: IfExpr): string {
    let result = `if ${this.printNode(node.condition)} {\n`;
    this.indentLevel++;
    for (const stmt of node.then) {
      result += this.indent(this.printNode(stmt)) + '\n';
    }
    this.indentLevel--;
    result += this.indent('}');

    if (node.else) {
      result += ' else {\n';
      this.indentLevel++;
      for (const stmt of node.else) {
        result += this.indent(this.printNode(stmt)) + '\n';
      }
      this.indentLevel--;
      result += this.indent('}');
    }

    return result;
  }

  private printForEach(node: ForEachExpr): string {
    let result = `ForEach(${this.printNode(node.collection)}) { ${node.itemName} in\n`;
    this.indentLevel++;
    for (const stmt of node.body) {
      result += this.indent(this.printNode(stmt)) + '\n';
    }
    this.indentLevel--;
    result += this.indent('}');
    return result;
  }

  private printModifier(modifier: ModifierCall): string {
    let result = `.${modifier.name}`;
    if (modifier.arguments && modifier.arguments.length > 0) {
      result += `(${this.printArguments(modifier.arguments)})`;
    }
    return result;
  }

  private printArguments(args: FunctionArgument[]): string {
    return args
      .map((arg) => {
        if (arg.label) {
          return `${arg.label}: ${this.printNode(arg.value)}`;
        }
        return this.printNode(arg.value);
      })
      .join(', ');
  }

  private indent(text: string): string {
    const prefix = INDENT.repeat(this.indentLevel);
    return text
      .split('\n')
      .map((line) => (line ? prefix + line : line))
      .join('\n');
  }

  private escapeString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  }
}

/**
 * Print Swift AST nodes to source code.
 */
export function printSwift(nodes: SwiftNode[]): string {
  const printer = new SwiftPrinter();
  return printer.print(nodes);
}
