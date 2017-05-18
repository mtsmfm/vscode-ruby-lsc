'use strict';

import * as vscode from 'vscode';
import { execFile } from 'mz/child_process';

import { LanguageClient, LanguageClientOptions } from 'vscode-languageclient';

export async function activate(context: vscode.ExtensionContext) {
    const conf = vscode.workspace.getConfiguration("ruby-lsc");
    let [command, ...args] = (<[string]>conf.get("commandWithArgs"));
    if (!command) {
        try {
            const uris = await vscode.workspace.findFiles("Gemfile");
            let rubyVersion = null;

            for (const uri of uris) {
                const doc = await vscode.workspace.openTextDocument(uri);
                const match = doc.getText().match(/ *ruby +['"](\d+\.\d+\.\d+)['"]/);
                if (match) {
                    rubyVersion = match[1];
                    break;
                }
            }

            const tag = rubyVersion ? `ruby-${rubyVersion}` : "latest";
            const image = `mtsmfm/language_server-ruby:${tag}`;

            vscode.window.withProgress({title: "ruby-lsc", location: vscode.ProgressLocation.Window}, async progress => {
                progress.report({message: `Pulling ${image}`});

                await execFile("docker", ["pull", image]);
            });

            command = "docker";
            args = ["run", "--rm", "-i", "-v", `${vscode.workspace.rootPath}:${vscode.workspace.rootPath}`, image];
        } catch (err) {
            if (err.code == "ENOENT") {
                const selected = await vscode.window.showErrorMessage(
                    'Docker executable not found. Install Docker or set ruby-lsc.commandWithArgs setting',
                    {modal: true},
                    'Open settings'
                );
                if (selected === 'Open settings') {
                    await vscode.commands.executeCommand('workbench.action.openWorkspaceSettings');
                }
            } else {
                vscode.window.showErrorMessage('Error execution Language Server via Docker: ' + err.message);
                console.error(err);
            }
        }
    }
    const clientOptions: LanguageClientOptions = {
        documentSelector: ['ruby'],
    };
    const disposable = new LanguageClient('Language Server Ruby', {command, args, options: {cwd: vscode.workspace.rootPath}}, clientOptions).start();

    context.subscriptions.push(disposable);
}
