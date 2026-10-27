/*
 * React track. Same text conventions: ¶ = backtick, $_{ = ${ . Code is written in template literals.
 * Tests get: mount(element) → view {text, $, $$, getByText, click, type, rerender, unmount}, h = React.createElement, tick.
 */
(function () {
  const T = (name, fn) => ({ name, fn });
  const ids = (list) => list;

  (globalThis.REACT_PARTS = globalThis.REACT_PARTS || []).push(
    // ───────────────────────────────────────── 1
    {
      id: 'r-intro',
      title: 'What is React? Your First Component',
      time: '15 min',
      blocks: [
        { p: 'Websites are made of pieces: a menu, a button, a profile card, a list of comments. **React** is a JavaScript library that lets you build each piece **once** as a reusable **component**, then combine them like Lego bricks to build a whole app.' },
        { p: 'Facebook, Instagram, Netflix, Airbnb and thousands of others use it. If you know basic JavaScript (functions, arrays, objects), you are ready.' },
        { tip: 'New to JavaScript? Do the **JavaScript track** first — at least lessons 1–9. React is just JavaScript with a few extra ideas on top.' },
        { h: 'The big idea' },
        { p: 'In plain JavaScript you tell the page *how* to change step by step ("find this element, change its text…"). In React you describe *what the screen should look like* for the current data, and React updates the page for you.' },
        { list: ['**Component** = a JavaScript function that returns what to show.', '**JSX** = HTML-looking syntax you write inside JavaScript.', '**State** = data that changes over time (you will meet it in lesson 5).'] },
        { h: 'Your first component' },
        { p: 'A component is a function whose name **starts with a capital letter** and that returns JSX. Below, `render(<Hello />)` draws it in the preview box. (In a real project that line is a bit longer — see the end of this lesson.)' },
        { run: `function Hello() {
  return <h1>Hello from React!</h1>;
}

render(<Hello />);` },
        { p: 'Use a component like an HTML tag: `<Hello />`. Because it is reusable, you can use it as many times as you like:' },
        { run: `function Hello() {
  return <p>👋 Hello!</p>;
}

function App() {
  return (
    <div>
      <Hello />
      <Hello />
      <Hello />
    </div>
  );
}

render(<App />);` },
        { h: 'Components inside components' },
        { run: `function Avatar() {
  return <span style={{ fontSize: 40 }}>🧑‍💻</span>;
}

function ProfileCard() {
  return (
    <div style={{ border: "1px solid gray", padding: 12, borderRadius: 8 }}>
      <Avatar />
      <h3>Ada Lovelace</h3>
      <p>The first programmer</p>
    </div>
  );
}

render(<ProfileCard />);` },
        { warn: 'Component names **must** start with a capital letter. `<hello />` is treated as a plain HTML tag and shows nothing useful; `<Hello />` calls your function.' },
        { h: 'What a real project looks like' },
        { p: 'On your own computer you would create a project with a tool called **Vite**, and your entry file does the same job as `render` here:' },
        { code: `// terminal:  npm create vite@latest my-app -- --template react

// src/main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);

// src/App.jsx
export default function App() {
  return <h1>Hello from React!</h1>;
}` },
        { tip: 'In this course you can write `import` / `export` lines if you like — they are ignored, because React and its hooks are already available.' },
      ],
      quiz: [
        { q: 'What is a React component?', options: ['A CSS file', 'A function that returns JSX', 'A database', 'An HTML attribute'], answer: 1, why: 'Components are functions that describe a piece of UI.' },
        { q: 'Which component name is valid?', options: ['profileCard', 'ProfileCard', 'profile-card', '<ProfileCard>'], answer: 1, why: 'Component names start with a capital letter.' },
        { q: 'Why use components?', options: ['They are required by browsers', 'They let you reuse and combine pieces of UI', 'They make code slower', 'They replace JavaScript'], answer: 1, why: 'Build once, reuse everywhere.' },
      ],
      exercises: [
        {
          id: 'r1-1',
          title: 'Welcome component',
          prompt: 'Write a component called `Welcome` that returns an `<h1>` with the text **Welcome to React!**',
          starter: `function Welcome() {

}

render(<Welcome />);`,
          expose: ['Welcome'],
          hint: 'return <h1>Welcome to React!</h1>;',
          solution: `function Welcome() {
  return <h1>Welcome to React!</h1>;
}

render(<Welcome />);`,
          tests: [
            T('renders an <h1>', (e, { mount, h }) => {
              if (!mount(h(e.Welcome)).$('h1')) throw new Error('No <h1> found. Did you return one?');
            }),
            T('text is "Welcome to React!"', (e, { mount, h, expect }) => expect(mount(h(e.Welcome)).$('h1').textContent).toBe('Welcome to React!')),
          ],
        },
        {
          id: 'r1-2',
          title: 'Profile card',
          prompt: 'Write `ProfileCard` returning a `<div>` that contains an `<h2>` with **Ada Lovelace** and a `<p>` with **Mathematician**.',
          starter: `function ProfileCard() {

}

render(<ProfileCard />);`,
          expose: ['ProfileCard'],
          hint: 'Wrap both elements in one <div> — a component must return a single root element.',
          solution: `function ProfileCard() {
  return (
    <div>
      <h2>Ada Lovelace</h2>
      <p>Mathematician</p>
    </div>
  );
}

render(<ProfileCard />);`,
          tests: [
            T('has an <h2> "Ada Lovelace"', (e, { mount, h, expect }) => expect(mount(h(e.ProfileCard)).$('h2').textContent).toBe('Ada Lovelace')),
            T('has a <p> "Mathematician"', (e, { mount, h, expect }) => expect(mount(h(e.ProfileCard)).$('p').textContent).toBe('Mathematician')),
            T('everything is inside one <div>', (e, { mount, h, expect }) => {
              const v = mount(h(e.ProfileCard));
              expect(v.container.children.length).toBe(1);
              expect(v.container.firstChild.tagName).toBe('DIV');
            }),
          ],
        },
        {
          id: 'r1-3',
          title: 'Compose components',
          prompt: '`Header` and `Footer` already exist. Write `Page` so it returns one `<div>` containing, in order: `<Header />`, a `<main>` with the text **Content**, and `<Footer />`.',
          starter: `function Header() {
  return <header>My Site</header>;
}

function Footer() {
  return <footer>© 2026</footer>;
}

function Page() {

}

render(<Page />);`,
          expose: ['Page'],
          hint: 'return (<div><Header /><main>Content</main><Footer /></div>);',
          solution: `function Header() {
  return <header>My Site</header>;
}

function Footer() {
  return <footer>© 2026</footer>;
}

function Page() {
  return (
    <div>
      <Header />
      <main>Content</main>
      <Footer />
    </div>
  );
}

render(<Page />);`,
          tests: [
            T('contains header, main, footer in order', (e, { mount, h, expect }) => {
              const root = mount(h(e.Page)).container.firstChild;
              expect(Array.from(root.children).map((c) => c.tagName)).toEqual(['HEADER', 'MAIN', 'FOOTER']);
            }),
            T('main says "Content"', (e, { mount, h, expect }) => expect(mount(h(e.Page)).$('main').textContent).toBe('Content')),
            T('Header and Footer are used (not retyped)', (e, { code, expect }) => {
              expect(/<Header\s*\/>/.test(code)).toBe(true);
              expect(/<Footer\s*\/>/.test(code)).toBe(true);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 2
    {
      id: 'r-jsx',
      title: 'JSX: HTML Inside JavaScript',
      time: '15 min',
      blocks: [
        { p: 'JSX looks like HTML but it is really JavaScript in disguise. A tool turns `<h1>Hi</h1>` into a normal JavaScript function call before the browser sees it. That is why it has a few strict rules.' },
        { h: 'The 5 rules of JSX' },
        { list: ['**One root element.** A component returns a single parent. Need no extra wrapper? Use a Fragment: `<> … </>`.', '**Close every tag.** `<img />`, `<input />`, `<br />` (with the slash).', '**camelCase attributes.** `className` instead of `class`, `htmlFor` instead of `for`, `onClick` instead of `onclick`.', '**Curly braces `{ }` open a JavaScript window** inside the markup.', '**Styles are objects:** `style={{ color: "red", fontSize: 20 }}` (double braces = braces-for-JS + an object).'] },
        { h: 'Curly braces: JavaScript inside JSX' },
        { run: `const name = "Ada";
const price = 4;
const qty = 3;

function Demo() {
  return (
    <div>
      <h2>Hello, {name.toUpperCase()}!</h2>
      <p>2 + 3 = {2 + 3}</p>
      <p>Total: \${price * qty}</p>
      <p>{qty > 2 ? "Bulk order 🎉" : "Small order"}</p>
    </div>
  );
}

render(<Demo />);` },
        { p: 'Anything that gives a **value** (variables, maths, function calls, ternaries) works inside `{ }`. Statements like `if` or `for` do not — use a ternary or compute the value before the `return`.' },
        { h: 'Attributes' },
        { run: `function Form() {
  const isDisabled = true;
  return (
    <div>
      <label htmlFor="email">Email</label>{" "}
      <input id="email" type="email" placeholder="you@example.com" />
      <br /><br />
      <button className="primary" disabled={isDisabled}>Can't click me</button>
    </div>
  );
}

render(<Form />);` },
        { h: 'Inline styles' },
        { run: `function Box() {
  const style = {
    backgroundColor: "tomato",   // camelCase, not background-color
    color: "white",
    padding: 16,                 // numbers become px
    borderRadius: 8,
  };
  return <div style={style}>I am a styled box</div>;
}

render(<Box />);` },
        { h: 'Fragments: no extra wrapper' },
        { run: `function Pair() {
  return (
    <>
      <dt>React</dt>
      <dd>A library for building UIs</dd>
    </>
  );
}

render(<dl><Pair /></dl>);` },
        { warn: 'Forgot the root element? You will see an error like "Adjacent JSX elements must be wrapped in an enclosing tag". Wrap everything in a `<div>` or a Fragment `<>…</>`.' },
      ],
      quiz: [
        { q: 'How do you write the CSS class in JSX?', options: ['class="x"', 'className="x"', 'cssClass="x"', 'style="x"'], answer: 1, why: '"class" is a reserved word in JavaScript, so JSX uses className.' },
        { q: 'What does {2 + 3} render?', options: ['2 + 3', '5', 'Nothing', 'An error'], answer: 1, why: 'Curly braces evaluate the JavaScript expression.' },
        { q: 'Which is correct inline style?', options: ['style="color: red"', 'style={{ color: "red" }}', 'style={color: red}', 'style=(color: red)'], answer: 1, why: 'The outer braces open JS; the inner braces are the object.' },
        { q: 'What is <></> ?', options: ['A comment', 'A Fragment: a wrapper that adds no HTML element', 'An error', 'A loop'], answer: 1, why: 'Fragments group elements without extra DOM nodes.' },
      ],
      exercises: [
        {
          id: 'r2-1',
          title: 'Math in JSX',
          prompt: 'Write `Total` returning a `<p>` that shows `Total: $12` — but **calculate** it from the constants `price` (4) and `quantity` (3) inside curly braces, not by typing 12.',
          starter: `const price = 4;
const quantity = 3;

function Total() {

}

render(<Total />);`,
          expose: ['Total'],
          hint: 'The $ is plain text, then an expression:  <p>Total: ${price * quantity}</p>',
          solution: `const price = 4;
const quantity = 3;

function Total() {
  return <p>Total: \${price * quantity}</p>;
}

render(<Total />);`,
          tests: [
            T('shows "Total: $12"', (e, { mount, h, expect }) => expect(mount(h(e.Total)).$('p').textContent).toBe('Total: $12')),
            T('uses price * quantity (not a typed 12)', (e, { code, expect }) => expect(/\{\s*price\s*\*\s*quantity\s*\}/.test(code)).toBe(true)),
          ],
        },
        {
          id: 'r2-2',
          title: 'Inline style',
          prompt: 'Write `StyledBox` returning a `<div>` that says **Box**, with a tomato background (`backgroundColor: "tomato"`) and `padding: 20`.',
          starter: `function StyledBox() {

}

render(<StyledBox />);`,
          expose: ['StyledBox'],
          hint: '<div style={{ backgroundColor: "tomato", padding: 20 }}>Box</div>',
          solution: `function StyledBox() {
  return <div style={{ backgroundColor: "tomato", padding: 20 }}>Box</div>;
}

render(<StyledBox />);`,
          tests: [
            T('text is "Box"', (e, { mount, h, expect }) => expect(mount(h(e.StyledBox)).$('div').textContent).toBe('Box')),
            T('background is tomato', (e, { mount, h, expect }) => expect(mount(h(e.StyledBox)).$('div').style.backgroundColor).toBe('tomato')),
            T('padding is 20px', (e, { mount, h, expect }) => expect(mount(h(e.StyledBox)).$('div').style.padding).toBe('20px')),
          ],
        },
        {
          id: 'r2-3',
          title: 'Label + input with a Fragment',
          prompt: 'Write `EmailField` returning (with **no wrapper element**, use a Fragment) a `<label>` with text **Email** connected to an `<input>` via `htmlFor="email"` / `id="email"`, and the input has `type="email"`.',
          starter: `function EmailField() {

}

render(<EmailField />);`,
          expose: ['EmailField'],
          hint: '<>\n  <label htmlFor="email">Email</label>\n  <input id="email" type="email" />\n</>',
          solution: `function EmailField() {
  return (
    <>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
    </>
  );
}

render(<EmailField />);`,
          tests: [
            T('label says "Email" and has htmlFor="email"', (e, { mount, h, expect }) => {
              const l = mount(h(e.EmailField)).$('label');
              expect(l.textContent).toBe('Email');
              expect(l.htmlFor).toBe('email');
            }),
            T('input has id="email" and type="email"', (e, { mount, h, expect }) => {
              const i = mount(h(e.EmailField)).$('input');
              expect(i.id).toBe('email');
              expect(i.type).toBe('email');
            }),
            T('no wrapper element (label and input are top-level)', (e, { mount, h, expect }) => {
              const v = mount(h(e.EmailField));
              expect(Array.from(v.container.children).map((c) => c.tagName)).toEqual(['LABEL', 'INPUT']);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 3
    {
      id: 'r-props',
      title: 'Props: Customising Components',
      time: '20 min',
      blocks: [
        { p: 'A function that always returns the same thing is not very useful. **Props** (short for *properties*) are the inputs of a component — exactly like function arguments. They let one component produce many different results.' },
        { run: `function Greeting(props) {
  return <h2>Hello, {props.name}!</h2>;
}

render(
  <div>
    <Greeting name="Ada" />
    <Greeting name="Grace" />
    <Greeting name="Linus" />
  </div>
);` },
        { h: 'Destructuring: the cleaner way' },
        { p: 'Props always arrive as **one object**. Almost everyone pulls the values out right in the parameter list:' },
        { run: `function Greeting({ name, mood = "happy" }) {   // mood has a default value
  return <p>{name} is feeling {mood}.</p>;
}

render(
  <div>
    <Greeting name="Ada" mood="curious" />
    <Greeting name="Bob" />
  </div>
);` },
        { h: 'Passing different kinds of values' },
        { list: ['Strings can use quotes: `name="Ada"`.', 'Everything else needs braces: `age={36}`, `isAdmin={true}`, `tags={["a", "b"]}`, `user={{ name: "Ada" }}`, `onClick={handleClick}`.', '`<Button disabled />` is shorthand for `disabled={true}`.'] },
        { run: `function Product({ name, price, inStock }) {
  return (
    <div>
      <strong>{name}</strong> — \${price} {inStock ? "✅ in stock" : "❌ sold out"}
    </div>
  );
}

render(
  <div>
    <Product name="Keyboard" price={49} inStock={true} />
    <Product name="Mouse" price={19} inStock={false} />
  </div>
);` },
        { h: 'children: content between the tags' },
        { run: `function Card({ title, children }) {
  return (
    <div style={{ border: "2px solid steelblue", borderRadius: 8, padding: 12, margin: 8 }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

render(
  <Card title="Shopping list">
    <ul><li>Milk</li><li>Eggs</li></ul>
  </Card>
);` },
        { warn: 'Props are **read-only**. A component must never change its own props (`props.name = "x"` is a bug). If something needs to change over time, that is **state** — the next-but-one lesson.' },
      ],
      quiz: [
        { q: 'Props are most like…', options: ['Global variables', 'Function arguments', 'CSS classes', 'HTML comments'], answer: 1, why: 'They are the inputs you pass to a component.' },
        { q: 'How do you pass the number 5 as a prop called count?', options: ['count="5"', 'count={5}', 'count=5', 'count:5'], answer: 1, why: 'Non-string values go inside curly braces.' },
        { q: 'What does {children} hold?', options: ['The component\'s state', 'Whatever is placed between the opening and closing tags', 'A list of CSS', 'Nothing'], answer: 1, why: '<Card>…stuff…</Card> → stuff arrives as children.' },
      ],
      exercises: [
        {
          id: 'r3-1',
          title: 'Greeting with a prop',
          prompt: 'Write `Greeting` which takes a `name` prop and returns `<h1>Hello, NAME!</h1>`.',
          starter: `function Greeting({ name }) {

}

render(<Greeting name="Ada" />);`,
          expose: ['Greeting'],
          hint: 'return <h1>Hello, {name}!</h1>;',
          solution: `function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

render(<Greeting name="Ada" />);`,
          tests: [
            T('name="Ada"', (e, { mount, h, expect }) => expect(mount(h(e.Greeting, { name: 'Ada' })).$('h1').textContent).toBe('Hello, Ada!')),
            T('name="World"', (e, { mount, h, expect }) => expect(mount(h(e.Greeting, { name: 'World' })).$('h1').textContent).toBe('Hello, World!')),
          ],
        },
        {
          id: 'r3-2',
          title: 'Badge with a default prop',
          prompt: 'Write `Badge({ text, color })`: a `<span>` showing `text`, with `backgroundColor` set to `color`. If no `color` is given, it should be **"gray"**.',
          starter: `function Badge({ text, color }) {

}

render(<Badge text="New" color="green" />);`,
          expose: ['Badge'],
          hint: 'Give color a default in the parameter list:  { text, color = "gray" }',
          solution: `function Badge({ text, color = "gray" }) {
  return <span style={{ backgroundColor: color, color: "white", padding: "2px 8px" }}>{text}</span>;
}

render(<Badge text="New" color="green" />);`,
          tests: [
            T('shows the text', (e, { mount, h, expect }) => expect(mount(h(e.Badge, { text: 'New' })).$('span').textContent).toBe('New')),
            T('uses the color prop', (e, { mount, h, expect }) => expect(mount(h(e.Badge, { text: 'x', color: 'red' })).$('span').style.backgroundColor).toBe('red')),
            T('defaults to gray', (e, { mount, h, expect }) => expect(mount(h(e.Badge, { text: 'x' })).$('span').style.backgroundColor).toBe('gray')),
          ],
        },
        {
          id: 'r3-3',
          title: 'A Card that wraps content',
          prompt: 'Write `Card({ title, children })` returning a `<div className="card">` with an `<h3>` showing the title, followed by the `children`.',
          starter: `function Card({ title, children }) {

}

render(<Card title="Hi"><p>Some content</p></Card>);`,
          expose: ['Card'],
          hint: '<div className="card"><h3>{title}</h3>{children}</div>',
          solution: `function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

render(<Card title="Hi"><p>Some content</p></Card>);`,
          tests: [
            T('root has class "card"', (e, { mount, h, expect }) => expect(mount(h(e.Card, { title: 'T' })).container.firstChild.className).toBe('card')),
            T('shows the title in an <h3>', (e, { mount, h, expect }) => expect(mount(h(e.Card, { title: 'My title' })).$('h3').textContent).toBe('My title')),
            T('renders children inside the card', (e, { mount, h, expect }) => {
              const v = mount(h(e.Card, { title: 'T' }, h('p', null, 'inside')));
              expect(v.$('.card p').textContent).toBe('inside');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 4
    {
      id: 'r-lists',
      title: 'Lists & Conditional Rendering',
      time: '20 min',
      blocks: [
        { p: 'Real screens show lists (messages, products) and make decisions (show the login form **or** the dashboard). Both are done with plain JavaScript you already know: `map` and `if`/ternary.' },
        { h: 'Rendering a list with map' },
        { run: `function FruitList() {
  const fruits = ["Apple", "Banana", "Cherry"];
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}

render(<FruitList />);` },
        { h: 'The key prop' },
        { p: 'Each item in a list needs a **unique, stable `key`** so React can tell items apart when the list changes. Use an id from your data. Avoid the array index when items can be added, removed or reordered.' },
        { run: `function Users() {
  const users = [
    { id: 1, name: "Ada", online: true },
    { id: 2, name: "Bob", online: false },
  ];
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name} {u.online ? "🟢" : "⚪"}
        </li>
      ))}
    </ul>
  );
}

render(<Users />);` },
        { tip: 'Forget the key? The output panel will show a warning: *Each child in a list should have a unique "key" prop.* Try deleting `key={u.id}` above and press Run.' },
        { h: 'Conditional rendering' },
        { p: 'Three common patterns:' },
        { run: `function Status({ loggedIn, unread }) {
  // 1. ternary: pick one of two
  const label = loggedIn ? <b>Welcome back!</b> : <i>Please log in</i>;

  return (
    <div>
      {label}
      {/* 2. &&: show something or nothing */}
      {unread > 0 && <p>You have {unread} unread messages</p>}
    </div>
  );
}

function Maybe({ show }) {
  // 3. early return: render nothing at all
  if (!show) return null;
  return <p>Now you see me</p>;
}

render(
  <div>
    <Status loggedIn={true} unread={3} />
    <Status loggedIn={false} unread={0} />
    <Maybe show={false} />
    <Maybe show={true} />
  </div>
);` },
        { warn: 'Careful with `&&` and numbers: `{count && <p>…</p>}` prints a stray **0** when `count` is 0. Write `{count > 0 && <p>…</p>}` instead.' },
        { h: 'Filter then map' },
        { run: `function Adults() {
  const people = [
    { id: 1, name: "Ada", age: 36 },
    { id: 2, name: "Bo", age: 12 },
    { id: 3, name: "Cy", age: 25 },
  ];
  return (
    <ul>
      {people
        .filter((p) => p.age >= 18)
        .map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}

render(<Adults />);` },
      ],
      quiz: [
        { q: 'What is the key prop for?', options: ['Styling', 'Helping React identify each item in a list', 'Security', 'Sorting'], answer: 1, why: 'Keys let React track which items changed, moved or were removed.' },
        { q: 'What does a component return to render nothing?', options: ['undefined string', 'null', '0', 'false string'], answer: 1, why: 'Returning null renders nothing.' },
        { q: 'Which turns an array of strings into <li> elements?', options: ['forEach', 'map', 'reduce', 'sort'], answer: 1, why: 'map returns a new array of elements, which JSX can display.' },
      ],
      exercises: [
        {
          id: 'r4-1',
          title: 'Render a list',
          prompt: 'Write `FruitList({ fruits })` which shows a `<ul>` with one `<li>` per fruit. Give each `<li>` a `key`.',
          starter: `function FruitList({ fruits }) {

}

render(<FruitList fruits={["Apple", "Banana"]} />);`,
          expose: ['FruitList'],
          hint: '<ul>{fruits.map((f) => <li key={f}>{f}</li>)}</ul>',
          solution: `function FruitList({ fruits }) {
  return (
    <ul>
      {fruits.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  );
}

render(<FruitList fruits={["Apple", "Banana"]} />);`,
          tests: [
            T('one <li> per fruit', (e, { mount, h, expect }) => {
              const v = mount(h(e.FruitList, { fruits: ['a', 'b', 'c'] }));
              expect(v.$$('li').map((li) => li.textContent)).toEqual(['a', 'b', 'c']);
            }),
            T('empty list → no <li>', (e, { mount, h, expect }) => expect(mount(h(e.FruitList, { fruits: [] })).$$('li').length).toBe(0)),
            T('uses map and a key', (e, { code, expect }) => {
              expect(code.includes('.map(')).toBe(true);
              expect(code.includes('key=')).toBe(true);
            }),
          ],
        },
        {
          id: 'r4-2',
          title: 'Ternary: online status',
          prompt: 'Write `Status({ online })` returning a `<span>` that says **Online** when `online` is true and **Offline** otherwise.',
          starter: `function Status({ online }) {

}

render(<Status online={true} />);`,
          expose: ['Status'],
          hint: '<span>{online ? "Online" : "Offline"}</span>',
          solution: `function Status({ online }) {
  return <span>{online ? "Online" : "Offline"}</span>;
}

render(<Status online={true} />);`,
          tests: [
            T('online → "Online"', (e, { mount, h, expect }) => expect(mount(h(e.Status, { online: true })).$('span').textContent).toBe('Online')),
            T('offline → "Offline"', (e, { mount, h, expect }) => expect(mount(h(e.Status, { online: false })).$('span').textContent).toBe('Offline')),
          ],
        },
        {
          id: 'r4-3',
          title: 'Render nothing',
          prompt: 'Write `Notice({ message })`. If `message` is empty/missing render **nothing** (`null`); otherwise a `<p className="notice">` with the message.',
          starter: `function Notice({ message }) {

}

render(<Notice message="Saved!" />);`,
          expose: ['Notice'],
          hint: 'if (!message) return null;',
          solution: `function Notice({ message }) {
  if (!message) return null;
  return <p className="notice">{message}</p>;
}

render(<Notice message="Saved!" />);`,
          tests: [
            T('with a message', (e, { mount, h, expect }) => {
              const p = mount(h(e.Notice, { message: 'Saved!' })).$('p.notice');
              expect(p.textContent).toBe('Saved!');
            }),
            T('missing message renders nothing', (e, { mount, h, expect }) => expect(mount(h(e.Notice)).html()).toBe('')),
            T('empty string renders nothing', (e, { mount, h, expect }) => expect(mount(h(e.Notice, { message: '' })).html()).toBe('')),
          ],
        },
        {
          id: 'r4-4',
          title: 'Shopping cart',
          prompt: 'Write `Cart({ items })` where each item is `{ id, name, price }`.\n- No items → `<p>Your cart is empty</p>`\n- Otherwise a `<ul>` with `<li>` per item showing `name - $price`, then `<p>Total: $X</p>` (sum of prices).',
          starter: `function Cart({ items }) {

}

render(<Cart items={[{ id: 1, name: "Pen", price: 2 }, { id: 2, name: "Book", price: 10 }]} />);`,
          expose: ['Cart'],
          hint: 'Early-return the empty message. Total: items.reduce((sum, i) => sum + i.price, 0)',
          solution: `function Cart({ items }) {
  if (items.length === 0) return <p>Your cart is empty</p>;
  const total = items.reduce((sum, i) => sum + i.price, 0);
  return (
    <div>
      <ul>
        {items.map((i) => (
          <li key={i.id}>{i.name} - \${i.price}</li>
        ))}
      </ul>
      <p>Total: \${total}</p>
    </div>
  );
}

render(<Cart items={[{ id: 1, name: "Pen", price: 2 }, { id: 2, name: "Book", price: 10 }]} />);`,
          tests: [
            T('empty cart message', (e, { mount, h, expect }) => expect(mount(h(e.Cart, { items: [] })).text()).toBe('Your cart is empty')),
            T('lists each item as "name - $price"', (e, { mount, h, expect }) => {
              const v = mount(h(e.Cart, { items: [{ id: 1, name: 'Pen', price: 2 }, { id: 2, name: 'Book', price: 10 }] }));
              expect(v.$$('li').map((l) => l.textContent)).toEqual(['Pen - $2', 'Book - $10']);
            }),
            T('shows the total', (e, { mount, h, expect }) => {
              const v = mount(h(e.Cart, { items: [{ id: 1, name: 'Pen', price: 2 }, { id: 2, name: 'Book', price: 10 }] }));
              expect(v.$('p').textContent).toBe('Total: $12');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 5
    {
      id: 'r-state',
      title: 'State: Making Things Interactive',
      time: '25 min',
      blocks: [
        { p: 'So far our components always show the same thing. To react to clicks and typing, a component needs **memory**. That memory is called **state**, and you add it with the `useState` hook.' },
        { run: `function Counter() {
  const [count, setCount] = useState(0);   // start at 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

render(<Counter />);` },
        { p: 'Click the button in the preview — it works! Here is what happens:' },
        { list: ['`useState(0)` returns a pair: the **current value** (`count`) and a **setter** (`setCount`).', 'Calling `setCount(5)` tells React: "the value changed — **re-run this component** and update the screen".', 'On the next run, `count` is 5. The component function runs again from the top.'] },
        { warn: 'Never change state directly: `count = count + 1` or `count++` does nothing visible. Always call the setter: `setCount(count + 1)`.' },
        { h: 'Updating from the previous value' },
        { p: 'When the new value depends on the old one, pass a function. It is always safe:' },
        { run: `function Double() {
  const [n, setN] = useState(1);
  return (
    <div>
      <p>n = {n}</p>
      <button onClick={() => setN((prev) => prev * 2)}>Double</button>
      <button onClick={() => setN(1)}>Reset</button>
    </div>
  );
}

render(<Double />);` },
        { h: 'State can hold anything' },
        { run: `function Fancy() {
  const [on, setOn] = useState(false);          // boolean
  const [name, setName] = useState("Ada");      // string
  const [items, setItems] = useState([]);       // array

  return (
    <div>
      <button onClick={() => setOn(!on)}>{on ? "ON" : "OFF"}</button>
      <button onClick={() => setItems([...items, items.length + 1])}>Add item</button>
      <p>{name} has {items.length} items: {items.join(", ")}</p>
    </div>
  );
}

render(<Fancy />);` },
        { warn: 'For arrays and objects, **make a new copy** instead of changing the old one: `setItems([...items, newItem])`, never `items.push(newItem)`. React only notices changes when it gets a brand-new value.' },
        { h: 'The rules of hooks' },
        { list: ['Only call hooks (`useState`, `useEffect`…) at the **top level** of a component — not inside `if`, loops or nested functions.', 'Only call them inside components (or your own custom hooks, which start with `use`).', 'In a real project: `import { useState } from "react";`'] },
        { tip: 'Each component instance has its **own** state. Render `<Counter />` three times and you get three independent counters.' },
      ],
      quiz: [
        { q: 'What does useState(0) return?', options: ['Just the number 0', 'An array: [currentValue, setterFunction]', 'A component', 'A promise'], answer: 1, why: 'You destructure it: const [value, setValue] = useState(0).' },
        { q: 'What happens when you call the setter function?', options: ['Nothing', 'React re-runs the component with the new value', 'The page reloads', 'State is deleted'], answer: 1, why: 'The component re-renders so the screen matches the new state.' },
        { q: 'How should you add an item to an array in state?', options: ['items.push(x)', 'setItems([...items, x])', 'items = [x]', 'items[items.length] = x'], answer: 1, why: 'Create a new array; never mutate state.' },
      ],
      exercises: [
        {
          id: 'r5-1',
          title: 'Counter',
          prompt: 'Write `Counter`: a `<p>` showing **Count: 0** and a `<button>` with the text **+** that adds 1 each click.',
          starter: `function Counter() {

}

render(<Counter />);`,
          expose: ['Counter'],
          hint: 'const [count, setCount] = useState(0);\n<p>Count: {count}</p>\n<button onClick={() => setCount(count + 1)}>+</button>',
          solution: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

render(<Counter />);`,
          tests: [
            T('starts at "Count: 0"', (e, { mount, h, expect }) => expect(mount(h(e.Counter)).$('p').textContent).toBe('Count: 0')),
            T('clicking + three times → "Count: 3"', (e, { mount, h, expect }) => {
              const v = mount(h(e.Counter));
              v.click('+');
              v.click('+');
              v.click('+');
              expect(v.$('p').textContent).toBe('Count: 3');
            }),
          ],
        },
        {
          id: 'r5-2',
          title: 'ON / OFF toggle',
          prompt: 'Write `Toggle`: one `<button>` that shows **OFF** at first. Each click flips it between **OFF** and **ON**.',
          starter: `function Toggle() {

}

render(<Toggle />);`,
          expose: ['Toggle'],
          hint: 'const [on, setOn] = useState(false);\n<button onClick={() => setOn(!on)}>{on ? "ON" : "OFF"}</button>',
          solution: `function Toggle() {
  const [on, setOn] = useState(false);
  return <button onClick={() => setOn(!on)}>{on ? "ON" : "OFF"}</button>;
}

render(<Toggle />);`,
          tests: [
            T('starts as OFF', (e, { mount, h, expect }) => expect(mount(h(e.Toggle)).$('button').textContent).toBe('OFF')),
            T('click → ON, click → OFF', (e, { mount, h, expect }) => {
              const v = mount(h(e.Toggle));
              v.click('button');
              expect(v.$('button').textContent).toBe('ON');
              v.click('button');
              expect(v.$('button').textContent).toBe('OFF');
            }),
          ],
        },
        {
          id: 'r5-3',
          title: 'Score keeper',
          prompt: 'Write `Score`: shows `<p>Score: 0</p>` and three buttons: **+1**, **-1** and **Reset**. The score can **never go below 0**.',
          starter: `function Score() {

}

render(<Score />);`,
          expose: ['Score'],
          hint: 'Use the function form for the minus button:  setScore((s) => Math.max(0, s - 1))',
          solution: `function Score() {
  const [score, setScore] = useState(0);
  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={() => setScore((s) => s + 1)}>+1</button>
      <button onClick={() => setScore((s) => Math.max(0, s - 1))}>-1</button>
      <button onClick={() => setScore(0)}>Reset</button>
    </div>
  );
}

render(<Score />);`,
          tests: [
            T('starts at 0', (e, { mount, h, expect }) => expect(mount(h(e.Score)).$('p').textContent).toBe('Score: 0')),
            T('-1 at zero stays 0', (e, { mount, h, expect }) => {
              const v = mount(h(e.Score));
              v.click('-1');
              expect(v.$('p').textContent).toBe('Score: 0');
            }),
            T('+1 ×3 then -1 → 2', (e, { mount, h, expect }) => {
              const v = mount(h(e.Score));
              v.click('+1');
              v.click('+1');
              v.click('+1');
              v.click('-1');
              expect(v.$('p').textContent).toBe('Score: 2');
            }),
            T('Reset → 0', (e, { mount, h, expect }) => {
              const v = mount(h(e.Score));
              v.click('+1');
              v.click('Reset');
              expect(v.$('p').textContent).toBe('Score: 0');
            }),
          ],
        },
        {
          id: 'r5-4',
          title: 'State with an array',
          prompt: 'Write `ClickLog`: a button **Add** and an empty `<ul>`. Each click adds an `<li>` containing the next number: `1`, then `2`, then `3`…',
          starter: `function ClickLog() {

}

render(<ClickLog />);`,
          expose: ['ClickLog'],
          hint: 'const [items, setItems] = useState([]);\nonClick={() => setItems([...items, items.length + 1])}',
          solution: `function ClickLog() {
  const [items, setItems] = useState([]);
  return (
    <div>
      <button onClick={() => setItems([...items, items.length + 1])}>Add</button>
      <ul>
        {items.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

render(<ClickLog />);`,
          tests: [
            T('starts empty', (e, { mount, h, expect }) => expect(mount(h(e.ClickLog)).$$('li').length).toBe(0)),
            T('three clicks → 1, 2, 3', (e, { mount, h, expect }) => {
              const v = mount(h(e.ClickLog));
              v.click('Add');
              v.click('Add');
              v.click('Add');
              expect(v.$$('li').map((l) => l.textContent)).toEqual(['1', '2', '3']);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 6
    {
      id: 'r-forms',
      title: 'Events & Forms',
      time: '25 min',
      blocks: [
        { p: 'Users do things: click, type, submit, press keys. In React you attach a **handler function** to an event with props like `onClick`, `onChange`, `onSubmit`.' },
        { run: `function Buttons() {
  function handleClick() {
    alert("Button clicked!");
  }
  return (
    <div>
      <button onClick={handleClick}>Pass the function</button>
      <button onClick={() => alert("Hi!")}>Inline arrow</button>
    </div>
  );
}

render(<Buttons />);` },
        { warn: 'Pass the function, do not **call** it: `onClick={handleClick}` ✔ — `onClick={handleClick()}` ✘ (that runs it immediately while rendering).' },
        { h: 'Controlled inputs: React owns the text' },
        { p: 'The standard way to read what a user types: store the text in **state**, show it with `value`, update it with `onChange`. The input is then "controlled" by React.' },
        { run: `function Echo() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type something"
      />
      <p>You typed: {text}</p>
    </div>
  );
}

render(<Echo />);` },
        { p: '`event.target.value` is the text currently in the input. Every key press → `onChange` → `setText` → re-render. Because state is the single source of truth, you can easily validate, transform or clear the text.' },
        { h: 'Submitting a form' },
        { run: `function AddName() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();               // stop the browser reloading the page
    if (name.trim() === "") return;       // ignore empty input
    setNames([...names, name.trim()]);
    setName("");                          // clear the box
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <button type="submit">Add</button>
      <ul>{names.map((n, i) => <li key={i}>{n}</li>)}</ul>
    </form>
  );
}

render(<AddName />);` },
        { h: 'Other input types' },
        { run: `function Options() {
  const [agree, setAgree] = useState(false);
  const [color, setColor] = useState("red");

  return (
    <div>
      <label>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        I agree
      </label>
      <br />
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>
      <p>agree: {String(agree)}, color: {color}</p>
    </div>
  );
}

render(<Options />);` },
        { tip: 'Checkboxes use `checked` + `e.target.checked`. Text, select and textarea use `value` + `e.target.value`.' },
      ],
      quiz: [
        { q: 'Which is correct?', options: ['<button onClick={save()}>', '<button onClick={save}>', '<button onclick="save">', '<button click={save}>'], answer: 1, why: 'Pass the function; React calls it when the event happens.' },
        { q: 'Where is the typed text found inside onChange?', options: ['event.value', 'event.target.value', 'event.text', 'event.input'], answer: 1, why: 'event.target is the input element.' },
        { q: 'Why call event.preventDefault() in onSubmit?', options: ['To validate', 'To stop the browser from reloading the page', 'To clear state', 'It is optional decoration'], answer: 1, why: 'Without it the default form submit reloads the page and wipes your state.' },
      ],
      exercises: [
        {
          id: 'r6-1',
          title: 'Echo',
          prompt: 'Write `Echo`: a controlled `<input>` and a `<p>` that shows **You typed: ** followed by the current text.',
          starter: `function Echo() {

}

render(<Echo />);`,
          expose: ['Echo'],
          hint: 'const [text, setText] = useState("");\n<input value={text} onChange={(e) => setText(e.target.value)} />\n<p>You typed: {text}</p>',
          solution: `function Echo() {
  const [text, setText] = useState("");
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>You typed: {text}</p>
    </div>
  );
}

render(<Echo />);`,
          tests: [
            T('starts with "You typed: "', (e, { mount, h, expect }) => expect(mount(h(e.Echo)).$('p').textContent).toBe('You typed: ')),
            T('typing "hi" updates the text', (e, { mount, h, expect }) => {
              const v = mount(h(e.Echo));
              v.type('input', 'hi');
              expect(v.$('p').textContent).toBe('You typed: hi');
            }),
            T('input shows the typed value (controlled)', (e, { mount, h, expect }) => {
              const v = mount(h(e.Echo));
              v.type('input', 'abc');
              expect(v.$('input').value).toBe('abc');
            }),
          ],
        },
        {
          id: 'r6-2',
          title: 'Add names form',
          prompt: 'Write `NameForm`: a `<form>` with an `<input>` and a button **Add**. Submitting adds the (trimmed) name as an `<li>` in a list, **clears** the input, and ignores blank names.',
          starter: `function NameForm() {

}

render(<NameForm />);`,
          expose: ['NameForm'],
          hint: 'Two pieces of state: the current text and the array of names. In onSubmit: event.preventDefault(), check name.trim(), add, then setName("").',
          solution: `function NameForm() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    const clean = name.trim();
    if (clean === "") return;
    setNames([...names, clean]);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Add</button>
      <ul>
        {names.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </form>
  );
}

render(<NameForm />);`,
          tests: [
            T('adding a name creates an <li>', (e, { mount, h, expect }) => {
              const v = mount(h(e.NameForm));
              v.type('input', 'Ada');
              v.click('Add');
              expect(v.$$('li').map((l) => l.textContent)).toEqual(['Ada']);
            }),
            T('input is cleared after adding', (e, { mount, h, expect }) => {
              const v = mount(h(e.NameForm));
              v.type('input', 'Ada');
              v.click('Add');
              expect(v.$('input').value).toBe('');
            }),
            T('blank names are ignored', (e, { mount, h, expect }) => {
              const v = mount(h(e.NameForm));
              v.type('input', '   ');
              v.click('Add');
              expect(v.$$('li').length).toBe(0);
            }),
            T('several names in order', (e, { mount, h, expect }) => {
              const v = mount(h(e.NameForm));
              v.type('input', 'Ada');
              v.click('Add');
              v.type('input', 'Bob');
              v.click('Add');
              expect(v.$$('li').map((l) => l.textContent)).toEqual(['Ada', 'Bob']);
            }),
          ],
        },
        {
          id: 'r6-3',
          title: 'Two inputs',
          prompt: 'Write `FullName`: two inputs with placeholders **First** and **Last**, and a `<h2>` that always shows `Hello, First Last` (e.g. `Hello, Ada Lovelace`).',
          starter: `function FullName() {

}

render(<FullName />);`,
          expose: ['FullName'],
          hint: 'Two states: first and last. <input placeholder="First" value={first} onChange={…} />',
          solution: `function FullName() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  return (
    <div>
      <input placeholder="First" value={first} onChange={(e) => setFirst(e.target.value)} />
      <input placeholder="Last" value={last} onChange={(e) => setLast(e.target.value)} />
      <h2>Hello, {first} {last}</h2>
    </div>
  );
}

render(<FullName />);`,
          tests: [
            T('both inputs exist with the right placeholders', (e, { mount, h, expect }) => {
              const v = mount(h(e.FullName));
              expect(v.$('input[placeholder="First"]') !== null).toBe(true);
              expect(v.$('input[placeholder="Last"]') !== null).toBe(true);
            }),
            T('typing both names updates the heading', (e, { mount, h, expect }) => {
              const v = mount(h(e.FullName));
              v.type('input[placeholder="First"]', 'Ada');
              v.type('input[placeholder="Last"]', 'Lovelace');
              expect(v.$('h2').textContent).toBe('Hello, Ada Lovelace');
            }),
          ],
        },
        {
          id: 'r6-4',
          title: 'Character counter',
          prompt: 'Write `Limit`: a `<textarea>` and a `<p>` showing `N / 20` where N is the number of characters typed (starts at `0 / 20`).',
          starter: `function Limit() {

}

render(<Limit />);`,
          expose: ['Limit'],
          hint: 'text.length gives the character count.',
          solution: `function Limit() {
  const [text, setText] = useState("");
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <p>{text.length} / 20</p>
    </div>
  );
}

render(<Limit />);`,
          tests: [
            T('starts at "0 / 20"', (e, { mount, h, expect }) => expect(mount(h(e.Limit)).$('p').textContent).toBe('0 / 20')),
            T('typing "hello" → "5 / 20"', (e, { mount, h, expect }) => {
              const v = mount(h(e.Limit));
              v.type('textarea', 'hello');
              expect(v.$('p').textContent).toBe('5 / 20');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 7
    {
      id: 'r-composition',
      title: 'Sharing State Between Components',
      time: '20 min',
      blocks: [
        { p: 'Real apps are trees of components. A common question: "Component A changes something — how does Component B find out?" The React answer is simple and worth memorising:' },
        { tip: '**Data flows down (props). Events flow up (functions passed as props).**' },
        { h: 'Passing a function down' },
        { p: 'A child cannot change its parent\'s state directly. Instead the parent passes a **function** as a prop; the child calls it when something happens.' },
        { run: `function Child({ onAdd }) {
  return <button onClick={onAdd}>Add one</button>;
}

function Parent() {
  const [total, setTotal] = useState(0);

  return (
    <div>
      <p>Total: {total}</p>
      <Child onAdd={() => setTotal(total + 1)} />
    </div>
  );
}

render(<Parent />);` },
        { h: 'Lifting state up' },
        { p: 'When two sibling components need the **same** data, move the state to their closest common parent and pass it down to both.' },
        { run: `function SearchBox({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search fruit" />;
}

function Results({ query }) {
  const fruits = ["Apple", "Banana", "Grape", "Orange"];
  const shown = fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase()));
  return <ul>{shown.map((f) => <li key={f}>{f}</li>)}</ul>;
}

function FruitSearch() {
  const [query, setQuery] = useState("");   // lives in the parent
  return (
    <div>
      <SearchBox value={query} onChange={setQuery} />
      <Results query={query} />
    </div>
  );
}

render(<FruitSearch />);` },
        { h: 'Deriving values instead of storing them' },
        { p: 'Do not put something in state if you can **calculate** it from other state. In `FruitSearch`, `shown` is calculated every render — it is not state. Less state = fewer bugs.' },
        { warn: 'Where should state live? Put it in the **lowest component that needs it, or the lowest common parent** of the components that need it. Not higher.' },
      ],
      quiz: [
        { q: 'How does a child tell its parent something happened?', options: ['It edits the parent\'s state', 'It calls a function the parent passed in as a prop', 'It uses a global variable', 'It cannot'], answer: 1, why: 'Events flow up through callback props.' },
        { q: 'Two siblings need the same data. Where does the state go?', options: ['In each sibling', 'In their closest common parent', 'In a CSS file', 'In the browser URL only'], answer: 1, why: 'Lift state up to the common parent and pass it down.' },
        { q: 'Which should NOT be state?', options: ['The text in an input', 'A filtered list that can be computed from the full list and the query', 'A counter', 'Whether a menu is open'], answer: 1, why: 'Derived values are computed each render.' },
      ],
      exercises: [
        {
          id: 'r7-1',
          title: 'Parent listens to child',
          prompt: '`Child` is provided: it shows a **Ping** button and calls `onPing()` when clicked. Write `Parent` that keeps a counter in state, shows `<p>Pings: N</p>` (starting at 0) and passes a function to `Child` so each click increases N.',
          starter: `function Child({ onPing }) {
  return <button onClick={onPing}>Ping</button>;
}

function Parent() {

}

render(<Parent />);`,
          expose: ['Parent'],
          hint: 'const [pings, setPings] = useState(0);\n<Child onPing={() => setPings(pings + 1)} />',
          solution: `function Child({ onPing }) {
  return <button onClick={onPing}>Ping</button>;
}

function Parent() {
  const [pings, setPings] = useState(0);
  return (
    <div>
      <p>Pings: {pings}</p>
      <Child onPing={() => setPings(pings + 1)} />
    </div>
  );
}

render(<Parent />);`,
          tests: [
            T('starts at "Pings: 0"', (e, { mount, h, expect }) => expect(mount(h(e.Parent)).$('p').textContent).toBe('Pings: 0')),
            T('two clicks → "Pings: 2"', (e, { mount, h, expect }) => {
              const v = mount(h(e.Parent));
              v.click('Ping');
              v.click('Ping');
              expect(v.$('p').textContent).toBe('Pings: 2');
            }),
          ],
        },
        {
          id: 'r7-2',
          title: 'Filterable list',
          prompt: 'Write `FilterableList({ items })`: a text `<input>` plus a `<ul>` that shows only the items containing the typed text (ignore upper/lower case). With no text, all items are shown. Do **not** store the filtered list in state — calculate it.',
          starter: `function FilterableList({ items }) {

}

render(<FilterableList items={["apple", "banana", "grape"]} />);`,
          expose: ['FilterableList'],
          hint: 'const shown = items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));',
          solution: `function FilterableList({ items }) {
  const [query, setQuery] = useState("");
  const shown = items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {shown.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

render(<FilterableList items={["apple", "banana", "grape"]} />);`,
          tests: [
            T('shows everything at first', (e, { mount, h, expect }) => {
              const v = mount(h(e.FilterableList, { items: ['apple', 'banana', 'grape'] }));
              expect(v.$$('li').length).toBe(3);
            }),
            T('typing "ap" shows apple and grape', (e, { mount, h, expect }) => {
              const v = mount(h(e.FilterableList, { items: ['apple', 'banana', 'grape'] }));
              v.type('input', 'ap');
              expect(v.$$('li').map((l) => l.textContent)).toEqual(['apple', 'grape']);
            }),
            T('ignores case', (e, { mount, h, expect }) => {
              const v = mount(h(e.FilterableList, { items: ['Apple', 'Banana'] }));
              v.type('input', 'BAN');
              expect(v.$$('li').map((l) => l.textContent)).toEqual(['Banana']);
            }),
          ],
        },
        {
          id: 'r7-3',
          title: 'Tabs',
          prompt: 'Write `Tabs({ tabs })` where `tabs` is `[{ label, content }]`. Render one `<button>` per tab label and a `<p>` with the **active** tab\'s content. The first tab is active at first; clicking a button activates its tab.',
          starter: `function Tabs({ tabs }) {

}

render(<Tabs tabs={[{ label: "A", content: "Alpha" }, { label: "B", content: "Beta" }]} />);`,
          expose: ['Tabs'],
          hint: 'Keep the active INDEX in state: const [active, setActive] = useState(0); content: tabs[active].content',
          solution: `function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div>
        {tabs.map((t, i) => (
          <button key={t.label} onClick={() => setActive(i)}>{t.label}</button>
        ))}
      </div>
      <p>{tabs[active].content}</p>
    </div>
  );
}

render(<Tabs tabs={[{ label: "A", content: "Alpha" }, { label: "B", content: "Beta" }]} />);`,
          tests: [
            T('one button per tab', (e, { mount, h, expect }) => {
              const v = mount(h(e.Tabs, { tabs: [{ label: 'A', content: 'Alpha' }, { label: 'B', content: 'Beta' }] }));
              expect(v.$$('button').map((b) => b.textContent)).toEqual(['A', 'B']);
            }),
            T('first tab is active at first', (e, { mount, h, expect }) => {
              const v = mount(h(e.Tabs, { tabs: [{ label: 'A', content: 'Alpha' }, { label: 'B', content: 'Beta' }] }));
              expect(v.$('p').textContent).toBe('Alpha');
            }),
            T('clicking B shows Beta, clicking A shows Alpha again', (e, { mount, h, expect }) => {
              const v = mount(h(e.Tabs, { tabs: [{ label: 'A', content: 'Alpha' }, { label: 'B', content: 'Beta' }] }));
              v.click('B');
              expect(v.$('p').textContent).toBe('Beta');
              v.click('A');
              expect(v.$('p').textContent).toBe('Alpha');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 8
    {
      id: 'r-effects',
      title: 'Effects: Talking to the Outside World',
      time: '25 min',
      blocks: [
        { p: 'Rendering should be **pure**: given the same props and state, a component returns the same JSX. But apps also need to *do* things: load data, start a timer, change the page title, listen to the window. Those are **side effects**, and they go inside `useEffect`.' },
        { run: `function Title() {
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = name ? "Hi " + name : "Hello";   // runs AFTER the screen updates
  }, [name]);                                        // ...only when name changes

  return <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />;
}

render(<Title />);` },
        { h: 'The dependency array' },
        { list: ['`useEffect(fn)` — runs after **every** render (rarely what you want).', '`useEffect(fn, [])` — runs **once**, when the component first appears.', '`useEffect(fn, [a, b])` — runs when `a` or `b` change.'] },
        { p: 'Rule of thumb: list **every** prop or state variable that your effect uses.' },
        { h: 'Cleanup' },
        { p: 'If an effect starts something (a timer, a subscription), return a function that stops it. React calls it before the next run and when the component disappears.' },
        { run: `function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);        // cleanup: stop the timer
  }, []);

  return <p>Seconds since mounted: {seconds}</p>;
}

render(<Clock />);` },
        { h: 'Loading data' },
        { p: 'The classic pattern — three states: loading, success, error. Here a fake server (`fetchUser`) stands in for a real `fetch(url)`.' },
        { run: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (id > 0 ? resolve({ name: "User " + id }) : reject(new Error("bad id"))), 600);
  });
}

function Profile({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;                 // ignore answers that arrive too late
    setUser(null);
    setError(false);
    fetchUser(id)
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [id]);

  if (error) return <p>⚠️ Something went wrong</p>;
  if (!user) return <p>Loading…</p>;
  return <p>Hello, {user.name}!</p>;
}

render(
  <div>
    <Profile id={1} />
    <Profile id={0} />
  </div>
);` },
        { warn: 'Do not use an effect to compute something from props/state — just calculate it during render. And do not forget cleanup for timers and listeners, or they keep running after the component is gone.' },
        { tip: 'Real apps: `fetch("https://api.example.com/users/1").then(r => r.json())` replaces `fetchUser`. Libraries like TanStack Query wrap this pattern for you — learn the basics first.' },
      ],
      quiz: [
        { q: 'When does useEffect(fn, []) run?', options: ['Every render', 'Once, after the first render', 'Never', 'Only on click'], answer: 1, why: 'An empty dependency array means "no dependencies — run once".' },
        { q: 'What is the function returned from an effect for?', options: ['Cleanup (stopping timers, listeners)', 'Returning data', 'Styling', 'Errors'], answer: 0, why: 'React runs it before re-running the effect and when unmounting.' },
        { q: 'Which belongs in useEffect?', options: ['Adding two numbers for display', 'Starting a setInterval', 'Choosing a CSS colour', 'Mapping a list into <li>'], answer: 1, why: 'Timers, fetching and subscriptions are side effects.' },
      ],
      exercises: [
        {
          id: 'r8-1',
          title: 'Page title',
          prompt: 'Write `DocTitle({ title })` that renders `<h1>{title}</h1>` and, using `useEffect`, sets `document.title = title` whenever `title` changes.',
          starter: `function DocTitle({ title }) {

}

render(<DocTitle title="Hello" />);`,
          expose: ['DocTitle'],
          hint: 'useEffect(() => { document.title = title; }, [title]);',
          solution: `function DocTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <h1>{title}</h1>;
}

render(<DocTitle title="Hello" />);`,
          tests: [
            T('renders the heading', (e, { mount, h, expect }) => expect(mount(h(e.DocTitle, { title: 'Hi' })).$('h1').textContent).toBe('Hi')),
            T('sets document.title, and updates it', async (e, { mount, h, expect, tick }) => {
              const original = document.title;
              try {
                const v = mount(h(e.DocTitle, { title: 'First' }));
                await tick();
                expect(document.title).toBe('First');
                v.rerender(h(e.DocTitle, { title: 'Second' }));
                await tick();
                expect(document.title).toBe('Second');
              } finally {
                document.title = original;
              }
            }),
          ],
        },
        {
          id: 'r8-2',
          title: 'Timer with cleanup',
          prompt: 'Write `Timer({ ms = 1000 })`: shows `<p>Seconds: N</p>` starting at 0 and goes up by 1 every `ms` milliseconds, using `setInterval` inside `useEffect`. **Clean up** the interval.',
          starter: `function Timer({ ms = 1000 }) {

}

render(<Timer />);`,
          expose: ['Timer'],
          hint: 'useEffect(() => {\n  const id = setInterval(() => setSeconds((s) => s + 1), ms);\n  return () => clearInterval(id);\n}, [ms]);',
          solution: `function Timer({ ms = 1000 }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return <p>Seconds: {seconds}</p>;
}

render(<Timer />);`,
          tests: [
            T('starts at "Seconds: 0"', (e, { mount, h, expect }) => expect(mount(h(e.Timer, { ms: 20 })).$('p').textContent).toBe('Seconds: 0')),
            T('keeps counting', async (e, { mount, h, expect, tick }) => {
              const v = mount(h(e.Timer, { ms: 20 }));
              await tick(150);
              const n = Number(v.$('p').textContent.replace('Seconds: ', ''));
              expect(n >= 3).toBe(true);
              v.unmount();
            }),
            T('cleans up with clearInterval', (e, { code, expect }) => expect(code.includes('clearInterval')).toBe(true)),
          ],
        },
        {
          id: 'r8-3',
          title: 'Loading, success, error',
          prompt: '`fetchUser(id)` is a fake server call (provided). Write `UserName({ id })`:\n- while waiting: `<p>Loading...</p>`\n- on success: `<p>Hello, USER NAME</p>`\n- on failure: `<p>Something went wrong</p>`\n\nLoad in a `useEffect` that depends on `id`.',
          starter: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ name: "User " + id });
      else reject(new Error("bad id"));
    }, 10);
  });
}

function UserName({ id }) {

}

render(<UserName id={1} />);`,
          expose: ['UserName'],
          hint: 'Two states: user (null at first) and error (false). if (error) …; if (!user) return Loading…',
          solution: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ name: "User " + id });
      else reject(new Error("bad id"));
    }, 10);
  });
}

function UserName({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setUser(null);
    setError(false);
    fetchUser(id)
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [id]);

  if (error) return <p>Something went wrong</p>;
  if (!user) return <p>Loading...</p>;
  return <p>Hello, {user.name}</p>;
}

render(<UserName id={1} />);`,
          tests: [
            T('shows Loading... first', (e, { mount, h, expect }) => expect(mount(h(e.UserName, { id: 1 })).$('p').textContent).toBe('Loading...')),
            T('then the user name', async (e, { mount, h, expect, tick }) => {
              const v = mount(h(e.UserName, { id: 1 }));
              await tick(100);
              expect(v.$('p').textContent).toBe('Hello, User 1');
            }),
            T('shows an error for a bad id', async (e, { mount, h, expect, tick }) => {
              const v = mount(h(e.UserName, { id: 0 }));
              await tick(100);
              expect(v.$('p').textContent).toBe('Something went wrong');
            }),
            T('reloads when id changes', async (e, { mount, h, expect, tick }) => {
              const v = mount(h(e.UserName, { id: 1 }));
              await tick(100);
              v.rerender(h(e.UserName, { id: 2 }));
              await tick(100);
              expect(v.$('p').textContent).toBe('Hello, User 2');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 9
    {
      id: 'r-hooks',
      title: 'Refs & Custom Hooks',
      time: '20 min',
      blocks: [
        { h: 'useRef: a handle to a DOM element' },
        { p: 'Sometimes you must talk to the real HTML element: focus an input, play a video, measure a box. `useRef` gives you a box whose `.current` points at it.' },
        { run: `function FocusDemo() {
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef} placeholder="Click the button to focus me" />
      <button onClick={() => inputRef.current.focus()}>Focus the input</button>
    </div>
  );
}

render(<FocusDemo />);` },
        { p: 'A ref can also hold **any value that should survive re-renders without causing one** (like a counter for unique ids). Changing `ref.current` does *not* update the screen — state does.' },
        { h: 'Custom hooks: reuse logic' },
        { p: 'Components reuse **UI**. Custom hooks reuse **logic**. A custom hook is just a function whose name starts with `use` and that calls other hooks.' },
        { run: `// A reusable on/off switch
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle];
}

function LightSwitch() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? "💡 ON" : "⚫ OFF"}</button>;
}

function Spoiler() {
  const [open, toggle] = useToggle(false);   // same logic, different UI
  return (
    <div>
      <button onClick={toggle}>{open ? "Hide" : "Show"} secret</button>
      {open && <p>The cake is a lie.</p>}
    </div>
  );
}

render(<div><LightSwitch /><Spoiler /></div>);` },
        { p: 'Each component that calls `useToggle` gets its **own** separate state. The hook shares the *recipe*, not the data.' },
        { h: 'Other hooks you will meet' },
        { list: ['`useMemo` — remember an expensive calculation between renders.', '`useCallback` — remember a function so it keeps the same identity.', '`useContext` — read shared data (theme, logged-in user) without passing props through every level.', '`useReducer` — state with many related updates, written as a "reducer" function.'] },
        { tip: 'You do not need these yet. 90% of everyday React is `useState` + `useEffect` + props. Reach for the others when you actually feel the pain they solve.' },
      ],
      quiz: [
        { q: 'What is ref.current?', options: ['The previous state', 'The element (or value) the ref holds', 'A CSS class', 'A promise'], answer: 1, why: 'For a DOM ref, .current is the real element after it is rendered.' },
        { q: 'What must a custom hook\'s name start with?', options: ['get', 'hook', 'use', 'React'], answer: 2, why: 'The "use" prefix lets React (and linters) recognise hooks.' },
        { q: 'Do two components using the same custom hook share state?', options: ['Yes', 'No, each call gets its own state', 'Only siblings', 'Only if const'], answer: 1, why: 'Hooks share logic, not data.' },
      ],
      exercises: [
        {
          id: 'r9-1',
          title: 'Focus with a ref',
          prompt: 'Write `FocusInput`: an `<input>` and a button **Focus**. Clicking the button puts the cursor in the input using a **ref**.',
          starter: `function FocusInput() {

}

render(<FocusInput />);`,
          expose: ['FocusInput'],
          hint: 'const ref = useRef(null);\n<input ref={ref} />\n<button onClick={() => ref.current.focus()}>Focus</button>',
          solution: `function FocusInput() {
  const ref = useRef(null);
  return (
    <div>
      <input ref={ref} />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </div>
  );
}

render(<FocusInput />);`,
          tests: [
            T('clicking Focus focuses the input', (e, { mount, h, expect }) => {
              const v = mount(h(e.FocusInput));
              v.click('Focus');
              expect(document.activeElement === v.$('input')).toBe(true);
            }),
            T('uses useRef', (e, { code, expect }) => expect(code.includes('useRef')).toBe(true)),
          ],
        },
        {
          id: 'r9-2',
          title: 'useToggle hook',
          prompt: 'Write the custom hook `useToggle(initial = false)` returning `[value, toggle]`. `toggle()` flips the value between true and false.',
          starter: `function useToggle(initial = false) {

}

function Demo() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? "ON" : "OFF"}</button>;
}

render(<Demo />);`,
          expose: ['useToggle'],
          hint: 'const [value, setValue] = useState(initial);\nconst toggle = () => setValue((v) => !v);\nreturn [value, toggle];',
          solution: `function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

function Demo() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? "ON" : "OFF"}</button>;
}

render(<Demo />);`,
          tests: [
            T('starts false by default, toggles', (e, { mount, h, expect }) => {
              const Probe = () => {
                const [v, t] = e.useToggle();
                return h('button', { onClick: t }, String(v));
              };
              const view = mount(h(Probe));
              expect(view.$('button').textContent).toBe('false');
              view.click('button');
              expect(view.$('button').textContent).toBe('true');
              view.click('button');
              expect(view.$('button').textContent).toBe('false');
            }),
            T('respects the initial value', (e, { mount, h, expect }) => {
              const Probe = () => {
                const [v] = e.useToggle(true);
                return h('p', null, String(v));
              };
              expect(mount(h(Probe)).$('p').textContent).toBe('true');
            }),
          ],
        },
        {
          id: 'r9-3',
          title: 'useCounter hook',
          prompt: 'Write `useCounter(start = 0)` returning an **object** `{ count, inc, dec, reset }`. `inc` adds 1, `dec` subtracts 1, `reset` returns to `start`.',
          starter: `function useCounter(start = 0) {

}

function Demo() {
  const { count, inc, dec, reset } = useCounter(5);
  return (
    <div>
      <p>{count}</p>
      <button onClick={inc}>inc</button>
      <button onClick={dec}>dec</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

render(<Demo />);`,
          expose: ['useCounter'],
          hint: 'const [count, setCount] = useState(start);\nreturn { count, inc: () => setCount(c => c + 1), dec: …, reset: () => setCount(start) };',
          solution: `function useCounter(start = 0) {
  const [count, setCount] = useState(start);
  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);
  const reset = () => setCount(start);
  return { count, inc, dec, reset };
}

function Demo() {
  const { count, inc, dec, reset } = useCounter(5);
  return (
    <div>
      <p>{count}</p>
      <button onClick={inc}>inc</button>
      <button onClick={dec}>dec</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

render(<Demo />);`,
          tests: [
            T('inc / dec / reset work', (e, { mount, h, expect }) => {
              const Probe = ({ start }) => {
                const { count, inc, dec, reset } = e.useCounter(start);
                return h('div', null, h('p', null, String(count)), h('button', { onClick: inc }, 'inc'), h('button', { onClick: dec }, 'dec'), h('button', { onClick: reset }, 'reset'));
              };
              const v = mount(h(Probe, { start: 5 }));
              expect(v.$('p').textContent).toBe('5');
              v.click('inc');
              v.click('inc');
              expect(v.$('p').textContent).toBe('7');
              v.click('dec');
              expect(v.$('p').textContent).toBe('6');
              v.click('reset');
              expect(v.$('p').textContent).toBe('5');
            }),
            T('defaults to 0', (e, { mount, h, expect }) => {
              const Probe = () => h('p', null, String(e.useCounter().count));
              expect(mount(h(Probe)).$('p').textContent).toBe('0');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 10
    {
      id: 'r-project',
      title: 'Project: Todo App & What Next',
      time: '35 min',
      blocks: [
        { p: 'Time to combine everything — components, props, state, lists, forms, events — into the classic first React project: a **todo list**.' },
        { h: 'The plan' },
        { list: ['A form with a text input and an **Add** button.', 'The list of todos in state: `{ id, text, done }`.', 'Clicking a todo\'s text **toggles** it done (add class `done`, which is shown crossed out).', 'A **✕** button deletes it.', 'A footer showing how many are **left** (not done).'] },
        { h: 'Thinking in React' },
        { list: ['**Split the UI** into components (here: one is enough, but `TodoItem` would be a nice next step).', '**Decide what is state:** the input text, the list. "How many are left" is *derived* — calculated, not stored.', '**Write the update functions** — always creating new arrays: `map` to change one, `filter` to remove one, spread to add one.'] },
        { run: `// A taste of the techniques you'll need:
function Demo() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build a project", done: false },
  ]);

  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos(todos.filter((t) => t.id !== id));

  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>
          <span onClick={() => toggle(t.id)} style={{ cursor: "pointer", textDecoration: t.done ? "line-through" : "none" }}>
            {t.text}
          </span>{" "}
          <button onClick={() => remove(t.id)}>✕</button>
        </li>
      ))}
    </ul>
  );
}

render(<Demo />);` },
        { tip: 'Use `useRef(1)` for an id counter: `nextId.current++` gives you a fresh unique id every time. (`Date.now()` also works.)' },
      ],
      quiz: [
        { q: 'To change one todo in an array of state, you should…', options: ['todos[0].done = true', 'setTodos(todos.map(...)) returning a new array', 'todos.splice()', 'Delete state'], answer: 1, why: 'map creates a new array with the one changed item.' },
        { q: 'Is "number of unfinished todos" best stored in state?', options: ['Yes, always', 'No — derive it from the todos array', 'Only in a ref', 'Only in a prop'], answer: 1, why: 'Anything computable from existing state should be computed.' },
      ],
      exercises: [
        {
          id: 'r10-1',
          title: 'Build the Todo app',
          prompt: 'Write `TodoApp` following this exact structure so the tests can find things:\n\n- a `<form>` with `<input placeholder="Add a task">` and `<button type="submit">Add</button>`\n- submitting adds a todo (trimmed text), clears the input, ignores blank text\n- a `<ul>`; each todo is an `<li>` containing a `<span>` with the text and a `<button>` with **✕**\n- clicking the `<span>` toggles the class **done** on it\n- clicking **✕** removes that todo\n- a `<p>` at the bottom showing `N left` (number of todos that are not done)',
          starter: `function TodoApp() {

}

render(<TodoApp />);`,
          expose: ['TodoApp'],
          hint: 'State: text (string), todos (array of {id, text, done}), plus a useRef for ids. left = todos.filter(t => !t.done).length. Toggle with map, remove with filter.',
          solution: `function TodoApp() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const nextId = useRef(1);

  function add(event) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setTodos([...todos, { id: nextId.current++, text: clean, done: false }]);
    setText("");
  }

  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos(todos.filter((t) => t.id !== id));
  const left = todos.filter((t) => !t.done).length;

  return (
    <div>
      <form onSubmit={add}>
        <input placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <span className={t.done ? "done" : ""} onClick={() => toggle(t.id)}>{t.text}</span>
            <button onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p>{left} left</p>
    </div>
  );
}

render(<TodoApp />);`,
          tests: [
            T('starts empty: no items, "0 left"', (e, { mount, h, expect }) => {
              const v = mount(h(e.TodoApp));
              expect(v.$$('li').length).toBe(0);
              expect(v.$('p').textContent).toBe('0 left');
            }),
            T('adding two tasks shows two items and "2 left"', (e, { mount, h, expect }) => {
              const v = mount(h(e.TodoApp));
              v.type('input[placeholder="Add a task"]', 'Buy milk');
              v.click('Add');
              v.type('input[placeholder="Add a task"]', 'Walk dog');
              v.click('Add');
              expect(v.$$('li span').map((s) => s.textContent)).toEqual(['Buy milk', 'Walk dog']);
              expect(v.$('p').textContent).toBe('2 left');
            }),
            T('the input is cleared after adding', (e, { mount, h, expect }) => {
              const v = mount(h(e.TodoApp));
              v.type('input', 'Task');
              v.click('Add');
              expect(v.$('input').value).toBe('');
            }),
            T('blank text is ignored', (e, { mount, h, expect }) => {
              const v = mount(h(e.TodoApp));
              v.type('input', '   ');
              v.click('Add');
              expect(v.$$('li').length).toBe(0);
            }),
            T('clicking the text toggles class "done" and updates the count', (e, { mount, h, expect }) => {
              const v = mount(h(e.TodoApp));
              v.type('input', 'A');
              v.click('Add');
              v.type('input', 'B');
              v.click('Add');
              v.click(v.$$('li span')[0]);
              expect(v.$$('li span')[0].classList.contains('done')).toBe(true);
              expect(v.$('p').textContent).toBe('1 left');
              v.click(v.$$('li span')[0]);
              expect(v.$$('li span')[0].classList.contains('done')).toBe(false);
              expect(v.$('p').textContent).toBe('2 left');
            }),
            T('✕ removes only that todo', (e, { mount, h, expect }) => {
              const v = mount(h(e.TodoApp));
              v.type('input', 'A');
              v.click('Add');
              v.type('input', 'B');
              v.click('Add');
              v.click(v.$$('li button')[0]);
              expect(v.$$('li span').map((s) => s.textContent)).toEqual(['B']);
              expect(v.$('p').textContent).toBe('1 left');
            }),
          ],
        },
        {
          id: 'r10-2',
          title: 'Bonus: star rating',
          prompt: 'Write `StarRating({ max = 5 })`: shows `max` buttons. Each shows **★** if its position is at or below the current rating, else **☆**. Clicking the 3rd star sets the rating to 3. Below, `<p>Rating: N / max</p>` (starts at `0 / 5`).',
          starter: `function StarRating({ max = 5 }) {

}

render(<StarRating />);`,
          expose: ['StarRating'],
          hint: 'Array.from({ length: max }, (_, i) => i + 1) gives [1, 2, 3, 4, 5] to map over.',
          solution: `function StarRating({ max = 5 }) {
  const [rating, setRating] = useState(0);
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div>
      {stars.map((n) => (
        <button key={n} onClick={() => setRating(n)}>{n <= rating ? "★" : "☆"}</button>
      ))}
      <p>Rating: {rating} / {max}</p>
    </div>
  );
}

render(<StarRating />);`,
          tests: [
            T('five empty stars and "Rating: 0 / 5"', (e, { mount, h, expect }) => {
              const v = mount(h(e.StarRating));
              expect(v.$$('button').map((b) => b.textContent)).toEqual(['☆', '☆', '☆', '☆', '☆']);
              expect(v.$('p').textContent).toBe('Rating: 0 / 5');
            }),
            T('clicking the 3rd star → 3 filled', (e, { mount, h, expect }) => {
              const v = mount(h(e.StarRating));
              v.click(v.$$('button')[2]);
              expect(v.$$('button').map((b) => b.textContent)).toEqual(['★', '★', '★', '☆', '☆']);
              expect(v.$('p').textContent).toBe('Rating: 3 / 5');
            }),
            T('max prop changes the number of stars', (e, { mount, h, expect }) => expect(mount(h(e.StarRating, { max: 3 })).$$('button').length).toBe(3)),
          ],
        },
      ],
      outro: [
        { h: '🎓 You can build React apps now' },
        { p: 'Set up a real project on your computer:' },
        { code: `npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev        # opens http://localhost:5173` },
        { h: 'What to learn next' },
        { list: ['**React Router** — multiple pages (`/`, `/about`, `/users/42`).', '**Fetching data** with `fetch` + a library like TanStack Query.', '**Context & reducers** for app-wide state.', '**Styling:** CSS Modules or Tailwind CSS.', '**TypeScript** — catches bugs before you run the code.', '**Next.js** — React framework with routing and server rendering built in.', '**React Native** — use the same ideas to build phone apps. Pick it from the track menu next!'] },
      ],
    }
  );
})();
