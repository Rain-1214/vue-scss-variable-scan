import { StatusBarAlignment, window, StatusBarItem } from "vscode";

class Notifier {

  public statusBarItem: StatusBarItem;
  private timerId!: NodeJS.Timer;

  public constructor(command?: string, alignment?: StatusBarAlignment, priority?: number) {
    this.statusBarItem = window.createStatusBarItem(alignment, priority);
    this.statusBarItem.command = command;
    this.statusBarItem.show();
  }

  public notify(icon: string, text: string, autoHide: boolean = true) {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.statusBarItem.text = `$(${icon}) ${text}`;
    this.statusBarItem.tooltip = '';

    if (autoHide) {
      this.timerId = setTimeout(() => {
        this.statusBarItem.text = `$(${icon})`;
        this.statusBarItem.tooltip = `${text}`;
      }, 5000);
    }
  }

}

export default Notifier;
