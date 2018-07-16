import { Uri, workspace } from "vscode";
import * as fs from "fs";

class Tool {

  private static instance: Tool;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Tool();
    }
    return this.instance;
  }

  private constructor() {}

  public async findAllFileByPathAndExcPath(path: string, excludePath: string): Promise<Uri[]> {
    if (!workspace.name || path === '') {
      return [];
    }
    return await workspace.findFiles(`${path}`, `${excludePath}`);
  }

  public async readeFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data.toString());
      });
    });
  }

}

export default Tool;
