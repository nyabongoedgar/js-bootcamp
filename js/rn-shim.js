/*
 * rn-shim.js — a tiny SIMULATION of React Native for the browser.
 * It provides the core components (View, Text, Pressable, TextInput, FlatList, …) with
 * the same props as the real thing, drawn as web elements with React Native's default
 * layout rules (flex column, no inheritance of text styles, etc.).
 * Real apps import these from "react-native"; the code you write here is identical.
 */
(function (root) {
  'use strict';

  function create(React, hooks) {
    const h = React.createElement;
    const { useState, createContext, useContext } = React;

    // ---------- StyleSheet ----------
    function flatten(style) {
      if (!style) return {};
      if (Array.isArray(style)) return style.reduce((acc, s) => Object.assign(acc, flatten(s)), {});
      return style;
    }

    function toCss(style) {
      const s = flatten(style);
      const out = {};
      const px = (v) => (typeof v === 'number' ? v + 'px' : v);
      Object.keys(s).forEach((k) => {
        const v = s[k];
        if (v == null || v === false) return;
        if (k === 'paddingHorizontal') { out.paddingLeft = px(v); out.paddingRight = px(v); }
        else if (k === 'paddingVertical') { out.paddingTop = px(v); out.paddingBottom = px(v); }
        else if (k === 'marginHorizontal') { out.marginLeft = px(v); out.marginRight = px(v); }
        else if (k === 'marginVertical') { out.marginTop = px(v); out.marginBottom = px(v); }
        else if (k === 'lineHeight') out.lineHeight = px(v);
        else if (k === 'elevation') out.boxShadow = '0 ' + v / 2 + 'px ' + v + 'px rgba(0,0,0,0.25)';
        else if (k === 'transform' && Array.isArray(v)) {
          out.transform = v
            .map((t) => Object.keys(t).map((n) => n + '(' + (typeof t[n] === 'number' && /translate/.test(n) ? t[n] + 'px' : t[n]) + ')').join(' '))
            .join(' ');
        } else if (/^(shadow|tintColor|resizeMode|textAlignVertical|includeFontPadding|overlayColor)/.test(k)) {
          // not supported in the simulator
        } else {
          out[k] = v;
          const m = /^border(Top|Right|Bottom|Left)?Width$/.exec(k);
          if (m) out['border' + (m[1] || '') + 'Style'] = 'solid';
        }
      });
      return out;
    }

    const StyleSheet = {
      create: (styles) => styles,
      flatten,
      hairlineWidth: 1,
      absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
      absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    };

    const BASE_VIEW = { display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative', minWidth: 0, minHeight: 0, flexShrink: 0, alignItems: 'stretch', alignContent: 'flex-start' };
    const BASE_TEXT = { margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', boxSizing: 'border-box' };
    const attrs = (name, p) => ({ 'data-rn': name, 'data-testid': p.testID, 'aria-label': p.accessibilityLabel });

    // ---------- View / Text ----------
    function View(p) {
      return h('div', Object.assign(attrs('View', p), { style: Object.assign({}, BASE_VIEW, toCss(p.style)) }), p.children);
    }

    const InText = createContext(false);
    function Text(p) {
      const nested = useContext(InText);
      const style = Object.assign({}, BASE_TEXT, nested ? { display: 'inline' } : { display: 'block' }, toCss(p.style));
      if (p.numberOfLines) {
        Object.assign(style, { overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: p.numberOfLines, WebkitBoxOrient: 'vertical' });
      }
      return h(InText.Provider, { value: true }, h('span', Object.assign(attrs('Text', p), { style, onClick: p.onPress }), p.children));
    }

    // ---------- touchables ----------
    function usePress(p) {
      const [pressed, setPressed] = useState(false);
      return {
        pressed,
        handlers: {
          onClick: p.disabled ? undefined : p.onPress,
          onMouseDown: () => { setPressed(true); p.onPressIn && p.onPressIn(); },
          onMouseUp: () => { setPressed(false); p.onPressOut && p.onPressOut(); },
          onMouseLeave: () => setPressed(false),
          onContextMenu: p.onLongPress ? (e) => { e.preventDefault(); p.onLongPress(e); } : undefined,
        },
      };
    }

    function Pressable(p) {
      const { pressed, handlers } = usePress(p);
      const style = typeof p.style === 'function' ? p.style({ pressed }) : p.style;
      const kids = typeof p.children === 'function' ? p.children({ pressed }) : p.children;
      return h('div', Object.assign(attrs('Pressable', p), handlers, { role: 'button', 'aria-disabled': p.disabled || undefined, style: Object.assign({}, BASE_VIEW, { cursor: p.disabled ? 'default' : 'pointer', userSelect: 'none' }, toCss(style)) }), kids);
    }

    function TouchableOpacity(p) {
      const { pressed, handlers } = usePress(p);
      const opacity = p.disabled ? 0.5 : pressed ? (p.activeOpacity == null ? 0.2 : p.activeOpacity) : 1;
      return h('div', Object.assign(attrs('TouchableOpacity', p), handlers, { role: 'button', style: Object.assign({}, BASE_VIEW, { cursor: 'pointer', userSelect: 'none', opacity }, toCss(p.style)) }), p.children);
    }

    function Button(p) {
      return h('button', Object.assign(attrs('Button', p), {
        onClick: p.disabled ? undefined : p.onPress,
        disabled: p.disabled,
        style: { background: 'none', border: 'none', font: 'inherit', fontSize: '18px', color: p.disabled ? '#999' : p.color || '#007AFF', padding: '8px', cursor: 'pointer', textAlign: 'center' },
      }), p.title);
    }

    // ---------- inputs ----------
    function TextInput(p) {
      const common = Object.assign(attrs('TextInput', p), {
        placeholder: p.placeholder,
        readOnly: p.editable === false,
        maxLength: p.maxLength,
        autoFocus: p.autoFocus,
        onChange: (e) => { p.onChangeText && p.onChangeText(e.target.value); p.onChange && p.onChange(e); },
        onKeyDown: (e) => { if (e.key === 'Enter' && !p.multiline && p.onSubmitEditing) p.onSubmitEditing(e); },
        onFocus: p.onFocus,
        onBlur: p.onBlur,
        style: Object.assign({ font: 'inherit', fontSize: '14px', padding: 0, border: 'none', outline: 'none', background: 'transparent', color: 'inherit', boxSizing: 'border-box', minWidth: 0, margin: 0 }, toCss(p.style)),
      });
      if (p.value !== undefined) common.value = p.value;
      else if (p.defaultValue !== undefined) common.defaultValue = p.defaultValue;
      if (p.multiline) return h('textarea', Object.assign(common, { rows: p.numberOfLines || 3 }));
      return h('input', Object.assign(common, { type: p.secureTextEntry ? 'password' : 'text' }));
    }

    function Switch(p) {
      return h('input', Object.assign(attrs('Switch', p), { type: 'checkbox', role: 'switch', checked: !!p.value, disabled: p.disabled, onChange: (e) => p.onValueChange && p.onValueChange(e.target.checked), style: { width: '40px', height: '22px', margin: 0, accentColor: (p.trackColor && p.trackColor.true) || '#34C759', alignSelf: 'flex-start' } }));
    }

    // ---------- scrolling & lists ----------
    function ScrollView(p) {
      const horizontal = !!p.horizontal;
      return h('div', Object.assign(attrs('ScrollView', p), { style: Object.assign({}, BASE_VIEW, { flexGrow: 1, flexShrink: 1, flexDirection: horizontal ? 'row' : 'column', overflowX: horizontal ? 'auto' : 'hidden', overflowY: horizontal ? 'hidden' : 'auto' }, toCss(p.style)) }),
        h('div', { style: Object.assign({}, BASE_VIEW, { flexDirection: horizontal ? 'row' : 'column', flexGrow: 1 }, toCss(p.contentContainerStyle)) }, p.children));
    }

    function FlatList(p) {
      const data = p.data || [];
      const render = (C) => (!C ? null : React.isValidElement(C) ? C : h(C));
      const items = [];
      data.forEach((item, index) => {
        const key = p.keyExtractor ? p.keyExtractor(item, index) : item && (item.key != null ? item.key : item.id != null ? item.id : index);
        items.push(h(React.Fragment, { key }, h(React.Fragment, null, p.renderItem({ item, index, separators: {} })), p.ItemSeparatorComponent && index < data.length - 1 ? render(p.ItemSeparatorComponent) : null));
      });
      const horizontal = !!p.horizontal;
      const body = [];
      if (p.ListHeaderComponent) body.push(h(React.Fragment, { key: '__header' }, render(p.ListHeaderComponent)));
      if (data.length === 0 && p.ListEmptyComponent) body.push(h(React.Fragment, { key: '__empty' }, render(p.ListEmptyComponent)));
      body.push(...items);
      if (p.ListFooterComponent) body.push(h(React.Fragment, { key: '__footer' }, render(p.ListFooterComponent)));
      return h(ScrollView, { horizontal, style: p.style, contentContainerStyle: p.contentContainerStyle, testID: p.testID }, body);
    }

    // ---------- misc ----------
    function Image(p) {
      const src = typeof p.source === 'string' ? p.source : p.source && p.source.uri;
      const fit = { cover: 'cover', contain: 'contain', stretch: 'fill', center: 'none', repeat: 'cover' }[p.resizeMode || (p.style && flatten(p.style).resizeMode) || 'cover'];
      return h('img', Object.assign(attrs('Image', p), { src, alt: p.accessibilityLabel || '', draggable: false, style: Object.assign({ display: 'block', objectFit: fit, flexShrink: 0 }, toCss(p.style)) }));
    }

    function ActivityIndicator(p) {
      const size = p.size === 'large' ? 36 : 20;
      return h('div', Object.assign(attrs('ActivityIndicator', p), { className: 'rn-spinner', role: 'progressbar', style: Object.assign({ width: size + 'px', height: size + 'px', borderColor: (p.color || '#999') + '55', borderTopColor: p.color || '#999', alignSelf: 'center' }, toCss(p.style)) }));
    }

    const Alert = { alert: (title, message, buttons) => hooks && hooks.alert && hooks.alert(title, message, buttons) };
    const Platform = { OS: 'ios', Version: '17.0', select: (o) => (o.ios !== undefined ? o.ios : o.default) };
    const Dimensions = { get: () => ({ width: 320, height: 560, scale: 2, fontScale: 1 }) };
    const useWindowDimensions = () => Dimensions.get();
    const StatusBar = () => null;

    const components = {
      View, Text, Pressable, TouchableOpacity, Button, TextInput, Switch, ScrollView, FlatList, Image, ActivityIndicator,
      SafeAreaView: View, KeyboardAvoidingView: View, StatusBar,
      StyleSheet, Alert, Platform, Dimensions, useWindowDimensions,
      SAMPLE_IMAGE: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0b400"/><stop offset="1" stop-color="#4c5fd5"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><circle cx="100" cy="85" r="34" fill="#fff" opacity=".85"/><rect x="50" y="130" width="100" height="40" rx="20" fill="#fff" opacity=".85"/></svg>'),
    };

    return { components };
  }

  const api = { create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RNShim = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
