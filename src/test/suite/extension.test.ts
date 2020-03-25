import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as cssInline from "../../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("should be able to convert transform property", () => {
    const result = cssInline.convertHighlightedToCSS(
      "transform: 'translate(-50%, -50%)'"
    );
    assert.equal(result, "transform: translate(-50%, -50%);");
  });

  test("should be able to convert multiple transform properties", () => {
    const result = cssInline.convertHighlightedToCSS(
      "transform: 'translate(-50%, -50%)',transform: 'translate(-50%, -50%)',transform: 'translate(-50%, -50%)',transform: 'translate(-50%, -50%)'"
    );
    assert.equal(
      result,
      "transform: translate(-50%, -50%);\ntransform: translate(-50%, -50%);\ntransform: translate(-50%, -50%);\ntransform: translate(-50%, -50%);"
    );
  });

  test("should be able to convert multiple mixed styles", () => {
    const result = cssInline.convertHighlightedToCSS(
      "transform: 'translate(-50%, -50%)', fontSize: '2rem', backgroundColor: '#ddd'"
    );
    assert.equal(
      result,
      "transform: translate(-50%, -50%);\nfont-size: 2rem;\nbackground-color: #ddd;"
    );
  });

  test("should be able to convert one property", () => {
    const result = cssInline.convertHighlightedToCSS('fontWeight:"bold"');
    assert.equal(result, "font-weight: bold;");
  });

  test("should be able to convert selected JSX", () => {
    const result = cssInline.convertHighlightedToCSS(
      '<div style={{fontSize: "2rem", transform: "translate(50%, 50%)"}}'
    );
    assert.equal(result, "font-size: 2rem;\ntransform: translate(50%, 50%);");
  });

  test("should be able to convert JSX with dynamic content", () => {
    const result = cssInline.convertHighlightedToCSS(
      '<div style={{fontSize: "2rem", transform: "translate(50%, 50%)"}}>{renderThis()}</div>'
    );
    assert.equal(result, "font-size: 2rem;\ntransform: translate(50%, 50%);");
  });

  test("should be able to convert style with ending comma", () => {
    const result = cssInline.convertHighlightedToCSS('fontWeight:"bold,"');
    assert.equal(result, "font-weight: bold;");
  });

  test("should return nothing if error", () => {
    const result = cssInline.convertHighlightedToCSS("");
    assert.equal(result, undefined);
  });

  test("should be able to convert styles with combination of strings and ints", () => {
    const result = cssInline.convertHighlightedToCSS(
      'opacity:0,\nfontSize:"0.775em",\nfontWeight: "bold",\nfontStyle:"italic"'
    );
    assert.equal(
      result,
      "opacity: 0;\nfont-size: 0.775em;\nfont-weight: bold;\nfont-style: italic;"
    );
  });

  test("should be able to convert styles with combination of strings and decimals", () => {
    const result = cssInline.convertHighlightedToCSS(
      'opacity:0.6,\nfontSize:"0.775em",\nfontWeight: "bold",\nfontStyle:"italic"'
    );
    assert.equal(
      result,
      "opacity: 0.6;\nfont-size: 0.775em;\nfont-weight: bold;\nfont-style: italic;"
    );
  });
});
