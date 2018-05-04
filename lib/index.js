// @flow
// import { availableDocumentFeatures } from 'jsdom/lib/jsdom/browser/documentfeatures';
import cssParser from 'css';
import { generateClassName } from './utils';
// var JSDOM = require('jsdom');

type Declaration = {
    type: string,
    property: string,
    value: string,
};

type Rule = {
    type: 'rule' | 'media',
    selectors: string[],
    declarations: Declaration[],
};

type ParsedAST = {
    stylesheet: {
        rules: Rule[],
        parsingErrors: boolean,
    }
};

type Dictionary<T> = { [string]: T };

type Context = {
    declarationMap: Dictionary<string>,
    selectorMap: Dictionary<string>,
    classIndex: number,
};

const defaultContext : Context = {
    declarationMap: {},
    selectorMap: {},
    classIndex: 10,
};

///
/// Creates a HashTable that maps the original CSS declarations to
/// the newly generated classes which will replace the original selectors/declarations.
///
function getDeclarationMap(delcarations: Declaration[], index: number) {
    const state = {
        declarationMap: {},
        classIndex: index,
    };

    return delcarations.reduce((state, declaration) => {
        const name = declaration.property + ':' + declaration.value;
        const [className, indexUsed] = generateClassName(state.classIndex);

        return {
            declarationMap: {
                ...state.declarationMap,
                [name]: className,
            },
            classIndex: indexUsed + 1,
        };
    }, state);
}

///
/// Creates a HashTable that maps the original selectors to the list of classes
/// which will replace the selectors.
///
function getSelectorMap(selectors: string[], classList: string, selectorMap: Dictionary<string>) : Dictionary<string> {
    return selectors.reduce((acc, selector) => {
        return {
            ...acc,
            [selector] : classList,
        };
    }, selectorMap);
}

export default (css : string, html: string, classesToExclude: ?string, context?: Context) => {
    const cssTree : ParsedAST = cssParser.parse(css);
    const currentContext = context || defaultContext;
    const responseCss = ''; // this will contain any css that should not be optimized
    const responseContent = ''; // this will contain the HTML (or render function) with classes replaced

    const responseContext = cssTree.stylesheet.rules.reduce((acc, rule) => {
        if (rule.type === 'rule') {
            const declarationMapForRule = getDeclarationMap(rule.declarations, acc.classIndex);
            const generatedClasses = Object.values(declarationMapForRule.declarationMap).join(' ');
            const selectorMapForRule = getSelectorMap(rule.selectors, generatedClasses, acc.selectorMap);

            return {
                declarationMap: {
                    ...acc.declarationMap,
                    ...declarationMapForRule.declarationMap,
                },
                selectorMap: {
                    ...acc.selectorMap,
                    ...selectorMapForRule,
                },
                classIndex: declarationMapForRule.classIndex,
            };
        }
        
        // this is where we would handle media queries (ie: @media small {})
        return acc;
    }, currentContext);

    return {
        css: responseCss,
        content: responseContent,
        context: responseContext,
    };
}