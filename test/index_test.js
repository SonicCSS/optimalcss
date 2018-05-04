import optimize from '../';
import { generateClassName } from '../lib/utils';
import expect from 'expect.js';

describe('multiply', () => {
    it('skips past classes that start with numbers', () => {
        expect(generateClassName(1)).to.eql(['a', 10]); // can skip single digit numbers
        expect(generateClassName(36)).to.eql(['a0', 360]); // 2 digit numbers
        expect(generateClassName(1296)).to.eql(['a00', 12960]); // can skip 3 digit numbers
        expect(generateClassName(46656)).to.eql(['a000', 466560]); // can skip 4 digit numbers
    });

    it('responds with correct declarations', () => {
        const cssString = `
            .foo {
                display: block;
                position: relative;
                background: #FFF;
                font-size: 16px;
            }

            .bar {
                height: 50px;
                width: 50px;
            }
        `;

        const htmlString = `
            <div class="foo">foo</div>
            <div class="bar">bar</div>
        `;
        
        const result = optimize(cssString, htmlString);

        expect(result.context.declarationMap).to.eql({
            'display:block': 'a',
            'position:relative': 'b',
            'background:#FFF': 'c',
            'font-size:16px': 'd',
            'height:50px': 'e',
            'width:50px': 'f'
        });
    });

    it('handles multiple selectors', () => {
        const cssString = `
            div.bang, span.boogie {
                color: red;
            }
        `;

        const htmlString = `
            <div class="bang"></div>
            <span class="boogie"></span>
        `;
        
        const result = optimize(cssString, htmlString);

        expect(result.context.selectorMap).to.have.property('div.bang');
        expect(result.context.selectorMap).to.have.property('span.boogie');
    });

    it('placeholder test', () => {
        const cssString = `
            .foo {
                display: block;
                position: relative;
                background: #FFF;
                font-size: 16px;
            }

            .test .bar,
            .foo .yaz {
                height: 1px;
                width: 1px;
            }

            .bar {
                height: 50px;
                width: 50px;
            }

            @media (min-width: 200px) and (max-width:480px) {
                header img {
                    margin: 0 auto;
                }
            }
        `;

        const htmlString = `
            <div>
                <span class="test">Hello, </span>
                <span>world.</span>
            </div>
        `;

        optimize(cssString, htmlString)
    });

//   it('returns the value of one number if the other is 1', () => {
//     strictEqual(multiply(1, 8), 8);
//     strictEqual(multiply(5, 1), 5);
//   });

//   it('is commutative', () => {
//     strictEqual(multiply(2, 4), multiply(4, 2));
//   });

//   it('returns the product of the two numbers', () => {
//     strictEqual(multiply(11, 9), 99);
//   });

//   it('handles negative numbers', () => {
//     strictEqual(multiply(-2, 2), -4);
//     strictEqual(multiply(2, -2), -4);
//     strictEqual(multiply(-2, -2), 4);
//   });
});
