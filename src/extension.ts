'use strict';
import * as vscode from 'vscode';
import Main from './controller/Main';

export async function activate(context: vscode.ExtensionContext) {
    const main = Main.getInstance();
    try {
        main.setCache(true);
        await main.createDisposables();
        main.setCache(false);
    } catch (e) {
        console.log(e);
    }
    const registerFileTypeArray: string[] = [ 'vue', 'scss' ];
    for(let i = 0; i < registerFileTypeArray.length; i++) {
        context.subscriptions.push(main.registerCompletionItem(registerFileTypeArray[i], /\$[\s\S]*/));
    }
    // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}