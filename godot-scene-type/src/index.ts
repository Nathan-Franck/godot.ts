
import type tsModule from 'typescript/lib/tsserverlibrary';
import type ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function init(modules: { typescript: typeof ts }) {

  /**
   * Now the real deal - when a .blend file is imported, load in the .blend file using parseBlend.ts, and provide a extend Record<string, string> of objects and their parents
   */
  function create(info: ts.server.PluginCreateInfo) {
    // Diagnostic logging
    info.project.projectService.logger.info(
      "I'm getting set up now! Check the log for this message."
    );

    // Set up decorator object
    const languageServiceHost = {} as Partial<ts.LanguageServiceHost>;
    const languageServiceHostProxy = new Proxy(info.languageServiceHost, {
      get(target, key: keyof ts.LanguageServiceHost) {
        return languageServiceHost[key]
          ? languageServiceHost[key]
          : target[key];
      },
    });

    const supportedExtensions = [
      '.tscn',
      '.scn',
      '.glb',
      '.gltf',
    ];

    const typeFolderPath = ".godot/types";
    function resPathToFileString(path: string) {
      return path.slice(6) // Remove "res://"
    }
    const scriptPath = "godot-scene-type/cli-src/test.gd";
    const godotPath = "C:/Projects/Coding/godot/bin/godot.windows.editor.x86_64.exe";

    languageServiceHost.resolveModuleNameLiterals = (
      moduleNames,
      containingFile,
      redirectedReference,
      options,
      sourceFile,
      reusedNames
    ) => {
      return moduleNames.map(moduleName => {
        if (supportedExtensions.some(supportedExt => moduleName.text.endsWith(supportedExt))) {
          // if module starts with res:// we treat this differently
          const fromProjectRoot = moduleName.text.startsWith("res://")
            ? resPathToFileString(moduleName.text)
            : path.relative(
              info.project.getCurrentDirectory(),
              `${path.dirname(containingFile)}/${moduleName.text}`
            );
          const resolvedPath = `res://${fromProjectRoot}`;
          const command = `${godotPath} --headless --path "${info.project.getCurrentDirectory()
            }" --script "${scriptPath}" -- "${resolvedPath}" "${typeFolderPath}"`;
          info.project.projectService.logger.info(
            `Running command: ${command}`
          );
          execSync(command);

          const resolvedModule: ts.ResolvedModuleFull = {
            resolvedFileName: path.resolve(
              info.project.getCurrentDirectory(),
              typeFolderPath,
              fromProjectRoot + ".d.ts"
            ),
            extension: modules.typescript.Extension.Dts,
            isExternalLibraryImport: false,
          };
          info.project.projectService.logger.info(
            `Resolved module: ${JSON.stringify(resolvedModule)}`
          );
          return { resolvedModule };
        }

        // Fall back to the default behavior. (What I think is default?)
        const result = modules.typescript.resolveModuleName(moduleName.text, containingFile, options, languageServiceHostProxy);
        return { resolvedModule: result.resolvedModule };
      });
    };

    const languageService = modules.typescript.createLanguageService(
      languageServiceHostProxy,
    );

    return languageService;
  }

  return { create };
}

export = init;