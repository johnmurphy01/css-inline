// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as _ from "lodash";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "cssinline" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.cssinline",
    () => {
      // The code you place here will be executed every time your command is executed
      getTextSelection();
    }
  );

  context.subscriptions.push(disposable);
}

function convertHighlightedToCSS(text: string) {
  let parsedText = text.trim().replace(/\r?\n|\r/g, "");
  if (text && text.indexOf("{{") >= 0) {
    const match = text.match(/{([^{^}]*)}/);
    if (match) {
      parsedText = match[1].trim().replace(/\r?\n|\r/g, "");
    }
  }

  // if text doesn't contain a comma, there presumably is only one attr
  if (parsedText.indexOf(",") < 0) {
    const finalText = parse(text);
    vscode.env.clipboard.writeText(finalText);
  } else {
    const attrs = parsedText.split(",");
    let finalText = "";
    for (var attr of attrs) {
      if (attr === "") {
        continue;
      }
      finalText += `${parse(attr)}\n`;
    }

    vscode.env.clipboard.writeText(finalText);
  }
}

function getTextSelection() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const cursorPosition = editor.selection.start;
    const inter = editor.selection.with(cursorPosition, editor.selection.end);
    const wordRange = inter;
    if (wordRange) {
      const highlight = editor.document.getText(wordRange);

      convertHighlightedToCSS(highlight);
    } else {
      vscode.window.showWarningMessage("Please make a text selection");
    }
  } else {
    vscode.window.showErrorMessage("No active editor!!");
  }
}

function parse(text: string) {
  const keyValue = text.split(":");
  const kebabCaseAttr = _.kebabCase(keyValue[0]);
  const value = keyValue[1].replace(/["']/g, "");

  return `${kebabCaseAttr}:${value};`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
