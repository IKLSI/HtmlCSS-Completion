// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "html-completion" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('html-completion.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Html-Completion!');
	});

	let insertion = vscode.commands.registerCommand('html-completion.insertion', async () => {
		// Demander à l'utilisateur de saisir le nombre d'éléments <li> à créer
		const numItems = await vscode.window.showInputBox({
			prompt: 'Combien d\'éléments <li> voulez-vous créer ?',
			placeHolder: 'Entrez un nombre'
		});
	
		if (numItems) {
			// Générer le code HTML avec le nombre spécifié de balises <li> avec indentation
			const indentation = '\t';  // Utilisez ici le caractère d'indentation souhaité
			const liItems = Array.from({ length: parseInt(numItems) }, () => `${indentation}<li>$1</li>`).join('\n');
	
			// Insérer le code HTML dans l'éditeur
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
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(insertion);
	context.subscriptions.push(validateur);
	context.subscriptions.push(github);
}

// This method is called when your extension is deactivated
export function deactivate() {}