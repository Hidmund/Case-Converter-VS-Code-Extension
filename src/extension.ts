import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "case-converter" is now active!');

    // Регистрируем команды
    const commands = [
        {
            name: 'case-converter.toUpperCase',
            action: (text: string) => text.toUpperCase()
        },
        {
            name: 'case-converter.toLowerCase',
            action: (text: string) => text.toLowerCase()
        },
        {
            name: 'case-converter.toCamelCase',
            action: toCamelCase
        },
        {
            name: 'case-converter.toSnakeCase',
            action: toSnakeCase
        },
        {
            name: 'case-converter.toKebabCase',
            action: (text: string) => toSnakeCase(text).replace(/_/g, '-')
        },
        {
            name: 'case-converter.toTitleCase',
            action: toTitleCase
        }
    ];

    commands.forEach(({ name, action }) => {
        let disposable = vscode.commands.registerCommand(name, () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active text editor found!');
                return;
            }

            const { document, selections } = editor;
            editor.edit(editBuilder => {
                selections.forEach(selection => {
                    const text = document.getText(selection);
                    if (text.trim()) {
                        const transformedText = action(text);
                        editBuilder.replace(selection, transformedText);
                    }
                });
            });
        });

        context.subscriptions.push(disposable);
    });
}

export function deactivate() {}

// Преобразование текста в snake_case
function toSnakeCase(text: string): string {
    return text
        .replace(/([a-z])([A-Z])/g, '$1_$2') // CamelCase → snake_case
        .replace(/\s+/g, '_')               // Пробелы → _
        .toLowerCase();                     // Всё в нижний регистр
}

function toCamelCase(text: string): string {
    return text
        .toLowerCase()
        .replace(/[_\s]+(.)/g, (_, char) => char.toUpperCase()) // _ или пробел + буква → заглавная буква
        .replace(/^(.)/, (_, char) => char.toUpperCase());      // Первая буква → заглавная
}

// Преобразование текста в Title Case (каждое слово с заглавной буквы)
function toTitleCase(text: string): string {
    return text
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}
