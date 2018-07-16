import { Disposable, Uri, workspace, languages, TextDocument, Position, CompletionItem, Range, CompletionItemKind } from "vscode";
import Tool from "./Tool";
import Notifier from "./Notifier";
import ScssVariable from "../entity/ScssVariable";

class Main {

  private static instance: Main;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Main();
    }
    return this.instance;
  }

  private tool = Tool.getInstance();
  private notifier = new Notifier('vue-scss-variable-scan.cache');
  private cache: boolean = false;
  private scssVariables: ScssVariable[] = [];

  private constructor () {}

  public getCache(): boolean {
    return this.cache;
  }

  public setCache(value: boolean) {
    this.cache = value;
  }

  public async createDisposables() {
    this.notifier.notify("eye", "Looking for CSS classes in the workspace...");
    const disposables: Disposable[] = [];
    const config = workspace.getConfiguration();
    const globalPath = config.get('vue-scss-variable-scan.globalPath');
    const globalExcludePath = config.get('vue-scss-variable-scan.globalExcludePath');
    const uris: Uri[] = await this.tool.findAllFileByPathAndExcPath(`${globalPath}`, `${globalExcludePath}`);
    if (!uris || uris.length === 0) {
      console.log('not find "scss" file');
      this.notifier.statusBarItem.hide();
      return disposables;
    }

    for(let i = 0;i < uris.length; i++) {
      const text = await this.tool.readeFile(uris[i].fsPath);
      const allLines: string[] = text.split('\n');
      for(let y = 0; y < allLines.length; y++) {
        const line = allLines[y];
        if (line === '' || !line.includes(';')) {
          continue;
        }
        const allValue = line.split(';');
        for (let z = 0; z < allValue.length; z++) {
          const value = allValue[z];
          if (value === '' || !value.includes(':')) {
            continue;
          }
          const key = value.split(':')[0].trim();
          if (key.startsWith('$')) {
            this.scssVariables.push(new ScssVariable(key, value.split(':')[1].trim()));
          }
        }
      }
    }
    console.log(this.scssVariables);
  }

  public registerCompletionItem (languageSelector: string, matchRegex: RegExp, classPrefix: string = "", splitChar: string = " ") {
    return languages.registerCompletionItemProvider({ scheme: 'file', language: languageSelector }, {
      provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
        const start = new Position(position.line, 0);
        const range: Range = new Range(start, position);
        const text: string = document.getText(range);

        const rawText: RegExpMatchArray | null = text.match(matchRegex);
        if (!rawText) {
          return [];
        }
        console.log(rawText);
        const test = new CompletionItem('asdf', CompletionItemKind.Variable);
        test.insertText = 'ab';
        test.filterText = 'ab';
        return [test,test,test,test,test,test];

      }
    }, '$');
  }

}

export default Main;