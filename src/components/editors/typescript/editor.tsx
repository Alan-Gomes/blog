import { createTypeInlayProvider } from '@/components/editors/typescript/type-inlay';
import { Editor, Monaco, OnMount } from '@monaco-editor/react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import.meta.hot?.accept(() => location.reload());

interface TypescriptEditorProps {
	code: string;
}

const minHeight = 100;

let initialized = false;
async function initializeLanguage(monaco: Monaco) {
	if (initialized) {
		return;
	}
	initialized = true;

	const { typescriptDefaults } = monaco.languages.typescript;
	monaco.languages.registerInlayHintsProvider('typescript', createTypeInlayProvider(monaco));
	typescriptDefaults.setCompilerOptions({
		...typescriptDefaults.getCompilerOptions(),
		strict: true,
		isolatedModules: true
	});
	typescriptDefaults.addExtraLib(`
	  /** Utilitário para fazer debug de tipos no editor */
		type Print<T> = {
			[K in keyof T]: T[K];
		} & {};
	`);
}

const estimatedLineHeight = 19;

const clampHeight = (height: number) => Math.max(minHeight, height);

const estimateHeight = (code: string) => clampHeight(code.split('\n').length * estimatedLineHeight);

export function TypeScriptEditor({ code: initialCode }: TypescriptEditorProps) {
	const [code, setCode] = useState(initialCode);
	const [id] = useState(nanoid);
	const path = `/examples-${id}.ts`;
	const [height, setHeight] = useState(() => estimateHeight(code));

	const onMount: OnMount = (editor, monaco) => {
		initializeLanguage(monaco);

		const updateHeight = () =>
			setHeight(clampHeight(editor.getContentHeight() + estimatedLineHeight));

		updateHeight();

		editor.onDidContentSizeChange(() => updateHeight());
	};

	return (
		<div className="relative">
			{code !== initialCode && (
				<div className="absolute right-0 top-0 z-10 text-sm">
					<button onClick={() => setCode(initialCode)}>Reiniciar</button>
				</div>
			)}
			<Editor
				defaultLanguage="typescript"
				theme="vs-dark"
				value={code}
				onChange={(value) => setCode(value || '')}
				height={height}
				loading={<>Carregando exemplo...</>}
				path={path}
				options={{
					wordWrap: 'on',
					wrappingIndent: 'same',
					minimap: { enabled: false },
					lineNumbers: 'off',
					overviewRulerBorder: false,
					lineDecorationsWidth: 0,
					lineNumbersMinChars: 0,
					folding: false,
					scrollBeyondLastLine: false,
					hideCursorInOverviewRuler: true,
					quickSuggestions: false,
					tabSize: 2,
					renderLineHighlightOnlyWhenFocus: true,
					scrollbar: {
						vertical: 'hidden',
						alwaysConsumeMouseWheel: false
					}
				}}
				onMount={onMount}
			/>
		</div>
	);
}
