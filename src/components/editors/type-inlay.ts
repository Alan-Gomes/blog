import type { Monaco } from '@monaco-editor/react';
import type monaco from 'monaco-editor';

const inlayMaxLength = 256;

export const createTypeInlayProvider = (monaco: Monaco) => {
	const provider: monaco.languages.InlayHintsProvider = {
		provideInlayHints: async (model, _, cancel) => {
			const text = model.getValue();
			const twoSlashRegex = /^\s*\/\/\s*\^\?$/gm;
			const debugRegex = /\w\s*=\s*Print\</gm;
			let match;
			const results: monaco.languages.InlayHint[] = [];
			const workerFactory = await monaco.languages.typescript.getTypeScriptWorker();
			const worker = await workerFactory();
			if (model.isDisposed()) {
				return {
					hints: [],
					dispose: () => {}
				};
			}

			async function getTypeAt(line: number, column: number, skip = 0) {
				const inspectionPos = new monaco.Position(line, column);
				const inspectionOff = model.getOffsetAt(inspectionPos);

				const hint = await worker.getQuickInfoAtPosition(
					'file:///' + model.uri.path,
					inspectionOff
				);
				if (!hint || !hint.displayParts) return undefined;

				let text: string = hint.displayParts
					.slice(skip)
					.map((d: any) => d.text)
					.join('')
					.replace(/\r?\n\s*/g, ' ');
				if (text.length > inlayMaxLength) text = text.slice(0, inlayMaxLength - 1) + '...';

				return text;
			}

			while ((match = twoSlashRegex.exec(text)) !== null) {
				const end = match.index + match[0].length - 1;
				const endPos = model.getPositionAt(end);

				if (cancel.isCancellationRequested) {
					return {
						hints: [],
						dispose: () => {}
					};
				}

				const type = await getTypeAt(endPos.lineNumber - 1, endPos.column);

				if (type) {
					results.push({
						// @ts-ignore
						kind: 0,
						position: new monaco.Position(endPos.lineNumber, endPos.column + 1),
						label: type,
						paddingLeft: true
					});
				}
			}

			while ((match = debugRegex.exec(text)) !== null) {
				const position = model.getPositionAt(match.index);

				if (cancel.isCancellationRequested) {
					return {
						hints: [],
						dispose: () => {}
					};
				}

				const type = await getTypeAt(position.lineNumber, position.column, 6);

				if (type) {
					const lineEnd = model.getLineLastNonWhitespaceColumn(position.lineNumber);
					results.push({
						// @ts-ignore
						kind: 0,
						position: new monaco.Position(position.lineNumber, lineEnd + 1),
						label: type,
						paddingLeft: true
					});
				}
			}

			return {
				hints: results,
				dispose: () => {}
			};
		}
	};
	return provider;
};
