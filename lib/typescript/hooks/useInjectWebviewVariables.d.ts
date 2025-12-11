import type { Flow, Manager, Spread, Theme, ePubCfi } from '../types';
import type { SourceType } from '../utils/enums/source-type.enum';
export declare function useInjectWebViewVariables(): {
    injectWebViewVariables: ({ jszip, epubjs, type, book, theme, enableSelection, locations, allowScriptedContent, allowPopups, manager, flow, snap, spread, fullsize, charactersPerLocation, }: {
        jszip: string;
        epubjs: string;
        type: SourceType;
        book: string;
        theme: Theme;
        enableSelection: boolean;
        locations?: ePubCfi[];
        allowScriptedContent?: boolean;
        allowPopups?: boolean;
        manager: Manager;
        flow: Flow;
        snap?: boolean;
        spread?: Spread;
        fullsize?: boolean;
        charactersPerLocation?: number;
    }) => string;
};
//# sourceMappingURL=useInjectWebviewVariables.d.ts.map