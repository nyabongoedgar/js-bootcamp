/*
 * React Native track. Examples run in a simulated phone screen (see js/rn-shim.js).
 * Tests find things with data attributes: [data-rn="Text"], [data-rn="Pressable"], [data-rn="TextInput"] …
 */
(function () {
  const T = (name, fn) => ({ name, fn });
  const texts = (v) => v.$$('[data-rn="Text"]').map((n) => n.textContent);

  (globalThis.NATIVE_PARTS = globalThis.NATIVE_PARTS || []).push(
    // ───────────────────────────────────────── 1
    {
      id: 'n-intro',
      title: 'Welcome to React Native',
      time: '15 min',
      blocks: [
        { p: '**React Native** lets you build real **iPhone and Android apps** using JavaScript and React. You write components just like on the web — but instead of HTML elements they draw genuine native buttons, text and lists. One codebase, two platforms.' },
        { tip: 'You need the basics first: JavaScript (track 1) and React components, props and state (track 2, at least lessons 1–5). Everything here builds on them.' },
        { h: 'How this course runs your code' },
        { p: 'A phone cannot run inside a web page, so this course gives you a **phone simulator**: the screen on the right of each example. It supports the same components and props as real React Native (`View`, `Text`, `Pressable`, `TextInput`, `FlatList` …) so what you learn transfers directly. The last lesson shows how to run on your real phone with **Expo**.' },
        { warn: 'It is a simulation: layout and look are close to a real phone but not pixel-identical, and device features (camera, GPS, push notifications) are not available here.' },
        { h: 'Web vs native: the key differences' },
        { list: ['There is **no HTML**. No `div`, `span`, `p`, `h1`, `button`, `img`.', '`<View>` replaces `<div>` — a rectangle that holds other things.', '`<Text>` replaces every text tag. **All text must be inside `<Text>`.**', '`<Pressable onPress={…}>` replaces buttons / clickable things (`onPress`, not `onClick`).', 'There is **no CSS**. You style with JavaScript objects (`StyleSheet`).', 'Layout is always **Flexbox**, and the default direction is **column** (top to bottom).'] },
        { h: 'Your first app' },
        { run: `function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello, mobile world! 📱</Text>
    </View>
  );
}

render(<App />);`, },
        { p: 'In a real Expo project, this is the **whole file** `App.js` — with an import line at the top:' },
        { code: `import { View, Text } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello, mobile world!</Text>
    </View>
  );
}` },
        { h: 'Text goes in <Text>' },
        { run: `function App() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>My Profile</Text>
      <Text>Name: Ada</Text>
      <Text>
        Nested text can be <Text style={{ fontWeight: "bold" }}>bold</Text> or{" "}
        <Text style={{ color: "crimson" }}>coloured</Text>.
      </Text>
    </View>
  );
}

render(<App />);` },
        { warn: 'Writing bare text directly inside a `<View>` crashes a real app ("Text strings must be rendered within a <Text> component"). Always wrap it.' },
      ],
      quiz: [
        { q: 'Which component replaces <div>?', options: ['<Box>', '<View>', '<Text>', '<Div>'], answer: 1, why: 'View is the basic container in React Native.' },
        { q: 'Where must text be placed?', options: ['Directly in a View', 'Inside a <Text> component', 'In a <p>', 'Anywhere'], answer: 1, why: 'All text must be wrapped in <Text>.' },
        { q: 'What is the press event called?', options: ['onClick', 'onPress', 'onTap', 'onTouch'], answer: 1, why: 'Touchables use onPress.' },
        { q: 'What is the default flex direction in React Native?', options: ['row', 'column', 'depends on screen', 'none'], answer: 1, why: 'Column (top to bottom) — unlike the web where the default is row.' },
      ],
      exercises: [
        {
          id: 'n1-1',
          title: 'Hello, React Native',
          prompt: 'Write `App` returning a `<View>` that contains a `<Text>` saying **Hello, React Native!**',
          starter: `function App() {

}

render(<App />);`,
          expose: ['App'],
          hint: '<View><Text>Hello, React Native!</Text></View>',
          solution: `function App() {
  return (
    <View>
      <Text>Hello, React Native!</Text>
    </View>
  );
}

render(<App />);`,
          tests: [
            T('root is a View', (e, { mount, h, expect }) => expect(mount(h(e.App)).container.firstChild.getAttribute('data-rn')).toBe('View')),
            T('has a Text "Hello, React Native!"', (e, { mount, h, expect }) => expect(texts(mount(h(e.App)))).toEqual(['Hello, React Native!'])),
          ],
        },
        {
          id: 'n1-2',
          title: 'Two lines of text',
          prompt: 'Write `Profile` returning a `<View>` with two `<Text>` elements: **Ada Lovelace** and then **Mathematician**.',
          starter: `function Profile() {

}

render(<Profile />);`,
          expose: ['Profile'],
          hint: 'Two <Text> children inside one <View>.',
          solution: `function Profile() {
  return (
    <View>
      <Text>Ada Lovelace</Text>
      <Text>Mathematician</Text>
    </View>
  );
}

render(<Profile />);`,
          tests: [T('two Text elements in order', (e, { mount, h, expect }) => expect(texts(mount(h(e.Profile)))).toEqual(['Ada Lovelace', 'Mathematician']))],
        },
        {
          id: 'n1-3',
          title: 'Translate web → native',
          prompt: 'This card was written for the **web**. Convert it to React Native: replace `div` with `View`, and `h1` / `p` with `Text`. The words must stay the same ("Title" and "Body text").',
          starter: `function Card() {
  return (
    <div>
      <h1>Title</h1>
      <p>Body text</p>
    </div>
  );
}

render(<Card />);`,
          expose: ['Card'],
          hint: '<View>\n  <Text>Title</Text>\n  <Text>Body text</Text>\n</View>',
          solution: `function Card() {
  return (
    <View>
      <Text>Title</Text>
      <Text>Body text</Text>
    </View>
  );
}

render(<Card />);`,
          tests: [
            T('uses a View as the root', (e, { mount, h, expect }) => expect(mount(h(e.Card)).container.firstChild.getAttribute('data-rn')).toBe('View')),
            T('shows "Title" and "Body text" in <Text>', (e, { mount, h, expect }) => expect(texts(mount(h(e.Card)))).toEqual(['Title', 'Body text'])),
            T('no web tags left', (e, { code, expect }) => expect(/<(div|h1|p)[\s>]/.test(code)).toBe(false)),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 2
    {
      id: 'n-styling',
      title: 'Styling & Flexbox Layout',
      time: '25 min',
      blocks: [
        { p: 'There is no CSS in React Native. Styles are plain JavaScript **objects**, with camelCase names and numbers instead of units (numbers are device-independent pixels).' },
        { run: `function App() {
  return (
    <View style={{ padding: 20 }}>
      <View style={{ backgroundColor: "tomato", width: 120, height: 120, borderRadius: 16 }} />
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "navy", marginTop: 12 }}>
        Styled!
      </Text>
    </View>
  );
}

render(<App />);` },
        { h: 'StyleSheet.create' },
        { p: 'Real apps keep styles in one object at the bottom of the file. Same result, cleaner code, reusable names:' },
        { run: `function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <Text style={[styles.title, styles.red]}>Combine styles with an array</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  title: { fontSize: 22, fontWeight: "600" },
  red: { color: "crimson" },
});

render(<App />);` },
        { h: 'Flexbox: how everything is laid out' },
        { p: 'Every `View` is a **flex container**. Two axes matter:' },
        { list: ['`flexDirection` sets the **main axis**: `"column"` (default, top→bottom) or `"row"` (left→right).', '`justifyContent` positions children along the **main** axis: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`.', '`alignItems` positions children along the **cross** axis: `flex-start`, `center`, `flex-end`, `stretch` (default).', '`flex: 1` means "grow to fill all the free space". `flex: 2` takes twice as much as `flex: 1`.', '`gap` adds space between children.'] },
        { p: 'Change `flexDirection`, `justifyContent` and `alignItems` below and run again to *see* each effect:' },
        { run: `const box = (color) => ({ width: 50, height: 50, backgroundColor: color, borderRadius: 8 });

function App() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",          // try "column"
        justifyContent: "space-between", // try "center", "flex-end"
        alignItems: "center",          // try "flex-start", "flex-end"
        padding: 16,
      }}
    >
      <View style={box("tomato")} />
      <View style={box("gold")} />
      <View style={box("steelblue")} />
    </View>
  );
}

render(<App />);` },
        { run: `// flex: 1 shares the space in proportion
function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "lightcoral" }}><Text>flex: 1</Text></View>
      <View style={{ flex: 2, backgroundColor: "lightgreen" }}><Text>flex: 2</Text></View>
      <View style={{ height: 60, backgroundColor: "lightblue" }}><Text>fixed height: 60</Text></View>
    </View>
  );
}

render(<App />);` },
        { warn: 'Styles are **not inherited** by children (except text nested inside text). Setting `color` on a `View` does nothing to the `Text` inside it — style the `Text` itself.' },
        { tip: 'Spacing vocabulary: `padding` (inside), `margin` (outside), plus `paddingHorizontal`, `paddingVertical`, `marginTop`, etc.' },
      ],
      quiz: [
        { q: 'Which style makes children sit side by side?', options: ['flexDirection: "row"', 'display: "inline"', 'float: "left"', 'align: "side"'], answer: 0, why: 'Row direction lays children out horizontally.' },
        { q: 'justifyContent aligns children along…', options: ['The cross axis', 'The main axis', 'The z-axis', 'Text only'], answer: 1, why: 'justifyContent = main axis; alignItems = cross axis.' },
        { q: 'What does flex: 1 do?', options: ['Adds 1px', 'Fills the available space', 'Hides the view', 'Makes it square'], answer: 1, why: 'The view grows to take free space.' },
      ],
      exercises: [
        {
          id: 'n2-1',
          title: 'A rounded box',
          prompt: 'Write `Box` returning a `<View>` styled with `backgroundColor: "tomato"`, `width: 100`, `height: 100` and `borderRadius: 10`.',
          starter: `function Box() {

}

render(<Box />);`,
          expose: ['Box'],
          hint: '<View style={{ backgroundColor: "tomato", width: 100, height: 100, borderRadius: 10 }} />',
          solution: `function Box() {
  return <View style={{ backgroundColor: "tomato", width: 100, height: 100, borderRadius: 10 }} />;
}

render(<Box />);`,
          tests: [
            T('background, width, height', (e, { mount, h, expect }) => {
              const s = mount(h(e.Box)).container.firstChild.style;
              expect(s.backgroundColor).toBe('tomato');
              expect(s.width).toBe('100px');
              expect(s.height).toBe('100px');
            }),
            T('borderRadius is 10', (e, { mount, h, expect }) => expect(mount(h(e.Box)).container.firstChild.style.borderRadius).toBe('10px')),
          ],
        },
        {
          id: 'n2-2',
          title: 'Row of three',
          prompt: 'Write `Row` returning a parent `<View>` that lays **three** small child `<View>`s in a **row**, spread out with `justifyContent: "space-between"`.',
          starter: `function Row() {

}

render(<Row />);`,
          expose: ['Row'],
          hint: 'Parent style: { flexDirection: "row", justifyContent: "space-between" } and three child Views (give them width/height/backgroundColor so you can see them).',
          solution: `function Row() {
  const box = { width: 40, height: 40, backgroundColor: "steelblue" };
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={box} />
      <View style={box} />
      <View style={box} />
    </View>
  );
}

render(<Row />);`,
          tests: [
            T('parent is a row', (e, { mount, h, expect }) => expect(mount(h(e.Row)).container.firstChild.style.flexDirection).toBe('row')),
            T('space-between', (e, { mount, h, expect }) => expect(mount(h(e.Row)).container.firstChild.style.justifyContent).toBe('space-between')),
            T('three children', (e, { mount, h, expect }) => expect(mount(h(e.Row)).container.firstChild.children.length).toBe(3)),
          ],
        },
        {
          id: 'n2-3',
          title: 'Centre everything',
          prompt: 'Write `Centered`: a root `<View>` with `flex: 1`, `justifyContent: "center"` and `alignItems: "center"` containing `<Text>Centered</Text>`.',
          starter: `function Centered() {

}

render(<Centered />);`,
          expose: ['Centered'],
          hint: '<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>…</View>',
          solution: `function Centered() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Centered</Text>
    </View>
  );
}

render(<Centered />);`,
          tests: [
            T('flex, justifyContent and alignItems', (e, { mount, h, expect }) => {
              const s = mount(h(e.Centered)).container.firstChild.style;
              expect(s.flexGrow).toBe('1');
              expect(s.justifyContent).toBe('center');
              expect(s.alignItems).toBe('center');
            }),
            T('has the text "Centered"', (e, { mount, h, expect }) => expect(texts(mount(h(e.Centered)))).toEqual(['Centered'])),
          ],
        },
        {
          id: 'n2-4',
          title: 'StyleSheet title',
          prompt: 'Write `Title` returning `<Text>` with the words **Big title**. Create the style with `StyleSheet.create` — `fontSize: 24`, `fontWeight: "bold"`, `color: "navy"` — and apply it.',
          starter: `function Title() {

}

render(<Title />);`,
          expose: ['Title'],
          hint: 'const styles = StyleSheet.create({ title: { … } });\n<Text style={styles.title}>Big title</Text>',
          solution: `const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", color: "navy" },
});

function Title() {
  return <Text style={styles.title}>Big title</Text>;
}

render(<Title />);`,
          tests: [
            T('shows "Big title"', (e, { mount, h, expect }) => expect(texts(mount(h(e.Title)))).toEqual(['Big title'])),
            T('fontSize 24, bold, navy', (e, { mount, h, expect }) => {
              const s = mount(h(e.Title)).$('[data-rn="Text"]').style;
              expect(s.fontSize).toBe('24px');
              expect(s.fontWeight).toBe('bold');
              expect(s.color).toBe('navy');
            }),
            T('uses StyleSheet.create', (e, { code, expect }) => expect(code.includes('StyleSheet.create')).toBe(true)),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 3
    {
      id: 'n-state',
      title: 'Props & State on a Phone',
      time: '20 min',
      blocks: [
        { p: 'Good news: **props and state work exactly like in React.** `useState`, `useEffect`, passing props, lifting state up — all identical. Only the building blocks change (`View`/`Text` instead of `div`/`p`).' },
        { run: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.box}>
      <Text style={styles.count}>{count}</Text>
      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Tap me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  count: { fontSize: 56, fontWeight: "bold" },
  button: { backgroundColor: "#4c5fd5", paddingVertical: 12, paddingHorizontal: 28, borderRadius: 24 },
  buttonText: { color: "white", fontSize: 18 },
});

render(<Counter />);` },
        { p: '`Pressable` is the general-purpose "tap me" wrapper: anything inside it becomes tappable and `onPress` runs when the user taps.' },
        { h: 'Props, as usual' },
        { run: `function Badge({ label, color = "gray" }) {
  return (
    <View style={{ backgroundColor: color, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" }}>
      <Text style={{ color: "white" }}>{label}</Text>
    </View>
  );
}

function App() {
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Badge label="New" color="seagreen" />
      <Badge label="Sale" color="crimson" />
      <Badge label="Default" />
    </View>
  );
}

render(<App />);` },
        { h: 'Reacting to the press: style as a function' },
        { p: '`Pressable` lets `style` be a function that receives `{ pressed }` — perfect for press feedback:' },
        { run: `function App() {
  const [liked, setLiked] = useState(false);
  return (
    <View style={{ padding: 20 }}>
      <Pressable
        onPress={() => setLiked(!liked)}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#ddd" : "#f2f2f2",
          padding: 14,
          borderRadius: 10,
        })}
      >
        <Text style={{ fontSize: 18 }}>{liked ? "♥ Liked" : "♡ Like"}</Text>
      </Pressable>
    </View>
  );
}

render(<App />);` },
        { tip: 'Hold the mouse button down on the pill above to see the pressed colour.' },
      ],
      quiz: [
        { q: 'Does useState work in React Native?', options: ['No, native has its own state system', 'Yes, identical to React', 'Only in classes', 'Only on Android'], answer: 1, why: 'React Native is React — same hooks.' },
        { q: 'Which makes a custom tappable area?', options: ['<Pressable onPress={…}>', '<View onClick={…}>', '<a href>', '<Tap>'], answer: 0, why: 'Wrap content in Pressable and give it onPress.' },
      ],
      exercises: [
        {
          id: 'n3-1',
          title: 'Tap counter',
          prompt: 'Write `Counter`: a `<Text>` showing **Count: 0** and a `<Pressable>` containing `<Text>+</Text>`. Each tap adds 1.',
          starter: `function Counter() {

}

render(<Counter />);`,
          expose: ['Counter'],
          hint: 'const [count, setCount] = useState(0);\n<Pressable onPress={() => setCount(count + 1)}><Text>+</Text></Pressable>',
          solution: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text>Count: {count}</Text>
      <Pressable onPress={() => setCount(count + 1)}>
        <Text>+</Text>
      </Pressable>
    </View>
  );
}

render(<Counter />);`,
          tests: [
            T('starts at "Count: 0"', (e, { mount, h, expect }) => expect(texts(mount(h(e.Counter)))[0]).toBe('Count: 0')),
            T('three taps → "Count: 3"', (e, { mount, h, expect }) => {
              const v = mount(h(e.Counter));
              v.click('+');
              v.click('+');
              v.click('+');
              expect(texts(v)[0]).toBe('Count: 3');
            }),
            T('uses Pressable', (e, { code, expect }) => expect(code.includes('<Pressable')).toBe(true)),
          ],
        },
        {
          id: 'n3-2',
          title: 'Greeting with props',
          prompt: 'Write `Greeting({ name, excited = false })` showing `<Text>Hello, NAME</Text>`, with an **!** added at the end when `excited` is true (`Hello, Ada!`).',
          starter: `function Greeting({ name, excited = false }) {

}

render(<Greeting name="Ada" excited />);`,
          expose: ['Greeting'],
          hint: '<Text>Hello, {name}{excited ? "!" : ""}</Text>',
          solution: `function Greeting({ name, excited = false }) {
  return <Text>Hello, {name}{excited ? "!" : ""}</Text>;
}

render(<Greeting name="Ada" excited />);`,
          tests: [
            T('plain', (e, { mount, h, expect }) => expect(texts(mount(h(e.Greeting, { name: 'Ada' })))).toEqual(['Hello, Ada'])),
            T('excited', (e, { mount, h, expect }) => expect(texts(mount(h(e.Greeting, { name: 'Ada', excited: true })))).toEqual(['Hello, Ada!'])),
          ],
        },
        {
          id: 'n3-3',
          title: 'Like button',
          prompt: 'Write `LikeButton`: a `<Pressable>` containing a `<Text>` that shows **♡ Like**. Each tap switches between **♡ Like** and **♥ Liked**.',
          starter: `function LikeButton() {

}

render(<LikeButton />);`,
          expose: ['LikeButton'],
          hint: 'A boolean state: liked. Text shows liked ? "♥ Liked" : "♡ Like".',
          solution: `function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <Pressable onPress={() => setLiked(!liked)}>
      <Text>{liked ? "♥ Liked" : "♡ Like"}</Text>
    </Pressable>
  );
}

render(<LikeButton />);`,
          tests: [
            T('starts as "♡ Like"', (e, { mount, h, expect }) => expect(texts(mount(h(e.LikeButton)))).toEqual(['♡ Like'])),
            T('tap → liked, tap → unliked', (e, { mount, h, expect }) => {
              const v = mount(h(e.LikeButton));
              v.click('♡ Like');
              expect(texts(v)).toEqual(['♥ Liked']);
              v.click('♥ Liked');
              expect(texts(v)).toEqual(['♡ Like']);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 4
    {
      id: 'n-input',
      title: 'Touch & Input: Buttons, TextInput, Switch',
      time: '25 min',
      blocks: [
        { h: 'The touchables' },
        { run: `function App() {
  const [msg, setMsg] = useState("Tap something");
  return (
    <View style={{ padding: 20, gap: 14 }}>
      <Text style={{ fontSize: 18 }}>{msg}</Text>

      {/* Built-in platform button: simplest, least customisable */}
      <Button title="Built-in Button" onPress={() => setMsg("Button pressed")} />

      {/* Fades while pressed */}
      <TouchableOpacity onPress={() => setMsg("TouchableOpacity pressed")}>
        <Text style={{ color: "white", backgroundColor: "seagreen", padding: 12, textAlign: "center", borderRadius: 8 }}>
          TouchableOpacity
        </Text>
      </TouchableOpacity>

      {/* The modern, flexible one */}
      <Pressable
        onPress={() => setMsg("Pressable pressed")}
        onLongPress={() => setMsg("Long press! (right-click in this simulator)")}
        style={({ pressed }) => ({ backgroundColor: pressed ? "#c0392b" : "#e74c3c", padding: 12, borderRadius: 8 })}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Pressable</Text>
      </Pressable>
    </View>
  );
}

render(<App />);` },
        { h: 'TextInput: typing' },
        { p: '`TextInput` works like a controlled web input, but the handler is `onChangeText` — it gives you the **text itself**, not an event.' },
        { run: `function App() {
  const [name, setName] = useState("");

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 10, fontSize: 16 }}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />
      <Text style={{ fontSize: 20 }}>Hello, {name || "stranger"}!</Text>
    </View>
  );
}

render(<App />);` },
        { list: ['`placeholder`, `value`, `onChangeText` — the essentials.', '`secureTextEntry` hides the characters (passwords).', '`multiline` for several lines; `keyboardType="numeric"` / `"email-address"` choose the on-screen keyboard on a real phone.', '`onSubmitEditing` runs when the user presses the keyboard\'s return key.'] },
        { h: 'Switch' },
        { run: `function App() {
  const [enabled, setEnabled] = useState(false);
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Switch value={enabled} onValueChange={setEnabled} />
      <Text>Notifications are {enabled ? "ON" : "OFF"}</Text>
    </View>
  );
}

render(<App />);` },
        { h: 'A login form' },
        { run: `function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: "#aaa", padding: 10, borderRadius: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: "#aaa", padding: 10, borderRadius: 8 }} />
      <Button title="Log in" onPress={() => Alert.alert("Logging in", "as " + email)} />
    </View>
  );
}

render(<Login />);` },
      ],
      quiz: [
        { q: 'What does onChangeText receive?', options: ['An event object', 'The new text string', 'Nothing', 'The old text'], answer: 1, why: 'Unlike the web onChange, it gives you the text directly.' },
        { q: 'How do you hide typed characters?', options: ['password', 'secureTextEntry', 'hidden', 'type="password"'], answer: 1, why: 'secureTextEntry masks the input.' },
        { q: 'Which is the most flexible touchable?', options: ['Button', 'Pressable', 'Text', 'Switch'], answer: 1, why: 'Pressable can contain anything and styles itself by pressed state.' },
      ],
      exercises: [
        {
          id: 'n4-1',
          title: 'Name input',
          prompt: 'Write `NameInput`: a `TextInput` (placeholder **Your name**) and a `<Text>` that says `Hello, NAME!` — or `Hello, stranger!` while the input is empty.',
          starter: `function NameInput() {

}

render(<NameInput />);`,
          expose: ['NameInput'],
          hint: 'const [name, setName] = useState("");\n<TextInput value={name} onChangeText={setName} placeholder="Your name" />\n<Text>Hello, {name || "stranger"}!</Text>',
          solution: `function NameInput() {
  const [name, setName] = useState("");
  return (
    <View>
      <TextInput placeholder="Your name" value={name} onChangeText={setName} />
      <Text>Hello, {name || "stranger"}!</Text>
    </View>
  );
}

render(<NameInput />);`,
          tests: [
            T('placeholder is "Your name"', (e, { mount, h, expect }) => expect(mount(h(e.NameInput)).$('[data-rn="TextInput"]').placeholder).toBe('Your name')),
            T('empty → "Hello, stranger!"', (e, { mount, h, expect }) => expect(texts(mount(h(e.NameInput)))).toEqual(['Hello, stranger!'])),
            T('typing "Ada" → "Hello, Ada!"', (e, { mount, h, expect }) => {
              const v = mount(h(e.NameInput));
              v.type('[data-rn="TextInput"]', 'Ada');
              expect(texts(v)).toEqual(['Hello, Ada!']);
            }),
          ],
        },
        {
          id: 'n4-2',
          title: 'Dark mode switch',
          prompt: 'Write `DarkMode`: a `<Switch>` (off at first) and a `<Text>` reading **Dark mode: OFF** / **Dark mode: ON**, controlled by the switch.',
          starter: `function DarkMode() {

}

render(<DarkMode />);`,
          expose: ['DarkMode'],
          hint: '<Switch value={on} onValueChange={setOn} />',
          solution: `function DarkMode() {
  const [on, setOn] = useState(false);
  return (
    <View>
      <Switch value={on} onValueChange={setOn} />
      <Text>Dark mode: {on ? "ON" : "OFF"}</Text>
    </View>
  );
}

render(<DarkMode />);`,
          tests: [
            T('starts OFF', (e, { mount, h, expect }) => expect(texts(mount(h(e.DarkMode)))).toEqual(['Dark mode: OFF'])),
            T('flipping the switch → ON, and back', (e, { mount, h, expect }) => {
              const v = mount(h(e.DarkMode));
              v.click('[data-rn="Switch"]');
              expect(texts(v)).toEqual(['Dark mode: ON']);
              v.click('[data-rn="Switch"]');
              expect(texts(v)).toEqual(['Dark mode: OFF']);
            }),
          ],
        },
        {
          id: 'n4-3',
          title: 'Login form',
          prompt: 'Write `LoginForm({ onSubmit })`: two `TextInput`s (placeholders **Email** and **Password**, the password one with `secureTextEntry`) and a `<Button title="Log in" />` that calls `onSubmit({ email, password })`.',
          starter: `function LoginForm({ onSubmit }) {

}

render(<LoginForm onSubmit={(data) => console.log(data)} />);`,
          expose: ['LoginForm'],
          hint: 'Two states (email, password). Button onPress={() => onSubmit({ email, password })}.',
          solution: `function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Log in" onPress={() => onSubmit({ email, password })} />
    </View>
  );
}

render(<LoginForm onSubmit={(data) => console.log(data)} />);`,
          tests: [
            T('password field is masked', (e, { mount, h, expect }) => expect(mount(h(e.LoginForm, { onSubmit() {} })).$('[placeholder="Password"]').type).toBe('password')),
            T('email field is not masked', (e, { mount, h, expect }) => expect(mount(h(e.LoginForm, { onSubmit() {} })).$('[placeholder="Email"]').type).toBe('text')),
            T('pressing Log in sends the typed values', (e, { mount, h, expect }) => {
              let got = null;
              const v = mount(h(e.LoginForm, { onSubmit: (d) => (got = d) }));
              v.type('[placeholder="Email"]', 'a@b.com');
              v.type('[placeholder="Password"]', 'secret');
              v.click('Log in');
              expect(got).toEqual({ email: 'a@b.com', password: 'secret' });
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 5
    {
      id: 'n-lists',
      title: 'Lists: FlatList & ScrollView',
      time: '20 min',
      blocks: [
        { p: 'Phone screens are small, so content scrolls. Two tools:' },
        { list: ['**`ScrollView`** — a scrollable container. Great for a few things (a settings page, a form). It renders *all* children at once.', '**`FlatList`** — for long lists. On a real phone it renders only the rows near the screen, so 10,000 items stay fast. Use it for any list of data.'] },
        { run: `function App() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {Array.from({ length: 20 }, (_, i) => (
        <View key={i} style={{ backgroundColor: "#e8ecff", padding: 16, borderRadius: 10 }}>
          <Text>Row number {i + 1} — scroll me</Text>
        </View>
      ))}
    </ScrollView>
  );
}

render(<App />);` },
        { h: 'FlatList' },
        { p: 'Give it `data` (an array), and `renderItem` (a function that receives `{ item }` and returns what one row looks like). `keyExtractor` tells React the unique id.' },
        { run: `const CONTACTS = [
  { id: "1", name: "Ada Lovelace", phone: "555-0101" },
  { id: "2", name: "Grace Hopper", phone: "555-0102" },
  { id: "3", name: "Alan Turing", phone: "555-0103" },
  { id: "4", name: "Linus Torvalds", phone: "555-0104" },
];

function App() {
  return (
    <FlatList
      data={CONTACTS}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <View style={{ padding: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
          <Text style={{ color: "gray" }}>{item.phone}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#ddd" }} />}
      ListEmptyComponent={<Text>No contacts yet</Text>}
    />
  );
}

render(<App />);` },
        { list: ['`ItemSeparatorComponent` — drawn between rows.', '`ListEmptyComponent` — shown when `data` is empty.', '`ListHeaderComponent` / `ListFooterComponent` — above / below the rows.', '`horizontal` — scroll sideways.', 'If your data has an `id` (or `key`) field, `keyExtractor` is optional.'] },
        { warn: 'Never put a FlatList inside a ScrollView that scrolls the same direction — they fight over the gesture and the list loses its performance advantage.' },
        { h: 'Searching a list' },
        { run: `const FRUITS = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape"];

function App() {
  const [query, setQuery] = useState("");
  const shown = FRUITS.filter((f) => f.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 12, gap: 8 }}>
      <TextInput placeholder="Search…" value={query} onChangeText={setQuery}
        style={{ borderWidth: 1, borderColor: "#aaa", borderRadius: 8, padding: 10 }} />
      <FlatList data={shown} keyExtractor={(f) => f} renderItem={({ item }) => <Text style={{ padding: 8, fontSize: 18 }}>{item}</Text>} />
    </View>
  );
}

render(<App />);` },
      ],
      quiz: [
        { q: 'Which is best for a list of 5,000 messages?', options: ['ScrollView with map', 'FlatList', 'View', 'Text'], answer: 1, why: 'FlatList only renders what is visible.' },
        { q: 'What does renderItem receive?', options: ['The whole array', 'An object with { item, index }', 'A string', 'Nothing'], answer: 1, why: 'Destructure it: ({ item }) => …' },
        { q: 'How do you show something when the list is empty?', options: ['ListEmptyComponent', 'emptyText', 'onEmpty', 'ifEmpty'], answer: 0, why: 'ListEmptyComponent renders when data has no items.' },
      ],
      exercises: [
        {
          id: 'n5-1',
          title: 'Fruit list',
          prompt: 'Write `FruitList({ fruits })` using a `FlatList` that shows each fruit (a string) in its own `<Text>`.',
          starter: `function FruitList({ fruits }) {

}

render(<FruitList fruits={["Apple", "Banana", "Cherry"]} />);`,
          expose: ['FruitList'],
          hint: '<FlatList data={fruits} keyExtractor={(f) => f} renderItem={({ item }) => <Text>{item}</Text>} />',
          solution: `function FruitList({ fruits }) {
  return (
    <FlatList
      data={fruits}
      keyExtractor={(f) => f}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
}

render(<FruitList fruits={["Apple", "Banana", "Cherry"]} />);`,
          tests: [
            T('shows each fruit', (e, { mount, h, expect }) => expect(texts(mount(h(e.FruitList, { fruits: ['a', 'b', 'c'] })))).toEqual(['a', 'b', 'c'])),
            T('uses FlatList', (e, { code, expect }) => expect(code.includes('<FlatList')).toBe(true)),
          ],
        },
        {
          id: 'n5-2',
          title: 'Contact list with empty state',
          prompt: 'Write `ContactList({ contacts })`; contacts are `{ id, name, phone }`. Use a `FlatList`. Each row has the **name** in one `<Text>` and the **phone** in another. When there are no contacts show `<Text>No contacts yet</Text>` via `ListEmptyComponent`.',
          starter: `function ContactList({ contacts }) {

}

render(<ContactList contacts={[{ id: "1", name: "Ada", phone: "555-1" }]} />);`,
          expose: ['ContactList'],
          hint: '<FlatList data={contacts} keyExtractor={(c) => c.id} renderItem={({ item }) => (…two Texts…)} ListEmptyComponent={<Text>No contacts yet</Text>} />',
          solution: `function ContactList({ contacts }) {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.phone}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No contacts yet</Text>}
    />
  );
}

render(<ContactList contacts={[{ id: "1", name: "Ada", phone: "555-1" }]} />);`,
          tests: [
            T('name then phone for each contact', (e, { mount, h, expect }) =>
              expect(texts(mount(h(e.ContactList, { contacts: [{ id: '1', name: 'Ada', phone: '555-1' }, { id: '2', name: 'Bo', phone: '555-2' }] })))).toEqual(['Ada', '555-1', 'Bo', '555-2'])),
            T('empty → "No contacts yet"', (e, { mount, h, expect }) => expect(texts(mount(h(e.ContactList, { contacts: [] })))).toEqual(['No contacts yet'])),
          ],
        },
        {
          id: 'n5-3',
          title: 'Searchable list',
          prompt: 'Write `Searchable({ items })`: a `TextInput` (placeholder **Search**) above a `FlatList` showing only the items that contain the typed text (ignoring case).',
          starter: `function Searchable({ items }) {

}

render(<Searchable items={["Apple", "Banana", "Cherry"]} />);`,
          expose: ['Searchable'],
          hint: 'const shown = items.filter(i => i.toLowerCase().includes(query.toLowerCase()));',
          solution: `function Searchable({ items }) {
  const [query, setQuery] = useState("");
  const shown = items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));
  return (
    <View>
      <TextInput placeholder="Search" value={query} onChangeText={setQuery} />
      <FlatList data={shown} keyExtractor={(i) => i} renderItem={({ item }) => <Text>{item}</Text>} />
    </View>
  );
}

render(<Searchable items={["Apple", "Banana", "Cherry"]} />);`,
          tests: [
            T('shows all items at first', (e, { mount, h, expect }) => expect(texts(mount(h(e.Searchable, { items: ['Apple', 'Banana', 'Cherry'] })))).toEqual(['Apple', 'Banana', 'Cherry'])),
            T('typing "AN" shows only Banana', (e, { mount, h, expect }) => {
              const v = mount(h(e.Searchable, { items: ['Apple', 'Banana', 'Cherry'] }));
              v.type('[placeholder="Search"]', 'AN');
              expect(texts(v)).toEqual(['Banana']);
            }),
            T('no match → empty list', (e, { mount, h, expect }) => {
              const v = mount(h(e.Searchable, { items: ['Apple'] }));
              v.type('[placeholder="Search"]', 'zzz');
              expect(texts(v)).toEqual([]);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 6
    {
      id: 'n-extras',
      title: 'Images, Alerts, Loading & Platform',
      time: '20 min',
      blocks: [
        { h: 'Images' },
        { p: '`Image` needs a `source` and an explicit **width and height** (network images have no size until loaded). `resizeMode` controls how it fits: `cover` (fill, crop), `contain` (fit inside).' },
        { run: `function App() {
  return (
    <View style={{ padding: 20, alignItems: "center", gap: 12 }}>
      {/* On a real app: source={{ uri: "https://example.com/photo.jpg" }} */}
      <Image source={{ uri: SAMPLE_IMAGE }} style={{ width: 120, height: 120, borderRadius: 60 }} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Ada Lovelace</Text>
    </View>
  );
}

render(<App />);` },
        { tip: '`SAMPLE_IMAGE` is a picture built into this simulator so examples work offline. In a real app you would use a web address or a file from your project: `require("./assets/photo.png")`.' },
        { h: 'Alert: native popups' },
        { run: `function App() {
  function confirmDelete() {
    Alert.alert("Delete item?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => console.log("deleted") },
    ]);
  }
  return (
    <View style={{ padding: 20 }}>
      <Button title="Delete…" onPress={confirmDelete} />
    </View>
  );
}

render(<App />);` },
        { h: 'ActivityIndicator: a loading spinner' },
        { run: `function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {loading ? <ActivityIndicator size="large" /> : <Text style={{ textAlign: "center", fontSize: 20 }}>Loaded ✅</Text>}
    </View>
  );
}

render(<App />);` },
        { h: 'Platform differences & safe areas' },
        { p: 'iPhone and Android differ in small ways. `Platform` lets you adapt. `SafeAreaView` keeps content out of the notch and home bar.' },
        { run: `function App() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text>Running on: {Platform.OS}</Text>
      <Text style={{ fontSize: Platform.select({ ios: 18, android: 16, default: 17 }) }}>
        This font size depends on the platform.
      </Text>
    </SafeAreaView>
  );
}

render(<App />);` },
        { warn: 'In this simulator `Platform.OS` is always `"ios"`. On a real device you may get `"android"` — test both!' },
      ],
      quiz: [
        { q: 'Why must network Images have a width and height?', options: ['Style rule only', 'React Native cannot know the size until it loads', 'To make them blurry', 'No reason'], answer: 1, why: 'Without a size the image takes up no space.' },
        { q: 'What does Alert.alert show?', options: ['A web page', 'A native popup dialog', 'A console message', 'A tooltip'], answer: 1, why: 'It uses the phone\'s own alert dialog.' },
        { q: 'What is Platform.OS?', options: ['The user\'s name', '"ios" or "android"', 'The version of JS', 'Screen width'], answer: 1, why: 'It tells you which OS the app is running on.' },
      ],
      exercises: [
        {
          id: 'n6-1',
          title: 'Avatar',
          prompt: 'Write `Avatar({ uri, size = 64 })`: an `Image` with `source={{ uri }}`, `width` and `height` equal to `size`, and `borderRadius: size / 2` (a circle).',
          starter: `function Avatar({ uri, size = 64 }) {

}

render(<Avatar uri={SAMPLE_IMAGE} />);`,
          expose: ['Avatar'],
          hint: '<Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />',
          solution: `function Avatar({ uri, size = 64 }) {
  return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
}

render(<Avatar uri={SAMPLE_IMAGE} />);`,
          tests: [
            T('uses the uri', (e, { mount, h, expect }) => expect(mount(h(e.Avatar, { uri: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' })).$('img').getAttribute('src')).toBe('data:image/gif;base64,R0lGODlhAQABAAAAACw=')),
            T('default size is 64 and round', (e, { mount, h, expect }) => {
              const s = mount(h(e.Avatar, { uri: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' })).$('img').style;
              expect(s.width).toBe('64px');
              expect(s.height).toBe('64px');
              expect(s.borderRadius).toBe('32px');
            }),
            T('custom size 100 → radius 50', (e, { mount, h, expect }) => {
              const s = mount(h(e.Avatar, { uri: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', size: 100 })).$('img').style;
              expect(s.width).toBe('100px');
              expect(s.borderRadius).toBe('50px');
            }),
          ],
        },
        {
          id: 'n6-2',
          title: 'Confirm before deleting',
          prompt: 'Write `DeleteButton({ onConfirm })`: a `<Button title="Delete" />`. Pressing it calls `Alert.alert("Delete?", "Are you sure?", buttons)` where `buttons` is `[{ text: "Cancel" }, { text: "Yes", onPress: onConfirm }]`.',
          starter: `function DeleteButton({ onConfirm }) {

}

render(<DeleteButton onConfirm={() => console.log("deleted")} />);`,
          expose: ['DeleteButton'],
          hint: '<Button title="Delete" onPress={() => Alert.alert("Delete?", "Are you sure?", [{ text: "Cancel" }, { text: "Yes", onPress: onConfirm }])} />',
          solution: `function DeleteButton({ onConfirm }) {
  function ask() {
    Alert.alert("Delete?", "Are you sure?", [
      { text: "Cancel" },
      { text: "Yes", onPress: onConfirm },
    ]);
  }
  return <Button title="Delete" onPress={ask} />;
}

render(<DeleteButton onConfirm={() => console.log("deleted")} />);`,
          tests: [
            T('nothing happens until pressed', (e, { mount, h, expect, alerts }) => {
              mount(h(e.DeleteButton, { onConfirm() {} }));
              expect(alerts.length).toBe(0);
            }),
            T('pressing shows the alert with the right title and message', (e, { mount, h, expect, alerts }) => {
              const v = mount(h(e.DeleteButton, { onConfirm() {} }));
              v.click('Delete');
              expect(alerts.length).toBe(1);
              expect(alerts[0].title).toBe('Delete?');
              expect(alerts[0].message).toBe('Are you sure?');
            }),
            T('choosing "Yes" calls onConfirm', (e, { mount, h, expect, alerts }) => {
              let called = false;
              const v = mount(h(e.DeleteButton, { onConfirm: () => (called = true) }));
              v.click('Delete');
              const yes = alerts[alerts.length - 1].buttons.find((b) => b.text === 'Yes');
              yes.onPress();
              expect(called).toBe(true);
            }),
          ],
        },
        {
          id: 'n6-3',
          title: 'Loader',
          prompt: 'Write `Loader({ loading })`: while `loading` is true show an `<ActivityIndicator />`; otherwise show `<Text>Done</Text>`.',
          starter: `function Loader({ loading }) {

}

render(<Loader loading={true} />);`,
          expose: ['Loader'],
          hint: '{loading ? <ActivityIndicator /> : <Text>Done</Text>}',
          solution: `function Loader({ loading }) {
  return loading ? <ActivityIndicator /> : <Text>Done</Text>;
}

render(<Loader loading={true} />);`,
          tests: [
            T('loading → spinner, no text', (e, { mount, h, expect }) => {
              const v = mount(h(e.Loader, { loading: true }));
              expect(v.$('[data-rn="ActivityIndicator"]') !== null).toBe(true);
              expect(texts(v)).toEqual([]);
            }),
            T('not loading → "Done", no spinner', (e, { mount, h, expect }) => {
              const v = mount(h(e.Loader, { loading: false }));
              expect(v.$('[data-rn="ActivityIndicator"]')).toBe(null);
              expect(texts(v)).toEqual(['Done']);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 7
    {
      id: 'n-navigation',
      title: 'Navigation: Many Screens',
      time: '20 min',
      blocks: [
        { p: 'Apps have several **screens**: a list, a detail page, settings. Unlike websites there are no URLs to type — the app **navigates** between screens (push a new one on top; go back to pop it).' },
        { h: 'The idea, using plain state' },
        { p: 'At its heart, navigation is: "which screen is showing right now?" — which is just state! Try it:' },
        { run: `function Home({ onOpen }) {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Home</Text>
      <Button title="Open settings" onPress={onOpen} />
    </View>
  );
}

function Settings({ onBack }) {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Settings</Text>
      <Button title="← Back" onPress={onBack} />
    </View>
  );
}

function App() {
  const [screen, setScreen] = useState("home");
  if (screen === "settings") return <Settings onBack={() => setScreen("home")} />;
  return <Home onOpen={() => setScreen("settings")} />;
}

render(<App />);` },
        { h: 'Tab bar' },
        { run: `function App() {
  const [tab, setTab] = useState("feed");
  const tabs = ["feed", "search", "profile"];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 22 }}>{tab} screen</Text>
      </View>
      <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#ccc" }}>
        {tabs.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={{ flex: 1, padding: 14, alignItems: "center" }}>
            <Text style={{ fontWeight: tab === t ? "bold" : "normal", color: tab === t ? "#4c5fd5" : "gray" }}>{t}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

render(<App />);` },
        { h: 'The real thing: React Navigation' },
        { p: 'For production apps you use the **React Navigation** library (or Expo Router). It adds smooth animations, the iOS swipe-back gesture, headers, deep links and screen history. The shape is the same as what you just built:' },
        { code: `// npm install @react-navigation/native @react-navigation/native-stack
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home</Text>
      <Button title="Go to details" onPress={() => navigation.navigate("Details", { id: 7 })} />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  return (
    <View>
      <Text>Details for item {route.params.id}</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}` },
        { tip: 'Learn the state-based version first (it is what the exercises use) — then the library will feel like a natural upgrade, not magic.' },
      ],
      quiz: [
        { q: 'At its simplest, "which screen is shown" is…', options: ['A CSS rule', 'State', 'A file name', 'A prop of View'], answer: 1, why: 'Navigation = changing which screen state is active.' },
        { q: 'Which library is the standard for real navigation?', options: ['React Navigation', 'React Router DOM', 'jQuery', 'Redux'], answer: 0, why: 'React Navigation (or Expo Router) is used in most apps.' },
      ],
      exercises: [
        {
          id: 'n7-1',
          title: 'Tab bar',
          prompt: 'Write `TabApp`: shows `<Text>Home screen</Text>` at first. At the bottom are two `Pressable` tabs with `<Text>Home</Text>` and `<Text>Settings</Text>`. Pressing a tab shows `Home screen` or `Settings screen`.',
          starter: `function TabApp() {

}

render(<TabApp />);`,
          expose: ['TabApp'],
          hint: 'const [tab, setTab] = useState("home"); Text shows tab === "home" ? "Home screen" : "Settings screen".',
          solution: `function TabApp() {
  const [tab, setTab] = useState("home");
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>{tab === "home" ? "Home screen" : "Settings screen"}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => setTab("home")} style={{ flex: 1 }}>
          <Text>Home</Text>
        </Pressable>
        <Pressable onPress={() => setTab("settings")} style={{ flex: 1 }}>
          <Text>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

render(<TabApp />);`,
          tests: [
            T('starts on the Home screen', (e, { mount, h, expect }) => expect(texts(mount(h(e.TabApp)))).toContain('Home screen')),
            T('tab "Settings" shows the Settings screen', (e, { mount, h, expect }) => {
              const v = mount(h(e.TabApp));
              v.click('Settings');
              expect(texts(v)).toContain('Settings screen');
              expect(texts(v).includes('Home screen')).toBe(false);
            }),
            T('tab "Home" goes back', (e, { mount, h, expect }) => {
              const v = mount(h(e.TabApp));
              v.click('Settings');
              v.click('Home');
              expect(texts(v)).toContain('Home screen');
            }),
          ],
        },
        {
          id: 'n7-2',
          title: 'List → detail → back',
          prompt: 'Write `Pets({ pets })` (an array of names). It starts as a list: one `Pressable` with a `<Text>` per pet. Pressing a pet shows **only** `<Text>Detail: NAME</Text>` and a `<Button title="Back" />` that returns to the list.',
          starter: `function Pets({ pets }) {

}

render(<Pets pets={["Cat", "Dog"]} />);`,
          expose: ['Pets'],
          hint: 'State: selected (null or a name). if (selected) return the detail view; else the list.',
          solution: `function Pets({ pets }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <View>
        <Text>Detail: {selected}</Text>
        <Button title="Back" onPress={() => setSelected(null)} />
      </View>
    );
  }

  return (
    <View>
      {pets.map((p) => (
        <Pressable key={p} onPress={() => setSelected(p)}>
          <Text>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}

render(<Pets pets={["Cat", "Dog"]} />);`,
          tests: [
            T('shows the list first', (e, { mount, h, expect }) => expect(texts(mount(h(e.Pets, { pets: ['Cat', 'Dog'] })))).toEqual(['Cat', 'Dog'])),
            T('pressing "Dog" shows its detail only', (e, { mount, h, expect }) => {
              const v = mount(h(e.Pets, { pets: ['Cat', 'Dog'] }));
              v.click('Dog');
              expect(texts(v)).toEqual(['Detail: Dog']);
              expect(v.$('[data-rn="Button"]').textContent).toBe('Back');
            }),
            T('Back returns to the list', (e, { mount, h, expect }) => {
              const v = mount(h(e.Pets, { pets: ['Cat', 'Dog'] }));
              v.click('Cat');
              v.click('Back');
              expect(texts(v)).toEqual(['Cat', 'Dog']);
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 8
    {
      id: 'n-data',
      title: 'Loading Data & Saving to the Phone',
      time: '25 min',
      blocks: [
        { p: 'Most apps load data from the internet and remember things on the device. Both use `useEffect` — exactly as in React.' },
        { h: 'The loading pattern' },
        { p: 'Three states: **loading** → **success** or **error**. Here `fetchPosts()` is a fake server; swap in `fetch("https://…")` for a real one.' },
        { run: `function fetchPosts() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([
      { id: 1, title: "Learn React Native" },
      { id: 2, title: "Build an app" },
      { id: 3, title: "Ship it 🚀" },
    ]), 1000)
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" /></View>;
  if (error) return <Text>Failed to load</Text>;

  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => <Text style={{ padding: 16, fontSize: 18 }}>{item.title}</Text>}
    />
  );
}

render(<App />);` },
        { h: 'A real fetch' },
        { code: `useEffect(() => {
  async function load() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      if (!response.ok) throw new Error("HTTP " + response.status);
      setPosts(await response.json());
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);` },
        { h: 'Saving data on the device' },
        { p: 'Variables vanish when the app closes. To remember something (a note, a login token, settings) save it with **AsyncStorage** — a simple key → string store. It is **asynchronous**, so you `await` it, usually inside `useEffect`:' },
        { code: `// npx expo install @react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

await AsyncStorage.setItem("note", "Buy milk");
const note = await AsyncStorage.getItem("note");     // "Buy milk" (or null)
await AsyncStorage.setItem("user", JSON.stringify({ name: "Ada" }));   // objects → JSON string
const user = JSON.parse(await AsyncStorage.getItem("user"));` },
        { tip: 'Never store passwords or secret tokens in AsyncStorage — it is not encrypted. Use `expo-secure-store` for secrets.' },
      ],
      quiz: [
        { q: 'Where do you normally start a network request in a component?', options: ['In the JSX', 'In a useEffect', 'In StyleSheet', 'In the import'], answer: 1, why: 'Side effects like fetching belong in effects.' },
        { q: 'AsyncStorage values are…', options: ['Numbers only', 'Strings (use JSON for objects)', 'Booleans only', 'Images'], answer: 1, why: 'Stringify objects before saving, parse after loading.' },
        { q: 'Which three states does a data-loading screen usually handle?', options: ['red/green/blue', 'loading, success, error', 'start/middle/end', 'on/off/auto'], answer: 1, why: 'Always plan for waiting and failure.' },
      ],
      exercises: [
        {
          id: 'n8-1',
          title: 'Post list with loading and error',
          prompt: '`fetchPosts()` (provided) resolves an array of `{ id, title }`. Write `PostList({ load = fetchPosts })`:\n- while loading → `<ActivityIndicator />`\n- success → a `FlatList` with each title in a `<Text>`\n- failure → `<Text>Failed to load</Text>`',
          starter: `function fetchPosts() {
  return new Promise((resolve) => setTimeout(() => resolve([{ id: 1, title: "First" }, { id: 2, title: "Second" }]), 10));
}

function PostList({ load = fetchPosts }) {

}

render(<PostList />);`,
          expose: ['PostList'],
          hint: 'States: posts, loading (true), error (false). useEffect(() => { load().then(setPosts).catch(() => setError(true)).finally(() => setLoading(false)); }, []);',
          solution: `function fetchPosts() {
  return new Promise((resolve) => setTimeout(() => resolve([{ id: 1, title: "First" }, { id: 2, title: "Second" }]), 10));
}

function PostList({ load = fetchPosts }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    load()
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Failed to load</Text>;
  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}

render(<PostList />);`,
          tests: [
            T('shows a spinner while loading', (e, { mount, h, expect }) => expect(mount(h(e.PostList)).$('[data-rn="ActivityIndicator"]') !== null).toBe(true)),
            T('then shows the titles', async (e, { mount, h, expect, tick }) => {
              const v = mount(h(e.PostList));
              await tick(100);
              expect(v.$('[data-rn="ActivityIndicator"]')).toBe(null);
              expect(texts(v)).toEqual(['First', 'Second']);
            }),
            T('shows "Failed to load" on error', async (e, { mount, h, expect, tick }) => {
              const v = mount(h(e.PostList, { load: () => Promise.reject(new Error('x')) }));
              await tick(100);
              expect(texts(v)).toEqual(['Failed to load']);
            }),
          ],
        },
        {
          id: 'n8-2',
          title: 'A note that remembers',
          prompt: 'Write `Note({ storage })`. `storage` has async `getItem(key)` and `setItem(key, value)` (like AsyncStorage). Show a `TextInput` (placeholder **Write a note**). On mount, load the saved text with key `"note"` into the input. Whenever the user types, update the input **and** save the new text with `storage.setItem("note", text)`.',
          starter: `function Note({ storage }) {

}

const fakeStorage = {
  data: {},
  async getItem(key) { return this.data[key] ?? null; },
  async setItem(key, value) { this.data[key] = value; },
};

render(<Note storage={fakeStorage} />);`,
          expose: ['Note'],
          hint: 'useEffect(() => { storage.getItem("note").then((saved) => { if (saved) setText(saved); }); }, []);\nfunction change(t) { setText(t); storage.setItem("note", t); }',
          solution: `function Note({ storage }) {
  const [text, setText] = useState("");

  useEffect(() => {
    storage.getItem("note").then((saved) => {
      if (saved) setText(saved);
    });
  }, []);

  function change(t) {
    setText(t);
    storage.setItem("note", t);
  }

  return <TextInput placeholder="Write a note" value={text} onChangeText={change} />;
}

const fakeStorage = {
  data: {},
  async getItem(key) { return this.data[key] ?? null; },
  async setItem(key, value) { this.data[key] = value; },
};

render(<Note storage={fakeStorage} />);`,
          tests: [
            T('loads the saved note on mount', async (e, { mount, h, expect, tick }) => {
              const storage = { getItem: async () => 'saved text', setItem: async () => {} };
              const v = mount(h(e.Note, { storage }));
              await tick(60);
              expect(v.$('[data-rn="TextInput"]').value).toBe('saved text');
            }),
            T('typing saves the text', async (e, { mount, h, expect, tick }) => {
              const saved = [];
              const storage = { getItem: async () => null, setItem: async (k, val) => saved.push([k, val]) };
              const v = mount(h(e.Note, { storage }));
              await tick(30);
              v.type('[placeholder="Write a note"]', 'hello');
              expect(saved[saved.length - 1]).toEqual(['note', 'hello']);
              expect(v.$('[data-rn="TextInput"]').value).toBe('hello');
            }),
          ],
        },
      ],
    },

    // ───────────────────────────────────────── 9
    {
      id: 'n-project',
      title: 'Project: Task App & Run It on Your Phone',
      time: '35 min',
      blocks: [
        { p: 'Time for a complete mini app: a **task list for your phone**. You will use everything: components, styles, state, `TextInput`, `Pressable` and `FlatList`.' },
        { h: 'What it should do' },
        { list: ['A `TextInput` (placeholder **New task**) and a `Button` **Add** (ignores empty text, clears the box).', 'A `FlatList` of tasks. Each task is a `Pressable` containing a `Text` of the task.', 'Tapping a task toggles it done — done tasks get `textDecorationLine: "line-through"`.', 'A `Text` at the bottom: `N left`.'] },
        { run: `// A taste of the techniques:
const styles = StyleSheet.create({
  row: { padding: 14, borderBottomWidth: 1, borderColor: "#eee" },
  done: { textDecorationLine: "line-through", color: "gray" },
});

function Demo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn React Native", done: false },
    { id: 2, text: "Build this app", done: true },
  ]);
  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <FlatList
      data={tasks}
      keyExtractor={(t) => String(t.id)}
      renderItem={({ item }) => (
        <Pressable style={styles.row} onPress={() => toggle(item.id)}>
          <Text style={[{ fontSize: 18 }, item.done && styles.done]}>{item.text}</Text>
        </Pressable>
      )}
    />
  );
}

render(<Demo />);` },
        { tip: '`style={[a, cond && b]}` — an array of styles lets you add a style only when a condition is true.' },
      ],
      quiz: [
        { q: 'How do you cross out text in React Native?', options: ['strike: true', 'textDecorationLine: "line-through"', 'text-decoration: line-through', 'fontStyle: "strike"'], answer: 1, why: 'RN style names are camelCase: textDecorationLine.' },
      ],
      exercises: [
        {
          id: 'n9-1',
          title: 'Build the Task app',
          prompt: 'Write `TaskApp`:\n- `<TextInput placeholder="New task">` and `<Button title="Add">`\n- pressing Add appends the trimmed text as a task, clears the input, and ignores blank text\n- show tasks in a `FlatList`; each is a `<Pressable>` with a `<Text>`\n- pressing a task toggles `textDecorationLine: "line-through"` on its `<Text>` (otherwise `"none"`)\n- a final `<Text>` shows `N left` (count of tasks not done) — put it **after** the list',
          starter: `function TaskApp() {

}

render(<TaskApp />);`,
          expose: ['TaskApp'],
          hint: 'State: text, tasks [{id,text,done}], useRef for ids. Item Text style: { textDecorationLine: item.done ? "line-through" : "none" }. left = tasks.filter(t => !t.done).length.',
          solution: `function TaskApp() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const nextId = useRef(1);

  function add() {
    const clean = text.trim();
    if (!clean) return;
    setTasks([...tasks, { id: nextId.current++, text: clean, done: false }]);
    setText("");
  }

  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const left = tasks.filter((t) => !t.done).length;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <TextInput placeholder="New task" value={text} onChangeText={setText} />
      <Button title="Add" onPress={add} />
      <FlatList
        data={tasks}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggle(item.id)}>
            <Text style={{ textDecorationLine: item.done ? "line-through" : "none" }}>{item.text}</Text>
          </Pressable>
        )}
      />
      <Text>{left} left</Text>
    </View>
  );
}

render(<TaskApp />);`,
          tests: [
            T('starts empty with "0 left"', (e, { mount, h, expect }) => expect(texts(mount(h(e.TaskApp)))).toEqual(['0 left'])),
            T('adding tasks shows them and updates the count', (e, { mount, h, expect }) => {
              const v = mount(h(e.TaskApp));
              v.type('[placeholder="New task"]', 'Buy milk');
              v.click('Add');
              v.type('[placeholder="New task"]', 'Walk dog');
              v.click('Add');
              expect(texts(v)).toEqual(['Buy milk', 'Walk dog', '2 left']);
            }),
            T('input is cleared after adding', (e, { mount, h, expect }) => {
              const v = mount(h(e.TaskApp));
              v.type('[placeholder="New task"]', 'x');
              v.click('Add');
              expect(v.$('[data-rn="TextInput"]').value).toBe('');
            }),
            T('blank text is ignored', (e, { mount, h, expect }) => {
              const v = mount(h(e.TaskApp));
              v.type('[placeholder="New task"]', '   ');
              v.click('Add');
              expect(texts(v)).toEqual(['0 left']);
            }),
            T('tapping a task crosses it out and lowers the count', (e, { mount, h, expect }) => {
              const v = mount(h(e.TaskApp));
              v.type('[placeholder="New task"]', 'Buy milk');
              v.click('Add');
              v.click('Buy milk');
              expect(v.getByText('Buy milk').style.textDecorationLine).toBe('line-through');
              expect(texts(v)).toContain('0 left');
              v.click('Buy milk');
              expect(v.getByText('Buy milk').style.textDecorationLine).toBe('none');
              expect(texts(v)).toContain('1 left');
            }),
          ],
        },
      ],
      outro: [
        { h: '📲 Run it on your real phone' },
        { p: 'The recommended way to start is **Expo**. You need Node.js installed, and the free **Expo Go** app on your phone (App Store / Google Play).' },
        { code: `# 1. create a project
npx create-expo-app@latest my-app
cd my-app

# 2. start the dev server
npx expo start

# 3. scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)
#    Your app opens on the phone. Save a file and it updates instantly.` },
        { p: 'Copy the code you wrote here into `App.js` (add `import { View, Text, … } from "react-native"` and `import { useState } from "react"`), and it runs on your phone.' },
        { h: 'Project structure at a glance' },
        { code: `my-app/
├─ app/               # screens (Expo Router uses these files as routes)
├─ assets/            # images, fonts
├─ app.json           # app name, icon, version
└─ package.json       # dependencies and scripts` },
        { h: 'What to learn next' },
        { list: ['**Expo Router** or **React Navigation** — real navigation with headers, tabs and animations.', '**Device APIs** with Expo: camera, location, notifications, haptics.', '**Animation:** the `Animated` API and `react-native-reanimated`.', '**State management:** Context, Zustand.', '**Publishing:** EAS Build turns your app into files for the App Store and Google Play (`npx eas build`).', '**TypeScript** — catches mistakes early; Expo projects support it out of the box.'] },
        { tip: 'Congratulations — you went from zero to a working mobile app. Keep building: make a habit tracker, a notes app, a recipe book. Real projects are where it all clicks.' },
      ],
    }
  );
})();
