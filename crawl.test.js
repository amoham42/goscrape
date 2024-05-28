const { normalizeURL, URLtoHTML } = require('./crawl.js');
const { test, expect } = require('@jest/globals');

test('normalizeURL', () => {
    const input = 'https://www.inStagram.com/stl/';
    const actual = normalizeURL(input);
    const expected = 'www.instagram.com/stl';
    expect(actual).toEqual(expected);
});

test('URLtoHTML absolute', () => {
    const input = `
    <html>
        <body>
            <a href="https://www.google.com">
                Google search
            </a>
        </body>
    </html>
    `;
    const baseURL = 'www.google.com';
    const actual = URLtoHTML(input, baseURL);
    const expected = ['https://www.google.com/'];
    expect(actual).toEqual(expected);
});

test('URLtoHTML relative', () => {
    const input = `
    <html>
        <body>
            <a href="/path/">
                Google search
            </a>
        </body>
    </html>
    `;
    const baseURL = 'https://www.google.com';
    const actual = URLtoHTML(input, baseURL);
    const expected = ['https://www.google.com/path/'];
    expect(actual).toEqual(expected);
});

test('URLtoHTML invalid', () => {
    const input = `
    <html>
        <body>
            <a href="invalid">
                INVALID
            </a>
        </body>
    </html>
    `;
    const baseURL = 'https://www.google.com';
    const actual = URLtoHTML(input, baseURL);
    const expected = [];
    expect(actual).toEqual(expected);
});


