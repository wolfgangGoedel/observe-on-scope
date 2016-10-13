import { jsdom } from 'jsdom';

const document = jsdom(`
  <html>
    <head><title></title></head>
    <body></body>
  </html>
`);
  
const window = document.defaultView;
Object.assign(window, {
  mocha: {},
  beforeEach: beforeEach,
  afterEach: afterEach
})
const navigator = (<any>window).navigator = {};
const Node = (<any>window).Node;

void Object.assign(global, {
  document,
  window,
  navigator,
  Node
});

delete require.cache[require.resolve('angular')];
delete require.cache[require.resolve('angular/angular')];
delete require.cache[require.resolve('angular-mocks')];