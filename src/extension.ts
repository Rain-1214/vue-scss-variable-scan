'use strict';
import * as vscode from 'vscode';
import Main from './controller/Main';

const scssFileChange = vscode.workspace.createFileSystemWatcher('**/*.scss', false, false, false);

export async function activate(context: vscode.ExtensionContext) {
    const main = Main.getInstance();
    await main.scanScssVariable();
    main.createDisposables(context);
    
    const disposables: vscode.Disposable[] = [];
    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration("vue-scss-variable-scan.globalPath") ||
            e.affectsConfiguration("vue-scss-variable-scan.globalExcludePath")) {
                await main.scanScssVariable();
                await main.createDisposables(context);
            }
        if (e.affectsConfiguration("vue-scss-variable-scan.addCustomCssProperty")) {
            const newCssProperty = vscode.workspace.getConfiguration().get('vue-scss-variable-scan.addCustomCssProperty') as string[];
            main.checkCssProperty = [ ...newCssProperty, ...main.resourceCheckCssProperty ];
            await main.createDisposables(context);
        }
        if (e.affectsConfiguration("vue-scss-variable-scan.excludeCssProperty")) {
            const excludeCssProperty = vscode.workspace.getConfiguration().get('vue-scss-variable-scan.excludeCssProperty') as string[];
            main.checkCssProperty = main.resourceCheckCssProperty.filter(e => !excludeCssProperty.includes(e));
            await main.createDisposables(context);
        }
    }, null, disposables);

    scssFileChange.onDidCreate(async (e) => {
        await main.scanScssVariable();
    });

    scssFileChange.onDidChange(async (e) => {
        await main.scanScssVariable();
    });
    scssFileChange.onDidDelete(async (e) => {
        await main.scanScssVariable();
    });

    context.subscriptions.push(...disposables);

    context.subscriptions.push(vscode.commands.registerCommand("vue-scss-variable-scan.refresh", async () => {
        await main.scanScssVariable();
        main.createDisposables(context);
    }));


}

// this method is called when your extension is deactivated
export function deactivate() {
    scssFileChange.dispose();
}