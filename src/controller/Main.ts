import { Disposable, Uri, workspace, languages, TextDocument, Position, CompletionItem, Range, CompletionItemKind, ExtensionContext } from "vscode";
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
  private notifier = new Notifier('vue-scss-variable-scan.refresh');
  private scssVariables: ScssVariable[] = [];
  private supportFileType: string[] = ['vue', 'scss'];
  public resourceCheckCssProperty: string[] = [
    "background", "border", "color", "width", "height", "font-size","padding", "margin"
  ];
  public checkCssProperty: string[] = [
    "background", "border", "color", "width", "height", "font-size","padding", "margin"
  ];
  

  private constructor () {}

  public async scanScssVariable() {
    this.scssVariables = [];
    this.notifier.notify("eye", "Looking for CSS classes in the workspace...");
    const disposables: Disposable[] = [];
    const config = workspace.getConfiguration();
    const globalPath = config.get('vue-scss-variable-scan.globalPath');
    const globalExcludePath = config.get('vue-scss-variable-scan.globalExcludePath');
    const uris: Uri[] = await this.tool.findAllFileByPathAndExcPath(`${globalPath}`, `${globalExcludePath}`);
    if (!uris || uris.length === 0) {
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
    this.notifier.notify('eye', `Looking for scss variable completed and find ${this.scssVariables.length} variable`);
  }

  public createDisposables(context: ExtensionContext) {
    for(let i = 0; i < this.supportFileType.length; i++) {
      context.subscriptions.push(this.registerCompletionItem(this.supportFileType[i], /:([\s\S]*)/));
    }
  }

  public registerCompletionItem (languageSelector: string, matchRegex: RegExp, classPrefix: string = "", splitChar: string = " ") {
    const _this = this;
    return languages.registerCompletionItemProvider({ scheme: 'file', language: languageSelector }, {
      provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
          const start = new Position(position.line, 0);
          const range: Range = new Range(start, position);
          const text: string = document.getText(range);
  
          const rawText: RegExpMatchArray | null = text.match(matchRegex);
          if (!rawText) {
            return _this.tool.promiseFactory([]);
          }
          const cssProperty = text.split(':')[0].trim();
          if (_this.checkCssProperty.find(e => cssProperty.includes(e)) === undefined) {
            return _this.tool.promiseFactory([]);
          }
          const items = [];
          for(let i = 0; i < _this.scssVariables.length; i++) {
            const item = new CompletionItem(_this.scssVariables[i].variable, CompletionItemKind.Color);
            item.filterText = _this.scssVariables[i].variable;
            item.detail = _this.scssVariables[i].value;
            items.push(item);
          }
          return _this.tool.promiseFactory(items);
      }
    }, ":");
  }

}

export default Main;