import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "html-completion" is now active!');

	let insertion = vscode.commands.registerCommand('html-completion.insertion', async () => {
		const numItems = await vscode.window.showInputBox({
			prompt: 'Combien d\'éléments <li> voulez-vous créer ?',
			placeHolder: 'Entrez un nombre'
		});

		if (numItems) {
			const indentation = '\t';
			const liItems = Array.from({ length: parseInt(numItems) }, () => `${indentation}<li>$1</li>`).join('\n');
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.insertSnippet(new vscode.SnippetString(`<ul>\n${liItems}\n</ul>`));
			}
		}
	});

	let validateur = vscode.commands.registerCommand('html-completion.validateur', () => {
		vscode.env.openExternal(vscode.Uri.parse('https://validator.w3.org/#validate_by_input'));
	});

	let github = vscode.commands.registerCommand('html-completion.github', () => {
		vscode.env.openExternal(vscode.Uri.parse('https://github.com/IKLSI/HtmlCSS-Completion#html-completion---extension-visual-studio-code'));
		vscode.env.openExternal(vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=0KLS0.htmlcss-completion'));
		vscode.window.showInformationMessage('Merci pour votre soutien !');
	});

	let openNotes = vscode.commands.registerCommand('html-completion.openNotesWindow', () => {
		const panel = vscode.window.createWebviewPanel(
			'notesPanel',
			'Bloc-notes',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
			}
		);

		panel.webview.html = getWebViewContent(panel);

		panel.webview.onDidReceiveMessage(message => {
			if (message.command === 'saveNote') {
				const noteContent = message.note;
				vscode.window.showSaveDialog({ filters: { 'Text Files': ['txt'] } }).then(fileUri => {
					if (fileUri) {
						const fs = require('fs');
						fs.writeFileSync(fileUri.fsPath, noteContent);
						vscode.window.showInformationMessage(`Note enregistrée sous ${fileUri.fsPath}`);
					}
				});
			}
		});
	});

	context.subscriptions.push(insertion);
	context.subscriptions.push(validateur);
	context.subscriptions.push(github);
	context.subscriptions.push(openNotes);
}

export function deactivate() {}

function getWebViewContent(panel: vscode.WebviewPanel) {
	const vscodeSettings = vscode.workspace.getConfiguration('workbench');
	const isDarkTheme = vscodeSettings.get('colorTheme') === 'Dark+ (default)';

	// HTML content for the webview
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Bloc-notes</title>
		<style>
			body {
				background-color: ${isDarkTheme ? '#333' : '#f5f5f5'};
				color: ${isDarkTheme ? 'white' : 'black'};
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100vh;
				font-family: poppins;
				font-weight: bold;
			}
	
			h1 {
				font-size: 24px;
				margin-bottom: 20px;
				text-transform: uppercase;
				font-family: arial;
			}
	
			#note-content {
				width: 100%;
				max-width: 600px;
				height: 200px;
				padding: 10px;
				border: 1px solid ${isDarkTheme ? '#777' : '#ccc'};
				border-radius: 5px;
				resize: none;
			}
	
			#save-button {
				background-color: ${isDarkTheme ? '#007ACC' : '#0099E5'};
				color: white;
				border: none;
				padding: 10px 20px;
				border-radius: 5px;
				cursor: pointer;
				font-size: 16px;
				margin-top: 10px;
			}
	
			#save-button:hover {
				background-color: ${isDarkTheme ? '#005F99' : '#007ACC'};
			}
	
			#save-button:active {
				background-color: ${isDarkTheme ? '#004C80' : '#0066B2'};
			}
		</style>
	</head>
	<body>
		<h1>Rédiger une note</h1>
		<textarea id="note-content" rows="10" cols="50"></textarea>
		<br>
		<button id="save-button">Enregistrer</button>
	
		<script>
			const vscode = acquireVsCodeApi();
	
			document.getElementById('save-button').addEventListener('click', () => {
				const noteContent = document.getElementById('note-content').value;
				vscode.postMessage({ command: 'saveNote', note: noteContent });
			});
		</script>
	</body>
	</html>
	`;
}