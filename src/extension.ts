import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	const commandId = 'alminde.convert-document-length-to-hex'

	context.subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		const contentLength = calculateHexFromDocument();
		if(contentLength) {
			vscode.env.clipboard.writeText(contentLength.hex);
			vscode.window.showInformationMessage(`Copied ${contentLength.hex} to clipboard`);
		}
	}));
	
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	statusBarItem.command = commandId;
	context.subscriptions.push(statusBarItem);

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBar));

	updateStatusBar();
}

function updateStatusBar(): void {
	const contentLength = calculateHexFromDocument();
	if(contentLength) {
		statusBarItem.text = `DEC:${contentLength?.decimal}, HEX:${contentLength?.hex}`;
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}


function calculateHexFromDocument(): ContentLength | undefined {
	const editor = vscode.window.activeTextEditor;
	if(editor) {
		const contentLength = editor.document.getText().length;
		return new ContentLength(contentLength, contentLength?.toString(16));
	}
}

class ContentLength {
	constructor(public decimal: number, public hex: string) { }
}

// this method is called when your extension is deactivated
export function deactivate() {}
