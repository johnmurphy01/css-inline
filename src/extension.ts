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

function trimWhitespaceAndNewLine(text: string) {
  return text.trim().replace(/\r?\n|\r/g, "");
}

export function convertHighlightedToCSS(text: string) {
  let trimmedText = trimWhitespaceAndNewLine(text);
  if (text && text.indexOf("{{") >= 0) {
    const match = text.match(/{([^{^}]*)}/);
    if (match) {
      trimmedText = trimWhitespaceAndNewLine(match[1]);
    }
  }

  let finalText = "";

  const valueMatches = trimmedText.match(/'.*?'|".*?"|[0-9]\.?[0-9]?/gi);
  const keyMatches = trimmedText.match(/(^|,\n|',|",|[0-9],).*?:/gi);

  if (!keyMatches || !valueMatches) {
    vscode.window.showErrorMessage(
      "There was an issue parsing the CSS string. Please report to https://github.com/johnmurphy01/css-inline"
    );
    return;
  }

  for (var i = 0; i < keyMatches.length; i++) {
    const key =
      keyMatches[i].indexOf(",") > 0
        ? keyMatches[i].substr(keyMatches[i].indexOf(",") + 1).replace(/:/g, "")
        : keyMatches[i].replace(/:/g, "");
    const value = valueMatches[i].replace(/',/g, "").replace(/",/g, "");
    if (key === "" || value === "") {
      continue;
    }
    const parsedText = parse(key, value);
    if (parsedText === "") {
      break;
    }

    if (keyMatches.length > 1 && i < keyMatches.length - 1) {
      finalText += `${parsedText}\n`;
    } else {
      finalText += `${parsedText}`;
    }
  }

  return finalText;
}

function getTextSelection() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const cursorPosition = editor.selection.start;
    const inter = editor.selection.with(cursorPosition, editor.selection.end);
    const wordRange = inter;
    if (wordRange) {
      const highlight = editor.document.getText(wordRange);

      const finalText = convertHighlightedToCSS(highlight);
      if (!finalText) {
        vscode.window.showErrorMessage("No CSS copied to the clipboard");
        return;
      }
      vscode.env.clipboard.writeText(finalText);
      vscode.window.showInformationMessage(
        "CSS successfully copied to clipboard"
      );
    } else {
      vscode.window.showWarningMessage("Please make a text selection");
    }
  } else {
    vscode.window.showErrorMessage("No active editor!!");
  }
}

function parse(key: string, value: string) {
  const kebabCaseAttr = _.kebabCase(key);
  let valueSansQuotes = value.replace(/["']/g, "");

  if (valueSansQuotes.indexOf(",") === valueSansQuotes.length - 1) {
    valueSansQuotes = valueSansQuotes.substring(0, valueSansQuotes.length - 1);
  }

  return `${kebabCaseAttr}: ${valueSansQuotes};`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
