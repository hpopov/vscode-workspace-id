import { createHash } from 'crypto';
import * as fs from 'fs';
import { promisify } from 'util';
import { URI } from 'vscode-uri';

const isWindows = true;
const isLinux = false;
const isMacintosh = false;
const uriString = 'file:///c%3A/Workspace/0_Data/repos/tasklist-theia-glsp';
const folderUri = URI.parse(uriString);


function stat(path: string): Promise<fs.Stats> {
    return promisify(fs.stat)(path);
}

async function getFolderId(): Promise<string | undefined> {

    console.log("Parsed folderUri", folderUri);
    // Remote: produce a hash from the entire URI
    if (folderUri.scheme !== 'file') {
        console.log("Folder URI scheme is not FILE!", folderUri.scheme);
        return createHash('md5').update(folderUri.toString()).digest('hex'); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
    }

    // Local: we use the ctime as extra salt to the
    // identifier so that folders getting recreated
    // result in a different identifier. However, if
    // the stat is not provided we return `undefined`
    // to ensure identifiers are stable for the given
    // URI.

    const folderStat = await stat(folderUri.fsPath);

    if (!folderStat) {
        return undefined;
    }

    console.log("Folder Stat", folderStat);

    let ctime: number | undefined;
    if (isLinux) {
        ctime = folderStat.ino; // Linux: birthtime is ctime, so we cannot use it! We use the ino instead!
    } else if (isMacintosh) {
        ctime = folderStat.birthtime.getTime(); // macOS: birthtime is fine to use as is
    } else if (isWindows) {
        if (typeof folderStat.birthtimeMs === 'number') {
            console.log("BirthtimeBs is number", folderStat.birthtimeMs)
            ctime = Math.floor(folderStat.birthtimeMs); // Windows: fix precision issue in node.js 8.x to get 7.x results (see https://github.com/nodejs/node/issues/19897)
        } else {
            ctime = folderStat.birthtime.getTime();
            console.log("BirthtimeBs is a date. Its time:", ctime)
        }
    }

    console.log("Computed ctime is", ctime, "String ctime", ctime ? String(ctime) : '');
    return createHash('md5').update(folderUri.fsPath).update(ctime ? String(ctime) : '').digest('hex'); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
}

getFolderId().then((folderID) => {
    console.log("VsCode Folder ID for", folderUri.fsPath, "is", folderID);
});