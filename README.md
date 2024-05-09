# vscode-workspace-id

Discover how VSCode Workspace ID (hash) is calculated. This can be useful, for instance, when you need access workspace-specific logs of VSCode extensions.

## Build the project

```bash
npm ci
npm run build
```

## Configurable global variables

1. Select your environment using these variables in index.ts:
```ts
const isWindows = true;
const isLinux = false;
const isMacintosh = false;
```

2. Specify your folder URI you want to calculate VSCode Workspace ID for. To find examples of VSCode serialized URIs, check out `$USERPROFILE\AppData\Roaming\Code\User\globalStorage\storage.json`. Then edit this variable in index.ts:
```ts
const uriString = 'file:///c%3A/Workspace/0_Data/repos/tasklist-theia-glsp';
```

## Run the project

To launch step-by-step conversion of a serialized VSCode URI to Workspace ID hash:
```bash
npm start
```

To recompile and relaunch:
```bash
npm run restart
```
