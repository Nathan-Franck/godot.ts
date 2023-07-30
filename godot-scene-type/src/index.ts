
import type tsModule from 'typescript/lib/tsserverlibrary';
import type ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

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

    languageServiceHost.getScriptSnapshot = (fileName: string) => {
      if (fileName.endsWith('.tscn')) {
        return modules.typescript.ScriptSnapshot.fromString(`
declare const blend: { parseResult: "fail!" };
export = blend;
        `);
      }

      // Fall back to the default behavior.
      const result = info.languageServiceHost.getScriptSnapshot(fileName);
      return result;
    };

    languageServiceHost.resolveModuleNameLiterals = (
      moduleNames,
      containingFile,
      redirectedReference,
      options,
      sourceFile,
      reusedNames
    ) => {
      return moduleNames.map(moduleName => {
        if (moduleName.text.endsWith('.tscn')) {
          const resolvedModule: ts.ResolvedModuleFull = {
            resolvedFileName: path.resolve(
              path.dirname(containingFile),
              moduleName.text,
            ),
            extension: modules.typescript.Extension.Dts,
            isExternalLibraryImport: false,
          };
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