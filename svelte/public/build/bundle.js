
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.55.1 */

    const { Error: Error_1, Object: Object_1, console: console_1$1 } = globals;

    // (267:0) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location: location$1,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function bind(fn, thisArg) {
      return function wrap() {
        return fn.apply(thisArg, arguments);
      };
    }

    // utils is a library of generic helper functions non-specific to axios

    const {toString} = Object.prototype;
    const {getPrototypeOf} = Object;

    const kindOf = (cache => thing => {
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));

    const kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type
    };

    const typeOfTest = type => thing => typeof thing === type;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     *
     * @returns {boolean} True if value is an Array, otherwise false
     */
    const {isArray} = Array;

    /**
     * Determine if a value is undefined
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    const isUndefined = typeOfTest('undefined');

    /**
     * Determine if a value is a Buffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    const isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      let result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a String, otherwise false
     */
    const isString = typeOfTest('string');

    /**
     * Determine if a value is a Function
     *
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    const isFunction = typeOfTest('function');

    /**
     * Determine if a value is a Number
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Number, otherwise false
     */
    const isNumber = typeOfTest('number');

    /**
     * Determine if a value is an Object
     *
     * @param {*} thing The value to test
     *
     * @returns {boolean} True if value is an Object, otherwise false
     */
    const isObject = (thing) => thing !== null && typeof thing === 'object';

    /**
     * Determine if a value is a Boolean
     *
     * @param {*} thing The value to test
     * @returns {boolean} True if value is a Boolean, otherwise false
     */
    const isBoolean = thing => thing === true || thing === false;

    /**
     * Determine if a value is a plain Object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a plain Object, otherwise false
     */
    const isPlainObject = (val) => {
      if (kindOf(val) !== 'object') {
        return false;
      }

      const prototype = getPrototypeOf(val);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
    };

    /**
     * Determine if a value is a Date
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Date, otherwise false
     */
    const isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    const isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Stream
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    const isStream = (val) => isObject(val) && isFunction(val.pipe);

    /**
     * Determine if a value is a FormData
     *
     * @param {*} thing The value to test
     *
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    const isFormData = (thing) => {
      const pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    };

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    const isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     *
     * @returns {String} The String freed of excess whitespace
     */
    const trim = (str) => str.trim ?
      str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     *
     * @param {Boolean} [allOwnKeys = false]
     * @returns {any}
     */
    function forEach(obj, fn, {allOwnKeys = false} = {}) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      let i;
      let l;

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;

        for (i = 0; i < len; i++) {
          key = keys[i];
          fn.call(null, obj[key], key, obj);
        }
      }
    }

    function findKey(obj, key) {
      key = key.toLowerCase();
      const keys = Object.keys(obj);
      let i = keys.length;
      let _key;
      while (i-- > 0) {
        _key = keys[i];
        if (key === _key.toLowerCase()) {
          return _key;
        }
      }
      return null;
    }

    const _global = (() => {
      /*eslint no-undef:0*/
      if (typeof globalThis !== "undefined") return globalThis;
      return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
    })();

    const isContextDefined = (context) => !isUndefined(context) && context !== _global;

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     *
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      const {caseless} = isContextDefined(this) && this || {};
      const result = {};
      const assignValue = (val, key) => {
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
          result[targetKey] = merge(result[targetKey], val);
        } else if (isPlainObject(val)) {
          result[targetKey] = merge({}, val);
        } else if (isArray(val)) {
          result[targetKey] = val.slice();
        } else {
          result[targetKey] = val;
        }
      };

      for (let i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     *
     * @param {Boolean} [allOwnKeys]
     * @returns {Object} The resulting value of object a
     */
    const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
      forEach(b, (val, key) => {
        if (thisArg && isFunction(val)) {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      }, {allOwnKeys});
      return a;
    };

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     *
     * @returns {string} content value without BOM
     */
    const stripBOM = (content) => {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    };

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     *
     * @returns {void}
     */
    const inherits = (constructor, superConstructor, props, descriptors) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      Object.defineProperty(constructor, 'super', {
        value: superConstructor.prototype
      });
      props && Object.assign(constructor.prototype, props);
    };

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function|Boolean} [filter]
     * @param {Function} [propFilter]
     *
     * @returns {Object}
     */
    const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
      let props;
      let i;
      let prop;
      const merged = {};

      destObj = destObj || {};
      // eslint-disable-next-line no-eq-null,eqeqeq
      if (sourceObj == null) return destObj;

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    };

    /**
     * Determines whether a string ends with the characters of a specified string
     *
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     *
     * @returns {boolean}
     */
    const endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };


    /**
     * Returns new array from array like object or null if failed
     *
     * @param {*} [thing]
     *
     * @returns {?Array}
     */
    const toArray = (thing) => {
      if (!thing) return null;
      if (isArray(thing)) return thing;
      let i = thing.length;
      if (!isNumber(i)) return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };

    /**
     * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
     * thing passed in is an instance of Uint8Array
     *
     * @param {TypedArray}
     *
     * @returns {Array}
     */
    // eslint-disable-next-line func-names
    const isTypedArray = (TypedArray => {
      // eslint-disable-next-line func-names
      return thing => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

    /**
     * For each entry in the object, call the function with the key and value.
     *
     * @param {Object<any, any>} obj - The object to iterate over.
     * @param {Function} fn - The function to call for each entry.
     *
     * @returns {void}
     */
    const forEachEntry = (obj, fn) => {
      const generator = obj && obj[Symbol.iterator];

      const iterator = generator.call(obj);

      let result;

      while ((result = iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };

    /**
     * It takes a regular expression and a string, and returns an array of all the matches
     *
     * @param {string} regExp - The regular expression to match against.
     * @param {string} str - The string to search.
     *
     * @returns {Array<boolean>}
     */
    const matchAll = (regExp, str) => {
      let matches;
      const arr = [];

      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }

      return arr;
    };

    /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
    const isHTMLForm = kindOfTest('HTMLFormElement');

    const toCamelCase = str => {
      return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
        function replacer(m, p1, p2) {
          return p1.toUpperCase() + p2;
        }
      );
    };

    /* Creating a function that will check if an object has a property. */
    const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

    /**
     * Determine if a value is a RegExp object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a RegExp object, otherwise false
     */
    const isRegExp = kindOfTest('RegExp');

    const reduceDescriptors = (obj, reducer) => {
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};

      forEach(descriptors, (descriptor, name) => {
        if (reducer(descriptor, name, obj) !== false) {
          reducedDescriptors[name] = descriptor;
        }
      });

      Object.defineProperties(obj, reducedDescriptors);
    };

    /**
     * Makes all methods read-only
     * @param {Object} obj
     */

    const freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        // skip restricted props in strict mode
        if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
          return false;
        }

        const value = obj[name];

        if (!isFunction(value)) return;

        descriptor.enumerable = false;

        if ('writable' in descriptor) {
          descriptor.writable = false;
          return;
        }

        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error('Can not rewrite read-only method \'' + name + '\'');
          };
        }
      });
    };

    const toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};

      const define = (arr) => {
        arr.forEach(value => {
          obj[value] = true;
        });
      };

      isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

      return obj;
    };

    const noop = () => {};

    const toFiniteNumber = (value, defaultValue) => {
      value = +value;
      return Number.isFinite(value) ? value : defaultValue;
    };

    const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

    const DIGIT = '0123456789';

    const ALPHABET = {
      DIGIT,
      ALPHA,
      ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
    };

    const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
      let str = '';
      const {length} = alphabet;
      while (size--) {
        str += alphabet[Math.random() * length|0];
      }

      return str;
    };

    /**
     * If the thing is a FormData object, return true, otherwise return false.
     *
     * @param {unknown} thing - The thing to check.
     *
     * @returns {boolean}
     */
    function isSpecCompliantForm(thing) {
      return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
    }

    const toJSONObject = (obj) => {
      const stack = new Array(10);

      const visit = (source, i) => {

        if (isObject(source)) {
          if (stack.indexOf(source) >= 0) {
            return;
          }

          if(!('toJSON' in source)) {
            stack[i] = source;
            const target = isArray(source) ? [] : {};

            forEach(source, (value, key) => {
              const reducedValue = visit(value, i + 1);
              !isUndefined(reducedValue) && (target[key] = reducedValue);
            });

            stack[i] = undefined;

            return target;
          }
        }

        return source;
      };

      return visit(obj, 0);
    };

    var utils = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isBoolean,
      isObject,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isRegExp,
      isFunction,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty,
      hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop,
      toFiniteNumber,
      findKey,
      global: _global,
      isContextDefined,
      ALPHABET,
      generateString,
      isSpecCompliantForm,
      toJSONObject
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     *
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = (new Error()).stack;
      }

      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: utils.toJSONObject(this.config),
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    const prototype$1 = AxiosError.prototype;
    const descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED',
      'ERR_NOT_SUPPORT',
      'ERR_INVALID_URL'
    // eslint-disable-next-line func-names
    ].forEach(code => {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = (error, code, config, request, response, customProps) => {
      const axiosError = Object.create(prototype$1);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      }, prop => {
        return prop !== 'isAxiosError';
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.cause = error;

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    // eslint-disable-next-line strict
    var httpAdapter = null;

    /**
     * Determines if the given thing is a array or js object.
     *
     * @param {string} thing - The object or array to be visited.
     *
     * @returns {boolean}
     */
    function isVisitable(thing) {
      return utils.isPlainObject(thing) || utils.isArray(thing);
    }

    /**
     * It removes the brackets from the end of a string
     *
     * @param {string} key - The key of the parameter.
     *
     * @returns {string} the key without the brackets.
     */
    function removeBrackets(key) {
      return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
    }

    /**
     * It takes a path, a key, and a boolean, and returns a string
     *
     * @param {string} path - The path to the current key.
     * @param {string} key - The key of the current object being iterated over.
     * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
     *
     * @returns {string} The path to the current key.
     */
    function renderKey(path, key, dots) {
      if (!path) return key;
      return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? '[' + token + ']' : token;
      }).join(dots ? '.' : '');
    }

    /**
     * If the array is an array and none of its elements are visitable, then it's a flat array.
     *
     * @param {Array<any>} arr - The array to check
     *
     * @returns {boolean}
     */
    function isFlatArray(arr) {
      return utils.isArray(arr) && !arr.some(isVisitable);
    }

    const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });

    /**
     * Convert a data object to FormData
     *
     * @param {Object} obj
     * @param {?Object} [formData]
     * @param {?Object} [options]
     * @param {Function} [options.visitor]
     * @param {Boolean} [options.metaTokens = true]
     * @param {Boolean} [options.dots = false]
     * @param {?Boolean} [options.indexes = false]
     *
     * @returns {Object}
     **/

    /**
     * It converts an object into a FormData object
     *
     * @param {Object<any, any>} obj - The object to convert to form data.
     * @param {string} formData - The FormData object to append to.
     * @param {Object<string, any>} options
     *
     * @returns
     */
    function toFormData(obj, formData, options) {
      if (!utils.isObject(obj)) {
        throw new TypeError('target must be an object');
      }

      // eslint-disable-next-line no-param-reassign
      formData = formData || new (FormData)();

      // eslint-disable-next-line no-param-reassign
      options = utils.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
      }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !utils.isUndefined(source[option]);
      });

      const metaTokens = options.metaTokens;
      // eslint-disable-next-line no-use-before-define
      const visitor = options.visitor || defaultVisitor;
      const dots = options.dots;
      const indexes = options.indexes;
      const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
      const useBlob = _Blob && utils.isSpecCompliantForm(formData);

      if (!utils.isFunction(visitor)) {
        throw new TypeError('visitor must be a function');
      }

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (!useBlob && utils.isBlob(value)) {
          throw new AxiosError('Blob is not supported. Use a Buffer instead.');
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      /**
       * Default visitor.
       *
       * @param {*} value
       * @param {String|Number} key
       * @param {Array<String|Number>} path
       * @this {FormData}
       *
       * @returns {boolean} return true to visit the each prop of the value recursively
       */
      function defaultVisitor(value, key, path) {
        let arr = value;

        if (value && !path && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            key = metaTokens ? key : key.slice(0, -2);
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (
            (utils.isArray(value) && isFlatArray(value)) ||
            ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
            )) {
            // eslint-disable-next-line no-param-reassign
            key = removeBrackets(key);

            arr.forEach(function each(el, index) {
              !(utils.isUndefined(el) || el === null) && formData.append(
                // eslint-disable-next-line no-nested-ternary
                indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
                convertValue(el)
              );
            });
            return false;
          }
        }

        if (isVisitable(value)) {
          return true;
        }

        formData.append(renderKey(path, key, dots), convertValue(value));

        return false;
      }

      const stack = [];

      const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
      });

      function build(value, path) {
        if (utils.isUndefined(value)) return;

        if (stack.indexOf(value) !== -1) {
          throw Error('Circular reference detected in ' + path.join('.'));
        }

        stack.push(value);

        utils.forEach(value, function each(el, key) {
          const result = !(utils.isUndefined(el) || el === null) && visitor.call(
            formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
          );

          if (result === true) {
            build(el, path ? path.concat(key) : [key]);
          }
        });

        stack.pop();
      }

      if (!utils.isObject(obj)) {
        throw new TypeError('data must be an object');
      }

      build(obj);

      return formData;
    }

    /**
     * It encodes a string by replacing all characters that are not in the unreserved set with
     * their percent-encoded equivalents
     *
     * @param {string} str - The string to encode.
     *
     * @returns {string} The encoded string.
     */
    function encode$1(str) {
      const charMap = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\x00'
      };
      return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
      });
    }

    /**
     * It takes a params object and converts it to a FormData object
     *
     * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
     * @param {Object<string, any>} options - The options object passed to the Axios constructor.
     *
     * @returns {void}
     */
    function AxiosURLSearchParams(params, options) {
      this._pairs = [];

      params && toFormData(params, this, options);
    }

    const prototype = AxiosURLSearchParams.prototype;

    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };

    prototype.toString = function toString(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
      } : encode$1;

      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + '=' + _encode(pair[1]);
      }, '').join('&');
    };

    /**
     * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
     * URI encoded counterparts
     *
     * @param {string} val The value to be encoded.
     *
     * @returns {string} The encoded value.
     */
    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @param {?object} options
     *
     * @returns {string} The formatted url
     */
    function buildURL(url, params, options) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }
      
      const _encode = options && options.encode || encode;

      const serializeFn = options && options.serialize;

      let serializedParams;

      if (serializeFn) {
        serializedParams = serializeFn(params, options);
      } else {
        serializedParams = utils.isURLSearchParams(params) ?
          params.toString() :
          new AxiosURLSearchParams(params, options).toString(_encode);
      }

      if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");

        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    }

    class InterceptorManager {
      constructor() {
        this.handlers = [];
      }

      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }

      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
       */
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }

      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }

      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
      forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    }

    var InterceptorManager$1 = InterceptorManager;

    var transitionalDefaults = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

    var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

    var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     *
     * @returns {boolean}
     */
    const isStandardBrowserEnv = (() => {
      let product;
      if (typeof navigator !== 'undefined' && (
        (product = navigator.product) === 'ReactNative' ||
        product === 'NativeScript' ||
        product === 'NS')
      ) {
        return false;
      }

      return typeof window !== 'undefined' && typeof document !== 'undefined';
    })();

    /**
     * Determine if we're running in a standard browser webWorker environment
     *
     * Although the `isStandardBrowserEnv` method indicates that
     * `allows axios to run in a web worker`, the WebWorker will still be
     * filtered out due to its judgment standard
     * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
     * This leads to a problem when axios post `FormData` in webWorker
     */
     const isStandardBrowserWebWorkerEnv = (() => {
      return (
        typeof WorkerGlobalScope !== 'undefined' &&
        // eslint-disable-next-line no-undef
        self instanceof WorkerGlobalScope &&
        typeof self.importScripts === 'function'
      );
    })();


    var platform = {
      isBrowser: true,
      classes: {
        URLSearchParams: URLSearchParams$1,
        FormData: FormData$1,
        Blob: Blob$1
      },
      isStandardBrowserEnv,
      isStandardBrowserWebWorkerEnv,
      protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
    };

    function toURLEncodedForm(data, options) {
      return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
          if (platform.isNode && utils.isBuffer(value)) {
            this.append(key, value.toString('base64'));
            return false;
          }

          return helpers.defaultVisitor.apply(this, arguments);
        }
      }, options));
    }

    /**
     * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
     *
     * @param {string} name - The name of the property to get.
     *
     * @returns An array of strings.
     */
    function parsePropPath(name) {
      // foo[x][y][z]
      // foo.x.y.z
      // foo-x-y-z
      // foo x y z
      return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
        return match[0] === '[]' ? '' : match[1] || match[0];
      });
    }

    /**
     * Convert an array to an object.
     *
     * @param {Array<any>} arr - The array to convert to an object.
     *
     * @returns An object with the same keys and values as the array.
     */
    function arrayToObject(arr) {
      const obj = {};
      const keys = Object.keys(arr);
      let i;
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        obj[key] = arr[key];
      }
      return obj;
    }

    /**
     * It takes a FormData object and returns a JavaScript object
     *
     * @param {string} formData The FormData object to convert to JSON.
     *
     * @returns {Object<string, any> | null} The converted object.
     */
    function formDataToJSON(formData) {
      function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils.isArray(target) ? target.length : name;

        if (isLast) {
          if (utils.hasOwnProp(target, name)) {
            target[name] = [target[name], value];
          } else {
            target[name] = value;
          }

          return !isNumericKey;
        }

        if (!target[name] || !utils.isObject(target[name])) {
          target[name] = [];
        }

        const result = buildPath(path, value, target[name], index);

        if (result && utils.isArray(target[name])) {
          target[name] = arrayToObject(target[name]);
        }

        return !isNumericKey;
      }

      if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
        const obj = {};

        utils.forEachEntry(formData, (name, value) => {
          buildPath(parsePropPath(name), value, obj, 0);
        });

        return obj;
      }

      return null;
    }

    const DEFAULT_CONTENT_TYPE = {
      'Content-Type': undefined
    };

    /**
     * It takes a string, tries to parse it, and if it fails, it returns the stringified version
     * of the input
     *
     * @param {any} rawValue - The value to be stringified.
     * @param {Function} parser - A function that parses a string into a JavaScript object.
     * @param {Function} encoder - A function that takes a value and returns a string.
     *
     * @returns {string} A stringified version of the rawValue.
     */
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    const defaults = {

      transitional: transitionalDefaults,

      adapter: ['xhr', 'http'],

      transformRequest: [function transformRequest(data, headers) {
        const contentType = headers.getContentType() || '';
        const hasJSONContentType = contentType.indexOf('application/json') > -1;
        const isObjectPayload = utils.isObject(data);

        if (isObjectPayload && utils.isHTMLForm(data)) {
          data = new FormData(data);
        }

        const isFormData = utils.isFormData(data);

        if (isFormData) {
          if (!hasJSONContentType) {
            return data;
          }
          return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
        }

        if (utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
          return data.toString();
        }

        let isFileList;

        if (isObjectPayload) {
          if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
            return toURLEncodedForm(data, this.formSerializer).toString();
          }

          if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
            const _FormData = this.env && this.env.FormData;

            return toFormData(
              isFileList ? {'files[]': data} : data,
              _FormData && new _FormData(),
              this.formSerializer
            );
          }
        }

        if (isObjectPayload || hasJSONContentType ) {
          headers.setContentType('application/json', false);
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === 'json';

        if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;

          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults$1 = defaults;

    // RawAxiosHeaders whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    const ignoreDuplicateOf = utils.toObjectSet([
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ]);

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} rawHeaders Headers needing to be parsed
     *
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = rawHeaders => {
      const parsed = {};
      let key;
      let val;
      let i;

      rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
        i = line.indexOf(':');
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();

        if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
          return;
        }

        if (key === 'set-cookie') {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      });

      return parsed;
    };

    const $internals = Symbol('internals');

    function normalizeHeader(header) {
      return header && String(header).trim().toLowerCase();
    }

    function normalizeValue(value) {
      if (value === false || value == null) {
        return value;
      }

      return utils.isArray(value) ? value.map(normalizeValue) : String(value);
    }

    function parseTokens(str) {
      const tokens = Object.create(null);
      const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
      let match;

      while ((match = tokensRE.exec(str))) {
        tokens[match[1]] = match[2];
      }

      return tokens;
    }

    function isValidHeaderName(str) {
      return /^[-_a-zA-Z]+$/.test(str.trim());
    }

    function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
      if (utils.isFunction(filter)) {
        return filter.call(this, value, header);
      }

      if (isHeaderNameFilter) {
        value = header;
      }

      if (!utils.isString(value)) return;

      if (utils.isString(filter)) {
        return value.indexOf(filter) !== -1;
      }

      if (utils.isRegExp(filter)) {
        return filter.test(value);
      }
    }

    function formatHeader(header) {
      return header.trim()
        .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
          return char.toUpperCase() + str;
        });
    }

    function buildAccessors(obj, header) {
      const accessorName = utils.toCamelCase(' ' + header);

      ['get', 'set', 'has'].forEach(methodName => {
        Object.defineProperty(obj, methodName + accessorName, {
          value: function(arg1, arg2, arg3) {
            return this[methodName].call(this, header, arg1, arg2, arg3);
          },
          configurable: true
        });
      });
    }

    class AxiosHeaders {
      constructor(headers) {
        headers && this.set(headers);
      }

      set(header, valueOrRewrite, rewrite) {
        const self = this;

        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);

          if (!lHeader) {
            throw new Error('header name must be a non-empty string');
          }

          const key = utils.findKey(self, lHeader);

          if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
            self[key || _header] = normalizeValue(_value);
          }
        }

        const setHeaders = (headers, _rewrite) =>
          utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

        if (utils.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders(header), valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }

        return this;
      }

      get(header, parser) {
        header = normalizeHeader(header);

        if (header) {
          const key = utils.findKey(this, header);

          if (key) {
            const value = this[key];

            if (!parser) {
              return value;
            }

            if (parser === true) {
              return parseTokens(value);
            }

            if (utils.isFunction(parser)) {
              return parser.call(this, value, key);
            }

            if (utils.isRegExp(parser)) {
              return parser.exec(value);
            }

            throw new TypeError('parser must be boolean|regexp|function');
          }
        }
      }

      has(header, matcher) {
        header = normalizeHeader(header);

        if (header) {
          const key = utils.findKey(this, header);

          return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }

        return false;
      }

      delete(header, matcher) {
        const self = this;
        let deleted = false;

        function deleteHeader(_header) {
          _header = normalizeHeader(_header);

          if (_header) {
            const key = utils.findKey(self, _header);

            if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
              delete self[key];

              deleted = true;
            }
          }
        }

        if (utils.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }

        return deleted;
      }

      clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;

        while (i--) {
          const key = keys[i];
          if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
            delete this[key];
            deleted = true;
          }
        }

        return deleted;
      }

      normalize(format) {
        const self = this;
        const headers = {};

        utils.forEach(this, (value, header) => {
          const key = utils.findKey(headers, header);

          if (key) {
            self[key] = normalizeValue(value);
            delete self[header];
            return;
          }

          const normalized = format ? formatHeader(header) : String(header).trim();

          if (normalized !== header) {
            delete self[header];
          }

          self[normalized] = normalizeValue(value);

          headers[normalized] = true;
        });

        return this;
      }

      concat(...targets) {
        return this.constructor.concat(this, ...targets);
      }

      toJSON(asStrings) {
        const obj = Object.create(null);

        utils.forEach(this, (value, header) => {
          value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
        });

        return obj;
      }

      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }

      toString() {
        return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
      }

      get [Symbol.toStringTag]() {
        return 'AxiosHeaders';
      }

      static from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }

      static concat(first, ...targets) {
        const computed = new this(first);

        targets.forEach((target) => computed.set(target));

        return computed;
      }

      static accessor(header) {
        const internals = this[$internals] = (this[$internals] = {
          accessors: {}
        });

        const accessors = internals.accessors;
        const prototype = this.prototype;

        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);

          if (!accessors[lHeader]) {
            buildAccessors(prototype, _header);
            accessors[lHeader] = true;
          }
        }

        utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

        return this;
      }
    }

    AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

    utils.freezeMethods(AxiosHeaders.prototype);
    utils.freezeMethods(AxiosHeaders);

    var AxiosHeaders$1 = AxiosHeaders;

    /**
     * Transform the data for a request or a response
     *
     * @param {Array|Function} fns A single function or Array of functions
     * @param {?Object} response The response object
     *
     * @returns {*} The resulting transformed data
     */
    function transformData(fns, response) {
      const config = this || defaults$1;
      const context = response || config;
      const headers = AxiosHeaders$1.from(context.headers);
      let data = context.data;

      utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
      });

      headers.normalize();

      return data;
    }

    function isCancel(value) {
      return !!(value && value.__CANCEL__);
    }

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @param {string=} message The message.
     * @param {Object=} config The config.
     * @param {Object=} request The request.
     *
     * @returns {CanceledError} The created error.
     */
    function CanceledError(message, config, request) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError, {
      __CANCEL__: true
    });

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     *
     * @returns {object} The response.
     */
    function settle(resolve, reject, response) {
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError(
          'Request failed with status code ' + response.status,
          [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    }

    var cookies = platform.isStandardBrowserEnv ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            const cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })();

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     *
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     *
     * @returns {string} The combined URL
     */
    function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    }

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     *
     * @returns {string} The combined full path
     */
    function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    }

    var isURLSameOrigin = platform.isStandardBrowserEnv ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        const msie = /(msie|trident)/i.test(navigator.userAgent);
        const urlParsingNode = document.createElement('a');
        let originURL;

        /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
        function resolveURL(url) {
          let href = url;

          if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
        return function isURLSameOrigin(requestURL) {
          const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })();

    function parseProtocol(url) {
      const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    }

    /**
     * Calculate data maxRate
     * @param {Number} [samplesCount= 10]
     * @param {Number} [min= 1000]
     * @returns {Function}
     */
    function speedometer(samplesCount, min) {
      samplesCount = samplesCount || 10;
      const bytes = new Array(samplesCount);
      const timestamps = new Array(samplesCount);
      let head = 0;
      let tail = 0;
      let firstSampleTS;

      min = min !== undefined ? min : 1000;

      return function push(chunkLength) {
        const now = Date.now();

        const startedAt = timestamps[tail];

        if (!firstSampleTS) {
          firstSampleTS = now;
        }

        bytes[head] = chunkLength;
        timestamps[head] = now;

        let i = tail;
        let bytesCount = 0;

        while (i !== head) {
          bytesCount += bytes[i++];
          i = i % samplesCount;
        }

        head = (head + 1) % samplesCount;

        if (head === tail) {
          tail = (tail + 1) % samplesCount;
        }

        if (now - firstSampleTS < min) {
          return;
        }

        const passed = startedAt && now - startedAt;

        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
      };
    }

    function progressEventReducer(listener, isDownloadStream) {
      let bytesNotified = 0;
      const _speedometer = speedometer(50, 250);

      return e => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;

        bytesNotified = loaded;

        const data = {
          loaded,
          total,
          progress: total ? (loaded / total) : undefined,
          bytes: progressBytes,
          rate: rate ? rate : undefined,
          estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
          event: e
        };

        data[isDownloadStream ? 'download' : 'upload'] = true;

        listener(data);
      };
    }

    const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

    var xhrAdapter = isXHRAdapterSupported && function (config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
        const responseType = config.responseType;
        let onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
          requestHeaders.setContentType(false); // Let the browser set it
        }

        let request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          const username = config.auth.username || '';
          const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
        }

        const fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          const responseHeaders = AxiosHeaders$1.from(
            'getAllResponseHeaders' in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
            request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (platform.isStandardBrowserEnv) {
          // Add xsrf header
          const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
            && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

          if (xsrfValue) {
            requestHeaders.set(config.xsrfHeaderName, xsrfValue);
          }
        }

        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = cancel => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        const protocol = parseProtocol(fullPath);

        if (protocol && platform.protocols.indexOf(protocol) === -1) {
          reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData || null);
      });
    };

    const knownAdapters = {
      http: httpAdapter,
      xhr: xhrAdapter
    };

    utils.forEach(knownAdapters, (fn, value) => {
      if(fn) {
        try {
          Object.defineProperty(fn, 'name', {value});
        } catch (e) {
          // eslint-disable-next-line no-empty
        }
        Object.defineProperty(fn, 'adapterName', {value});
      }
    });

    var adapters = {
      getAdapter: (adapters) => {
        adapters = utils.isArray(adapters) ? adapters : [adapters];

        const {length} = adapters;
        let nameOrAdapter;
        let adapter;

        for (let i = 0; i < length; i++) {
          nameOrAdapter = adapters[i];
          if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
            break;
          }
        }

        if (!adapter) {
          if (adapter === false) {
            throw new AxiosError(
              `Adapter ${nameOrAdapter} is not supported by the environment`,
              'ERR_NOT_SUPPORT'
            );
          }

          throw new Error(
            utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
              `Adapter '${nameOrAdapter}' is not available in the build` :
              `Unknown adapter '${nameOrAdapter}'`
          );
        }

        if (!utils.isFunction(adapter)) {
          throw new TypeError('adapter is not a function');
        }

        return adapter;
      },
      adapters: knownAdapters
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     *
     * @param {Object} config The config that is to be used for the request
     *
     * @returns {void}
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError(null, config);
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      config.headers = AxiosHeaders$1.from(config.headers);

      // Transform request data
      config.data = transformData.call(
        config,
        config.transformRequest
      );

      if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
        config.headers.setContentType('application/x-www-form-urlencoded', false);
      }

      const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          config.transformResponse,
          response
        );

        response.headers = AxiosHeaders$1.from(response.headers);

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
            reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
          }
        }

        return Promise.reject(reason);
      });
    }

    const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     *
     * @returns {Object} New object resulting from merging config2 to config1
     */
    function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      const config = {};

      function getMergedValue(target, source, caseless) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge.call({caseless}, target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(a, b, caseless) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(a, b, caseless);
        } else if (!utils.isUndefined(a)) {
          return getMergedValue(undefined, a, caseless);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(a, b) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(undefined, b);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(a, b) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(undefined, b);
        } else if (!utils.isUndefined(a)) {
          return getMergedValue(undefined, a);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
          return getMergedValue(a, b);
        } else if (prop in config1) {
          return getMergedValue(undefined, a);
        }
      }

      const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(config1[prop], config2[prop], prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    }

    const VERSION = "1.3.4";

    const validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    const deprecatedWarnings = {};

    /**
     * Transitional option validator
     *
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     *
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return (value, opt, opts) => {
        if (validator === false) {
          throw new AxiosError(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     *
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     *
     * @returns {object}
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let i = keys.length;
      while (i-- > 0) {
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
          const value = options[opt];
          const result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions,
      validators: validators$1
    };

    const validators = validator.validators;

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     *
     * @return {Axios} A new instance of Axios
     */
    class Axios {
      constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager$1(),
          response: new InterceptorManager$1()
        };
      }

      /**
       * Dispatch a request
       *
       * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
       * @param {?Object} config
       *
       * @returns {Promise} The Promise to be fulfilled
       */
      request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === 'string') {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }

        config = mergeConfig(this.defaults, config);

        const {transitional, paramsSerializer, headers} = config;

        if (transitional !== undefined) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }

        if (paramsSerializer !== undefined) {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }

        // Set config.method
        config.method = (config.method || this.defaults.method || 'get').toLowerCase();

        let contextHeaders;

        // Flatten headers
        contextHeaders = headers && utils.merge(
          headers.common,
          headers[config.method]
        );

        contextHeaders && utils.forEach(
          ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
          (method) => {
            delete headers[method];
          }
        );

        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
            return;
          }

          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });

        let promise;
        let i = 0;
        let len;

        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), undefined];
          chain.unshift.apply(chain, requestInterceptorChain);
          chain.push.apply(chain, responseInterceptorChain);
          len = chain.length;

          promise = Promise.resolve(config);

          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }

          return promise;
        }

        len = requestInterceptorChain.length;

        let newConfig = config;

        i = 0;

        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }

        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }

        i = 0;
        len = responseInterceptorChain.length;

        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }

        return promise;
      }

      getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    }

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url,
            data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios$1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @param {Function} executor The executor function.
     *
     * @returns {CancelToken}
     */
    class CancelToken {
      constructor(executor) {
        if (typeof executor !== 'function') {
          throw new TypeError('executor must be a function.');
        }

        let resolvePromise;

        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });

        const token = this;

        // eslint-disable-next-line func-names
        this.promise.then(cancel => {
          if (!token._listeners) return;

          let i = token._listeners.length;

          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });

        // eslint-disable-next-line func-names
        this.promise.then = onfulfilled => {
          let _resolve;
          // eslint-disable-next-line func-names
          const promise = new Promise(resolve => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);

          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };

          return promise;
        };

        executor(function cancel(message, config, request) {
          if (token.reason) {
            // Cancellation has already been requested
            return;
          }

          token.reason = new CanceledError(message, config, request);
          resolvePromise(token.reason);
        });
      }

      /**
       * Throws a `CanceledError` if cancellation has been requested.
       */
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }

      /**
       * Subscribe to the cancel signal
       */

      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }

        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }

      /**
       * Unsubscribe from the cancel signal
       */

      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }

      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    }

    var CancelToken$1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     *
     * @returns {Function}
     */
    function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    }

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     *
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    }

    const HttpStatusCode = {
      Continue: 100,
      SwitchingProtocols: 101,
      Processing: 102,
      EarlyHints: 103,
      Ok: 200,
      Created: 201,
      Accepted: 202,
      NonAuthoritativeInformation: 203,
      NoContent: 204,
      ResetContent: 205,
      PartialContent: 206,
      MultiStatus: 207,
      AlreadyReported: 208,
      ImUsed: 226,
      MultipleChoices: 300,
      MovedPermanently: 301,
      Found: 302,
      SeeOther: 303,
      NotModified: 304,
      UseProxy: 305,
      Unused: 306,
      TemporaryRedirect: 307,
      PermanentRedirect: 308,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentRequired: 402,
      Forbidden: 403,
      NotFound: 404,
      MethodNotAllowed: 405,
      NotAcceptable: 406,
      ProxyAuthenticationRequired: 407,
      RequestTimeout: 408,
      Conflict: 409,
      Gone: 410,
      LengthRequired: 411,
      PreconditionFailed: 412,
      PayloadTooLarge: 413,
      UriTooLong: 414,
      UnsupportedMediaType: 415,
      RangeNotSatisfiable: 416,
      ExpectationFailed: 417,
      ImATeapot: 418,
      MisdirectedRequest: 421,
      UnprocessableEntity: 422,
      Locked: 423,
      FailedDependency: 424,
      TooEarly: 425,
      UpgradeRequired: 426,
      PreconditionRequired: 428,
      TooManyRequests: 429,
      RequestHeaderFieldsTooLarge: 431,
      UnavailableForLegalReasons: 451,
      InternalServerError: 500,
      NotImplemented: 501,
      BadGateway: 502,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      HttpVersionNotSupported: 505,
      VariantAlsoNegotiates: 506,
      InsufficientStorage: 507,
      LoopDetected: 508,
      NotExtended: 510,
      NetworkAuthenticationRequired: 511,
    };

    Object.entries(HttpStatusCode).forEach(([key, value]) => {
      HttpStatusCode[value] = key;
    });

    var HttpStatusCode$1 = HttpStatusCode;

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     *
     * @returns {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      const context = new Axios$1(defaultConfig);
      const instance = bind(Axios$1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

      // Copy context to instance
      utils.extend(instance, context, null, {allOwnKeys: true});

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    const axios = createInstance(defaults$1);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios$1;

    // Expose Cancel & CancelToken
    axios.CanceledError = CanceledError;
    axios.CancelToken = CancelToken$1;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData;

    // Expose AxiosError class
    axios.AxiosError = AxiosError;

    // alias for CanceledError for backward compatibility
    axios.Cancel = axios.CanceledError;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };

    axios.spread = spread;

    // Expose isAxiosError
    axios.isAxiosError = isAxiosError;

    // Expose mergeConfig
    axios.mergeConfig = mergeConfig;

    axios.AxiosHeaders = AxiosHeaders$1;

    axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

    axios.HttpStatusCode = HttpStatusCode$1;

    axios.default = axios;

    // this module should only have a default export
    var axios$1 = axios;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire(path) {
    	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    }

    var momentWithLocalesExports = {};
    var momentWithLocales = {
      get exports(){ return momentWithLocalesExports; },
      set exports(v){ momentWithLocalesExports = v; },
    };

    (function (module, exports) {
    (function (global, factory) {
    	    module.exports = factory() ;
    	}(commonjsGlobal, (function () {
    	    var hookCallback;

    	    function hooks() {
    	        return hookCallback.apply(null, arguments);
    	    }

    	    // This is done to register the method called with moment()
    	    // without creating circular dependencies.
    	    function setHookCallback(callback) {
    	        hookCallback = callback;
    	    }

    	    function isArray(input) {
    	        return (
    	            input instanceof Array ||
    	            Object.prototype.toString.call(input) === '[object Array]'
    	        );
    	    }

    	    function isObject(input) {
    	        // IE8 will treat undefined and null as object if it wasn't for
    	        // input != null
    	        return (
    	            input != null &&
    	            Object.prototype.toString.call(input) === '[object Object]'
    	        );
    	    }

    	    function hasOwnProp(a, b) {
    	        return Object.prototype.hasOwnProperty.call(a, b);
    	    }

    	    function isObjectEmpty(obj) {
    	        if (Object.getOwnPropertyNames) {
    	            return Object.getOwnPropertyNames(obj).length === 0;
    	        } else {
    	            var k;
    	            for (k in obj) {
    	                if (hasOwnProp(obj, k)) {
    	                    return false;
    	                }
    	            }
    	            return true;
    	        }
    	    }

    	    function isUndefined(input) {
    	        return input === void 0;
    	    }

    	    function isNumber(input) {
    	        return (
    	            typeof input === 'number' ||
    	            Object.prototype.toString.call(input) === '[object Number]'
    	        );
    	    }

    	    function isDate(input) {
    	        return (
    	            input instanceof Date ||
    	            Object.prototype.toString.call(input) === '[object Date]'
    	        );
    	    }

    	    function map(arr, fn) {
    	        var res = [],
    	            i,
    	            arrLen = arr.length;
    	        for (i = 0; i < arrLen; ++i) {
    	            res.push(fn(arr[i], i));
    	        }
    	        return res;
    	    }

    	    function extend(a, b) {
    	        for (var i in b) {
    	            if (hasOwnProp(b, i)) {
    	                a[i] = b[i];
    	            }
    	        }

    	        if (hasOwnProp(b, 'toString')) {
    	            a.toString = b.toString;
    	        }

    	        if (hasOwnProp(b, 'valueOf')) {
    	            a.valueOf = b.valueOf;
    	        }

    	        return a;
    	    }

    	    function createUTC(input, format, locale, strict) {
    	        return createLocalOrUTC(input, format, locale, strict, true).utc();
    	    }

    	    function defaultParsingFlags() {
    	        // We need to deep clone this object.
    	        return {
    	            empty: false,
    	            unusedTokens: [],
    	            unusedInput: [],
    	            overflow: -2,
    	            charsLeftOver: 0,
    	            nullInput: false,
    	            invalidEra: null,
    	            invalidMonth: null,
    	            invalidFormat: false,
    	            userInvalidated: false,
    	            iso: false,
    	            parsedDateParts: [],
    	            era: null,
    	            meridiem: null,
    	            rfc2822: false,
    	            weekdayMismatch: false,
    	        };
    	    }

    	    function getParsingFlags(m) {
    	        if (m._pf == null) {
    	            m._pf = defaultParsingFlags();
    	        }
    	        return m._pf;
    	    }

    	    var some;
    	    if (Array.prototype.some) {
    	        some = Array.prototype.some;
    	    } else {
    	        some = function (fun) {
    	            var t = Object(this),
    	                len = t.length >>> 0,
    	                i;

    	            for (i = 0; i < len; i++) {
    	                if (i in t && fun.call(this, t[i], i, t)) {
    	                    return true;
    	                }
    	            }

    	            return false;
    	        };
    	    }

    	    function isValid(m) {
    	        if (m._isValid == null) {
    	            var flags = getParsingFlags(m),
    	                parsedParts = some.call(flags.parsedDateParts, function (i) {
    	                    return i != null;
    	                }),
    	                isNowValid =
    	                    !isNaN(m._d.getTime()) &&
    	                    flags.overflow < 0 &&
    	                    !flags.empty &&
    	                    !flags.invalidEra &&
    	                    !flags.invalidMonth &&
    	                    !flags.invalidWeekday &&
    	                    !flags.weekdayMismatch &&
    	                    !flags.nullInput &&
    	                    !flags.invalidFormat &&
    	                    !flags.userInvalidated &&
    	                    (!flags.meridiem || (flags.meridiem && parsedParts));

    	            if (m._strict) {
    	                isNowValid =
    	                    isNowValid &&
    	                    flags.charsLeftOver === 0 &&
    	                    flags.unusedTokens.length === 0 &&
    	                    flags.bigHour === undefined;
    	            }

    	            if (Object.isFrozen == null || !Object.isFrozen(m)) {
    	                m._isValid = isNowValid;
    	            } else {
    	                return isNowValid;
    	            }
    	        }
    	        return m._isValid;
    	    }

    	    function createInvalid(flags) {
    	        var m = createUTC(NaN);
    	        if (flags != null) {
    	            extend(getParsingFlags(m), flags);
    	        } else {
    	            getParsingFlags(m).userInvalidated = true;
    	        }

    	        return m;
    	    }

    	    // Plugins that add properties should also add the key here (null value),
    	    // so we can properly clone ourselves.
    	    var momentProperties = (hooks.momentProperties = []),
    	        updateInProgress = false;

    	    function copyConfig(to, from) {
    	        var i,
    	            prop,
    	            val,
    	            momentPropertiesLen = momentProperties.length;

    	        if (!isUndefined(from._isAMomentObject)) {
    	            to._isAMomentObject = from._isAMomentObject;
    	        }
    	        if (!isUndefined(from._i)) {
    	            to._i = from._i;
    	        }
    	        if (!isUndefined(from._f)) {
    	            to._f = from._f;
    	        }
    	        if (!isUndefined(from._l)) {
    	            to._l = from._l;
    	        }
    	        if (!isUndefined(from._strict)) {
    	            to._strict = from._strict;
    	        }
    	        if (!isUndefined(from._tzm)) {
    	            to._tzm = from._tzm;
    	        }
    	        if (!isUndefined(from._isUTC)) {
    	            to._isUTC = from._isUTC;
    	        }
    	        if (!isUndefined(from._offset)) {
    	            to._offset = from._offset;
    	        }
    	        if (!isUndefined(from._pf)) {
    	            to._pf = getParsingFlags(from);
    	        }
    	        if (!isUndefined(from._locale)) {
    	            to._locale = from._locale;
    	        }

    	        if (momentPropertiesLen > 0) {
    	            for (i = 0; i < momentPropertiesLen; i++) {
    	                prop = momentProperties[i];
    	                val = from[prop];
    	                if (!isUndefined(val)) {
    	                    to[prop] = val;
    	                }
    	            }
    	        }

    	        return to;
    	    }

    	    // Moment prototype object
    	    function Moment(config) {
    	        copyConfig(this, config);
    	        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    	        if (!this.isValid()) {
    	            this._d = new Date(NaN);
    	        }
    	        // Prevent infinite loop in case updateOffset creates new moment
    	        // objects.
    	        if (updateInProgress === false) {
    	            updateInProgress = true;
    	            hooks.updateOffset(this);
    	            updateInProgress = false;
    	        }
    	    }

    	    function isMoment(obj) {
    	        return (
    	            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
    	        );
    	    }

    	    function warn(msg) {
    	        if (
    	            hooks.suppressDeprecationWarnings === false &&
    	            typeof console !== 'undefined' &&
    	            console.warn
    	        ) {
    	            console.warn('Deprecation warning: ' + msg);
    	        }
    	    }

    	    function deprecate(msg, fn) {
    	        var firstTime = true;

    	        return extend(function () {
    	            if (hooks.deprecationHandler != null) {
    	                hooks.deprecationHandler(null, msg);
    	            }
    	            if (firstTime) {
    	                var args = [],
    	                    arg,
    	                    i,
    	                    key,
    	                    argLen = arguments.length;
    	                for (i = 0; i < argLen; i++) {
    	                    arg = '';
    	                    if (typeof arguments[i] === 'object') {
    	                        arg += '\n[' + i + '] ';
    	                        for (key in arguments[0]) {
    	                            if (hasOwnProp(arguments[0], key)) {
    	                                arg += key + ': ' + arguments[0][key] + ', ';
    	                            }
    	                        }
    	                        arg = arg.slice(0, -2); // Remove trailing comma and space
    	                    } else {
    	                        arg = arguments[i];
    	                    }
    	                    args.push(arg);
    	                }
    	                warn(
    	                    msg +
    	                        '\nArguments: ' +
    	                        Array.prototype.slice.call(args).join('') +
    	                        '\n' +
    	                        new Error().stack
    	                );
    	                firstTime = false;
    	            }
    	            return fn.apply(this, arguments);
    	        }, fn);
    	    }

    	    var deprecations = {};

    	    function deprecateSimple(name, msg) {
    	        if (hooks.deprecationHandler != null) {
    	            hooks.deprecationHandler(name, msg);
    	        }
    	        if (!deprecations[name]) {
    	            warn(msg);
    	            deprecations[name] = true;
    	        }
    	    }

    	    hooks.suppressDeprecationWarnings = false;
    	    hooks.deprecationHandler = null;

    	    function isFunction(input) {
    	        return (
    	            (typeof Function !== 'undefined' && input instanceof Function) ||
    	            Object.prototype.toString.call(input) === '[object Function]'
    	        );
    	    }

    	    function set(config) {
    	        var prop, i;
    	        for (i in config) {
    	            if (hasOwnProp(config, i)) {
    	                prop = config[i];
    	                if (isFunction(prop)) {
    	                    this[i] = prop;
    	                } else {
    	                    this['_' + i] = prop;
    	                }
    	            }
    	        }
    	        this._config = config;
    	        // Lenient ordinal parsing accepts just a number in addition to
    	        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    	        // TODO: Remove "ordinalParse" fallback in next major release.
    	        this._dayOfMonthOrdinalParseLenient = new RegExp(
    	            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
    	                '|' +
    	                /\d{1,2}/.source
    	        );
    	    }

    	    function mergeConfigs(parentConfig, childConfig) {
    	        var res = extend({}, parentConfig),
    	            prop;
    	        for (prop in childConfig) {
    	            if (hasOwnProp(childConfig, prop)) {
    	                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
    	                    res[prop] = {};
    	                    extend(res[prop], parentConfig[prop]);
    	                    extend(res[prop], childConfig[prop]);
    	                } else if (childConfig[prop] != null) {
    	                    res[prop] = childConfig[prop];
    	                } else {
    	                    delete res[prop];
    	                }
    	            }
    	        }
    	        for (prop in parentConfig) {
    	            if (
    	                hasOwnProp(parentConfig, prop) &&
    	                !hasOwnProp(childConfig, prop) &&
    	                isObject(parentConfig[prop])
    	            ) {
    	                // make sure changes to properties don't modify parent config
    	                res[prop] = extend({}, res[prop]);
    	            }
    	        }
    	        return res;
    	    }

    	    function Locale(config) {
    	        if (config != null) {
    	            this.set(config);
    	        }
    	    }

    	    var keys;

    	    if (Object.keys) {
    	        keys = Object.keys;
    	    } else {
    	        keys = function (obj) {
    	            var i,
    	                res = [];
    	            for (i in obj) {
    	                if (hasOwnProp(obj, i)) {
    	                    res.push(i);
    	                }
    	            }
    	            return res;
    	        };
    	    }

    	    var defaultCalendar = {
    	        sameDay: '[Today at] LT',
    	        nextDay: '[Tomorrow at] LT',
    	        nextWeek: 'dddd [at] LT',
    	        lastDay: '[Yesterday at] LT',
    	        lastWeek: '[Last] dddd [at] LT',
    	        sameElse: 'L',
    	    };

    	    function calendar(key, mom, now) {
    	        var output = this._calendar[key] || this._calendar['sameElse'];
    	        return isFunction(output) ? output.call(mom, now) : output;
    	    }

    	    function zeroFill(number, targetLength, forceSign) {
    	        var absNumber = '' + Math.abs(number),
    	            zerosToFill = targetLength - absNumber.length,
    	            sign = number >= 0;
    	        return (
    	            (sign ? (forceSign ? '+' : '') : '-') +
    	            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
    	            absNumber
    	        );
    	    }

    	    var formattingTokens =
    	            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
    	        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
    	        formatFunctions = {},
    	        formatTokenFunctions = {};

    	    // token:    'M'
    	    // padded:   ['MM', 2]
    	    // ordinal:  'Mo'
    	    // callback: function () { this.month() + 1 }
    	    function addFormatToken(token, padded, ordinal, callback) {
    	        var func = callback;
    	        if (typeof callback === 'string') {
    	            func = function () {
    	                return this[callback]();
    	            };
    	        }
    	        if (token) {
    	            formatTokenFunctions[token] = func;
    	        }
    	        if (padded) {
    	            formatTokenFunctions[padded[0]] = function () {
    	                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
    	            };
    	        }
    	        if (ordinal) {
    	            formatTokenFunctions[ordinal] = function () {
    	                return this.localeData().ordinal(
    	                    func.apply(this, arguments),
    	                    token
    	                );
    	            };
    	        }
    	    }

    	    function removeFormattingTokens(input) {
    	        if (input.match(/\[[\s\S]/)) {
    	            return input.replace(/^\[|\]$/g, '');
    	        }
    	        return input.replace(/\\/g, '');
    	    }

    	    function makeFormatFunction(format) {
    	        var array = format.match(formattingTokens),
    	            i,
    	            length;

    	        for (i = 0, length = array.length; i < length; i++) {
    	            if (formatTokenFunctions[array[i]]) {
    	                array[i] = formatTokenFunctions[array[i]];
    	            } else {
    	                array[i] = removeFormattingTokens(array[i]);
    	            }
    	        }

    	        return function (mom) {
    	            var output = '',
    	                i;
    	            for (i = 0; i < length; i++) {
    	                output += isFunction(array[i])
    	                    ? array[i].call(mom, format)
    	                    : array[i];
    	            }
    	            return output;
    	        };
    	    }

    	    // format date using native date object
    	    function formatMoment(m, format) {
    	        if (!m.isValid()) {
    	            return m.localeData().invalidDate();
    	        }

    	        format = expandFormat(format, m.localeData());
    	        formatFunctions[format] =
    	            formatFunctions[format] || makeFormatFunction(format);

    	        return formatFunctions[format](m);
    	    }

    	    function expandFormat(format, locale) {
    	        var i = 5;

    	        function replaceLongDateFormatTokens(input) {
    	            return locale.longDateFormat(input) || input;
    	        }

    	        localFormattingTokens.lastIndex = 0;
    	        while (i >= 0 && localFormattingTokens.test(format)) {
    	            format = format.replace(
    	                localFormattingTokens,
    	                replaceLongDateFormatTokens
    	            );
    	            localFormattingTokens.lastIndex = 0;
    	            i -= 1;
    	        }

    	        return format;
    	    }

    	    var defaultLongDateFormat = {
    	        LTS: 'h:mm:ss A',
    	        LT: 'h:mm A',
    	        L: 'MM/DD/YYYY',
    	        LL: 'MMMM D, YYYY',
    	        LLL: 'MMMM D, YYYY h:mm A',
    	        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    	    };

    	    function longDateFormat(key) {
    	        var format = this._longDateFormat[key],
    	            formatUpper = this._longDateFormat[key.toUpperCase()];

    	        if (format || !formatUpper) {
    	            return format;
    	        }

    	        this._longDateFormat[key] = formatUpper
    	            .match(formattingTokens)
    	            .map(function (tok) {
    	                if (
    	                    tok === 'MMMM' ||
    	                    tok === 'MM' ||
    	                    tok === 'DD' ||
    	                    tok === 'dddd'
    	                ) {
    	                    return tok.slice(1);
    	                }
    	                return tok;
    	            })
    	            .join('');

    	        return this._longDateFormat[key];
    	    }

    	    var defaultInvalidDate = 'Invalid date';

    	    function invalidDate() {
    	        return this._invalidDate;
    	    }

    	    var defaultOrdinal = '%d',
    	        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    	    function ordinal(number) {
    	        return this._ordinal.replace('%d', number);
    	    }

    	    var defaultRelativeTime = {
    	        future: 'in %s',
    	        past: '%s ago',
    	        s: 'a few seconds',
    	        ss: '%d seconds',
    	        m: 'a minute',
    	        mm: '%d minutes',
    	        h: 'an hour',
    	        hh: '%d hours',
    	        d: 'a day',
    	        dd: '%d days',
    	        w: 'a week',
    	        ww: '%d weeks',
    	        M: 'a month',
    	        MM: '%d months',
    	        y: 'a year',
    	        yy: '%d years',
    	    };

    	    function relativeTime(number, withoutSuffix, string, isFuture) {
    	        var output = this._relativeTime[string];
    	        return isFunction(output)
    	            ? output(number, withoutSuffix, string, isFuture)
    	            : output.replace(/%d/i, number);
    	    }

    	    function pastFuture(diff, output) {
    	        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    	        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    	    }

    	    var aliases = {};

    	    function addUnitAlias(unit, shorthand) {
    	        var lowerCase = unit.toLowerCase();
    	        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    	    }

    	    function normalizeUnits(units) {
    	        return typeof units === 'string'
    	            ? aliases[units] || aliases[units.toLowerCase()]
    	            : undefined;
    	    }

    	    function normalizeObjectUnits(inputObject) {
    	        var normalizedInput = {},
    	            normalizedProp,
    	            prop;

    	        for (prop in inputObject) {
    	            if (hasOwnProp(inputObject, prop)) {
    	                normalizedProp = normalizeUnits(prop);
    	                if (normalizedProp) {
    	                    normalizedInput[normalizedProp] = inputObject[prop];
    	                }
    	            }
    	        }

    	        return normalizedInput;
    	    }

    	    var priorities = {};

    	    function addUnitPriority(unit, priority) {
    	        priorities[unit] = priority;
    	    }

    	    function getPrioritizedUnits(unitsObj) {
    	        var units = [],
    	            u;
    	        for (u in unitsObj) {
    	            if (hasOwnProp(unitsObj, u)) {
    	                units.push({ unit: u, priority: priorities[u] });
    	            }
    	        }
    	        units.sort(function (a, b) {
    	            return a.priority - b.priority;
    	        });
    	        return units;
    	    }

    	    function isLeapYear(year) {
    	        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    	    }

    	    function absFloor(number) {
    	        if (number < 0) {
    	            // -0 -> 0
    	            return Math.ceil(number) || 0;
    	        } else {
    	            return Math.floor(number);
    	        }
    	    }

    	    function toInt(argumentForCoercion) {
    	        var coercedNumber = +argumentForCoercion,
    	            value = 0;

    	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
    	            value = absFloor(coercedNumber);
    	        }

    	        return value;
    	    }

    	    function makeGetSet(unit, keepTime) {
    	        return function (value) {
    	            if (value != null) {
    	                set$1(this, unit, value);
    	                hooks.updateOffset(this, keepTime);
    	                return this;
    	            } else {
    	                return get(this, unit);
    	            }
    	        };
    	    }

    	    function get(mom, unit) {
    	        return mom.isValid()
    	            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
    	            : NaN;
    	    }

    	    function set$1(mom, unit, value) {
    	        if (mom.isValid() && !isNaN(value)) {
    	            if (
    	                unit === 'FullYear' &&
    	                isLeapYear(mom.year()) &&
    	                mom.month() === 1 &&
    	                mom.date() === 29
    	            ) {
    	                value = toInt(value);
    	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
    	                    value,
    	                    mom.month(),
    	                    daysInMonth(value, mom.month())
    	                );
    	            } else {
    	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    	            }
    	        }
    	    }

    	    // MOMENTS

    	    function stringGet(units) {
    	        units = normalizeUnits(units);
    	        if (isFunction(this[units])) {
    	            return this[units]();
    	        }
    	        return this;
    	    }

    	    function stringSet(units, value) {
    	        if (typeof units === 'object') {
    	            units = normalizeObjectUnits(units);
    	            var prioritized = getPrioritizedUnits(units),
    	                i,
    	                prioritizedLen = prioritized.length;
    	            for (i = 0; i < prioritizedLen; i++) {
    	                this[prioritized[i].unit](units[prioritized[i].unit]);
    	            }
    	        } else {
    	            units = normalizeUnits(units);
    	            if (isFunction(this[units])) {
    	                return this[units](value);
    	            }
    	        }
    	        return this;
    	    }

    	    var match1 = /\d/, //       0 - 9
    	        match2 = /\d\d/, //      00 - 99
    	        match3 = /\d{3}/, //     000 - 999
    	        match4 = /\d{4}/, //    0000 - 9999
    	        match6 = /[+-]?\d{6}/, // -999999 - 999999
    	        match1to2 = /\d\d?/, //       0 - 99
    	        match3to4 = /\d\d\d\d?/, //     999 - 9999
    	        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
    	        match1to3 = /\d{1,3}/, //       0 - 999
    	        match1to4 = /\d{1,4}/, //       0 - 9999
    	        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
    	        matchUnsigned = /\d+/, //       0 - inf
    	        matchSigned = /[+-]?\d+/, //    -inf - inf
    	        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
    	        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
    	        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
    	        // any word (or two) characters or numbers including two/three word month in arabic.
    	        // includes scottish gaelic two word and hyphenated months
    	        matchWord =
    	            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
    	        regexes;

    	    regexes = {};

    	    function addRegexToken(token, regex, strictRegex) {
    	        regexes[token] = isFunction(regex)
    	            ? regex
    	            : function (isStrict, localeData) {
    	                  return isStrict && strictRegex ? strictRegex : regex;
    	              };
    	    }

    	    function getParseRegexForToken(token, config) {
    	        if (!hasOwnProp(regexes, token)) {
    	            return new RegExp(unescapeFormat(token));
    	        }

    	        return regexes[token](config._strict, config._locale);
    	    }

    	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    	    function unescapeFormat(s) {
    	        return regexEscape(
    	            s
    	                .replace('\\', '')
    	                .replace(
    	                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
    	                    function (matched, p1, p2, p3, p4) {
    	                        return p1 || p2 || p3 || p4;
    	                    }
    	                )
    	        );
    	    }

    	    function regexEscape(s) {
    	        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    	    }

    	    var tokens = {};

    	    function addParseToken(token, callback) {
    	        var i,
    	            func = callback,
    	            tokenLen;
    	        if (typeof token === 'string') {
    	            token = [token];
    	        }
    	        if (isNumber(callback)) {
    	            func = function (input, array) {
    	                array[callback] = toInt(input);
    	            };
    	        }
    	        tokenLen = token.length;
    	        for (i = 0; i < tokenLen; i++) {
    	            tokens[token[i]] = func;
    	        }
    	    }

    	    function addWeekParseToken(token, callback) {
    	        addParseToken(token, function (input, array, config, token) {
    	            config._w = config._w || {};
    	            callback(input, config._w, config, token);
    	        });
    	    }

    	    function addTimeToArrayFromToken(token, input, config) {
    	        if (input != null && hasOwnProp(tokens, token)) {
    	            tokens[token](input, config._a, config, token);
    	        }
    	    }

    	    var YEAR = 0,
    	        MONTH = 1,
    	        DATE = 2,
    	        HOUR = 3,
    	        MINUTE = 4,
    	        SECOND = 5,
    	        MILLISECOND = 6,
    	        WEEK = 7,
    	        WEEKDAY = 8;

    	    function mod(n, x) {
    	        return ((n % x) + x) % x;
    	    }

    	    var indexOf;

    	    if (Array.prototype.indexOf) {
    	        indexOf = Array.prototype.indexOf;
    	    } else {
    	        indexOf = function (o) {
    	            // I know
    	            var i;
    	            for (i = 0; i < this.length; ++i) {
    	                if (this[i] === o) {
    	                    return i;
    	                }
    	            }
    	            return -1;
    	        };
    	    }

    	    function daysInMonth(year, month) {
    	        if (isNaN(year) || isNaN(month)) {
    	            return NaN;
    	        }
    	        var modMonth = mod(month, 12);
    	        year += (month - modMonth) / 12;
    	        return modMonth === 1
    	            ? isLeapYear(year)
    	                ? 29
    	                : 28
    	            : 31 - ((modMonth % 7) % 2);
    	    }

    	    // FORMATTING

    	    addFormatToken('M', ['MM', 2], 'Mo', function () {
    	        return this.month() + 1;
    	    });

    	    addFormatToken('MMM', 0, 0, function (format) {
    	        return this.localeData().monthsShort(this, format);
    	    });

    	    addFormatToken('MMMM', 0, 0, function (format) {
    	        return this.localeData().months(this, format);
    	    });

    	    // ALIASES

    	    addUnitAlias('month', 'M');

    	    // PRIORITY

    	    addUnitPriority('month', 8);

    	    // PARSING

    	    addRegexToken('M', match1to2);
    	    addRegexToken('MM', match1to2, match2);
    	    addRegexToken('MMM', function (isStrict, locale) {
    	        return locale.monthsShortRegex(isStrict);
    	    });
    	    addRegexToken('MMMM', function (isStrict, locale) {
    	        return locale.monthsRegex(isStrict);
    	    });

    	    addParseToken(['M', 'MM'], function (input, array) {
    	        array[MONTH] = toInt(input) - 1;
    	    });

    	    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    	        var month = config._locale.monthsParse(input, token, config._strict);
    	        // if we didn't find a month name, mark the date as invalid.
    	        if (month != null) {
    	            array[MONTH] = month;
    	        } else {
    	            getParsingFlags(config).invalidMonth = input;
    	        }
    	    });

    	    // LOCALES

    	    var defaultLocaleMonths =
    	            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	                '_'
    	            ),
    	        defaultLocaleMonthsShort =
    	            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
    	        defaultMonthsShortRegex = matchWord,
    	        defaultMonthsRegex = matchWord;

    	    function localeMonths(m, format) {
    	        if (!m) {
    	            return isArray(this._months)
    	                ? this._months
    	                : this._months['standalone'];
    	        }
    	        return isArray(this._months)
    	            ? this._months[m.month()]
    	            : this._months[
    	                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
    	                      ? 'format'
    	                      : 'standalone'
    	              ][m.month()];
    	    }

    	    function localeMonthsShort(m, format) {
    	        if (!m) {
    	            return isArray(this._monthsShort)
    	                ? this._monthsShort
    	                : this._monthsShort['standalone'];
    	        }
    	        return isArray(this._monthsShort)
    	            ? this._monthsShort[m.month()]
    	            : this._monthsShort[
    	                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
    	              ][m.month()];
    	    }

    	    function handleStrictParse(monthName, format, strict) {
    	        var i,
    	            ii,
    	            mom,
    	            llc = monthName.toLocaleLowerCase();
    	        if (!this._monthsParse) {
    	            // this is not used
    	            this._monthsParse = [];
    	            this._longMonthsParse = [];
    	            this._shortMonthsParse = [];
    	            for (i = 0; i < 12; ++i) {
    	                mom = createUTC([2000, i]);
    	                this._shortMonthsParse[i] = this.monthsShort(
    	                    mom,
    	                    ''
    	                ).toLocaleLowerCase();
    	                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
    	            }
    	        }

    	        if (strict) {
    	            if (format === 'MMM') {
    	                ii = indexOf.call(this._shortMonthsParse, llc);
    	                return ii !== -1 ? ii : null;
    	            } else {
    	                ii = indexOf.call(this._longMonthsParse, llc);
    	                return ii !== -1 ? ii : null;
    	            }
    	        } else {
    	            if (format === 'MMM') {
    	                ii = indexOf.call(this._shortMonthsParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._longMonthsParse, llc);
    	                return ii !== -1 ? ii : null;
    	            } else {
    	                ii = indexOf.call(this._longMonthsParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._shortMonthsParse, llc);
    	                return ii !== -1 ? ii : null;
    	            }
    	        }
    	    }

    	    function localeMonthsParse(monthName, format, strict) {
    	        var i, mom, regex;

    	        if (this._monthsParseExact) {
    	            return handleStrictParse.call(this, monthName, format, strict);
    	        }

    	        if (!this._monthsParse) {
    	            this._monthsParse = [];
    	            this._longMonthsParse = [];
    	            this._shortMonthsParse = [];
    	        }

    	        // TODO: add sorting
    	        // Sorting makes sure if one month (or abbr) is a prefix of another
    	        // see sorting in computeMonthsParse
    	        for (i = 0; i < 12; i++) {
    	            // make the regex if we don't have it already
    	            mom = createUTC([2000, i]);
    	            if (strict && !this._longMonthsParse[i]) {
    	                this._longMonthsParse[i] = new RegExp(
    	                    '^' + this.months(mom, '').replace('.', '') + '$',
    	                    'i'
    	                );
    	                this._shortMonthsParse[i] = new RegExp(
    	                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
    	                    'i'
    	                );
    	            }
    	            if (!strict && !this._monthsParse[i]) {
    	                regex =
    	                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
    	                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
    	            }
    	            // test the regex
    	            if (
    	                strict &&
    	                format === 'MMMM' &&
    	                this._longMonthsParse[i].test(monthName)
    	            ) {
    	                return i;
    	            } else if (
    	                strict &&
    	                format === 'MMM' &&
    	                this._shortMonthsParse[i].test(monthName)
    	            ) {
    	                return i;
    	            } else if (!strict && this._monthsParse[i].test(monthName)) {
    	                return i;
    	            }
    	        }
    	    }

    	    // MOMENTS

    	    function setMonth(mom, value) {
    	        var dayOfMonth;

    	        if (!mom.isValid()) {
    	            // No op
    	            return mom;
    	        }

    	        if (typeof value === 'string') {
    	            if (/^\d+$/.test(value)) {
    	                value = toInt(value);
    	            } else {
    	                value = mom.localeData().monthsParse(value);
    	                // TODO: Another silent failure?
    	                if (!isNumber(value)) {
    	                    return mom;
    	                }
    	            }
    	        }

    	        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    	        return mom;
    	    }

    	    function getSetMonth(value) {
    	        if (value != null) {
    	            setMonth(this, value);
    	            hooks.updateOffset(this, true);
    	            return this;
    	        } else {
    	            return get(this, 'Month');
    	        }
    	    }

    	    function getDaysInMonth() {
    	        return daysInMonth(this.year(), this.month());
    	    }

    	    function monthsShortRegex(isStrict) {
    	        if (this._monthsParseExact) {
    	            if (!hasOwnProp(this, '_monthsRegex')) {
    	                computeMonthsParse.call(this);
    	            }
    	            if (isStrict) {
    	                return this._monthsShortStrictRegex;
    	            } else {
    	                return this._monthsShortRegex;
    	            }
    	        } else {
    	            if (!hasOwnProp(this, '_monthsShortRegex')) {
    	                this._monthsShortRegex = defaultMonthsShortRegex;
    	            }
    	            return this._monthsShortStrictRegex && isStrict
    	                ? this._monthsShortStrictRegex
    	                : this._monthsShortRegex;
    	        }
    	    }

    	    function monthsRegex(isStrict) {
    	        if (this._monthsParseExact) {
    	            if (!hasOwnProp(this, '_monthsRegex')) {
    	                computeMonthsParse.call(this);
    	            }
    	            if (isStrict) {
    	                return this._monthsStrictRegex;
    	            } else {
    	                return this._monthsRegex;
    	            }
    	        } else {
    	            if (!hasOwnProp(this, '_monthsRegex')) {
    	                this._monthsRegex = defaultMonthsRegex;
    	            }
    	            return this._monthsStrictRegex && isStrict
    	                ? this._monthsStrictRegex
    	                : this._monthsRegex;
    	        }
    	    }

    	    function computeMonthsParse() {
    	        function cmpLenRev(a, b) {
    	            return b.length - a.length;
    	        }

    	        var shortPieces = [],
    	            longPieces = [],
    	            mixedPieces = [],
    	            i,
    	            mom;
    	        for (i = 0; i < 12; i++) {
    	            // make the regex if we don't have it already
    	            mom = createUTC([2000, i]);
    	            shortPieces.push(this.monthsShort(mom, ''));
    	            longPieces.push(this.months(mom, ''));
    	            mixedPieces.push(this.months(mom, ''));
    	            mixedPieces.push(this.monthsShort(mom, ''));
    	        }
    	        // Sorting makes sure if one month (or abbr) is a prefix of another it
    	        // will match the longer piece.
    	        shortPieces.sort(cmpLenRev);
    	        longPieces.sort(cmpLenRev);
    	        mixedPieces.sort(cmpLenRev);
    	        for (i = 0; i < 12; i++) {
    	            shortPieces[i] = regexEscape(shortPieces[i]);
    	            longPieces[i] = regexEscape(longPieces[i]);
    	        }
    	        for (i = 0; i < 24; i++) {
    	            mixedPieces[i] = regexEscape(mixedPieces[i]);
    	        }

    	        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    	        this._monthsShortRegex = this._monthsRegex;
    	        this._monthsStrictRegex = new RegExp(
    	            '^(' + longPieces.join('|') + ')',
    	            'i'
    	        );
    	        this._monthsShortStrictRegex = new RegExp(
    	            '^(' + shortPieces.join('|') + ')',
    	            'i'
    	        );
    	    }

    	    // FORMATTING

    	    addFormatToken('Y', 0, 0, function () {
    	        var y = this.year();
    	        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    	    });

    	    addFormatToken(0, ['YY', 2], 0, function () {
    	        return this.year() % 100;
    	    });

    	    addFormatToken(0, ['YYYY', 4], 0, 'year');
    	    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    	    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    	    // ALIASES

    	    addUnitAlias('year', 'y');

    	    // PRIORITIES

    	    addUnitPriority('year', 1);

    	    // PARSING

    	    addRegexToken('Y', matchSigned);
    	    addRegexToken('YY', match1to2, match2);
    	    addRegexToken('YYYY', match1to4, match4);
    	    addRegexToken('YYYYY', match1to6, match6);
    	    addRegexToken('YYYYYY', match1to6, match6);

    	    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    	    addParseToken('YYYY', function (input, array) {
    	        array[YEAR] =
    	            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    	    });
    	    addParseToken('YY', function (input, array) {
    	        array[YEAR] = hooks.parseTwoDigitYear(input);
    	    });
    	    addParseToken('Y', function (input, array) {
    	        array[YEAR] = parseInt(input, 10);
    	    });

    	    // HELPERS

    	    function daysInYear(year) {
    	        return isLeapYear(year) ? 366 : 365;
    	    }

    	    // HOOKS

    	    hooks.parseTwoDigitYear = function (input) {
    	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    	    };

    	    // MOMENTS

    	    var getSetYear = makeGetSet('FullYear', true);

    	    function getIsLeapYear() {
    	        return isLeapYear(this.year());
    	    }

    	    function createDate(y, m, d, h, M, s, ms) {
    	        // can't just apply() to create a date:
    	        // https://stackoverflow.com/q/181348
    	        var date;
    	        // the date constructor remaps years 0-99 to 1900-1999
    	        if (y < 100 && y >= 0) {
    	            // preserve leap years using a full 400 year cycle, then reset
    	            date = new Date(y + 400, m, d, h, M, s, ms);
    	            if (isFinite(date.getFullYear())) {
    	                date.setFullYear(y);
    	            }
    	        } else {
    	            date = new Date(y, m, d, h, M, s, ms);
    	        }

    	        return date;
    	    }

    	    function createUTCDate(y) {
    	        var date, args;
    	        // the Date.UTC function remaps years 0-99 to 1900-1999
    	        if (y < 100 && y >= 0) {
    	            args = Array.prototype.slice.call(arguments);
    	            // preserve leap years using a full 400 year cycle, then reset
    	            args[0] = y + 400;
    	            date = new Date(Date.UTC.apply(null, args));
    	            if (isFinite(date.getUTCFullYear())) {
    	                date.setUTCFullYear(y);
    	            }
    	        } else {
    	            date = new Date(Date.UTC.apply(null, arguments));
    	        }

    	        return date;
    	    }

    	    // start-of-first-week - start-of-year
    	    function firstWeekOffset(year, dow, doy) {
    	        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
    	            fwd = 7 + dow - doy,
    	            // first-week day local weekday -- which local weekday is fwd
    	            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    	        return -fwdlw + fwd - 1;
    	    }

    	    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    	    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    	        var localWeekday = (7 + weekday - dow) % 7,
    	            weekOffset = firstWeekOffset(year, dow, doy),
    	            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
    	            resYear,
    	            resDayOfYear;

    	        if (dayOfYear <= 0) {
    	            resYear = year - 1;
    	            resDayOfYear = daysInYear(resYear) + dayOfYear;
    	        } else if (dayOfYear > daysInYear(year)) {
    	            resYear = year + 1;
    	            resDayOfYear = dayOfYear - daysInYear(year);
    	        } else {
    	            resYear = year;
    	            resDayOfYear = dayOfYear;
    	        }

    	        return {
    	            year: resYear,
    	            dayOfYear: resDayOfYear,
    	        };
    	    }

    	    function weekOfYear(mom, dow, doy) {
    	        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
    	            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
    	            resWeek,
    	            resYear;

    	        if (week < 1) {
    	            resYear = mom.year() - 1;
    	            resWeek = week + weeksInYear(resYear, dow, doy);
    	        } else if (week > weeksInYear(mom.year(), dow, doy)) {
    	            resWeek = week - weeksInYear(mom.year(), dow, doy);
    	            resYear = mom.year() + 1;
    	        } else {
    	            resYear = mom.year();
    	            resWeek = week;
    	        }

    	        return {
    	            week: resWeek,
    	            year: resYear,
    	        };
    	    }

    	    function weeksInYear(year, dow, doy) {
    	        var weekOffset = firstWeekOffset(year, dow, doy),
    	            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    	        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    	    }

    	    // FORMATTING

    	    addFormatToken('w', ['ww', 2], 'wo', 'week');
    	    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    	    // ALIASES

    	    addUnitAlias('week', 'w');
    	    addUnitAlias('isoWeek', 'W');

    	    // PRIORITIES

    	    addUnitPriority('week', 5);
    	    addUnitPriority('isoWeek', 5);

    	    // PARSING

    	    addRegexToken('w', match1to2);
    	    addRegexToken('ww', match1to2, match2);
    	    addRegexToken('W', match1to2);
    	    addRegexToken('WW', match1to2, match2);

    	    addWeekParseToken(
    	        ['w', 'ww', 'W', 'WW'],
    	        function (input, week, config, token) {
    	            week[token.substr(0, 1)] = toInt(input);
    	        }
    	    );

    	    // HELPERS

    	    // LOCALES

    	    function localeWeek(mom) {
    	        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    	    }

    	    var defaultLocaleWeek = {
    	        dow: 0, // Sunday is the first day of the week.
    	        doy: 6, // The week that contains Jan 6th is the first week of the year.
    	    };

    	    function localeFirstDayOfWeek() {
    	        return this._week.dow;
    	    }

    	    function localeFirstDayOfYear() {
    	        return this._week.doy;
    	    }

    	    // MOMENTS

    	    function getSetWeek(input) {
    	        var week = this.localeData().week(this);
    	        return input == null ? week : this.add((input - week) * 7, 'd');
    	    }

    	    function getSetISOWeek(input) {
    	        var week = weekOfYear(this, 1, 4).week;
    	        return input == null ? week : this.add((input - week) * 7, 'd');
    	    }

    	    // FORMATTING

    	    addFormatToken('d', 0, 'do', 'day');

    	    addFormatToken('dd', 0, 0, function (format) {
    	        return this.localeData().weekdaysMin(this, format);
    	    });

    	    addFormatToken('ddd', 0, 0, function (format) {
    	        return this.localeData().weekdaysShort(this, format);
    	    });

    	    addFormatToken('dddd', 0, 0, function (format) {
    	        return this.localeData().weekdays(this, format);
    	    });

    	    addFormatToken('e', 0, 0, 'weekday');
    	    addFormatToken('E', 0, 0, 'isoWeekday');

    	    // ALIASES

    	    addUnitAlias('day', 'd');
    	    addUnitAlias('weekday', 'e');
    	    addUnitAlias('isoWeekday', 'E');

    	    // PRIORITY
    	    addUnitPriority('day', 11);
    	    addUnitPriority('weekday', 11);
    	    addUnitPriority('isoWeekday', 11);

    	    // PARSING

    	    addRegexToken('d', match1to2);
    	    addRegexToken('e', match1to2);
    	    addRegexToken('E', match1to2);
    	    addRegexToken('dd', function (isStrict, locale) {
    	        return locale.weekdaysMinRegex(isStrict);
    	    });
    	    addRegexToken('ddd', function (isStrict, locale) {
    	        return locale.weekdaysShortRegex(isStrict);
    	    });
    	    addRegexToken('dddd', function (isStrict, locale) {
    	        return locale.weekdaysRegex(isStrict);
    	    });

    	    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    	        var weekday = config._locale.weekdaysParse(input, token, config._strict);
    	        // if we didn't get a weekday name, mark the date as invalid
    	        if (weekday != null) {
    	            week.d = weekday;
    	        } else {
    	            getParsingFlags(config).invalidWeekday = input;
    	        }
    	    });

    	    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    	        week[token] = toInt(input);
    	    });

    	    // HELPERS

    	    function parseWeekday(input, locale) {
    	        if (typeof input !== 'string') {
    	            return input;
    	        }

    	        if (!isNaN(input)) {
    	            return parseInt(input, 10);
    	        }

    	        input = locale.weekdaysParse(input);
    	        if (typeof input === 'number') {
    	            return input;
    	        }

    	        return null;
    	    }

    	    function parseIsoWeekday(input, locale) {
    	        if (typeof input === 'string') {
    	            return locale.weekdaysParse(input) % 7 || 7;
    	        }
    	        return isNaN(input) ? null : input;
    	    }

    	    // LOCALES
    	    function shiftWeekdays(ws, n) {
    	        return ws.slice(n, 7).concat(ws.slice(0, n));
    	    }

    	    var defaultLocaleWeekdays =
    	            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    	        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        defaultWeekdaysRegex = matchWord,
    	        defaultWeekdaysShortRegex = matchWord,
    	        defaultWeekdaysMinRegex = matchWord;

    	    function localeWeekdays(m, format) {
    	        var weekdays = isArray(this._weekdays)
    	            ? this._weekdays
    	            : this._weekdays[
    	                  m && m !== true && this._weekdays.isFormat.test(format)
    	                      ? 'format'
    	                      : 'standalone'
    	              ];
    	        return m === true
    	            ? shiftWeekdays(weekdays, this._week.dow)
    	            : m
    	            ? weekdays[m.day()]
    	            : weekdays;
    	    }

    	    function localeWeekdaysShort(m) {
    	        return m === true
    	            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
    	            : m
    	            ? this._weekdaysShort[m.day()]
    	            : this._weekdaysShort;
    	    }

    	    function localeWeekdaysMin(m) {
    	        return m === true
    	            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
    	            : m
    	            ? this._weekdaysMin[m.day()]
    	            : this._weekdaysMin;
    	    }

    	    function handleStrictParse$1(weekdayName, format, strict) {
    	        var i,
    	            ii,
    	            mom,
    	            llc = weekdayName.toLocaleLowerCase();
    	        if (!this._weekdaysParse) {
    	            this._weekdaysParse = [];
    	            this._shortWeekdaysParse = [];
    	            this._minWeekdaysParse = [];

    	            for (i = 0; i < 7; ++i) {
    	                mom = createUTC([2000, 1]).day(i);
    	                this._minWeekdaysParse[i] = this.weekdaysMin(
    	                    mom,
    	                    ''
    	                ).toLocaleLowerCase();
    	                this._shortWeekdaysParse[i] = this.weekdaysShort(
    	                    mom,
    	                    ''
    	                ).toLocaleLowerCase();
    	                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
    	            }
    	        }

    	        if (strict) {
    	            if (format === 'dddd') {
    	                ii = indexOf.call(this._weekdaysParse, llc);
    	                return ii !== -1 ? ii : null;
    	            } else if (format === 'ddd') {
    	                ii = indexOf.call(this._shortWeekdaysParse, llc);
    	                return ii !== -1 ? ii : null;
    	            } else {
    	                ii = indexOf.call(this._minWeekdaysParse, llc);
    	                return ii !== -1 ? ii : null;
    	            }
    	        } else {
    	            if (format === 'dddd') {
    	                ii = indexOf.call(this._weekdaysParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._shortWeekdaysParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._minWeekdaysParse, llc);
    	                return ii !== -1 ? ii : null;
    	            } else if (format === 'ddd') {
    	                ii = indexOf.call(this._shortWeekdaysParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._weekdaysParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._minWeekdaysParse, llc);
    	                return ii !== -1 ? ii : null;
    	            } else {
    	                ii = indexOf.call(this._minWeekdaysParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._weekdaysParse, llc);
    	                if (ii !== -1) {
    	                    return ii;
    	                }
    	                ii = indexOf.call(this._shortWeekdaysParse, llc);
    	                return ii !== -1 ? ii : null;
    	            }
    	        }
    	    }

    	    function localeWeekdaysParse(weekdayName, format, strict) {
    	        var i, mom, regex;

    	        if (this._weekdaysParseExact) {
    	            return handleStrictParse$1.call(this, weekdayName, format, strict);
    	        }

    	        if (!this._weekdaysParse) {
    	            this._weekdaysParse = [];
    	            this._minWeekdaysParse = [];
    	            this._shortWeekdaysParse = [];
    	            this._fullWeekdaysParse = [];
    	        }

    	        for (i = 0; i < 7; i++) {
    	            // make the regex if we don't have it already

    	            mom = createUTC([2000, 1]).day(i);
    	            if (strict && !this._fullWeekdaysParse[i]) {
    	                this._fullWeekdaysParse[i] = new RegExp(
    	                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
    	                    'i'
    	                );
    	                this._shortWeekdaysParse[i] = new RegExp(
    	                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
    	                    'i'
    	                );
    	                this._minWeekdaysParse[i] = new RegExp(
    	                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
    	                    'i'
    	                );
    	            }
    	            if (!this._weekdaysParse[i]) {
    	                regex =
    	                    '^' +
    	                    this.weekdays(mom, '') +
    	                    '|^' +
    	                    this.weekdaysShort(mom, '') +
    	                    '|^' +
    	                    this.weekdaysMin(mom, '');
    	                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
    	            }
    	            // test the regex
    	            if (
    	                strict &&
    	                format === 'dddd' &&
    	                this._fullWeekdaysParse[i].test(weekdayName)
    	            ) {
    	                return i;
    	            } else if (
    	                strict &&
    	                format === 'ddd' &&
    	                this._shortWeekdaysParse[i].test(weekdayName)
    	            ) {
    	                return i;
    	            } else if (
    	                strict &&
    	                format === 'dd' &&
    	                this._minWeekdaysParse[i].test(weekdayName)
    	            ) {
    	                return i;
    	            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
    	                return i;
    	            }
    	        }
    	    }

    	    // MOMENTS

    	    function getSetDayOfWeek(input) {
    	        if (!this.isValid()) {
    	            return input != null ? this : NaN;
    	        }
    	        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    	        if (input != null) {
    	            input = parseWeekday(input, this.localeData());
    	            return this.add(input - day, 'd');
    	        } else {
    	            return day;
    	        }
    	    }

    	    function getSetLocaleDayOfWeek(input) {
    	        if (!this.isValid()) {
    	            return input != null ? this : NaN;
    	        }
    	        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    	        return input == null ? weekday : this.add(input - weekday, 'd');
    	    }

    	    function getSetISODayOfWeek(input) {
    	        if (!this.isValid()) {
    	            return input != null ? this : NaN;
    	        }

    	        // behaves the same as moment#day except
    	        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    	        // as a setter, sunday should belong to the previous week.

    	        if (input != null) {
    	            var weekday = parseIsoWeekday(input, this.localeData());
    	            return this.day(this.day() % 7 ? weekday : weekday - 7);
    	        } else {
    	            return this.day() || 7;
    	        }
    	    }

    	    function weekdaysRegex(isStrict) {
    	        if (this._weekdaysParseExact) {
    	            if (!hasOwnProp(this, '_weekdaysRegex')) {
    	                computeWeekdaysParse.call(this);
    	            }
    	            if (isStrict) {
    	                return this._weekdaysStrictRegex;
    	            } else {
    	                return this._weekdaysRegex;
    	            }
    	        } else {
    	            if (!hasOwnProp(this, '_weekdaysRegex')) {
    	                this._weekdaysRegex = defaultWeekdaysRegex;
    	            }
    	            return this._weekdaysStrictRegex && isStrict
    	                ? this._weekdaysStrictRegex
    	                : this._weekdaysRegex;
    	        }
    	    }

    	    function weekdaysShortRegex(isStrict) {
    	        if (this._weekdaysParseExact) {
    	            if (!hasOwnProp(this, '_weekdaysRegex')) {
    	                computeWeekdaysParse.call(this);
    	            }
    	            if (isStrict) {
    	                return this._weekdaysShortStrictRegex;
    	            } else {
    	                return this._weekdaysShortRegex;
    	            }
    	        } else {
    	            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
    	                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
    	            }
    	            return this._weekdaysShortStrictRegex && isStrict
    	                ? this._weekdaysShortStrictRegex
    	                : this._weekdaysShortRegex;
    	        }
    	    }

    	    function weekdaysMinRegex(isStrict) {
    	        if (this._weekdaysParseExact) {
    	            if (!hasOwnProp(this, '_weekdaysRegex')) {
    	                computeWeekdaysParse.call(this);
    	            }
    	            if (isStrict) {
    	                return this._weekdaysMinStrictRegex;
    	            } else {
    	                return this._weekdaysMinRegex;
    	            }
    	        } else {
    	            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
    	                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
    	            }
    	            return this._weekdaysMinStrictRegex && isStrict
    	                ? this._weekdaysMinStrictRegex
    	                : this._weekdaysMinRegex;
    	        }
    	    }

    	    function computeWeekdaysParse() {
    	        function cmpLenRev(a, b) {
    	            return b.length - a.length;
    	        }

    	        var minPieces = [],
    	            shortPieces = [],
    	            longPieces = [],
    	            mixedPieces = [],
    	            i,
    	            mom,
    	            minp,
    	            shortp,
    	            longp;
    	        for (i = 0; i < 7; i++) {
    	            // make the regex if we don't have it already
    	            mom = createUTC([2000, 1]).day(i);
    	            minp = regexEscape(this.weekdaysMin(mom, ''));
    	            shortp = regexEscape(this.weekdaysShort(mom, ''));
    	            longp = regexEscape(this.weekdays(mom, ''));
    	            minPieces.push(minp);
    	            shortPieces.push(shortp);
    	            longPieces.push(longp);
    	            mixedPieces.push(minp);
    	            mixedPieces.push(shortp);
    	            mixedPieces.push(longp);
    	        }
    	        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    	        // will match the longer piece.
    	        minPieces.sort(cmpLenRev);
    	        shortPieces.sort(cmpLenRev);
    	        longPieces.sort(cmpLenRev);
    	        mixedPieces.sort(cmpLenRev);

    	        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    	        this._weekdaysShortRegex = this._weekdaysRegex;
    	        this._weekdaysMinRegex = this._weekdaysRegex;

    	        this._weekdaysStrictRegex = new RegExp(
    	            '^(' + longPieces.join('|') + ')',
    	            'i'
    	        );
    	        this._weekdaysShortStrictRegex = new RegExp(
    	            '^(' + shortPieces.join('|') + ')',
    	            'i'
    	        );
    	        this._weekdaysMinStrictRegex = new RegExp(
    	            '^(' + minPieces.join('|') + ')',
    	            'i'
    	        );
    	    }

    	    // FORMATTING

    	    function hFormat() {
    	        return this.hours() % 12 || 12;
    	    }

    	    function kFormat() {
    	        return this.hours() || 24;
    	    }

    	    addFormatToken('H', ['HH', 2], 0, 'hour');
    	    addFormatToken('h', ['hh', 2], 0, hFormat);
    	    addFormatToken('k', ['kk', 2], 0, kFormat);

    	    addFormatToken('hmm', 0, 0, function () {
    	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    	    });

    	    addFormatToken('hmmss', 0, 0, function () {
    	        return (
    	            '' +
    	            hFormat.apply(this) +
    	            zeroFill(this.minutes(), 2) +
    	            zeroFill(this.seconds(), 2)
    	        );
    	    });

    	    addFormatToken('Hmm', 0, 0, function () {
    	        return '' + this.hours() + zeroFill(this.minutes(), 2);
    	    });

    	    addFormatToken('Hmmss', 0, 0, function () {
    	        return (
    	            '' +
    	            this.hours() +
    	            zeroFill(this.minutes(), 2) +
    	            zeroFill(this.seconds(), 2)
    	        );
    	    });

    	    function meridiem(token, lowercase) {
    	        addFormatToken(token, 0, 0, function () {
    	            return this.localeData().meridiem(
    	                this.hours(),
    	                this.minutes(),
    	                lowercase
    	            );
    	        });
    	    }

    	    meridiem('a', true);
    	    meridiem('A', false);

    	    // ALIASES

    	    addUnitAlias('hour', 'h');

    	    // PRIORITY
    	    addUnitPriority('hour', 13);

    	    // PARSING

    	    function matchMeridiem(isStrict, locale) {
    	        return locale._meridiemParse;
    	    }

    	    addRegexToken('a', matchMeridiem);
    	    addRegexToken('A', matchMeridiem);
    	    addRegexToken('H', match1to2);
    	    addRegexToken('h', match1to2);
    	    addRegexToken('k', match1to2);
    	    addRegexToken('HH', match1to2, match2);
    	    addRegexToken('hh', match1to2, match2);
    	    addRegexToken('kk', match1to2, match2);

    	    addRegexToken('hmm', match3to4);
    	    addRegexToken('hmmss', match5to6);
    	    addRegexToken('Hmm', match3to4);
    	    addRegexToken('Hmmss', match5to6);

    	    addParseToken(['H', 'HH'], HOUR);
    	    addParseToken(['k', 'kk'], function (input, array, config) {
    	        var kInput = toInt(input);
    	        array[HOUR] = kInput === 24 ? 0 : kInput;
    	    });
    	    addParseToken(['a', 'A'], function (input, array, config) {
    	        config._isPm = config._locale.isPM(input);
    	        config._meridiem = input;
    	    });
    	    addParseToken(['h', 'hh'], function (input, array, config) {
    	        array[HOUR] = toInt(input);
    	        getParsingFlags(config).bigHour = true;
    	    });
    	    addParseToken('hmm', function (input, array, config) {
    	        var pos = input.length - 2;
    	        array[HOUR] = toInt(input.substr(0, pos));
    	        array[MINUTE] = toInt(input.substr(pos));
    	        getParsingFlags(config).bigHour = true;
    	    });
    	    addParseToken('hmmss', function (input, array, config) {
    	        var pos1 = input.length - 4,
    	            pos2 = input.length - 2;
    	        array[HOUR] = toInt(input.substr(0, pos1));
    	        array[MINUTE] = toInt(input.substr(pos1, 2));
    	        array[SECOND] = toInt(input.substr(pos2));
    	        getParsingFlags(config).bigHour = true;
    	    });
    	    addParseToken('Hmm', function (input, array, config) {
    	        var pos = input.length - 2;
    	        array[HOUR] = toInt(input.substr(0, pos));
    	        array[MINUTE] = toInt(input.substr(pos));
    	    });
    	    addParseToken('Hmmss', function (input, array, config) {
    	        var pos1 = input.length - 4,
    	            pos2 = input.length - 2;
    	        array[HOUR] = toInt(input.substr(0, pos1));
    	        array[MINUTE] = toInt(input.substr(pos1, 2));
    	        array[SECOND] = toInt(input.substr(pos2));
    	    });

    	    // LOCALES

    	    function localeIsPM(input) {
    	        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    	        // Using charAt should be more compatible.
    	        return (input + '').toLowerCase().charAt(0) === 'p';
    	    }

    	    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
    	        // Setting the hour should keep the time, because the user explicitly
    	        // specified which hour they want. So trying to maintain the same hour (in
    	        // a new timezone) makes sense. Adding/subtracting hours does not follow
    	        // this rule.
    	        getSetHour = makeGetSet('Hours', true);

    	    function localeMeridiem(hours, minutes, isLower) {
    	        if (hours > 11) {
    	            return isLower ? 'pm' : 'PM';
    	        } else {
    	            return isLower ? 'am' : 'AM';
    	        }
    	    }

    	    var baseConfig = {
    	        calendar: defaultCalendar,
    	        longDateFormat: defaultLongDateFormat,
    	        invalidDate: defaultInvalidDate,
    	        ordinal: defaultOrdinal,
    	        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    	        relativeTime: defaultRelativeTime,

    	        months: defaultLocaleMonths,
    	        monthsShort: defaultLocaleMonthsShort,

    	        week: defaultLocaleWeek,

    	        weekdays: defaultLocaleWeekdays,
    	        weekdaysMin: defaultLocaleWeekdaysMin,
    	        weekdaysShort: defaultLocaleWeekdaysShort,

    	        meridiemParse: defaultLocaleMeridiemParse,
    	    };

    	    // internal storage for locale config files
    	    var locales = {},
    	        localeFamilies = {},
    	        globalLocale;

    	    function commonPrefix(arr1, arr2) {
    	        var i,
    	            minl = Math.min(arr1.length, arr2.length);
    	        for (i = 0; i < minl; i += 1) {
    	            if (arr1[i] !== arr2[i]) {
    	                return i;
    	            }
    	        }
    	        return minl;
    	    }

    	    function normalizeLocale(key) {
    	        return key ? key.toLowerCase().replace('_', '-') : key;
    	    }

    	    // pick the locale from the array
    	    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    	    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    	    function chooseLocale(names) {
    	        var i = 0,
    	            j,
    	            next,
    	            locale,
    	            split;

    	        while (i < names.length) {
    	            split = normalizeLocale(names[i]).split('-');
    	            j = split.length;
    	            next = normalizeLocale(names[i + 1]);
    	            next = next ? next.split('-') : null;
    	            while (j > 0) {
    	                locale = loadLocale(split.slice(0, j).join('-'));
    	                if (locale) {
    	                    return locale;
    	                }
    	                if (
    	                    next &&
    	                    next.length >= j &&
    	                    commonPrefix(split, next) >= j - 1
    	                ) {
    	                    //the next array item is better than a shallower substring of this one
    	                    break;
    	                }
    	                j--;
    	            }
    	            i++;
    	        }
    	        return globalLocale;
    	    }

    	    function isLocaleNameSane(name) {
    	        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
    	        return name.match('^[^/\\\\]*$') != null;
    	    }

    	    function loadLocale(name) {
    	        var oldLocale = null,
    	            aliasedRequire;
    	        // TODO: Find a better way to register and load all the locales in Node
    	        if (
    	            locales[name] === undefined &&
    	            'object' !== 'undefined' &&
    	            module &&
    	            module.exports &&
    	            isLocaleNameSane(name)
    	        ) {
    	            try {
    	                oldLocale = globalLocale._abbr;
    	                aliasedRequire = commonjsRequire;
    	                aliasedRequire('./locale/' + name);
    	                getSetGlobalLocale(oldLocale);
    	            } catch (e) {
    	                // mark as not found to avoid repeating expensive file require call causing high CPU
    	                // when trying to find en-US, en_US, en-us for every format call
    	                locales[name] = null; // null means not found
    	            }
    	        }
    	        return locales[name];
    	    }

    	    // This function will load locale and then set the global locale.  If
    	    // no arguments are passed in, it will simply return the current global
    	    // locale key.
    	    function getSetGlobalLocale(key, values) {
    	        var data;
    	        if (key) {
    	            if (isUndefined(values)) {
    	                data = getLocale(key);
    	            } else {
    	                data = defineLocale(key, values);
    	            }

    	            if (data) {
    	                // moment.duration._locale = moment._locale = data;
    	                globalLocale = data;
    	            } else {
    	                if (typeof console !== 'undefined' && console.warn) {
    	                    //warn user if arguments are passed but the locale could not be set
    	                    console.warn(
    	                        'Locale ' + key + ' not found. Did you forget to load it?'
    	                    );
    	                }
    	            }
    	        }

    	        return globalLocale._abbr;
    	    }

    	    function defineLocale(name, config) {
    	        if (config !== null) {
    	            var locale,
    	                parentConfig = baseConfig;
    	            config.abbr = name;
    	            if (locales[name] != null) {
    	                deprecateSimple(
    	                    'defineLocaleOverride',
    	                    'use moment.updateLocale(localeName, config) to change ' +
    	                        'an existing locale. moment.defineLocale(localeName, ' +
    	                        'config) should only be used for creating a new locale ' +
    	                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
    	                );
    	                parentConfig = locales[name]._config;
    	            } else if (config.parentLocale != null) {
    	                if (locales[config.parentLocale] != null) {
    	                    parentConfig = locales[config.parentLocale]._config;
    	                } else {
    	                    locale = loadLocale(config.parentLocale);
    	                    if (locale != null) {
    	                        parentConfig = locale._config;
    	                    } else {
    	                        if (!localeFamilies[config.parentLocale]) {
    	                            localeFamilies[config.parentLocale] = [];
    	                        }
    	                        localeFamilies[config.parentLocale].push({
    	                            name: name,
    	                            config: config,
    	                        });
    	                        return null;
    	                    }
    	                }
    	            }
    	            locales[name] = new Locale(mergeConfigs(parentConfig, config));

    	            if (localeFamilies[name]) {
    	                localeFamilies[name].forEach(function (x) {
    	                    defineLocale(x.name, x.config);
    	                });
    	            }

    	            // backwards compat for now: also set the locale
    	            // make sure we set the locale AFTER all child locales have been
    	            // created, so we won't end up with the child locale set.
    	            getSetGlobalLocale(name);

    	            return locales[name];
    	        } else {
    	            // useful for testing
    	            delete locales[name];
    	            return null;
    	        }
    	    }

    	    function updateLocale(name, config) {
    	        if (config != null) {
    	            var locale,
    	                tmpLocale,
    	                parentConfig = baseConfig;

    	            if (locales[name] != null && locales[name].parentLocale != null) {
    	                // Update existing child locale in-place to avoid memory-leaks
    	                locales[name].set(mergeConfigs(locales[name]._config, config));
    	            } else {
    	                // MERGE
    	                tmpLocale = loadLocale(name);
    	                if (tmpLocale != null) {
    	                    parentConfig = tmpLocale._config;
    	                }
    	                config = mergeConfigs(parentConfig, config);
    	                if (tmpLocale == null) {
    	                    // updateLocale is called for creating a new locale
    	                    // Set abbr so it will have a name (getters return
    	                    // undefined otherwise).
    	                    config.abbr = name;
    	                }
    	                locale = new Locale(config);
    	                locale.parentLocale = locales[name];
    	                locales[name] = locale;
    	            }

    	            // backwards compat for now: also set the locale
    	            getSetGlobalLocale(name);
    	        } else {
    	            // pass null for config to unupdate, useful for tests
    	            if (locales[name] != null) {
    	                if (locales[name].parentLocale != null) {
    	                    locales[name] = locales[name].parentLocale;
    	                    if (name === getSetGlobalLocale()) {
    	                        getSetGlobalLocale(name);
    	                    }
    	                } else if (locales[name] != null) {
    	                    delete locales[name];
    	                }
    	            }
    	        }
    	        return locales[name];
    	    }

    	    // returns locale data
    	    function getLocale(key) {
    	        var locale;

    	        if (key && key._locale && key._locale._abbr) {
    	            key = key._locale._abbr;
    	        }

    	        if (!key) {
    	            return globalLocale;
    	        }

    	        if (!isArray(key)) {
    	            //short-circuit everything else
    	            locale = loadLocale(key);
    	            if (locale) {
    	                return locale;
    	            }
    	            key = [key];
    	        }

    	        return chooseLocale(key);
    	    }

    	    function listLocales() {
    	        return keys(locales);
    	    }

    	    function checkOverflow(m) {
    	        var overflow,
    	            a = m._a;

    	        if (a && getParsingFlags(m).overflow === -2) {
    	            overflow =
    	                a[MONTH] < 0 || a[MONTH] > 11
    	                    ? MONTH
    	                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
    	                    ? DATE
    	                    : a[HOUR] < 0 ||
    	                      a[HOUR] > 24 ||
    	                      (a[HOUR] === 24 &&
    	                          (a[MINUTE] !== 0 ||
    	                              a[SECOND] !== 0 ||
    	                              a[MILLISECOND] !== 0))
    	                    ? HOUR
    	                    : a[MINUTE] < 0 || a[MINUTE] > 59
    	                    ? MINUTE
    	                    : a[SECOND] < 0 || a[SECOND] > 59
    	                    ? SECOND
    	                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
    	                    ? MILLISECOND
    	                    : -1;

    	            if (
    	                getParsingFlags(m)._overflowDayOfYear &&
    	                (overflow < YEAR || overflow > DATE)
    	            ) {
    	                overflow = DATE;
    	            }
    	            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
    	                overflow = WEEK;
    	            }
    	            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
    	                overflow = WEEKDAY;
    	            }

    	            getParsingFlags(m).overflow = overflow;
    	        }

    	        return m;
    	    }

    	    // iso 8601 regex
    	    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    	    var extendedIsoRegex =
    	            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    	        basicIsoRegex =
    	            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    	        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
    	        isoDates = [
    	            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    	            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    	            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    	            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    	            ['YYYY-DDD', /\d{4}-\d{3}/],
    	            ['YYYY-MM', /\d{4}-\d\d/, false],
    	            ['YYYYYYMMDD', /[+-]\d{10}/],
    	            ['YYYYMMDD', /\d{8}/],
    	            ['GGGG[W]WWE', /\d{4}W\d{3}/],
    	            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    	            ['YYYYDDD', /\d{7}/],
    	            ['YYYYMM', /\d{6}/, false],
    	            ['YYYY', /\d{4}/, false],
    	        ],
    	        // iso time formats and regexes
    	        isoTimes = [
    	            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    	            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    	            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    	            ['HH:mm', /\d\d:\d\d/],
    	            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    	            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    	            ['HHmmss', /\d\d\d\d\d\d/],
    	            ['HHmm', /\d\d\d\d/],
    	            ['HH', /\d\d/],
    	        ],
    	        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
    	        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    	        rfc2822 =
    	            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
    	        obsOffsets = {
    	            UT: 0,
    	            GMT: 0,
    	            EDT: -4 * 60,
    	            EST: -5 * 60,
    	            CDT: -5 * 60,
    	            CST: -6 * 60,
    	            MDT: -6 * 60,
    	            MST: -7 * 60,
    	            PDT: -7 * 60,
    	            PST: -8 * 60,
    	        };

    	    // date from iso format
    	    function configFromISO(config) {
    	        var i,
    	            l,
    	            string = config._i,
    	            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
    	            allowTime,
    	            dateFormat,
    	            timeFormat,
    	            tzFormat,
    	            isoDatesLen = isoDates.length,
    	            isoTimesLen = isoTimes.length;

    	        if (match) {
    	            getParsingFlags(config).iso = true;
    	            for (i = 0, l = isoDatesLen; i < l; i++) {
    	                if (isoDates[i][1].exec(match[1])) {
    	                    dateFormat = isoDates[i][0];
    	                    allowTime = isoDates[i][2] !== false;
    	                    break;
    	                }
    	            }
    	            if (dateFormat == null) {
    	                config._isValid = false;
    	                return;
    	            }
    	            if (match[3]) {
    	                for (i = 0, l = isoTimesLen; i < l; i++) {
    	                    if (isoTimes[i][1].exec(match[3])) {
    	                        // match[2] should be 'T' or space
    	                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
    	                        break;
    	                    }
    	                }
    	                if (timeFormat == null) {
    	                    config._isValid = false;
    	                    return;
    	                }
    	            }
    	            if (!allowTime && timeFormat != null) {
    	                config._isValid = false;
    	                return;
    	            }
    	            if (match[4]) {
    	                if (tzRegex.exec(match[4])) {
    	                    tzFormat = 'Z';
    	                } else {
    	                    config._isValid = false;
    	                    return;
    	                }
    	            }
    	            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
    	            configFromStringAndFormat(config);
    	        } else {
    	            config._isValid = false;
    	        }
    	    }

    	    function extractFromRFC2822Strings(
    	        yearStr,
    	        monthStr,
    	        dayStr,
    	        hourStr,
    	        minuteStr,
    	        secondStr
    	    ) {
    	        var result = [
    	            untruncateYear(yearStr),
    	            defaultLocaleMonthsShort.indexOf(monthStr),
    	            parseInt(dayStr, 10),
    	            parseInt(hourStr, 10),
    	            parseInt(minuteStr, 10),
    	        ];

    	        if (secondStr) {
    	            result.push(parseInt(secondStr, 10));
    	        }

    	        return result;
    	    }

    	    function untruncateYear(yearStr) {
    	        var year = parseInt(yearStr, 10);
    	        if (year <= 49) {
    	            return 2000 + year;
    	        } else if (year <= 999) {
    	            return 1900 + year;
    	        }
    	        return year;
    	    }

    	    function preprocessRFC2822(s) {
    	        // Remove comments and folding whitespace and replace multiple-spaces with a single space
    	        return s
    	            .replace(/\([^()]*\)|[\n\t]/g, ' ')
    	            .replace(/(\s\s+)/g, ' ')
    	            .replace(/^\s\s*/, '')
    	            .replace(/\s\s*$/, '');
    	    }

    	    function checkWeekday(weekdayStr, parsedInput, config) {
    	        if (weekdayStr) {
    	            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
    	            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
    	                weekdayActual = new Date(
    	                    parsedInput[0],
    	                    parsedInput[1],
    	                    parsedInput[2]
    	                ).getDay();
    	            if (weekdayProvided !== weekdayActual) {
    	                getParsingFlags(config).weekdayMismatch = true;
    	                config._isValid = false;
    	                return false;
    	            }
    	        }
    	        return true;
    	    }

    	    function calculateOffset(obsOffset, militaryOffset, numOffset) {
    	        if (obsOffset) {
    	            return obsOffsets[obsOffset];
    	        } else if (militaryOffset) {
    	            // the only allowed military tz is Z
    	            return 0;
    	        } else {
    	            var hm = parseInt(numOffset, 10),
    	                m = hm % 100,
    	                h = (hm - m) / 100;
    	            return h * 60 + m;
    	        }
    	    }

    	    // date and time from ref 2822 format
    	    function configFromRFC2822(config) {
    	        var match = rfc2822.exec(preprocessRFC2822(config._i)),
    	            parsedArray;
    	        if (match) {
    	            parsedArray = extractFromRFC2822Strings(
    	                match[4],
    	                match[3],
    	                match[2],
    	                match[5],
    	                match[6],
    	                match[7]
    	            );
    	            if (!checkWeekday(match[1], parsedArray, config)) {
    	                return;
    	            }

    	            config._a = parsedArray;
    	            config._tzm = calculateOffset(match[8], match[9], match[10]);

    	            config._d = createUTCDate.apply(null, config._a);
    	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

    	            getParsingFlags(config).rfc2822 = true;
    	        } else {
    	            config._isValid = false;
    	        }
    	    }

    	    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    	    function configFromString(config) {
    	        var matched = aspNetJsonRegex.exec(config._i);
    	        if (matched !== null) {
    	            config._d = new Date(+matched[1]);
    	            return;
    	        }

    	        configFromISO(config);
    	        if (config._isValid === false) {
    	            delete config._isValid;
    	        } else {
    	            return;
    	        }

    	        configFromRFC2822(config);
    	        if (config._isValid === false) {
    	            delete config._isValid;
    	        } else {
    	            return;
    	        }

    	        if (config._strict) {
    	            config._isValid = false;
    	        } else {
    	            // Final attempt, use Input Fallback
    	            hooks.createFromInputFallback(config);
    	        }
    	    }

    	    hooks.createFromInputFallback = deprecate(
    	        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    	            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    	            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    	        function (config) {
    	            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    	        }
    	    );

    	    // Pick the first defined of two or three arguments.
    	    function defaults(a, b, c) {
    	        if (a != null) {
    	            return a;
    	        }
    	        if (b != null) {
    	            return b;
    	        }
    	        return c;
    	    }

    	    function currentDateArray(config) {
    	        // hooks is actually the exported moment object
    	        var nowValue = new Date(hooks.now());
    	        if (config._useUTC) {
    	            return [
    	                nowValue.getUTCFullYear(),
    	                nowValue.getUTCMonth(),
    	                nowValue.getUTCDate(),
    	            ];
    	        }
    	        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    	    }

    	    // convert an array to a date.
    	    // the array should mirror the parameters below
    	    // note: all values past the year are optional and will default to the lowest possible value.
    	    // [year, month, day , hour, minute, second, millisecond]
    	    function configFromArray(config) {
    	        var i,
    	            date,
    	            input = [],
    	            currentDate,
    	            expectedWeekday,
    	            yearToUse;

    	        if (config._d) {
    	            return;
    	        }

    	        currentDate = currentDateArray(config);

    	        //compute day of the year from weeks and weekdays
    	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
    	            dayOfYearFromWeekInfo(config);
    	        }

    	        //if the day of the year is set, figure out what it is
    	        if (config._dayOfYear != null) {
    	            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

    	            if (
    	                config._dayOfYear > daysInYear(yearToUse) ||
    	                config._dayOfYear === 0
    	            ) {
    	                getParsingFlags(config)._overflowDayOfYear = true;
    	            }

    	            date = createUTCDate(yearToUse, 0, config._dayOfYear);
    	            config._a[MONTH] = date.getUTCMonth();
    	            config._a[DATE] = date.getUTCDate();
    	        }

    	        // Default to current date.
    	        // * if no year, month, day of month are given, default to today
    	        // * if day of month is given, default month and year
    	        // * if month is given, default only year
    	        // * if year is given, don't default anything
    	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
    	            config._a[i] = input[i] = currentDate[i];
    	        }

    	        // Zero out whatever was not defaulted, including time
    	        for (; i < 7; i++) {
    	            config._a[i] = input[i] =
    	                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
    	        }

    	        // Check for 24:00:00.000
    	        if (
    	            config._a[HOUR] === 24 &&
    	            config._a[MINUTE] === 0 &&
    	            config._a[SECOND] === 0 &&
    	            config._a[MILLISECOND] === 0
    	        ) {
    	            config._nextDay = true;
    	            config._a[HOUR] = 0;
    	        }

    	        config._d = (config._useUTC ? createUTCDate : createDate).apply(
    	            null,
    	            input
    	        );
    	        expectedWeekday = config._useUTC
    	            ? config._d.getUTCDay()
    	            : config._d.getDay();

    	        // Apply timezone offset from input. The actual utcOffset can be changed
    	        // with parseZone.
    	        if (config._tzm != null) {
    	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    	        }

    	        if (config._nextDay) {
    	            config._a[HOUR] = 24;
    	        }

    	        // check for mismatching day of week
    	        if (
    	            config._w &&
    	            typeof config._w.d !== 'undefined' &&
    	            config._w.d !== expectedWeekday
    	        ) {
    	            getParsingFlags(config).weekdayMismatch = true;
    	        }
    	    }

    	    function dayOfYearFromWeekInfo(config) {
    	        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

    	        w = config._w;
    	        if (w.GG != null || w.W != null || w.E != null) {
    	            dow = 1;
    	            doy = 4;

    	            // TODO: We need to take the current isoWeekYear, but that depends on
    	            // how we interpret now (local, utc, fixed offset). So create
    	            // a now version of current config (take local/utc/offset flags, and
    	            // create now).
    	            weekYear = defaults(
    	                w.GG,
    	                config._a[YEAR],
    	                weekOfYear(createLocal(), 1, 4).year
    	            );
    	            week = defaults(w.W, 1);
    	            weekday = defaults(w.E, 1);
    	            if (weekday < 1 || weekday > 7) {
    	                weekdayOverflow = true;
    	            }
    	        } else {
    	            dow = config._locale._week.dow;
    	            doy = config._locale._week.doy;

    	            curWeek = weekOfYear(createLocal(), dow, doy);

    	            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

    	            // Default to current week.
    	            week = defaults(w.w, curWeek.week);

    	            if (w.d != null) {
    	                // weekday -- low day numbers are considered next week
    	                weekday = w.d;
    	                if (weekday < 0 || weekday > 6) {
    	                    weekdayOverflow = true;
    	                }
    	            } else if (w.e != null) {
    	                // local weekday -- counting starts from beginning of week
    	                weekday = w.e + dow;
    	                if (w.e < 0 || w.e > 6) {
    	                    weekdayOverflow = true;
    	                }
    	            } else {
    	                // default to beginning of week
    	                weekday = dow;
    	            }
    	        }
    	        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
    	            getParsingFlags(config)._overflowWeeks = true;
    	        } else if (weekdayOverflow != null) {
    	            getParsingFlags(config)._overflowWeekday = true;
    	        } else {
    	            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
    	            config._a[YEAR] = temp.year;
    	            config._dayOfYear = temp.dayOfYear;
    	        }
    	    }

    	    // constant that refers to the ISO standard
    	    hooks.ISO_8601 = function () {};

    	    // constant that refers to the RFC 2822 form
    	    hooks.RFC_2822 = function () {};

    	    // date from string and format string
    	    function configFromStringAndFormat(config) {
    	        // TODO: Move this to another part of the creation flow to prevent circular deps
    	        if (config._f === hooks.ISO_8601) {
    	            configFromISO(config);
    	            return;
    	        }
    	        if (config._f === hooks.RFC_2822) {
    	            configFromRFC2822(config);
    	            return;
    	        }
    	        config._a = [];
    	        getParsingFlags(config).empty = true;

    	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
    	        var string = '' + config._i,
    	            i,
    	            parsedInput,
    	            tokens,
    	            token,
    	            skipped,
    	            stringLength = string.length,
    	            totalParsedInputLength = 0,
    	            era,
    	            tokenLen;

    	        tokens =
    	            expandFormat(config._f, config._locale).match(formattingTokens) || [];
    	        tokenLen = tokens.length;
    	        for (i = 0; i < tokenLen; i++) {
    	            token = tokens[i];
    	            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
    	                [])[0];
    	            if (parsedInput) {
    	                skipped = string.substr(0, string.indexOf(parsedInput));
    	                if (skipped.length > 0) {
    	                    getParsingFlags(config).unusedInput.push(skipped);
    	                }
    	                string = string.slice(
    	                    string.indexOf(parsedInput) + parsedInput.length
    	                );
    	                totalParsedInputLength += parsedInput.length;
    	            }
    	            // don't parse if it's not a known token
    	            if (formatTokenFunctions[token]) {
    	                if (parsedInput) {
    	                    getParsingFlags(config).empty = false;
    	                } else {
    	                    getParsingFlags(config).unusedTokens.push(token);
    	                }
    	                addTimeToArrayFromToken(token, parsedInput, config);
    	            } else if (config._strict && !parsedInput) {
    	                getParsingFlags(config).unusedTokens.push(token);
    	            }
    	        }

    	        // add remaining unparsed input length to the string
    	        getParsingFlags(config).charsLeftOver =
    	            stringLength - totalParsedInputLength;
    	        if (string.length > 0) {
    	            getParsingFlags(config).unusedInput.push(string);
    	        }

    	        // clear _12h flag if hour is <= 12
    	        if (
    	            config._a[HOUR] <= 12 &&
    	            getParsingFlags(config).bigHour === true &&
    	            config._a[HOUR] > 0
    	        ) {
    	            getParsingFlags(config).bigHour = undefined;
    	        }

    	        getParsingFlags(config).parsedDateParts = config._a.slice(0);
    	        getParsingFlags(config).meridiem = config._meridiem;
    	        // handle meridiem
    	        config._a[HOUR] = meridiemFixWrap(
    	            config._locale,
    	            config._a[HOUR],
    	            config._meridiem
    	        );

    	        // handle era
    	        era = getParsingFlags(config).era;
    	        if (era !== null) {
    	            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
    	        }

    	        configFromArray(config);
    	        checkOverflow(config);
    	    }

    	    function meridiemFixWrap(locale, hour, meridiem) {
    	        var isPm;

    	        if (meridiem == null) {
    	            // nothing to do
    	            return hour;
    	        }
    	        if (locale.meridiemHour != null) {
    	            return locale.meridiemHour(hour, meridiem);
    	        } else if (locale.isPM != null) {
    	            // Fallback
    	            isPm = locale.isPM(meridiem);
    	            if (isPm && hour < 12) {
    	                hour += 12;
    	            }
    	            if (!isPm && hour === 12) {
    	                hour = 0;
    	            }
    	            return hour;
    	        } else {
    	            // this is not supposed to happen
    	            return hour;
    	        }
    	    }

    	    // date from string and array of format strings
    	    function configFromStringAndArray(config) {
    	        var tempConfig,
    	            bestMoment,
    	            scoreToBeat,
    	            i,
    	            currentScore,
    	            validFormatFound,
    	            bestFormatIsValid = false,
    	            configfLen = config._f.length;

    	        if (configfLen === 0) {
    	            getParsingFlags(config).invalidFormat = true;
    	            config._d = new Date(NaN);
    	            return;
    	        }

    	        for (i = 0; i < configfLen; i++) {
    	            currentScore = 0;
    	            validFormatFound = false;
    	            tempConfig = copyConfig({}, config);
    	            if (config._useUTC != null) {
    	                tempConfig._useUTC = config._useUTC;
    	            }
    	            tempConfig._f = config._f[i];
    	            configFromStringAndFormat(tempConfig);

    	            if (isValid(tempConfig)) {
    	                validFormatFound = true;
    	            }

    	            // if there is any input that was not parsed add a penalty for that format
    	            currentScore += getParsingFlags(tempConfig).charsLeftOver;

    	            //or tokens
    	            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

    	            getParsingFlags(tempConfig).score = currentScore;

    	            if (!bestFormatIsValid) {
    	                if (
    	                    scoreToBeat == null ||
    	                    currentScore < scoreToBeat ||
    	                    validFormatFound
    	                ) {
    	                    scoreToBeat = currentScore;
    	                    bestMoment = tempConfig;
    	                    if (validFormatFound) {
    	                        bestFormatIsValid = true;
    	                    }
    	                }
    	            } else {
    	                if (currentScore < scoreToBeat) {
    	                    scoreToBeat = currentScore;
    	                    bestMoment = tempConfig;
    	                }
    	            }
    	        }

    	        extend(config, bestMoment || tempConfig);
    	    }

    	    function configFromObject(config) {
    	        if (config._d) {
    	            return;
    	        }

    	        var i = normalizeObjectUnits(config._i),
    	            dayOrDate = i.day === undefined ? i.date : i.day;
    	        config._a = map(
    	            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
    	            function (obj) {
    	                return obj && parseInt(obj, 10);
    	            }
    	        );

    	        configFromArray(config);
    	    }

    	    function createFromConfig(config) {
    	        var res = new Moment(checkOverflow(prepareConfig(config)));
    	        if (res._nextDay) {
    	            // Adding is smart enough around DST
    	            res.add(1, 'd');
    	            res._nextDay = undefined;
    	        }

    	        return res;
    	    }

    	    function prepareConfig(config) {
    	        var input = config._i,
    	            format = config._f;

    	        config._locale = config._locale || getLocale(config._l);

    	        if (input === null || (format === undefined && input === '')) {
    	            return createInvalid({ nullInput: true });
    	        }

    	        if (typeof input === 'string') {
    	            config._i = input = config._locale.preparse(input);
    	        }

    	        if (isMoment(input)) {
    	            return new Moment(checkOverflow(input));
    	        } else if (isDate(input)) {
    	            config._d = input;
    	        } else if (isArray(format)) {
    	            configFromStringAndArray(config);
    	        } else if (format) {
    	            configFromStringAndFormat(config);
    	        } else {
    	            configFromInput(config);
    	        }

    	        if (!isValid(config)) {
    	            config._d = null;
    	        }

    	        return config;
    	    }

    	    function configFromInput(config) {
    	        var input = config._i;
    	        if (isUndefined(input)) {
    	            config._d = new Date(hooks.now());
    	        } else if (isDate(input)) {
    	            config._d = new Date(input.valueOf());
    	        } else if (typeof input === 'string') {
    	            configFromString(config);
    	        } else if (isArray(input)) {
    	            config._a = map(input.slice(0), function (obj) {
    	                return parseInt(obj, 10);
    	            });
    	            configFromArray(config);
    	        } else if (isObject(input)) {
    	            configFromObject(config);
    	        } else if (isNumber(input)) {
    	            // from milliseconds
    	            config._d = new Date(input);
    	        } else {
    	            hooks.createFromInputFallback(config);
    	        }
    	    }

    	    function createLocalOrUTC(input, format, locale, strict, isUTC) {
    	        var c = {};

    	        if (format === true || format === false) {
    	            strict = format;
    	            format = undefined;
    	        }

    	        if (locale === true || locale === false) {
    	            strict = locale;
    	            locale = undefined;
    	        }

    	        if (
    	            (isObject(input) && isObjectEmpty(input)) ||
    	            (isArray(input) && input.length === 0)
    	        ) {
    	            input = undefined;
    	        }
    	        // object construction must be done this way.
    	        // https://github.com/moment/moment/issues/1423
    	        c._isAMomentObject = true;
    	        c._useUTC = c._isUTC = isUTC;
    	        c._l = locale;
    	        c._i = input;
    	        c._f = format;
    	        c._strict = strict;

    	        return createFromConfig(c);
    	    }

    	    function createLocal(input, format, locale, strict) {
    	        return createLocalOrUTC(input, format, locale, strict, false);
    	    }

    	    var prototypeMin = deprecate(
    	            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    	            function () {
    	                var other = createLocal.apply(null, arguments);
    	                if (this.isValid() && other.isValid()) {
    	                    return other < this ? this : other;
    	                } else {
    	                    return createInvalid();
    	                }
    	            }
    	        ),
    	        prototypeMax = deprecate(
    	            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    	            function () {
    	                var other = createLocal.apply(null, arguments);
    	                if (this.isValid() && other.isValid()) {
    	                    return other > this ? this : other;
    	                } else {
    	                    return createInvalid();
    	                }
    	            }
    	        );

    	    // Pick a moment m from moments so that m[fn](other) is true for all
    	    // other. This relies on the function fn to be transitive.
    	    //
    	    // moments should either be an array of moment objects or an array, whose
    	    // first element is an array of moment objects.
    	    function pickBy(fn, moments) {
    	        var res, i;
    	        if (moments.length === 1 && isArray(moments[0])) {
    	            moments = moments[0];
    	        }
    	        if (!moments.length) {
    	            return createLocal();
    	        }
    	        res = moments[0];
    	        for (i = 1; i < moments.length; ++i) {
    	            if (!moments[i].isValid() || moments[i][fn](res)) {
    	                res = moments[i];
    	            }
    	        }
    	        return res;
    	    }

    	    // TODO: Use [].sort instead?
    	    function min() {
    	        var args = [].slice.call(arguments, 0);

    	        return pickBy('isBefore', args);
    	    }

    	    function max() {
    	        var args = [].slice.call(arguments, 0);

    	        return pickBy('isAfter', args);
    	    }

    	    var now = function () {
    	        return Date.now ? Date.now() : +new Date();
    	    };

    	    var ordering = [
    	        'year',
    	        'quarter',
    	        'month',
    	        'week',
    	        'day',
    	        'hour',
    	        'minute',
    	        'second',
    	        'millisecond',
    	    ];

    	    function isDurationValid(m) {
    	        var key,
    	            unitHasDecimal = false,
    	            i,
    	            orderLen = ordering.length;
    	        for (key in m) {
    	            if (
    	                hasOwnProp(m, key) &&
    	                !(
    	                    indexOf.call(ordering, key) !== -1 &&
    	                    (m[key] == null || !isNaN(m[key]))
    	                )
    	            ) {
    	                return false;
    	            }
    	        }

    	        for (i = 0; i < orderLen; ++i) {
    	            if (m[ordering[i]]) {
    	                if (unitHasDecimal) {
    	                    return false; // only allow non-integers for smallest unit
    	                }
    	                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
    	                    unitHasDecimal = true;
    	                }
    	            }
    	        }

    	        return true;
    	    }

    	    function isValid$1() {
    	        return this._isValid;
    	    }

    	    function createInvalid$1() {
    	        return createDuration(NaN);
    	    }

    	    function Duration(duration) {
    	        var normalizedInput = normalizeObjectUnits(duration),
    	            years = normalizedInput.year || 0,
    	            quarters = normalizedInput.quarter || 0,
    	            months = normalizedInput.month || 0,
    	            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
    	            days = normalizedInput.day || 0,
    	            hours = normalizedInput.hour || 0,
    	            minutes = normalizedInput.minute || 0,
    	            seconds = normalizedInput.second || 0,
    	            milliseconds = normalizedInput.millisecond || 0;

    	        this._isValid = isDurationValid(normalizedInput);

    	        // representation for dateAddRemove
    	        this._milliseconds =
    	            +milliseconds +
    	            seconds * 1e3 + // 1000
    	            minutes * 6e4 + // 1000 * 60
    	            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    	        // Because of dateAddRemove treats 24 hours as different from a
    	        // day when working around DST, we need to store them separately
    	        this._days = +days + weeks * 7;
    	        // It is impossible to translate months into days without knowing
    	        // which months you are are talking about, so we have to store
    	        // it separately.
    	        this._months = +months + quarters * 3 + years * 12;

    	        this._data = {};

    	        this._locale = getLocale();

    	        this._bubble();
    	    }

    	    function isDuration(obj) {
    	        return obj instanceof Duration;
    	    }

    	    function absRound(number) {
    	        if (number < 0) {
    	            return Math.round(-1 * number) * -1;
    	        } else {
    	            return Math.round(number);
    	        }
    	    }

    	    // compare two arrays, return the number of differences
    	    function compareArrays(array1, array2, dontConvert) {
    	        var len = Math.min(array1.length, array2.length),
    	            lengthDiff = Math.abs(array1.length - array2.length),
    	            diffs = 0,
    	            i;
    	        for (i = 0; i < len; i++) {
    	            if (
    	                (dontConvert && array1[i] !== array2[i]) ||
    	                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
    	            ) {
    	                diffs++;
    	            }
    	        }
    	        return diffs + lengthDiff;
    	    }

    	    // FORMATTING

    	    function offset(token, separator) {
    	        addFormatToken(token, 0, 0, function () {
    	            var offset = this.utcOffset(),
    	                sign = '+';
    	            if (offset < 0) {
    	                offset = -offset;
    	                sign = '-';
    	            }
    	            return (
    	                sign +
    	                zeroFill(~~(offset / 60), 2) +
    	                separator +
    	                zeroFill(~~offset % 60, 2)
    	            );
    	        });
    	    }

    	    offset('Z', ':');
    	    offset('ZZ', '');

    	    // PARSING

    	    addRegexToken('Z', matchShortOffset);
    	    addRegexToken('ZZ', matchShortOffset);
    	    addParseToken(['Z', 'ZZ'], function (input, array, config) {
    	        config._useUTC = true;
    	        config._tzm = offsetFromString(matchShortOffset, input);
    	    });

    	    // HELPERS

    	    // timezone chunker
    	    // '+10:00' > ['10',  '00']
    	    // '-1530'  > ['-15', '30']
    	    var chunkOffset = /([\+\-]|\d\d)/gi;

    	    function offsetFromString(matcher, string) {
    	        var matches = (string || '').match(matcher),
    	            chunk,
    	            parts,
    	            minutes;

    	        if (matches === null) {
    	            return null;
    	        }

    	        chunk = matches[matches.length - 1] || [];
    	        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    	        minutes = +(parts[1] * 60) + toInt(parts[2]);

    	        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    	    }

    	    // Return a moment from input, that is local/utc/zone equivalent to model.
    	    function cloneWithOffset(input, model) {
    	        var res, diff;
    	        if (model._isUTC) {
    	            res = model.clone();
    	            diff =
    	                (isMoment(input) || isDate(input)
    	                    ? input.valueOf()
    	                    : createLocal(input).valueOf()) - res.valueOf();
    	            // Use low-level api, because this fn is low-level api.
    	            res._d.setTime(res._d.valueOf() + diff);
    	            hooks.updateOffset(res, false);
    	            return res;
    	        } else {
    	            return createLocal(input).local();
    	        }
    	    }

    	    function getDateOffset(m) {
    	        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    	        // https://github.com/moment/moment/pull/1871
    	        return -Math.round(m._d.getTimezoneOffset());
    	    }

    	    // HOOKS

    	    // This function will be called whenever a moment is mutated.
    	    // It is intended to keep the offset in sync with the timezone.
    	    hooks.updateOffset = function () {};

    	    // MOMENTS

    	    // keepLocalTime = true means only change the timezone, without
    	    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    	    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    	    // +0200, so we adjust the time as needed, to be valid.
    	    //
    	    // Keeping the time actually adds/subtracts (one hour)
    	    // from the actual represented time. That is why we call updateOffset
    	    // a second time. In case it wants us to change the offset again
    	    // _changeInProgress == true case, then we have to adjust, because
    	    // there is no such time in the given timezone.
    	    function getSetOffset(input, keepLocalTime, keepMinutes) {
    	        var offset = this._offset || 0,
    	            localAdjust;
    	        if (!this.isValid()) {
    	            return input != null ? this : NaN;
    	        }
    	        if (input != null) {
    	            if (typeof input === 'string') {
    	                input = offsetFromString(matchShortOffset, input);
    	                if (input === null) {
    	                    return this;
    	                }
    	            } else if (Math.abs(input) < 16 && !keepMinutes) {
    	                input = input * 60;
    	            }
    	            if (!this._isUTC && keepLocalTime) {
    	                localAdjust = getDateOffset(this);
    	            }
    	            this._offset = input;
    	            this._isUTC = true;
    	            if (localAdjust != null) {
    	                this.add(localAdjust, 'm');
    	            }
    	            if (offset !== input) {
    	                if (!keepLocalTime || this._changeInProgress) {
    	                    addSubtract(
    	                        this,
    	                        createDuration(input - offset, 'm'),
    	                        1,
    	                        false
    	                    );
    	                } else if (!this._changeInProgress) {
    	                    this._changeInProgress = true;
    	                    hooks.updateOffset(this, true);
    	                    this._changeInProgress = null;
    	                }
    	            }
    	            return this;
    	        } else {
    	            return this._isUTC ? offset : getDateOffset(this);
    	        }
    	    }

    	    function getSetZone(input, keepLocalTime) {
    	        if (input != null) {
    	            if (typeof input !== 'string') {
    	                input = -input;
    	            }

    	            this.utcOffset(input, keepLocalTime);

    	            return this;
    	        } else {
    	            return -this.utcOffset();
    	        }
    	    }

    	    function setOffsetToUTC(keepLocalTime) {
    	        return this.utcOffset(0, keepLocalTime);
    	    }

    	    function setOffsetToLocal(keepLocalTime) {
    	        if (this._isUTC) {
    	            this.utcOffset(0, keepLocalTime);
    	            this._isUTC = false;

    	            if (keepLocalTime) {
    	                this.subtract(getDateOffset(this), 'm');
    	            }
    	        }
    	        return this;
    	    }

    	    function setOffsetToParsedOffset() {
    	        if (this._tzm != null) {
    	            this.utcOffset(this._tzm, false, true);
    	        } else if (typeof this._i === 'string') {
    	            var tZone = offsetFromString(matchOffset, this._i);
    	            if (tZone != null) {
    	                this.utcOffset(tZone);
    	            } else {
    	                this.utcOffset(0, true);
    	            }
    	        }
    	        return this;
    	    }

    	    function hasAlignedHourOffset(input) {
    	        if (!this.isValid()) {
    	            return false;
    	        }
    	        input = input ? createLocal(input).utcOffset() : 0;

    	        return (this.utcOffset() - input) % 60 === 0;
    	    }

    	    function isDaylightSavingTime() {
    	        return (
    	            this.utcOffset() > this.clone().month(0).utcOffset() ||
    	            this.utcOffset() > this.clone().month(5).utcOffset()
    	        );
    	    }

    	    function isDaylightSavingTimeShifted() {
    	        if (!isUndefined(this._isDSTShifted)) {
    	            return this._isDSTShifted;
    	        }

    	        var c = {},
    	            other;

    	        copyConfig(c, this);
    	        c = prepareConfig(c);

    	        if (c._a) {
    	            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
    	            this._isDSTShifted =
    	                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
    	        } else {
    	            this._isDSTShifted = false;
    	        }

    	        return this._isDSTShifted;
    	    }

    	    function isLocal() {
    	        return this.isValid() ? !this._isUTC : false;
    	    }

    	    function isUtcOffset() {
    	        return this.isValid() ? this._isUTC : false;
    	    }

    	    function isUtc() {
    	        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    	    }

    	    // ASP.NET json date format regex
    	    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
    	        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    	        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    	        // and further modified to allow for strings containing both week and day
    	        isoRegex =
    	            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    	    function createDuration(input, key) {
    	        var duration = input,
    	            // matching against regexp is expensive, do it on demand
    	            match = null,
    	            sign,
    	            ret,
    	            diffRes;

    	        if (isDuration(input)) {
    	            duration = {
    	                ms: input._milliseconds,
    	                d: input._days,
    	                M: input._months,
    	            };
    	        } else if (isNumber(input) || !isNaN(+input)) {
    	            duration = {};
    	            if (key) {
    	                duration[key] = +input;
    	            } else {
    	                duration.milliseconds = +input;
    	            }
    	        } else if ((match = aspNetRegex.exec(input))) {
    	            sign = match[1] === '-' ? -1 : 1;
    	            duration = {
    	                y: 0,
    	                d: toInt(match[DATE]) * sign,
    	                h: toInt(match[HOUR]) * sign,
    	                m: toInt(match[MINUTE]) * sign,
    	                s: toInt(match[SECOND]) * sign,
    	                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
    	            };
    	        } else if ((match = isoRegex.exec(input))) {
    	            sign = match[1] === '-' ? -1 : 1;
    	            duration = {
    	                y: parseIso(match[2], sign),
    	                M: parseIso(match[3], sign),
    	                w: parseIso(match[4], sign),
    	                d: parseIso(match[5], sign),
    	                h: parseIso(match[6], sign),
    	                m: parseIso(match[7], sign),
    	                s: parseIso(match[8], sign),
    	            };
    	        } else if (duration == null) {
    	            // checks for null or undefined
    	            duration = {};
    	        } else if (
    	            typeof duration === 'object' &&
    	            ('from' in duration || 'to' in duration)
    	        ) {
    	            diffRes = momentsDifference(
    	                createLocal(duration.from),
    	                createLocal(duration.to)
    	            );

    	            duration = {};
    	            duration.ms = diffRes.milliseconds;
    	            duration.M = diffRes.months;
    	        }

    	        ret = new Duration(duration);

    	        if (isDuration(input) && hasOwnProp(input, '_locale')) {
    	            ret._locale = input._locale;
    	        }

    	        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
    	            ret._isValid = input._isValid;
    	        }

    	        return ret;
    	    }

    	    createDuration.fn = Duration.prototype;
    	    createDuration.invalid = createInvalid$1;

    	    function parseIso(inp, sign) {
    	        // We'd normally use ~~inp for this, but unfortunately it also
    	        // converts floats to ints.
    	        // inp may be undefined, so careful calling replace on it.
    	        var res = inp && parseFloat(inp.replace(',', '.'));
    	        // apply sign while we're at it
    	        return (isNaN(res) ? 0 : res) * sign;
    	    }

    	    function positiveMomentsDifference(base, other) {
    	        var res = {};

    	        res.months =
    	            other.month() - base.month() + (other.year() - base.year()) * 12;
    	        if (base.clone().add(res.months, 'M').isAfter(other)) {
    	            --res.months;
    	        }

    	        res.milliseconds = +other - +base.clone().add(res.months, 'M');

    	        return res;
    	    }

    	    function momentsDifference(base, other) {
    	        var res;
    	        if (!(base.isValid() && other.isValid())) {
    	            return { milliseconds: 0, months: 0 };
    	        }

    	        other = cloneWithOffset(other, base);
    	        if (base.isBefore(other)) {
    	            res = positiveMomentsDifference(base, other);
    	        } else {
    	            res = positiveMomentsDifference(other, base);
    	            res.milliseconds = -res.milliseconds;
    	            res.months = -res.months;
    	        }

    	        return res;
    	    }

    	    // TODO: remove 'name' arg after deprecation is removed
    	    function createAdder(direction, name) {
    	        return function (val, period) {
    	            var dur, tmp;
    	            //invert the arguments, but complain about it
    	            if (period !== null && !isNaN(+period)) {
    	                deprecateSimple(
    	                    name,
    	                    'moment().' +
    	                        name +
    	                        '(period, number) is deprecated. Please use moment().' +
    	                        name +
    	                        '(number, period). ' +
    	                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
    	                );
    	                tmp = val;
    	                val = period;
    	                period = tmp;
    	            }

    	            dur = createDuration(val, period);
    	            addSubtract(this, dur, direction);
    	            return this;
    	        };
    	    }

    	    function addSubtract(mom, duration, isAdding, updateOffset) {
    	        var milliseconds = duration._milliseconds,
    	            days = absRound(duration._days),
    	            months = absRound(duration._months);

    	        if (!mom.isValid()) {
    	            // No op
    	            return;
    	        }

    	        updateOffset = updateOffset == null ? true : updateOffset;

    	        if (months) {
    	            setMonth(mom, get(mom, 'Month') + months * isAdding);
    	        }
    	        if (days) {
    	            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    	        }
    	        if (milliseconds) {
    	            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    	        }
    	        if (updateOffset) {
    	            hooks.updateOffset(mom, days || months);
    	        }
    	    }

    	    var add = createAdder(1, 'add'),
    	        subtract = createAdder(-1, 'subtract');

    	    function isString(input) {
    	        return typeof input === 'string' || input instanceof String;
    	    }

    	    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    	    function isMomentInput(input) {
    	        return (
    	            isMoment(input) ||
    	            isDate(input) ||
    	            isString(input) ||
    	            isNumber(input) ||
    	            isNumberOrStringArray(input) ||
    	            isMomentInputObject(input) ||
    	            input === null ||
    	            input === undefined
    	        );
    	    }

    	    function isMomentInputObject(input) {
    	        var objectTest = isObject(input) && !isObjectEmpty(input),
    	            propertyTest = false,
    	            properties = [
    	                'years',
    	                'year',
    	                'y',
    	                'months',
    	                'month',
    	                'M',
    	                'days',
    	                'day',
    	                'd',
    	                'dates',
    	                'date',
    	                'D',
    	                'hours',
    	                'hour',
    	                'h',
    	                'minutes',
    	                'minute',
    	                'm',
    	                'seconds',
    	                'second',
    	                's',
    	                'milliseconds',
    	                'millisecond',
    	                'ms',
    	            ],
    	            i,
    	            property,
    	            propertyLen = properties.length;

    	        for (i = 0; i < propertyLen; i += 1) {
    	            property = properties[i];
    	            propertyTest = propertyTest || hasOwnProp(input, property);
    	        }

    	        return objectTest && propertyTest;
    	    }

    	    function isNumberOrStringArray(input) {
    	        var arrayTest = isArray(input),
    	            dataTypeTest = false;
    	        if (arrayTest) {
    	            dataTypeTest =
    	                input.filter(function (item) {
    	                    return !isNumber(item) && isString(input);
    	                }).length === 0;
    	        }
    	        return arrayTest && dataTypeTest;
    	    }

    	    function isCalendarSpec(input) {
    	        var objectTest = isObject(input) && !isObjectEmpty(input),
    	            propertyTest = false,
    	            properties = [
    	                'sameDay',
    	                'nextDay',
    	                'lastDay',
    	                'nextWeek',
    	                'lastWeek',
    	                'sameElse',
    	            ],
    	            i,
    	            property;

    	        for (i = 0; i < properties.length; i += 1) {
    	            property = properties[i];
    	            propertyTest = propertyTest || hasOwnProp(input, property);
    	        }

    	        return objectTest && propertyTest;
    	    }

    	    function getCalendarFormat(myMoment, now) {
    	        var diff = myMoment.diff(now, 'days', true);
    	        return diff < -6
    	            ? 'sameElse'
    	            : diff < -1
    	            ? 'lastWeek'
    	            : diff < 0
    	            ? 'lastDay'
    	            : diff < 1
    	            ? 'sameDay'
    	            : diff < 2
    	            ? 'nextDay'
    	            : diff < 7
    	            ? 'nextWeek'
    	            : 'sameElse';
    	    }

    	    function calendar$1(time, formats) {
    	        // Support for single parameter, formats only overload to the calendar function
    	        if (arguments.length === 1) {
    	            if (!arguments[0]) {
    	                time = undefined;
    	                formats = undefined;
    	            } else if (isMomentInput(arguments[0])) {
    	                time = arguments[0];
    	                formats = undefined;
    	            } else if (isCalendarSpec(arguments[0])) {
    	                formats = arguments[0];
    	                time = undefined;
    	            }
    	        }
    	        // We want to compare the start of today, vs this.
    	        // Getting start-of-today depends on whether we're local/utc/offset or not.
    	        var now = time || createLocal(),
    	            sod = cloneWithOffset(now, this).startOf('day'),
    	            format = hooks.calendarFormat(this, sod) || 'sameElse',
    	            output =
    	                formats &&
    	                (isFunction(formats[format])
    	                    ? formats[format].call(this, now)
    	                    : formats[format]);

    	        return this.format(
    	            output || this.localeData().calendar(format, this, createLocal(now))
    	        );
    	    }

    	    function clone() {
    	        return new Moment(this);
    	    }

    	    function isAfter(input, units) {
    	        var localInput = isMoment(input) ? input : createLocal(input);
    	        if (!(this.isValid() && localInput.isValid())) {
    	            return false;
    	        }
    	        units = normalizeUnits(units) || 'millisecond';
    	        if (units === 'millisecond') {
    	            return this.valueOf() > localInput.valueOf();
    	        } else {
    	            return localInput.valueOf() < this.clone().startOf(units).valueOf();
    	        }
    	    }

    	    function isBefore(input, units) {
    	        var localInput = isMoment(input) ? input : createLocal(input);
    	        if (!(this.isValid() && localInput.isValid())) {
    	            return false;
    	        }
    	        units = normalizeUnits(units) || 'millisecond';
    	        if (units === 'millisecond') {
    	            return this.valueOf() < localInput.valueOf();
    	        } else {
    	            return this.clone().endOf(units).valueOf() < localInput.valueOf();
    	        }
    	    }

    	    function isBetween(from, to, units, inclusivity) {
    	        var localFrom = isMoment(from) ? from : createLocal(from),
    	            localTo = isMoment(to) ? to : createLocal(to);
    	        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
    	            return false;
    	        }
    	        inclusivity = inclusivity || '()';
    	        return (
    	            (inclusivity[0] === '('
    	                ? this.isAfter(localFrom, units)
    	                : !this.isBefore(localFrom, units)) &&
    	            (inclusivity[1] === ')'
    	                ? this.isBefore(localTo, units)
    	                : !this.isAfter(localTo, units))
    	        );
    	    }

    	    function isSame(input, units) {
    	        var localInput = isMoment(input) ? input : createLocal(input),
    	            inputMs;
    	        if (!(this.isValid() && localInput.isValid())) {
    	            return false;
    	        }
    	        units = normalizeUnits(units) || 'millisecond';
    	        if (units === 'millisecond') {
    	            return this.valueOf() === localInput.valueOf();
    	        } else {
    	            inputMs = localInput.valueOf();
    	            return (
    	                this.clone().startOf(units).valueOf() <= inputMs &&
    	                inputMs <= this.clone().endOf(units).valueOf()
    	            );
    	        }
    	    }

    	    function isSameOrAfter(input, units) {
    	        return this.isSame(input, units) || this.isAfter(input, units);
    	    }

    	    function isSameOrBefore(input, units) {
    	        return this.isSame(input, units) || this.isBefore(input, units);
    	    }

    	    function diff(input, units, asFloat) {
    	        var that, zoneDelta, output;

    	        if (!this.isValid()) {
    	            return NaN;
    	        }

    	        that = cloneWithOffset(input, this);

    	        if (!that.isValid()) {
    	            return NaN;
    	        }

    	        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    	        units = normalizeUnits(units);

    	        switch (units) {
    	            case 'year':
    	                output = monthDiff(this, that) / 12;
    	                break;
    	            case 'month':
    	                output = monthDiff(this, that);
    	                break;
    	            case 'quarter':
    	                output = monthDiff(this, that) / 3;
    	                break;
    	            case 'second':
    	                output = (this - that) / 1e3;
    	                break; // 1000
    	            case 'minute':
    	                output = (this - that) / 6e4;
    	                break; // 1000 * 60
    	            case 'hour':
    	                output = (this - that) / 36e5;
    	                break; // 1000 * 60 * 60
    	            case 'day':
    	                output = (this - that - zoneDelta) / 864e5;
    	                break; // 1000 * 60 * 60 * 24, negate dst
    	            case 'week':
    	                output = (this - that - zoneDelta) / 6048e5;
    	                break; // 1000 * 60 * 60 * 24 * 7, negate dst
    	            default:
    	                output = this - that;
    	        }

    	        return asFloat ? output : absFloor(output);
    	    }

    	    function monthDiff(a, b) {
    	        if (a.date() < b.date()) {
    	            // end-of-month calculations work correct when the start month has more
    	            // days than the end month.
    	            return -monthDiff(b, a);
    	        }
    	        // difference in months
    	        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
    	            // b is in (anchor - 1 month, anchor + 1 month)
    	            anchor = a.clone().add(wholeMonthDiff, 'months'),
    	            anchor2,
    	            adjust;

    	        if (b - anchor < 0) {
    	            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
    	            // linear across the month
    	            adjust = (b - anchor) / (anchor - anchor2);
    	        } else {
    	            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
    	            // linear across the month
    	            adjust = (b - anchor) / (anchor2 - anchor);
    	        }

    	        //check for negative zero, return zero if negative zero
    	        return -(wholeMonthDiff + adjust) || 0;
    	    }

    	    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    	    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    	    function toString() {
    	        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    	    }

    	    function toISOString(keepOffset) {
    	        if (!this.isValid()) {
    	            return null;
    	        }
    	        var utc = keepOffset !== true,
    	            m = utc ? this.clone().utc() : this;
    	        if (m.year() < 0 || m.year() > 9999) {
    	            return formatMoment(
    	                m,
    	                utc
    	                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
    	                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
    	            );
    	        }
    	        if (isFunction(Date.prototype.toISOString)) {
    	            // native implementation is ~50x faster, use it when we can
    	            if (utc) {
    	                return this.toDate().toISOString();
    	            } else {
    	                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
    	                    .toISOString()
    	                    .replace('Z', formatMoment(m, 'Z'));
    	            }
    	        }
    	        return formatMoment(
    	            m,
    	            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
    	        );
    	    }

    	    /**
    	     * Return a human readable representation of a moment that can
    	     * also be evaluated to get a new moment which is the same
    	     *
    	     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
    	     */
    	    function inspect() {
    	        if (!this.isValid()) {
    	            return 'moment.invalid(/* ' + this._i + ' */)';
    	        }
    	        var func = 'moment',
    	            zone = '',
    	            prefix,
    	            year,
    	            datetime,
    	            suffix;
    	        if (!this.isLocal()) {
    	            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
    	            zone = 'Z';
    	        }
    	        prefix = '[' + func + '("]';
    	        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
    	        datetime = '-MM-DD[T]HH:mm:ss.SSS';
    	        suffix = zone + '[")]';

    	        return this.format(prefix + year + datetime + suffix);
    	    }

    	    function format(inputString) {
    	        if (!inputString) {
    	            inputString = this.isUtc()
    	                ? hooks.defaultFormatUtc
    	                : hooks.defaultFormat;
    	        }
    	        var output = formatMoment(this, inputString);
    	        return this.localeData().postformat(output);
    	    }

    	    function from(time, withoutSuffix) {
    	        if (
    	            this.isValid() &&
    	            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
    	        ) {
    	            return createDuration({ to: this, from: time })
    	                .locale(this.locale())
    	                .humanize(!withoutSuffix);
    	        } else {
    	            return this.localeData().invalidDate();
    	        }
    	    }

    	    function fromNow(withoutSuffix) {
    	        return this.from(createLocal(), withoutSuffix);
    	    }

    	    function to(time, withoutSuffix) {
    	        if (
    	            this.isValid() &&
    	            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
    	        ) {
    	            return createDuration({ from: this, to: time })
    	                .locale(this.locale())
    	                .humanize(!withoutSuffix);
    	        } else {
    	            return this.localeData().invalidDate();
    	        }
    	    }

    	    function toNow(withoutSuffix) {
    	        return this.to(createLocal(), withoutSuffix);
    	    }

    	    // If passed a locale key, it will set the locale for this
    	    // instance.  Otherwise, it will return the locale configuration
    	    // variables for this instance.
    	    function locale(key) {
    	        var newLocaleData;

    	        if (key === undefined) {
    	            return this._locale._abbr;
    	        } else {
    	            newLocaleData = getLocale(key);
    	            if (newLocaleData != null) {
    	                this._locale = newLocaleData;
    	            }
    	            return this;
    	        }
    	    }

    	    var lang = deprecate(
    	        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    	        function (key) {
    	            if (key === undefined) {
    	                return this.localeData();
    	            } else {
    	                return this.locale(key);
    	            }
    	        }
    	    );

    	    function localeData() {
    	        return this._locale;
    	    }

    	    var MS_PER_SECOND = 1000,
    	        MS_PER_MINUTE = 60 * MS_PER_SECOND,
    	        MS_PER_HOUR = 60 * MS_PER_MINUTE,
    	        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    	    // actual modulo - handles negative numbers (for dates before 1970):
    	    function mod$1(dividend, divisor) {
    	        return ((dividend % divisor) + divisor) % divisor;
    	    }

    	    function localStartOfDate(y, m, d) {
    	        // the date constructor remaps years 0-99 to 1900-1999
    	        if (y < 100 && y >= 0) {
    	            // preserve leap years using a full 400 year cycle, then reset
    	            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
    	        } else {
    	            return new Date(y, m, d).valueOf();
    	        }
    	    }

    	    function utcStartOfDate(y, m, d) {
    	        // Date.UTC remaps years 0-99 to 1900-1999
    	        if (y < 100 && y >= 0) {
    	            // preserve leap years using a full 400 year cycle, then reset
    	            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
    	        } else {
    	            return Date.UTC(y, m, d);
    	        }
    	    }

    	    function startOf(units) {
    	        var time, startOfDate;
    	        units = normalizeUnits(units);
    	        if (units === undefined || units === 'millisecond' || !this.isValid()) {
    	            return this;
    	        }

    	        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

    	        switch (units) {
    	            case 'year':
    	                time = startOfDate(this.year(), 0, 1);
    	                break;
    	            case 'quarter':
    	                time = startOfDate(
    	                    this.year(),
    	                    this.month() - (this.month() % 3),
    	                    1
    	                );
    	                break;
    	            case 'month':
    	                time = startOfDate(this.year(), this.month(), 1);
    	                break;
    	            case 'week':
    	                time = startOfDate(
    	                    this.year(),
    	                    this.month(),
    	                    this.date() - this.weekday()
    	                );
    	                break;
    	            case 'isoWeek':
    	                time = startOfDate(
    	                    this.year(),
    	                    this.month(),
    	                    this.date() - (this.isoWeekday() - 1)
    	                );
    	                break;
    	            case 'day':
    	            case 'date':
    	                time = startOfDate(this.year(), this.month(), this.date());
    	                break;
    	            case 'hour':
    	                time = this._d.valueOf();
    	                time -= mod$1(
    	                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
    	                    MS_PER_HOUR
    	                );
    	                break;
    	            case 'minute':
    	                time = this._d.valueOf();
    	                time -= mod$1(time, MS_PER_MINUTE);
    	                break;
    	            case 'second':
    	                time = this._d.valueOf();
    	                time -= mod$1(time, MS_PER_SECOND);
    	                break;
    	        }

    	        this._d.setTime(time);
    	        hooks.updateOffset(this, true);
    	        return this;
    	    }

    	    function endOf(units) {
    	        var time, startOfDate;
    	        units = normalizeUnits(units);
    	        if (units === undefined || units === 'millisecond' || !this.isValid()) {
    	            return this;
    	        }

    	        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

    	        switch (units) {
    	            case 'year':
    	                time = startOfDate(this.year() + 1, 0, 1) - 1;
    	                break;
    	            case 'quarter':
    	                time =
    	                    startOfDate(
    	                        this.year(),
    	                        this.month() - (this.month() % 3) + 3,
    	                        1
    	                    ) - 1;
    	                break;
    	            case 'month':
    	                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
    	                break;
    	            case 'week':
    	                time =
    	                    startOfDate(
    	                        this.year(),
    	                        this.month(),
    	                        this.date() - this.weekday() + 7
    	                    ) - 1;
    	                break;
    	            case 'isoWeek':
    	                time =
    	                    startOfDate(
    	                        this.year(),
    	                        this.month(),
    	                        this.date() - (this.isoWeekday() - 1) + 7
    	                    ) - 1;
    	                break;
    	            case 'day':
    	            case 'date':
    	                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
    	                break;
    	            case 'hour':
    	                time = this._d.valueOf();
    	                time +=
    	                    MS_PER_HOUR -
    	                    mod$1(
    	                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
    	                        MS_PER_HOUR
    	                    ) -
    	                    1;
    	                break;
    	            case 'minute':
    	                time = this._d.valueOf();
    	                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
    	                break;
    	            case 'second':
    	                time = this._d.valueOf();
    	                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
    	                break;
    	        }

    	        this._d.setTime(time);
    	        hooks.updateOffset(this, true);
    	        return this;
    	    }

    	    function valueOf() {
    	        return this._d.valueOf() - (this._offset || 0) * 60000;
    	    }

    	    function unix() {
    	        return Math.floor(this.valueOf() / 1000);
    	    }

    	    function toDate() {
    	        return new Date(this.valueOf());
    	    }

    	    function toArray() {
    	        var m = this;
    	        return [
    	            m.year(),
    	            m.month(),
    	            m.date(),
    	            m.hour(),
    	            m.minute(),
    	            m.second(),
    	            m.millisecond(),
    	        ];
    	    }

    	    function toObject() {
    	        var m = this;
    	        return {
    	            years: m.year(),
    	            months: m.month(),
    	            date: m.date(),
    	            hours: m.hours(),
    	            minutes: m.minutes(),
    	            seconds: m.seconds(),
    	            milliseconds: m.milliseconds(),
    	        };
    	    }

    	    function toJSON() {
    	        // new Date(NaN).toJSON() === null
    	        return this.isValid() ? this.toISOString() : null;
    	    }

    	    function isValid$2() {
    	        return isValid(this);
    	    }

    	    function parsingFlags() {
    	        return extend({}, getParsingFlags(this));
    	    }

    	    function invalidAt() {
    	        return getParsingFlags(this).overflow;
    	    }

    	    function creationData() {
    	        return {
    	            input: this._i,
    	            format: this._f,
    	            locale: this._locale,
    	            isUTC: this._isUTC,
    	            strict: this._strict,
    	        };
    	    }

    	    addFormatToken('N', 0, 0, 'eraAbbr');
    	    addFormatToken('NN', 0, 0, 'eraAbbr');
    	    addFormatToken('NNN', 0, 0, 'eraAbbr');
    	    addFormatToken('NNNN', 0, 0, 'eraName');
    	    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    	    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    	    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    	    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    	    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    	    addRegexToken('N', matchEraAbbr);
    	    addRegexToken('NN', matchEraAbbr);
    	    addRegexToken('NNN', matchEraAbbr);
    	    addRegexToken('NNNN', matchEraName);
    	    addRegexToken('NNNNN', matchEraNarrow);

    	    addParseToken(
    	        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
    	        function (input, array, config, token) {
    	            var era = config._locale.erasParse(input, token, config._strict);
    	            if (era) {
    	                getParsingFlags(config).era = era;
    	            } else {
    	                getParsingFlags(config).invalidEra = input;
    	            }
    	        }
    	    );

    	    addRegexToken('y', matchUnsigned);
    	    addRegexToken('yy', matchUnsigned);
    	    addRegexToken('yyy', matchUnsigned);
    	    addRegexToken('yyyy', matchUnsigned);
    	    addRegexToken('yo', matchEraYearOrdinal);

    	    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    	    addParseToken(['yo'], function (input, array, config, token) {
    	        var match;
    	        if (config._locale._eraYearOrdinalRegex) {
    	            match = input.match(config._locale._eraYearOrdinalRegex);
    	        }

    	        if (config._locale.eraYearOrdinalParse) {
    	            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
    	        } else {
    	            array[YEAR] = parseInt(input, 10);
    	        }
    	    });

    	    function localeEras(m, format) {
    	        var i,
    	            l,
    	            date,
    	            eras = this._eras || getLocale('en')._eras;
    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            switch (typeof eras[i].since) {
    	                case 'string':
    	                    // truncate time
    	                    date = hooks(eras[i].since).startOf('day');
    	                    eras[i].since = date.valueOf();
    	                    break;
    	            }

    	            switch (typeof eras[i].until) {
    	                case 'undefined':
    	                    eras[i].until = +Infinity;
    	                    break;
    	                case 'string':
    	                    // truncate time
    	                    date = hooks(eras[i].until).startOf('day').valueOf();
    	                    eras[i].until = date.valueOf();
    	                    break;
    	            }
    	        }
    	        return eras;
    	    }

    	    function localeErasParse(eraName, format, strict) {
    	        var i,
    	            l,
    	            eras = this.eras(),
    	            name,
    	            abbr,
    	            narrow;
    	        eraName = eraName.toUpperCase();

    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            name = eras[i].name.toUpperCase();
    	            abbr = eras[i].abbr.toUpperCase();
    	            narrow = eras[i].narrow.toUpperCase();

    	            if (strict) {
    	                switch (format) {
    	                    case 'N':
    	                    case 'NN':
    	                    case 'NNN':
    	                        if (abbr === eraName) {
    	                            return eras[i];
    	                        }
    	                        break;

    	                    case 'NNNN':
    	                        if (name === eraName) {
    	                            return eras[i];
    	                        }
    	                        break;

    	                    case 'NNNNN':
    	                        if (narrow === eraName) {
    	                            return eras[i];
    	                        }
    	                        break;
    	                }
    	            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
    	                return eras[i];
    	            }
    	        }
    	    }

    	    function localeErasConvertYear(era, year) {
    	        var dir = era.since <= era.until ? +1 : -1;
    	        if (year === undefined) {
    	            return hooks(era.since).year();
    	        } else {
    	            return hooks(era.since).year() + (year - era.offset) * dir;
    	        }
    	    }

    	    function getEraName() {
    	        var i,
    	            l,
    	            val,
    	            eras = this.localeData().eras();
    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            // truncate time
    	            val = this.clone().startOf('day').valueOf();

    	            if (eras[i].since <= val && val <= eras[i].until) {
    	                return eras[i].name;
    	            }
    	            if (eras[i].until <= val && val <= eras[i].since) {
    	                return eras[i].name;
    	            }
    	        }

    	        return '';
    	    }

    	    function getEraNarrow() {
    	        var i,
    	            l,
    	            val,
    	            eras = this.localeData().eras();
    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            // truncate time
    	            val = this.clone().startOf('day').valueOf();

    	            if (eras[i].since <= val && val <= eras[i].until) {
    	                return eras[i].narrow;
    	            }
    	            if (eras[i].until <= val && val <= eras[i].since) {
    	                return eras[i].narrow;
    	            }
    	        }

    	        return '';
    	    }

    	    function getEraAbbr() {
    	        var i,
    	            l,
    	            val,
    	            eras = this.localeData().eras();
    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            // truncate time
    	            val = this.clone().startOf('day').valueOf();

    	            if (eras[i].since <= val && val <= eras[i].until) {
    	                return eras[i].abbr;
    	            }
    	            if (eras[i].until <= val && val <= eras[i].since) {
    	                return eras[i].abbr;
    	            }
    	        }

    	        return '';
    	    }

    	    function getEraYear() {
    	        var i,
    	            l,
    	            dir,
    	            val,
    	            eras = this.localeData().eras();
    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            dir = eras[i].since <= eras[i].until ? +1 : -1;

    	            // truncate time
    	            val = this.clone().startOf('day').valueOf();

    	            if (
    	                (eras[i].since <= val && val <= eras[i].until) ||
    	                (eras[i].until <= val && val <= eras[i].since)
    	            ) {
    	                return (
    	                    (this.year() - hooks(eras[i].since).year()) * dir +
    	                    eras[i].offset
    	                );
    	            }
    	        }

    	        return this.year();
    	    }

    	    function erasNameRegex(isStrict) {
    	        if (!hasOwnProp(this, '_erasNameRegex')) {
    	            computeErasParse.call(this);
    	        }
    	        return isStrict ? this._erasNameRegex : this._erasRegex;
    	    }

    	    function erasAbbrRegex(isStrict) {
    	        if (!hasOwnProp(this, '_erasAbbrRegex')) {
    	            computeErasParse.call(this);
    	        }
    	        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    	    }

    	    function erasNarrowRegex(isStrict) {
    	        if (!hasOwnProp(this, '_erasNarrowRegex')) {
    	            computeErasParse.call(this);
    	        }
    	        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    	    }

    	    function matchEraAbbr(isStrict, locale) {
    	        return locale.erasAbbrRegex(isStrict);
    	    }

    	    function matchEraName(isStrict, locale) {
    	        return locale.erasNameRegex(isStrict);
    	    }

    	    function matchEraNarrow(isStrict, locale) {
    	        return locale.erasNarrowRegex(isStrict);
    	    }

    	    function matchEraYearOrdinal(isStrict, locale) {
    	        return locale._eraYearOrdinalRegex || matchUnsigned;
    	    }

    	    function computeErasParse() {
    	        var abbrPieces = [],
    	            namePieces = [],
    	            narrowPieces = [],
    	            mixedPieces = [],
    	            i,
    	            l,
    	            eras = this.eras();

    	        for (i = 0, l = eras.length; i < l; ++i) {
    	            namePieces.push(regexEscape(eras[i].name));
    	            abbrPieces.push(regexEscape(eras[i].abbr));
    	            narrowPieces.push(regexEscape(eras[i].narrow));

    	            mixedPieces.push(regexEscape(eras[i].name));
    	            mixedPieces.push(regexEscape(eras[i].abbr));
    	            mixedPieces.push(regexEscape(eras[i].narrow));
    	        }

    	        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    	        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
    	        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
    	        this._erasNarrowRegex = new RegExp(
    	            '^(' + narrowPieces.join('|') + ')',
    	            'i'
    	        );
    	    }

    	    // FORMATTING

    	    addFormatToken(0, ['gg', 2], 0, function () {
    	        return this.weekYear() % 100;
    	    });

    	    addFormatToken(0, ['GG', 2], 0, function () {
    	        return this.isoWeekYear() % 100;
    	    });

    	    function addWeekYearFormatToken(token, getter) {
    	        addFormatToken(0, [token, token.length], 0, getter);
    	    }

    	    addWeekYearFormatToken('gggg', 'weekYear');
    	    addWeekYearFormatToken('ggggg', 'weekYear');
    	    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    	    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    	    // ALIASES

    	    addUnitAlias('weekYear', 'gg');
    	    addUnitAlias('isoWeekYear', 'GG');

    	    // PRIORITY

    	    addUnitPriority('weekYear', 1);
    	    addUnitPriority('isoWeekYear', 1);

    	    // PARSING

    	    addRegexToken('G', matchSigned);
    	    addRegexToken('g', matchSigned);
    	    addRegexToken('GG', match1to2, match2);
    	    addRegexToken('gg', match1to2, match2);
    	    addRegexToken('GGGG', match1to4, match4);
    	    addRegexToken('gggg', match1to4, match4);
    	    addRegexToken('GGGGG', match1to6, match6);
    	    addRegexToken('ggggg', match1to6, match6);

    	    addWeekParseToken(
    	        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
    	        function (input, week, config, token) {
    	            week[token.substr(0, 2)] = toInt(input);
    	        }
    	    );

    	    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    	        week[token] = hooks.parseTwoDigitYear(input);
    	    });

    	    // MOMENTS

    	    function getSetWeekYear(input) {
    	        return getSetWeekYearHelper.call(
    	            this,
    	            input,
    	            this.week(),
    	            this.weekday(),
    	            this.localeData()._week.dow,
    	            this.localeData()._week.doy
    	        );
    	    }

    	    function getSetISOWeekYear(input) {
    	        return getSetWeekYearHelper.call(
    	            this,
    	            input,
    	            this.isoWeek(),
    	            this.isoWeekday(),
    	            1,
    	            4
    	        );
    	    }

    	    function getISOWeeksInYear() {
    	        return weeksInYear(this.year(), 1, 4);
    	    }

    	    function getISOWeeksInISOWeekYear() {
    	        return weeksInYear(this.isoWeekYear(), 1, 4);
    	    }

    	    function getWeeksInYear() {
    	        var weekInfo = this.localeData()._week;
    	        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    	    }

    	    function getWeeksInWeekYear() {
    	        var weekInfo = this.localeData()._week;
    	        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    	    }

    	    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    	        var weeksTarget;
    	        if (input == null) {
    	            return weekOfYear(this, dow, doy).year;
    	        } else {
    	            weeksTarget = weeksInYear(input, dow, doy);
    	            if (week > weeksTarget) {
    	                week = weeksTarget;
    	            }
    	            return setWeekAll.call(this, input, week, weekday, dow, doy);
    	        }
    	    }

    	    function setWeekAll(weekYear, week, weekday, dow, doy) {
    	        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
    	            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    	        this.year(date.getUTCFullYear());
    	        this.month(date.getUTCMonth());
    	        this.date(date.getUTCDate());
    	        return this;
    	    }

    	    // FORMATTING

    	    addFormatToken('Q', 0, 'Qo', 'quarter');

    	    // ALIASES

    	    addUnitAlias('quarter', 'Q');

    	    // PRIORITY

    	    addUnitPriority('quarter', 7);

    	    // PARSING

    	    addRegexToken('Q', match1);
    	    addParseToken('Q', function (input, array) {
    	        array[MONTH] = (toInt(input) - 1) * 3;
    	    });

    	    // MOMENTS

    	    function getSetQuarter(input) {
    	        return input == null
    	            ? Math.ceil((this.month() + 1) / 3)
    	            : this.month((input - 1) * 3 + (this.month() % 3));
    	    }

    	    // FORMATTING

    	    addFormatToken('D', ['DD', 2], 'Do', 'date');

    	    // ALIASES

    	    addUnitAlias('date', 'D');

    	    // PRIORITY
    	    addUnitPriority('date', 9);

    	    // PARSING

    	    addRegexToken('D', match1to2);
    	    addRegexToken('DD', match1to2, match2);
    	    addRegexToken('Do', function (isStrict, locale) {
    	        // TODO: Remove "ordinalParse" fallback in next major release.
    	        return isStrict
    	            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
    	            : locale._dayOfMonthOrdinalParseLenient;
    	    });

    	    addParseToken(['D', 'DD'], DATE);
    	    addParseToken('Do', function (input, array) {
    	        array[DATE] = toInt(input.match(match1to2)[0]);
    	    });

    	    // MOMENTS

    	    var getSetDayOfMonth = makeGetSet('Date', true);

    	    // FORMATTING

    	    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    	    // ALIASES

    	    addUnitAlias('dayOfYear', 'DDD');

    	    // PRIORITY
    	    addUnitPriority('dayOfYear', 4);

    	    // PARSING

    	    addRegexToken('DDD', match1to3);
    	    addRegexToken('DDDD', match3);
    	    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    	        config._dayOfYear = toInt(input);
    	    });

    	    // HELPERS

    	    // MOMENTS

    	    function getSetDayOfYear(input) {
    	        var dayOfYear =
    	            Math.round(
    	                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
    	            ) + 1;
    	        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    	    }

    	    // FORMATTING

    	    addFormatToken('m', ['mm', 2], 0, 'minute');

    	    // ALIASES

    	    addUnitAlias('minute', 'm');

    	    // PRIORITY

    	    addUnitPriority('minute', 14);

    	    // PARSING

    	    addRegexToken('m', match1to2);
    	    addRegexToken('mm', match1to2, match2);
    	    addParseToken(['m', 'mm'], MINUTE);

    	    // MOMENTS

    	    var getSetMinute = makeGetSet('Minutes', false);

    	    // FORMATTING

    	    addFormatToken('s', ['ss', 2], 0, 'second');

    	    // ALIASES

    	    addUnitAlias('second', 's');

    	    // PRIORITY

    	    addUnitPriority('second', 15);

    	    // PARSING

    	    addRegexToken('s', match1to2);
    	    addRegexToken('ss', match1to2, match2);
    	    addParseToken(['s', 'ss'], SECOND);

    	    // MOMENTS

    	    var getSetSecond = makeGetSet('Seconds', false);

    	    // FORMATTING

    	    addFormatToken('S', 0, 0, function () {
    	        return ~~(this.millisecond() / 100);
    	    });

    	    addFormatToken(0, ['SS', 2], 0, function () {
    	        return ~~(this.millisecond() / 10);
    	    });

    	    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    	    addFormatToken(0, ['SSSS', 4], 0, function () {
    	        return this.millisecond() * 10;
    	    });
    	    addFormatToken(0, ['SSSSS', 5], 0, function () {
    	        return this.millisecond() * 100;
    	    });
    	    addFormatToken(0, ['SSSSSS', 6], 0, function () {
    	        return this.millisecond() * 1000;
    	    });
    	    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    	        return this.millisecond() * 10000;
    	    });
    	    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    	        return this.millisecond() * 100000;
    	    });
    	    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    	        return this.millisecond() * 1000000;
    	    });

    	    // ALIASES

    	    addUnitAlias('millisecond', 'ms');

    	    // PRIORITY

    	    addUnitPriority('millisecond', 16);

    	    // PARSING

    	    addRegexToken('S', match1to3, match1);
    	    addRegexToken('SS', match1to3, match2);
    	    addRegexToken('SSS', match1to3, match3);

    	    var token, getSetMillisecond;
    	    for (token = 'SSSS'; token.length <= 9; token += 'S') {
    	        addRegexToken(token, matchUnsigned);
    	    }

    	    function parseMs(input, array) {
    	        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    	    }

    	    for (token = 'S'; token.length <= 9; token += 'S') {
    	        addParseToken(token, parseMs);
    	    }

    	    getSetMillisecond = makeGetSet('Milliseconds', false);

    	    // FORMATTING

    	    addFormatToken('z', 0, 0, 'zoneAbbr');
    	    addFormatToken('zz', 0, 0, 'zoneName');

    	    // MOMENTS

    	    function getZoneAbbr() {
    	        return this._isUTC ? 'UTC' : '';
    	    }

    	    function getZoneName() {
    	        return this._isUTC ? 'Coordinated Universal Time' : '';
    	    }

    	    var proto = Moment.prototype;

    	    proto.add = add;
    	    proto.calendar = calendar$1;
    	    proto.clone = clone;
    	    proto.diff = diff;
    	    proto.endOf = endOf;
    	    proto.format = format;
    	    proto.from = from;
    	    proto.fromNow = fromNow;
    	    proto.to = to;
    	    proto.toNow = toNow;
    	    proto.get = stringGet;
    	    proto.invalidAt = invalidAt;
    	    proto.isAfter = isAfter;
    	    proto.isBefore = isBefore;
    	    proto.isBetween = isBetween;
    	    proto.isSame = isSame;
    	    proto.isSameOrAfter = isSameOrAfter;
    	    proto.isSameOrBefore = isSameOrBefore;
    	    proto.isValid = isValid$2;
    	    proto.lang = lang;
    	    proto.locale = locale;
    	    proto.localeData = localeData;
    	    proto.max = prototypeMax;
    	    proto.min = prototypeMin;
    	    proto.parsingFlags = parsingFlags;
    	    proto.set = stringSet;
    	    proto.startOf = startOf;
    	    proto.subtract = subtract;
    	    proto.toArray = toArray;
    	    proto.toObject = toObject;
    	    proto.toDate = toDate;
    	    proto.toISOString = toISOString;
    	    proto.inspect = inspect;
    	    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
    	        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
    	            return 'Moment<' + this.format() + '>';
    	        };
    	    }
    	    proto.toJSON = toJSON;
    	    proto.toString = toString;
    	    proto.unix = unix;
    	    proto.valueOf = valueOf;
    	    proto.creationData = creationData;
    	    proto.eraName = getEraName;
    	    proto.eraNarrow = getEraNarrow;
    	    proto.eraAbbr = getEraAbbr;
    	    proto.eraYear = getEraYear;
    	    proto.year = getSetYear;
    	    proto.isLeapYear = getIsLeapYear;
    	    proto.weekYear = getSetWeekYear;
    	    proto.isoWeekYear = getSetISOWeekYear;
    	    proto.quarter = proto.quarters = getSetQuarter;
    	    proto.month = getSetMonth;
    	    proto.daysInMonth = getDaysInMonth;
    	    proto.week = proto.weeks = getSetWeek;
    	    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    	    proto.weeksInYear = getWeeksInYear;
    	    proto.weeksInWeekYear = getWeeksInWeekYear;
    	    proto.isoWeeksInYear = getISOWeeksInYear;
    	    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    	    proto.date = getSetDayOfMonth;
    	    proto.day = proto.days = getSetDayOfWeek;
    	    proto.weekday = getSetLocaleDayOfWeek;
    	    proto.isoWeekday = getSetISODayOfWeek;
    	    proto.dayOfYear = getSetDayOfYear;
    	    proto.hour = proto.hours = getSetHour;
    	    proto.minute = proto.minutes = getSetMinute;
    	    proto.second = proto.seconds = getSetSecond;
    	    proto.millisecond = proto.milliseconds = getSetMillisecond;
    	    proto.utcOffset = getSetOffset;
    	    proto.utc = setOffsetToUTC;
    	    proto.local = setOffsetToLocal;
    	    proto.parseZone = setOffsetToParsedOffset;
    	    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    	    proto.isDST = isDaylightSavingTime;
    	    proto.isLocal = isLocal;
    	    proto.isUtcOffset = isUtcOffset;
    	    proto.isUtc = isUtc;
    	    proto.isUTC = isUtc;
    	    proto.zoneAbbr = getZoneAbbr;
    	    proto.zoneName = getZoneName;
    	    proto.dates = deprecate(
    	        'dates accessor is deprecated. Use date instead.',
    	        getSetDayOfMonth
    	    );
    	    proto.months = deprecate(
    	        'months accessor is deprecated. Use month instead',
    	        getSetMonth
    	    );
    	    proto.years = deprecate(
    	        'years accessor is deprecated. Use year instead',
    	        getSetYear
    	    );
    	    proto.zone = deprecate(
    	        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
    	        getSetZone
    	    );
    	    proto.isDSTShifted = deprecate(
    	        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
    	        isDaylightSavingTimeShifted
    	    );

    	    function createUnix(input) {
    	        return createLocal(input * 1000);
    	    }

    	    function createInZone() {
    	        return createLocal.apply(null, arguments).parseZone();
    	    }

    	    function preParsePostFormat(string) {
    	        return string;
    	    }

    	    var proto$1 = Locale.prototype;

    	    proto$1.calendar = calendar;
    	    proto$1.longDateFormat = longDateFormat;
    	    proto$1.invalidDate = invalidDate;
    	    proto$1.ordinal = ordinal;
    	    proto$1.preparse = preParsePostFormat;
    	    proto$1.postformat = preParsePostFormat;
    	    proto$1.relativeTime = relativeTime;
    	    proto$1.pastFuture = pastFuture;
    	    proto$1.set = set;
    	    proto$1.eras = localeEras;
    	    proto$1.erasParse = localeErasParse;
    	    proto$1.erasConvertYear = localeErasConvertYear;
    	    proto$1.erasAbbrRegex = erasAbbrRegex;
    	    proto$1.erasNameRegex = erasNameRegex;
    	    proto$1.erasNarrowRegex = erasNarrowRegex;

    	    proto$1.months = localeMonths;
    	    proto$1.monthsShort = localeMonthsShort;
    	    proto$1.monthsParse = localeMonthsParse;
    	    proto$1.monthsRegex = monthsRegex;
    	    proto$1.monthsShortRegex = monthsShortRegex;
    	    proto$1.week = localeWeek;
    	    proto$1.firstDayOfYear = localeFirstDayOfYear;
    	    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    	    proto$1.weekdays = localeWeekdays;
    	    proto$1.weekdaysMin = localeWeekdaysMin;
    	    proto$1.weekdaysShort = localeWeekdaysShort;
    	    proto$1.weekdaysParse = localeWeekdaysParse;

    	    proto$1.weekdaysRegex = weekdaysRegex;
    	    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    	    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    	    proto$1.isPM = localeIsPM;
    	    proto$1.meridiem = localeMeridiem;

    	    function get$1(format, index, field, setter) {
    	        var locale = getLocale(),
    	            utc = createUTC().set(setter, index);
    	        return locale[field](utc, format);
    	    }

    	    function listMonthsImpl(format, index, field) {
    	        if (isNumber(format)) {
    	            index = format;
    	            format = undefined;
    	        }

    	        format = format || '';

    	        if (index != null) {
    	            return get$1(format, index, field, 'month');
    	        }

    	        var i,
    	            out = [];
    	        for (i = 0; i < 12; i++) {
    	            out[i] = get$1(format, i, field, 'month');
    	        }
    	        return out;
    	    }

    	    // ()
    	    // (5)
    	    // (fmt, 5)
    	    // (fmt)
    	    // (true)
    	    // (true, 5)
    	    // (true, fmt, 5)
    	    // (true, fmt)
    	    function listWeekdaysImpl(localeSorted, format, index, field) {
    	        if (typeof localeSorted === 'boolean') {
    	            if (isNumber(format)) {
    	                index = format;
    	                format = undefined;
    	            }

    	            format = format || '';
    	        } else {
    	            format = localeSorted;
    	            index = format;
    	            localeSorted = false;

    	            if (isNumber(format)) {
    	                index = format;
    	                format = undefined;
    	            }

    	            format = format || '';
    	        }

    	        var locale = getLocale(),
    	            shift = localeSorted ? locale._week.dow : 0,
    	            i,
    	            out = [];

    	        if (index != null) {
    	            return get$1(format, (index + shift) % 7, field, 'day');
    	        }

    	        for (i = 0; i < 7; i++) {
    	            out[i] = get$1(format, (i + shift) % 7, field, 'day');
    	        }
    	        return out;
    	    }

    	    function listMonths(format, index) {
    	        return listMonthsImpl(format, index, 'months');
    	    }

    	    function listMonthsShort(format, index) {
    	        return listMonthsImpl(format, index, 'monthsShort');
    	    }

    	    function listWeekdays(localeSorted, format, index) {
    	        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    	    }

    	    function listWeekdaysShort(localeSorted, format, index) {
    	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    	    }

    	    function listWeekdaysMin(localeSorted, format, index) {
    	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    	    }

    	    getSetGlobalLocale('en', {
    	        eras: [
    	            {
    	                since: '0001-01-01',
    	                until: +Infinity,
    	                offset: 1,
    	                name: 'Anno Domini',
    	                narrow: 'AD',
    	                abbr: 'AD',
    	            },
    	            {
    	                since: '0000-12-31',
    	                until: -Infinity,
    	                offset: 1,
    	                name: 'Before Christ',
    	                narrow: 'BC',
    	                abbr: 'BC',
    	            },
    	        ],
    	        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    toInt((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	    });

    	    // Side effect imports

    	    hooks.lang = deprecate(
    	        'moment.lang is deprecated. Use moment.locale instead.',
    	        getSetGlobalLocale
    	    );
    	    hooks.langData = deprecate(
    	        'moment.langData is deprecated. Use moment.localeData instead.',
    	        getLocale
    	    );

    	    var mathAbs = Math.abs;

    	    function abs() {
    	        var data = this._data;

    	        this._milliseconds = mathAbs(this._milliseconds);
    	        this._days = mathAbs(this._days);
    	        this._months = mathAbs(this._months);

    	        data.milliseconds = mathAbs(data.milliseconds);
    	        data.seconds = mathAbs(data.seconds);
    	        data.minutes = mathAbs(data.minutes);
    	        data.hours = mathAbs(data.hours);
    	        data.months = mathAbs(data.months);
    	        data.years = mathAbs(data.years);

    	        return this;
    	    }

    	    function addSubtract$1(duration, input, value, direction) {
    	        var other = createDuration(input, value);

    	        duration._milliseconds += direction * other._milliseconds;
    	        duration._days += direction * other._days;
    	        duration._months += direction * other._months;

    	        return duration._bubble();
    	    }

    	    // supports only 2.0-style add(1, 's') or add(duration)
    	    function add$1(input, value) {
    	        return addSubtract$1(this, input, value, 1);
    	    }

    	    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    	    function subtract$1(input, value) {
    	        return addSubtract$1(this, input, value, -1);
    	    }

    	    function absCeil(number) {
    	        if (number < 0) {
    	            return Math.floor(number);
    	        } else {
    	            return Math.ceil(number);
    	        }
    	    }

    	    function bubble() {
    	        var milliseconds = this._milliseconds,
    	            days = this._days,
    	            months = this._months,
    	            data = this._data,
    	            seconds,
    	            minutes,
    	            hours,
    	            years,
    	            monthsFromDays;

    	        // if we have a mix of positive and negative values, bubble down first
    	        // check: https://github.com/moment/moment/issues/2166
    	        if (
    	            !(
    	                (milliseconds >= 0 && days >= 0 && months >= 0) ||
    	                (milliseconds <= 0 && days <= 0 && months <= 0)
    	            )
    	        ) {
    	            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
    	            days = 0;
    	            months = 0;
    	        }

    	        // The following code bubbles up values, see the tests for
    	        // examples of what that means.
    	        data.milliseconds = milliseconds % 1000;

    	        seconds = absFloor(milliseconds / 1000);
    	        data.seconds = seconds % 60;

    	        minutes = absFloor(seconds / 60);
    	        data.minutes = minutes % 60;

    	        hours = absFloor(minutes / 60);
    	        data.hours = hours % 24;

    	        days += absFloor(hours / 24);

    	        // convert days to months
    	        monthsFromDays = absFloor(daysToMonths(days));
    	        months += monthsFromDays;
    	        days -= absCeil(monthsToDays(monthsFromDays));

    	        // 12 months -> 1 year
    	        years = absFloor(months / 12);
    	        months %= 12;

    	        data.days = days;
    	        data.months = months;
    	        data.years = years;

    	        return this;
    	    }

    	    function daysToMonths(days) {
    	        // 400 years have 146097 days (taking into account leap year rules)
    	        // 400 years have 12 months === 4800
    	        return (days * 4800) / 146097;
    	    }

    	    function monthsToDays(months) {
    	        // the reverse of daysToMonths
    	        return (months * 146097) / 4800;
    	    }

    	    function as(units) {
    	        if (!this.isValid()) {
    	            return NaN;
    	        }
    	        var days,
    	            months,
    	            milliseconds = this._milliseconds;

    	        units = normalizeUnits(units);

    	        if (units === 'month' || units === 'quarter' || units === 'year') {
    	            days = this._days + milliseconds / 864e5;
    	            months = this._months + daysToMonths(days);
    	            switch (units) {
    	                case 'month':
    	                    return months;
    	                case 'quarter':
    	                    return months / 3;
    	                case 'year':
    	                    return months / 12;
    	            }
    	        } else {
    	            // handle milliseconds separately because of floating point math errors (issue #1867)
    	            days = this._days + Math.round(monthsToDays(this._months));
    	            switch (units) {
    	                case 'week':
    	                    return days / 7 + milliseconds / 6048e5;
    	                case 'day':
    	                    return days + milliseconds / 864e5;
    	                case 'hour':
    	                    return days * 24 + milliseconds / 36e5;
    	                case 'minute':
    	                    return days * 1440 + milliseconds / 6e4;
    	                case 'second':
    	                    return days * 86400 + milliseconds / 1000;
    	                // Math.floor prevents floating point math errors here
    	                case 'millisecond':
    	                    return Math.floor(days * 864e5) + milliseconds;
    	                default:
    	                    throw new Error('Unknown unit ' + units);
    	            }
    	        }
    	    }

    	    // TODO: Use this.as('ms')?
    	    function valueOf$1() {
    	        if (!this.isValid()) {
    	            return NaN;
    	        }
    	        return (
    	            this._milliseconds +
    	            this._days * 864e5 +
    	            (this._months % 12) * 2592e6 +
    	            toInt(this._months / 12) * 31536e6
    	        );
    	    }

    	    function makeAs(alias) {
    	        return function () {
    	            return this.as(alias);
    	        };
    	    }

    	    var asMilliseconds = makeAs('ms'),
    	        asSeconds = makeAs('s'),
    	        asMinutes = makeAs('m'),
    	        asHours = makeAs('h'),
    	        asDays = makeAs('d'),
    	        asWeeks = makeAs('w'),
    	        asMonths = makeAs('M'),
    	        asQuarters = makeAs('Q'),
    	        asYears = makeAs('y');

    	    function clone$1() {
    	        return createDuration(this);
    	    }

    	    function get$2(units) {
    	        units = normalizeUnits(units);
    	        return this.isValid() ? this[units + 's']() : NaN;
    	    }

    	    function makeGetter(name) {
    	        return function () {
    	            return this.isValid() ? this._data[name] : NaN;
    	        };
    	    }

    	    var milliseconds = makeGetter('milliseconds'),
    	        seconds = makeGetter('seconds'),
    	        minutes = makeGetter('minutes'),
    	        hours = makeGetter('hours'),
    	        days = makeGetter('days'),
    	        months = makeGetter('months'),
    	        years = makeGetter('years');

    	    function weeks() {
    	        return absFloor(this.days() / 7);
    	    }

    	    var round = Math.round,
    	        thresholds = {
    	            ss: 44, // a few seconds to seconds
    	            s: 45, // seconds to minute
    	            m: 45, // minutes to hour
    	            h: 22, // hours to day
    	            d: 26, // days to month/week
    	            w: null, // weeks to month
    	            M: 11, // months to year
    	        };

    	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    	        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    	    }

    	    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
    	        var duration = createDuration(posNegDuration).abs(),
    	            seconds = round(duration.as('s')),
    	            minutes = round(duration.as('m')),
    	            hours = round(duration.as('h')),
    	            days = round(duration.as('d')),
    	            months = round(duration.as('M')),
    	            weeks = round(duration.as('w')),
    	            years = round(duration.as('y')),
    	            a =
    	                (seconds <= thresholds.ss && ['s', seconds]) ||
    	                (seconds < thresholds.s && ['ss', seconds]) ||
    	                (minutes <= 1 && ['m']) ||
    	                (minutes < thresholds.m && ['mm', minutes]) ||
    	                (hours <= 1 && ['h']) ||
    	                (hours < thresholds.h && ['hh', hours]) ||
    	                (days <= 1 && ['d']) ||
    	                (days < thresholds.d && ['dd', days]);

    	        if (thresholds.w != null) {
    	            a =
    	                a ||
    	                (weeks <= 1 && ['w']) ||
    	                (weeks < thresholds.w && ['ww', weeks]);
    	        }
    	        a = a ||
    	            (months <= 1 && ['M']) ||
    	            (months < thresholds.M && ['MM', months]) ||
    	            (years <= 1 && ['y']) || ['yy', years];

    	        a[2] = withoutSuffix;
    	        a[3] = +posNegDuration > 0;
    	        a[4] = locale;
    	        return substituteTimeAgo.apply(null, a);
    	    }

    	    // This function allows you to set the rounding function for relative time strings
    	    function getSetRelativeTimeRounding(roundingFunction) {
    	        if (roundingFunction === undefined) {
    	            return round;
    	        }
    	        if (typeof roundingFunction === 'function') {
    	            round = roundingFunction;
    	            return true;
    	        }
    	        return false;
    	    }

    	    // This function allows you to set a threshold for relative time strings
    	    function getSetRelativeTimeThreshold(threshold, limit) {
    	        if (thresholds[threshold] === undefined) {
    	            return false;
    	        }
    	        if (limit === undefined) {
    	            return thresholds[threshold];
    	        }
    	        thresholds[threshold] = limit;
    	        if (threshold === 's') {
    	            thresholds.ss = limit - 1;
    	        }
    	        return true;
    	    }

    	    function humanize(argWithSuffix, argThresholds) {
    	        if (!this.isValid()) {
    	            return this.localeData().invalidDate();
    	        }

    	        var withSuffix = false,
    	            th = thresholds,
    	            locale,
    	            output;

    	        if (typeof argWithSuffix === 'object') {
    	            argThresholds = argWithSuffix;
    	            argWithSuffix = false;
    	        }
    	        if (typeof argWithSuffix === 'boolean') {
    	            withSuffix = argWithSuffix;
    	        }
    	        if (typeof argThresholds === 'object') {
    	            th = Object.assign({}, thresholds, argThresholds);
    	            if (argThresholds.s != null && argThresholds.ss == null) {
    	                th.ss = argThresholds.s - 1;
    	            }
    	        }

    	        locale = this.localeData();
    	        output = relativeTime$1(this, !withSuffix, th, locale);

    	        if (withSuffix) {
    	            output = locale.pastFuture(+this, output);
    	        }

    	        return locale.postformat(output);
    	    }

    	    var abs$1 = Math.abs;

    	    function sign(x) {
    	        return (x > 0) - (x < 0) || +x;
    	    }

    	    function toISOString$1() {
    	        // for ISO strings we do not use the normal bubbling rules:
    	        //  * milliseconds bubble up until they become hours
    	        //  * days do not bubble at all
    	        //  * months bubble up until they become years
    	        // This is because there is no context-free conversion between hours and days
    	        // (think of clock changes)
    	        // and also not between days and months (28-31 days per month)
    	        if (!this.isValid()) {
    	            return this.localeData().invalidDate();
    	        }

    	        var seconds = abs$1(this._milliseconds) / 1000,
    	            days = abs$1(this._days),
    	            months = abs$1(this._months),
    	            minutes,
    	            hours,
    	            years,
    	            s,
    	            total = this.asSeconds(),
    	            totalSign,
    	            ymSign,
    	            daysSign,
    	            hmsSign;

    	        if (!total) {
    	            // this is the same as C#'s (Noda) and python (isodate)...
    	            // but not other JS (goog.date)
    	            return 'P0D';
    	        }

    	        // 3600 seconds -> 60 minutes -> 1 hour
    	        minutes = absFloor(seconds / 60);
    	        hours = absFloor(minutes / 60);
    	        seconds %= 60;
    	        minutes %= 60;

    	        // 12 months -> 1 year
    	        years = absFloor(months / 12);
    	        months %= 12;

    	        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    	        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

    	        totalSign = total < 0 ? '-' : '';
    	        ymSign = sign(this._months) !== sign(total) ? '-' : '';
    	        daysSign = sign(this._days) !== sign(total) ? '-' : '';
    	        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

    	        return (
    	            totalSign +
    	            'P' +
    	            (years ? ymSign + years + 'Y' : '') +
    	            (months ? ymSign + months + 'M' : '') +
    	            (days ? daysSign + days + 'D' : '') +
    	            (hours || minutes || seconds ? 'T' : '') +
    	            (hours ? hmsSign + hours + 'H' : '') +
    	            (minutes ? hmsSign + minutes + 'M' : '') +
    	            (seconds ? hmsSign + s + 'S' : '')
    	        );
    	    }

    	    var proto$2 = Duration.prototype;

    	    proto$2.isValid = isValid$1;
    	    proto$2.abs = abs;
    	    proto$2.add = add$1;
    	    proto$2.subtract = subtract$1;
    	    proto$2.as = as;
    	    proto$2.asMilliseconds = asMilliseconds;
    	    proto$2.asSeconds = asSeconds;
    	    proto$2.asMinutes = asMinutes;
    	    proto$2.asHours = asHours;
    	    proto$2.asDays = asDays;
    	    proto$2.asWeeks = asWeeks;
    	    proto$2.asMonths = asMonths;
    	    proto$2.asQuarters = asQuarters;
    	    proto$2.asYears = asYears;
    	    proto$2.valueOf = valueOf$1;
    	    proto$2._bubble = bubble;
    	    proto$2.clone = clone$1;
    	    proto$2.get = get$2;
    	    proto$2.milliseconds = milliseconds;
    	    proto$2.seconds = seconds;
    	    proto$2.minutes = minutes;
    	    proto$2.hours = hours;
    	    proto$2.days = days;
    	    proto$2.weeks = weeks;
    	    proto$2.months = months;
    	    proto$2.years = years;
    	    proto$2.humanize = humanize;
    	    proto$2.toISOString = toISOString$1;
    	    proto$2.toString = toISOString$1;
    	    proto$2.toJSON = toISOString$1;
    	    proto$2.locale = locale;
    	    proto$2.localeData = localeData;

    	    proto$2.toIsoString = deprecate(
    	        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
    	        toISOString$1
    	    );
    	    proto$2.lang = lang;

    	    // FORMATTING

    	    addFormatToken('X', 0, 0, 'unix');
    	    addFormatToken('x', 0, 0, 'valueOf');

    	    // PARSING

    	    addRegexToken('x', matchSigned);
    	    addRegexToken('X', matchTimestamp);
    	    addParseToken('X', function (input, array, config) {
    	        config._d = new Date(parseFloat(input) * 1000);
    	    });
    	    addParseToken('x', function (input, array, config) {
    	        config._d = new Date(toInt(input));
    	    });

    	    //! moment.js

    	    hooks.version = '2.29.4';

    	    setHookCallback(createLocal);

    	    hooks.fn = proto;
    	    hooks.min = min;
    	    hooks.max = max;
    	    hooks.now = now;
    	    hooks.utc = createUTC;
    	    hooks.unix = createUnix;
    	    hooks.months = listMonths;
    	    hooks.isDate = isDate;
    	    hooks.locale = getSetGlobalLocale;
    	    hooks.invalid = createInvalid;
    	    hooks.duration = createDuration;
    	    hooks.isMoment = isMoment;
    	    hooks.weekdays = listWeekdays;
    	    hooks.parseZone = createInZone;
    	    hooks.localeData = getLocale;
    	    hooks.isDuration = isDuration;
    	    hooks.monthsShort = listMonthsShort;
    	    hooks.weekdaysMin = listWeekdaysMin;
    	    hooks.defineLocale = defineLocale;
    	    hooks.updateLocale = updateLocale;
    	    hooks.locales = listLocales;
    	    hooks.weekdaysShort = listWeekdaysShort;
    	    hooks.normalizeUnits = normalizeUnits;
    	    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    	    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    	    hooks.calendarFormat = getCalendarFormat;
    	    hooks.prototype = proto;

    	    // currently HTML5 input type only supports 24-hour formats
    	    hooks.HTML5_FMT = {
    	        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
    	        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
    	        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
    	        DATE: 'YYYY-MM-DD', // <input type="date" />
    	        TIME: 'HH:mm', // <input type="time" />
    	        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
    	        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
    	        WEEK: 'GGGG-[W]WW', // <input type="week" />
    	        MONTH: 'YYYY-MM', // <input type="month" />
    	    };

    	    //! moment.js locale configuration

    	    hooks.defineLocale('af', {
    	        months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
    	        weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
    	        weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
    	        meridiemParse: /vm|nm/i,
    	        isPM: function (input) {
    	            return /^nm$/i.test(input);
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 12) {
    	                return isLower ? 'vm' : 'VM';
    	            } else {
    	                return isLower ? 'nm' : 'NM';
    	            }
    	        },
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Vandag om] LT',
    	            nextDay: '[Môre om] LT',
    	            nextWeek: 'dddd [om] LT',
    	            lastDay: '[Gister om] LT',
    	            lastWeek: '[Laas] dddd [om] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'oor %s',
    	            past: '%s gelede',
    	            s: "'n paar sekondes",
    	            ss: '%d sekondes',
    	            m: "'n minuut",
    	            mm: '%d minute',
    	            h: "'n uur",
    	            hh: '%d ure',
    	            d: "'n dag",
    	            dd: '%d dae',
    	            M: "'n maand",
    	            MM: '%d maande',
    	            y: "'n jaar",
    	            yy: '%d jaar',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    	        ordinal: function (number) {
    	            return (
    	                number +
    	                (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de')
    	            ); // Thanks to Joris Röling : https://github.com/jjupiter
    	        },
    	        week: {
    	            dow: 1, // Maandag is die eerste dag van die week.
    	            doy: 4, // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var pluralForm = function (n) {
    	            return n === 0
    	                ? 0
    	                : n === 1
    	                ? 1
    	                : n === 2
    	                ? 2
    	                : n % 100 >= 3 && n % 100 <= 10
    	                ? 3
    	                : n % 100 >= 11
    	                ? 4
    	                : 5;
    	        },
    	        plurals = {
    	            s: [
    	                'أقل من ثانية',
    	                'ثانية واحدة',
    	                ['ثانيتان', 'ثانيتين'],
    	                '%d ثوان',
    	                '%d ثانية',
    	                '%d ثانية',
    	            ],
    	            m: [
    	                'أقل من دقيقة',
    	                'دقيقة واحدة',
    	                ['دقيقتان', 'دقيقتين'],
    	                '%d دقائق',
    	                '%d دقيقة',
    	                '%d دقيقة',
    	            ],
    	            h: [
    	                'أقل من ساعة',
    	                'ساعة واحدة',
    	                ['ساعتان', 'ساعتين'],
    	                '%d ساعات',
    	                '%d ساعة',
    	                '%d ساعة',
    	            ],
    	            d: [
    	                'أقل من يوم',
    	                'يوم واحد',
    	                ['يومان', 'يومين'],
    	                '%d أيام',
    	                '%d يومًا',
    	                '%d يوم',
    	            ],
    	            M: [
    	                'أقل من شهر',
    	                'شهر واحد',
    	                ['شهران', 'شهرين'],
    	                '%d أشهر',
    	                '%d شهرا',
    	                '%d شهر',
    	            ],
    	            y: [
    	                'أقل من عام',
    	                'عام واحد',
    	                ['عامان', 'عامين'],
    	                '%d أعوام',
    	                '%d عامًا',
    	                '%d عام',
    	            ],
    	        },
    	        pluralize = function (u) {
    	            return function (number, withoutSuffix, string, isFuture) {
    	                var f = pluralForm(number),
    	                    str = plurals[u][pluralForm(number)];
    	                if (f === 2) {
    	                    str = str[withoutSuffix ? 0 : 1];
    	                }
    	                return str.replace(/%d/i, number);
    	            };
    	        },
    	        months$1 = [
    	            'جانفي',
    	            'فيفري',
    	            'مارس',
    	            'أفريل',
    	            'ماي',
    	            'جوان',
    	            'جويلية',
    	            'أوت',
    	            'سبتمبر',
    	            'أكتوبر',
    	            'نوفمبر',
    	            'ديسمبر',
    	        ];

    	    hooks.defineLocale('ar-dz', {
    	        months: months$1,
    	        monthsShort: months$1,
    	        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'D/\u200FM/\u200FYYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ص|م/,
    	        isPM: function (input) {
    	            return 'م' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ص';
    	            } else {
    	                return 'م';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[اليوم عند الساعة] LT',
    	            nextDay: '[غدًا عند الساعة] LT',
    	            nextWeek: 'dddd [عند الساعة] LT',
    	            lastDay: '[أمس عند الساعة] LT',
    	            lastWeek: 'dddd [عند الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'بعد %s',
    	            past: 'منذ %s',
    	            s: pluralize('s'),
    	            ss: pluralize('s'),
    	            m: pluralize('m'),
    	            mm: pluralize('m'),
    	            h: pluralize('h'),
    	            hh: pluralize('h'),
    	            d: pluralize('d'),
    	            dd: pluralize('d'),
    	            M: pluralize('M'),
    	            MM: pluralize('M'),
    	            y: pluralize('y'),
    	            yy: pluralize('y'),
    	        },
    	        postformat: function (string) {
    	            return string.replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ar-kw', {
    	        months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split(
    	                '_'
    	            ),
    	        weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[اليوم على الساعة] LT',
    	            nextDay: '[غدا على الساعة] LT',
    	            nextWeek: 'dddd [على الساعة] LT',
    	            lastDay: '[أمس على الساعة] LT',
    	            lastWeek: 'dddd [على الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'في %s',
    	            past: 'منذ %s',
    	            s: 'ثوان',
    	            ss: '%d ثانية',
    	            m: 'دقيقة',
    	            mm: '%d دقائق',
    	            h: 'ساعة',
    	            hh: '%d ساعات',
    	            d: 'يوم',
    	            dd: '%d أيام',
    	            M: 'شهر',
    	            MM: '%d أشهر',
    	            y: 'سنة',
    	            yy: '%d سنوات',
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap = {
    	            1: '1',
    	            2: '2',
    	            3: '3',
    	            4: '4',
    	            5: '5',
    	            6: '6',
    	            7: '7',
    	            8: '8',
    	            9: '9',
    	            0: '0',
    	        },
    	        pluralForm$1 = function (n) {
    	            return n === 0
    	                ? 0
    	                : n === 1
    	                ? 1
    	                : n === 2
    	                ? 2
    	                : n % 100 >= 3 && n % 100 <= 10
    	                ? 3
    	                : n % 100 >= 11
    	                ? 4
    	                : 5;
    	        },
    	        plurals$1 = {
    	            s: [
    	                'أقل من ثانية',
    	                'ثانية واحدة',
    	                ['ثانيتان', 'ثانيتين'],
    	                '%d ثوان',
    	                '%d ثانية',
    	                '%d ثانية',
    	            ],
    	            m: [
    	                'أقل من دقيقة',
    	                'دقيقة واحدة',
    	                ['دقيقتان', 'دقيقتين'],
    	                '%d دقائق',
    	                '%d دقيقة',
    	                '%d دقيقة',
    	            ],
    	            h: [
    	                'أقل من ساعة',
    	                'ساعة واحدة',
    	                ['ساعتان', 'ساعتين'],
    	                '%d ساعات',
    	                '%d ساعة',
    	                '%d ساعة',
    	            ],
    	            d: [
    	                'أقل من يوم',
    	                'يوم واحد',
    	                ['يومان', 'يومين'],
    	                '%d أيام',
    	                '%d يومًا',
    	                '%d يوم',
    	            ],
    	            M: [
    	                'أقل من شهر',
    	                'شهر واحد',
    	                ['شهران', 'شهرين'],
    	                '%d أشهر',
    	                '%d شهرا',
    	                '%d شهر',
    	            ],
    	            y: [
    	                'أقل من عام',
    	                'عام واحد',
    	                ['عامان', 'عامين'],
    	                '%d أعوام',
    	                '%d عامًا',
    	                '%d عام',
    	            ],
    	        },
    	        pluralize$1 = function (u) {
    	            return function (number, withoutSuffix, string, isFuture) {
    	                var f = pluralForm$1(number),
    	                    str = plurals$1[u][pluralForm$1(number)];
    	                if (f === 2) {
    	                    str = str[withoutSuffix ? 0 : 1];
    	                }
    	                return str.replace(/%d/i, number);
    	            };
    	        },
    	        months$2 = [
    	            'يناير',
    	            'فبراير',
    	            'مارس',
    	            'أبريل',
    	            'مايو',
    	            'يونيو',
    	            'يوليو',
    	            'أغسطس',
    	            'سبتمبر',
    	            'أكتوبر',
    	            'نوفمبر',
    	            'ديسمبر',
    	        ];

    	    hooks.defineLocale('ar-ly', {
    	        months: months$2,
    	        monthsShort: months$2,
    	        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'D/\u200FM/\u200FYYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ص|م/,
    	        isPM: function (input) {
    	            return 'م' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ص';
    	            } else {
    	                return 'م';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[اليوم عند الساعة] LT',
    	            nextDay: '[غدًا عند الساعة] LT',
    	            nextWeek: 'dddd [عند الساعة] LT',
    	            lastDay: '[أمس عند الساعة] LT',
    	            lastWeek: 'dddd [عند الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'بعد %s',
    	            past: 'منذ %s',
    	            s: pluralize$1('s'),
    	            ss: pluralize$1('s'),
    	            m: pluralize$1('m'),
    	            mm: pluralize$1('m'),
    	            h: pluralize$1('h'),
    	            hh: pluralize$1('h'),
    	            d: pluralize$1('d'),
    	            dd: pluralize$1('d'),
    	            M: pluralize$1('M'),
    	            MM: pluralize$1('M'),
    	            y: pluralize$1('y'),
    	            yy: pluralize$1('y'),
    	        },
    	        preparse: function (string) {
    	            return string.replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string
    	                .replace(/\d/g, function (match) {
    	                    return symbolMap[match];
    	                })
    	                .replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 6, // Saturday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ar-ma', {
    	        months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split(
    	                '_'
    	            ),
    	        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[اليوم على الساعة] LT',
    	            nextDay: '[غدا على الساعة] LT',
    	            nextWeek: 'dddd [على الساعة] LT',
    	            lastDay: '[أمس على الساعة] LT',
    	            lastWeek: 'dddd [على الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'في %s',
    	            past: 'منذ %s',
    	            s: 'ثوان',
    	            ss: '%d ثانية',
    	            m: 'دقيقة',
    	            mm: '%d دقائق',
    	            h: 'ساعة',
    	            hh: '%d ساعات',
    	            d: 'يوم',
    	            dd: '%d أيام',
    	            M: 'شهر',
    	            MM: '%d أشهر',
    	            y: 'سنة',
    	            yy: '%d سنوات',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$1 = {
    	            1: '١',
    	            2: '٢',
    	            3: '٣',
    	            4: '٤',
    	            5: '٥',
    	            6: '٦',
    	            7: '٧',
    	            8: '٨',
    	            9: '٩',
    	            0: '٠',
    	        },
    	        numberMap = {
    	            '١': '1',
    	            '٢': '2',
    	            '٣': '3',
    	            '٤': '4',
    	            '٥': '5',
    	            '٦': '6',
    	            '٧': '7',
    	            '٨': '8',
    	            '٩': '9',
    	            '٠': '0',
    	        };

    	    hooks.defineLocale('ar-sa', {
    	        months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
    	                '_'
    	            ),
    	        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ص|م/,
    	        isPM: function (input) {
    	            return 'م' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ص';
    	            } else {
    	                return 'م';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[اليوم على الساعة] LT',
    	            nextDay: '[غدا على الساعة] LT',
    	            nextWeek: 'dddd [على الساعة] LT',
    	            lastDay: '[أمس على الساعة] LT',
    	            lastWeek: 'dddd [على الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'في %s',
    	            past: 'منذ %s',
    	            s: 'ثوان',
    	            ss: '%d ثانية',
    	            m: 'دقيقة',
    	            mm: '%d دقائق',
    	            h: 'ساعة',
    	            hh: '%d ساعات',
    	            d: 'يوم',
    	            dd: '%d أيام',
    	            M: 'شهر',
    	            MM: '%d أشهر',
    	            y: 'سنة',
    	            yy: '%d سنوات',
    	        },
    	        preparse: function (string) {
    	            return string
    	                .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
    	                    return numberMap[match];
    	                })
    	                .replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string
    	                .replace(/\d/g, function (match) {
    	                    return symbolMap$1[match];
    	                })
    	                .replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ar-tn', {
    	        months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
    	                '_'
    	            ),
    	        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[اليوم على الساعة] LT',
    	            nextDay: '[غدا على الساعة] LT',
    	            nextWeek: 'dddd [على الساعة] LT',
    	            lastDay: '[أمس على الساعة] LT',
    	            lastWeek: 'dddd [على الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'في %s',
    	            past: 'منذ %s',
    	            s: 'ثوان',
    	            ss: '%d ثانية',
    	            m: 'دقيقة',
    	            mm: '%d دقائق',
    	            h: 'ساعة',
    	            hh: '%d ساعات',
    	            d: 'يوم',
    	            dd: '%d أيام',
    	            M: 'شهر',
    	            MM: '%d أشهر',
    	            y: 'سنة',
    	            yy: '%d سنوات',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$2 = {
    	            1: '١',
    	            2: '٢',
    	            3: '٣',
    	            4: '٤',
    	            5: '٥',
    	            6: '٦',
    	            7: '٧',
    	            8: '٨',
    	            9: '٩',
    	            0: '٠',
    	        },
    	        numberMap$1 = {
    	            '١': '1',
    	            '٢': '2',
    	            '٣': '3',
    	            '٤': '4',
    	            '٥': '5',
    	            '٦': '6',
    	            '٧': '7',
    	            '٨': '8',
    	            '٩': '9',
    	            '٠': '0',
    	        },
    	        pluralForm$2 = function (n) {
    	            return n === 0
    	                ? 0
    	                : n === 1
    	                ? 1
    	                : n === 2
    	                ? 2
    	                : n % 100 >= 3 && n % 100 <= 10
    	                ? 3
    	                : n % 100 >= 11
    	                ? 4
    	                : 5;
    	        },
    	        plurals$2 = {
    	            s: [
    	                'أقل من ثانية',
    	                'ثانية واحدة',
    	                ['ثانيتان', 'ثانيتين'],
    	                '%d ثوان',
    	                '%d ثانية',
    	                '%d ثانية',
    	            ],
    	            m: [
    	                'أقل من دقيقة',
    	                'دقيقة واحدة',
    	                ['دقيقتان', 'دقيقتين'],
    	                '%d دقائق',
    	                '%d دقيقة',
    	                '%d دقيقة',
    	            ],
    	            h: [
    	                'أقل من ساعة',
    	                'ساعة واحدة',
    	                ['ساعتان', 'ساعتين'],
    	                '%d ساعات',
    	                '%d ساعة',
    	                '%d ساعة',
    	            ],
    	            d: [
    	                'أقل من يوم',
    	                'يوم واحد',
    	                ['يومان', 'يومين'],
    	                '%d أيام',
    	                '%d يومًا',
    	                '%d يوم',
    	            ],
    	            M: [
    	                'أقل من شهر',
    	                'شهر واحد',
    	                ['شهران', 'شهرين'],
    	                '%d أشهر',
    	                '%d شهرا',
    	                '%d شهر',
    	            ],
    	            y: [
    	                'أقل من عام',
    	                'عام واحد',
    	                ['عامان', 'عامين'],
    	                '%d أعوام',
    	                '%d عامًا',
    	                '%d عام',
    	            ],
    	        },
    	        pluralize$2 = function (u) {
    	            return function (number, withoutSuffix, string, isFuture) {
    	                var f = pluralForm$2(number),
    	                    str = plurals$2[u][pluralForm$2(number)];
    	                if (f === 2) {
    	                    str = str[withoutSuffix ? 0 : 1];
    	                }
    	                return str.replace(/%d/i, number);
    	            };
    	        },
    	        months$3 = [
    	            'يناير',
    	            'فبراير',
    	            'مارس',
    	            'أبريل',
    	            'مايو',
    	            'يونيو',
    	            'يوليو',
    	            'أغسطس',
    	            'سبتمبر',
    	            'أكتوبر',
    	            'نوفمبر',
    	            'ديسمبر',
    	        ];

    	    hooks.defineLocale('ar', {
    	        months: months$3,
    	        monthsShort: months$3,
    	        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    	        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    	        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'D/\u200FM/\u200FYYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ص|م/,
    	        isPM: function (input) {
    	            return 'م' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ص';
    	            } else {
    	                return 'م';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[اليوم عند الساعة] LT',
    	            nextDay: '[غدًا عند الساعة] LT',
    	            nextWeek: 'dddd [عند الساعة] LT',
    	            lastDay: '[أمس عند الساعة] LT',
    	            lastWeek: 'dddd [عند الساعة] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'بعد %s',
    	            past: 'منذ %s',
    	            s: pluralize$2('s'),
    	            ss: pluralize$2('s'),
    	            m: pluralize$2('m'),
    	            mm: pluralize$2('m'),
    	            h: pluralize$2('h'),
    	            hh: pluralize$2('h'),
    	            d: pluralize$2('d'),
    	            dd: pluralize$2('d'),
    	            M: pluralize$2('M'),
    	            MM: pluralize$2('M'),
    	            y: pluralize$2('y'),
    	            yy: pluralize$2('y'),
    	        },
    	        preparse: function (string) {
    	            return string
    	                .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
    	                    return numberMap$1[match];
    	                })
    	                .replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string
    	                .replace(/\d/g, function (match) {
    	                    return symbolMap$2[match];
    	                })
    	                .replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 6, // Saturday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var suffixes = {
    	        1: '-inci',
    	        5: '-inci',
    	        8: '-inci',
    	        70: '-inci',
    	        80: '-inci',
    	        2: '-nci',
    	        7: '-nci',
    	        20: '-nci',
    	        50: '-nci',
    	        3: '-üncü',
    	        4: '-üncü',
    	        100: '-üncü',
    	        6: '-ncı',
    	        9: '-uncu',
    	        10: '-uncu',
    	        30: '-uncu',
    	        60: '-ıncı',
    	        90: '-ıncı',
    	    };

    	    hooks.defineLocale('az', {
    	        months: 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split(
    	            '_'
    	        ),
    	        monthsShort: 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
    	        weekdays:
    	            'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
    	        weekdaysMin: 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[bugün saat] LT',
    	            nextDay: '[sabah saat] LT',
    	            nextWeek: '[gələn həftə] dddd [saat] LT',
    	            lastDay: '[dünən] LT',
    	            lastWeek: '[keçən həftə] dddd [saat] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s sonra',
    	            past: '%s əvvəl',
    	            s: 'bir neçə saniyə',
    	            ss: '%d saniyə',
    	            m: 'bir dəqiqə',
    	            mm: '%d dəqiqə',
    	            h: 'bir saat',
    	            hh: '%d saat',
    	            d: 'bir gün',
    	            dd: '%d gün',
    	            M: 'bir ay',
    	            MM: '%d ay',
    	            y: 'bir il',
    	            yy: '%d il',
    	        },
    	        meridiemParse: /gecə|səhər|gündüz|axşam/,
    	        isPM: function (input) {
    	            return /^(gündüz|axşam)$/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'gecə';
    	            } else if (hour < 12) {
    	                return 'səhər';
    	            } else if (hour < 17) {
    	                return 'gündüz';
    	            } else {
    	                return 'axşam';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
    	        ordinal: function (number) {
    	            if (number === 0) {
    	                // special case for zero
    	                return number + '-ıncı';
    	            }
    	            var a = number % 10,
    	                b = (number % 100) - a,
    	                c = number >= 100 ? 100 : null;
    	            return number + (suffixes[a] || suffixes[b] || suffixes[c]);
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function plural(word, num) {
    	        var forms = word.split('_');
    	        return num % 10 === 1 && num % 100 !== 11
    	            ? forms[0]
    	            : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    	            ? forms[1]
    	            : forms[2];
    	    }
    	    function relativeTimeWithPlural(number, withoutSuffix, key) {
    	        var format = {
    	            ss: withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
    	            mm: withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
    	            hh: withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
    	            dd: 'дзень_дні_дзён',
    	            MM: 'месяц_месяцы_месяцаў',
    	            yy: 'год_гады_гадоў',
    	        };
    	        if (key === 'm') {
    	            return withoutSuffix ? 'хвіліна' : 'хвіліну';
    	        } else if (key === 'h') {
    	            return withoutSuffix ? 'гадзіна' : 'гадзіну';
    	        } else {
    	            return number + ' ' + plural(format[key], +number);
    	        }
    	    }

    	    hooks.defineLocale('be', {
    	        months: {
    	            format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort:
    	            'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
    	        weekdays: {
    	            format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split(
    	                    '_'
    	                ),
    	            isFormat: /\[ ?[Ууў] ?(?:мінулую|наступную)? ?\] ?dddd/,
    	        },
    	        weekdaysShort: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
    	        weekdaysMin: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY г.',
    	            LLL: 'D MMMM YYYY г., HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY г., HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Сёння ў] LT',
    	            nextDay: '[Заўтра ў] LT',
    	            lastDay: '[Учора ў] LT',
    	            nextWeek: function () {
    	                return '[У] dddd [ў] LT';
    	            },
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                    case 3:
    	                    case 5:
    	                    case 6:
    	                        return '[У мінулую] dddd [ў] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                        return '[У мінулы] dddd [ў] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'праз %s',
    	            past: '%s таму',
    	            s: 'некалькі секунд',
    	            m: relativeTimeWithPlural,
    	            mm: relativeTimeWithPlural,
    	            h: relativeTimeWithPlural,
    	            hh: relativeTimeWithPlural,
    	            d: 'дзень',
    	            dd: relativeTimeWithPlural,
    	            M: 'месяц',
    	            MM: relativeTimeWithPlural,
    	            y: 'год',
    	            yy: relativeTimeWithPlural,
    	        },
    	        meridiemParse: /ночы|раніцы|дня|вечара/,
    	        isPM: function (input) {
    	            return /^(дня|вечара)$/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'ночы';
    	            } else if (hour < 12) {
    	                return 'раніцы';
    	            } else if (hour < 17) {
    	                return 'дня';
    	            } else {
    	                return 'вечара';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'M':
    	                case 'd':
    	                case 'DDD':
    	                case 'w':
    	                case 'W':
    	                    return (number % 10 === 2 || number % 10 === 3) &&
    	                        number % 100 !== 12 &&
    	                        number % 100 !== 13
    	                        ? number + '-і'
    	                        : number + '-ы';
    	                case 'D':
    	                    return number + '-га';
    	                default:
    	                    return number;
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('bg', {
    	        months: 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split(
    	            '_'
    	        ),
    	        monthsShort: 'яну_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
    	        weekdays: 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
    	        weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'D.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY H:mm',
    	            LLLL: 'dddd, D MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Днес в] LT',
    	            nextDay: '[Утре в] LT',
    	            nextWeek: 'dddd [в] LT',
    	            lastDay: '[Вчера в] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                    case 3:
    	                    case 6:
    	                        return '[Миналата] dddd [в] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[Миналия] dddd [в] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'след %s',
    	            past: 'преди %s',
    	            s: 'няколко секунди',
    	            ss: '%d секунди',
    	            m: 'минута',
    	            mm: '%d минути',
    	            h: 'час',
    	            hh: '%d часа',
    	            d: 'ден',
    	            dd: '%d дена',
    	            w: 'седмица',
    	            ww: '%d седмици',
    	            M: 'месец',
    	            MM: '%d месеца',
    	            y: 'година',
    	            yy: '%d години',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
    	        ordinal: function (number) {
    	            var lastDigit = number % 10,
    	                last2Digits = number % 100;
    	            if (number === 0) {
    	                return number + '-ев';
    	            } else if (last2Digits === 0) {
    	                return number + '-ен';
    	            } else if (last2Digits > 10 && last2Digits < 20) {
    	                return number + '-ти';
    	            } else if (lastDigit === 1) {
    	                return number + '-ви';
    	            } else if (lastDigit === 2) {
    	                return number + '-ри';
    	            } else if (lastDigit === 7 || lastDigit === 8) {
    	                return number + '-ми';
    	            } else {
    	                return number + '-ти';
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('bm', {
    	        months: 'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des'.split('_'),
    	        weekdays: 'Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
    	        weekdaysShort: 'Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib'.split('_'),
    	        weekdaysMin: 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'MMMM [tile] D [san] YYYY',
    	            LLL: 'MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
    	            LLLL: 'dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Bi lɛrɛ] LT',
    	            nextDay: '[Sini lɛrɛ] LT',
    	            nextWeek: 'dddd [don lɛrɛ] LT',
    	            lastDay: '[Kunu lɛrɛ] LT',
    	            lastWeek: 'dddd [tɛmɛnen lɛrɛ] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s kɔnɔ',
    	            past: 'a bɛ %s bɔ',
    	            s: 'sanga dama dama',
    	            ss: 'sekondi %d',
    	            m: 'miniti kelen',
    	            mm: 'miniti %d',
    	            h: 'lɛrɛ kelen',
    	            hh: 'lɛrɛ %d',
    	            d: 'tile kelen',
    	            dd: 'tile %d',
    	            M: 'kalo kelen',
    	            MM: 'kalo %d',
    	            y: 'san kelen',
    	            yy: 'san %d',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$3 = {
    	            1: '১',
    	            2: '২',
    	            3: '৩',
    	            4: '৪',
    	            5: '৫',
    	            6: '৬',
    	            7: '৭',
    	            8: '৮',
    	            9: '৯',
    	            0: '০',
    	        },
    	        numberMap$2 = {
    	            '১': '1',
    	            '২': '2',
    	            '৩': '3',
    	            '৪': '4',
    	            '৫': '5',
    	            '৬': '6',
    	            '৭': '7',
    	            '৮': '8',
    	            '৯': '9',
    	            '০': '0',
    	        };

    	    hooks.defineLocale('bn-bd', {
    	        months: 'জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'জানু_ফেব্রু_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্ট_অক্টো_নভে_ডিসে'.split(
    	                '_'
    	            ),
    	        weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
    	        weekdaysMin: 'রবি_সোম_মঙ্গল_বুধ_বৃহ_শুক্র_শনি'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm সময়',
    	            LTS: 'A h:mm:ss সময়',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm সময়',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm সময়',
    	        },
    	        calendar: {
    	            sameDay: '[আজ] LT',
    	            nextDay: '[আগামীকাল] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[গতকাল] LT',
    	            lastWeek: '[গত] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s পরে',
    	            past: '%s আগে',
    	            s: 'কয়েক সেকেন্ড',
    	            ss: '%d সেকেন্ড',
    	            m: 'এক মিনিট',
    	            mm: '%d মিনিট',
    	            h: 'এক ঘন্টা',
    	            hh: '%d ঘন্টা',
    	            d: 'এক দিন',
    	            dd: '%d দিন',
    	            M: 'এক মাস',
    	            MM: '%d মাস',
    	            y: 'এক বছর',
    	            yy: '%d বছর',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
    	                return numberMap$2[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$3[match];
    	            });
    	        },

    	        meridiemParse: /রাত|ভোর|সকাল|দুপুর|বিকাল|সন্ধ্যা|রাত/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'রাত') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'ভোর') {
    	                return hour;
    	            } else if (meridiem === 'সকাল') {
    	                return hour;
    	            } else if (meridiem === 'দুপুর') {
    	                return hour >= 3 ? hour : hour + 12;
    	            } else if (meridiem === 'বিকাল') {
    	                return hour + 12;
    	            } else if (meridiem === 'সন্ধ্যা') {
    	                return hour + 12;
    	            }
    	        },

    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'রাত';
    	            } else if (hour < 6) {
    	                return 'ভোর';
    	            } else if (hour < 12) {
    	                return 'সকাল';
    	            } else if (hour < 15) {
    	                return 'দুপুর';
    	            } else if (hour < 18) {
    	                return 'বিকাল';
    	            } else if (hour < 20) {
    	                return 'সন্ধ্যা';
    	            } else {
    	                return 'রাত';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$4 = {
    	            1: '১',
    	            2: '২',
    	            3: '৩',
    	            4: '৪',
    	            5: '৫',
    	            6: '৬',
    	            7: '৭',
    	            8: '৮',
    	            9: '৯',
    	            0: '০',
    	        },
    	        numberMap$3 = {
    	            '১': '1',
    	            '২': '2',
    	            '৩': '3',
    	            '৪': '4',
    	            '৫': '5',
    	            '৬': '6',
    	            '৭': '7',
    	            '৮': '8',
    	            '৯': '9',
    	            '০': '0',
    	        };

    	    hooks.defineLocale('bn', {
    	        months: 'জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'জানু_ফেব্রু_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্ট_অক্টো_নভে_ডিসে'.split(
    	                '_'
    	            ),
    	        weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
    	        weekdaysMin: 'রবি_সোম_মঙ্গল_বুধ_বৃহ_শুক্র_শনি'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm সময়',
    	            LTS: 'A h:mm:ss সময়',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm সময়',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm সময়',
    	        },
    	        calendar: {
    	            sameDay: '[আজ] LT',
    	            nextDay: '[আগামীকাল] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[গতকাল] LT',
    	            lastWeek: '[গত] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s পরে',
    	            past: '%s আগে',
    	            s: 'কয়েক সেকেন্ড',
    	            ss: '%d সেকেন্ড',
    	            m: 'এক মিনিট',
    	            mm: '%d মিনিট',
    	            h: 'এক ঘন্টা',
    	            hh: '%d ঘন্টা',
    	            d: 'এক দিন',
    	            dd: '%d দিন',
    	            M: 'এক মাস',
    	            MM: '%d মাস',
    	            y: 'এক বছর',
    	            yy: '%d বছর',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
    	                return numberMap$3[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$4[match];
    	            });
    	        },
    	        meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (
    	                (meridiem === 'রাত' && hour >= 4) ||
    	                (meridiem === 'দুপুর' && hour < 5) ||
    	                meridiem === 'বিকাল'
    	            ) {
    	                return hour + 12;
    	            } else {
    	                return hour;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'রাত';
    	            } else if (hour < 10) {
    	                return 'সকাল';
    	            } else if (hour < 17) {
    	                return 'দুপুর';
    	            } else if (hour < 20) {
    	                return 'বিকাল';
    	            } else {
    	                return 'রাত';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$5 = {
    	            1: '༡',
    	            2: '༢',
    	            3: '༣',
    	            4: '༤',
    	            5: '༥',
    	            6: '༦',
    	            7: '༧',
    	            8: '༨',
    	            9: '༩',
    	            0: '༠',
    	        },
    	        numberMap$4 = {
    	            '༡': '1',
    	            '༢': '2',
    	            '༣': '3',
    	            '༤': '4',
    	            '༥': '5',
    	            '༦': '6',
    	            '༧': '7',
    	            '༨': '8',
    	            '༩': '9',
    	            '༠': '0',
    	        };

    	    hooks.defineLocale('bo', {
    	        months: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ཟླ་1_ཟླ་2_ཟླ་3_ཟླ་4_ཟླ་5_ཟླ་6_ཟླ་7_ཟླ་8_ཟླ་9_ཟླ་10_ཟླ་11_ཟླ་12'.split(
    	                '_'
    	            ),
    	        monthsShortRegex: /^(ཟླ་\d{1,2})/,
    	        monthsParseExact: true,
    	        weekdays:
    	            'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split(
    	            '_'
    	        ),
    	        weekdaysMin: 'ཉི_ཟླ_མིག_ལྷག_ཕུར_སངས_སྤེན'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm',
    	            LTS: 'A h:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm',
    	        },
    	        calendar: {
    	            sameDay: '[དི་རིང] LT',
    	            nextDay: '[སང་ཉིན] LT',
    	            nextWeek: '[བདུན་ཕྲག་རྗེས་མ], LT',
    	            lastDay: '[ཁ་སང] LT',
    	            lastWeek: '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s ལ་',
    	            past: '%s སྔན་ལ',
    	            s: 'ལམ་སང',
    	            ss: '%d སྐར་ཆ།',
    	            m: 'སྐར་མ་གཅིག',
    	            mm: '%d སྐར་མ',
    	            h: 'ཆུ་ཚོད་གཅིག',
    	            hh: '%d ཆུ་ཚོད',
    	            d: 'ཉིན་གཅིག',
    	            dd: '%d ཉིན་',
    	            M: 'ཟླ་བ་གཅིག',
    	            MM: '%d ཟླ་བ',
    	            y: 'ལོ་གཅིག',
    	            yy: '%d ལོ',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
    	                return numberMap$4[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$5[match];
    	            });
    	        },
    	        meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (
    	                (meridiem === 'མཚན་མོ' && hour >= 4) ||
    	                (meridiem === 'ཉིན་གུང' && hour < 5) ||
    	                meridiem === 'དགོང་དག'
    	            ) {
    	                return hour + 12;
    	            } else {
    	                return hour;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'མཚན་མོ';
    	            } else if (hour < 10) {
    	                return 'ཞོགས་ཀས';
    	            } else if (hour < 17) {
    	                return 'ཉིན་གུང';
    	            } else if (hour < 20) {
    	                return 'དགོང་དག';
    	            } else {
    	                return 'མཚན་མོ';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function relativeTimeWithMutation(number, withoutSuffix, key) {
    	        var format = {
    	            mm: 'munutenn',
    	            MM: 'miz',
    	            dd: 'devezh',
    	        };
    	        return number + ' ' + mutation(format[key], number);
    	    }
    	    function specialMutationForYears(number) {
    	        switch (lastNumber(number)) {
    	            case 1:
    	            case 3:
    	            case 4:
    	            case 5:
    	            case 9:
    	                return number + ' bloaz';
    	            default:
    	                return number + ' vloaz';
    	        }
    	    }
    	    function lastNumber(number) {
    	        if (number > 9) {
    	            return lastNumber(number % 10);
    	        }
    	        return number;
    	    }
    	    function mutation(text, number) {
    	        if (number === 2) {
    	            return softMutation(text);
    	        }
    	        return text;
    	    }
    	    function softMutation(text) {
    	        var mutationTable = {
    	            m: 'v',
    	            b: 'v',
    	            d: 'z',
    	        };
    	        if (mutationTable[text.charAt(0)] === undefined) {
    	            return text;
    	        }
    	        return mutationTable[text.charAt(0)] + text.substring(1);
    	    }

    	    var monthsParse = [
    	            /^gen/i,
    	            /^c[ʼ\']hwe/i,
    	            /^meu/i,
    	            /^ebr/i,
    	            /^mae/i,
    	            /^(mez|eve)/i,
    	            /^gou/i,
    	            /^eos/i,
    	            /^gwe/i,
    	            /^her/i,
    	            /^du/i,
    	            /^ker/i,
    	        ],
    	        monthsRegex$1 =
    	            /^(genver|c[ʼ\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu|gen|c[ʼ\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i,
    	        monthsStrictRegex =
    	            /^(genver|c[ʼ\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu)/i,
    	        monthsShortStrictRegex =
    	            /^(gen|c[ʼ\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i,
    	        fullWeekdaysParse = [
    	            /^sul/i,
    	            /^lun/i,
    	            /^meurzh/i,
    	            /^merc[ʼ\']her/i,
    	            /^yaou/i,
    	            /^gwener/i,
    	            /^sadorn/i,
    	        ],
    	        shortWeekdaysParse = [
    	            /^Sul/i,
    	            /^Lun/i,
    	            /^Meu/i,
    	            /^Mer/i,
    	            /^Yao/i,
    	            /^Gwe/i,
    	            /^Sad/i,
    	        ],
    	        minWeekdaysParse = [
    	            /^Su/i,
    	            /^Lu/i,
    	            /^Me([^r]|$)/i,
    	            /^Mer/i,
    	            /^Ya/i,
    	            /^Gw/i,
    	            /^Sa/i,
    	        ];

    	    hooks.defineLocale('br', {
    	        months: 'Genver_Cʼhwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Gen_Cʼhwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
    	        weekdays: 'Sul_Lun_Meurzh_Mercʼher_Yaou_Gwener_Sadorn'.split('_'),
    	        weekdaysShort: 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
    	        weekdaysMin: 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
    	        weekdaysParse: minWeekdaysParse,
    	        fullWeekdaysParse: fullWeekdaysParse,
    	        shortWeekdaysParse: shortWeekdaysParse,
    	        minWeekdaysParse: minWeekdaysParse,

    	        monthsRegex: monthsRegex$1,
    	        monthsShortRegex: monthsRegex$1,
    	        monthsStrictRegex: monthsStrictRegex,
    	        monthsShortStrictRegex: monthsShortStrictRegex,
    	        monthsParse: monthsParse,
    	        longMonthsParse: monthsParse,
    	        shortMonthsParse: monthsParse,

    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [a viz] MMMM YYYY',
    	            LLL: 'D [a viz] MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D [a viz] MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Hiziv da] LT',
    	            nextDay: '[Warcʼhoazh da] LT',
    	            nextWeek: 'dddd [da] LT',
    	            lastDay: '[Decʼh da] LT',
    	            lastWeek: 'dddd [paset da] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'a-benn %s',
    	            past: '%s ʼzo',
    	            s: 'un nebeud segondennoù',
    	            ss: '%d eilenn',
    	            m: 'ur vunutenn',
    	            mm: relativeTimeWithMutation,
    	            h: 'un eur',
    	            hh: '%d eur',
    	            d: 'un devezh',
    	            dd: relativeTimeWithMutation,
    	            M: 'ur miz',
    	            MM: relativeTimeWithMutation,
    	            y: 'ur bloaz',
    	            yy: specialMutationForYears,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
    	        ordinal: function (number) {
    	            var output = number === 1 ? 'añ' : 'vet';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	        meridiemParse: /a.m.|g.m./, // goude merenn | a-raok merenn
    	        isPM: function (token) {
    	            return token === 'g.m.';
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            return hour < 12 ? 'a.m.' : 'g.m.';
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function translate(number, withoutSuffix, key) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 'ss':
    	                if (number === 1) {
    	                    result += 'sekunda';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'sekunde';
    	                } else {
    	                    result += 'sekundi';
    	                }
    	                return result;
    	            case 'm':
    	                return withoutSuffix ? 'jedna minuta' : 'jedne minute';
    	            case 'mm':
    	                if (number === 1) {
    	                    result += 'minuta';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'minute';
    	                } else {
    	                    result += 'minuta';
    	                }
    	                return result;
    	            case 'h':
    	                return withoutSuffix ? 'jedan sat' : 'jednog sata';
    	            case 'hh':
    	                if (number === 1) {
    	                    result += 'sat';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'sata';
    	                } else {
    	                    result += 'sati';
    	                }
    	                return result;
    	            case 'dd':
    	                if (number === 1) {
    	                    result += 'dan';
    	                } else {
    	                    result += 'dana';
    	                }
    	                return result;
    	            case 'MM':
    	                if (number === 1) {
    	                    result += 'mjesec';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'mjeseca';
    	                } else {
    	                    result += 'mjeseci';
    	                }
    	                return result;
    	            case 'yy':
    	                if (number === 1) {
    	                    result += 'godina';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'godine';
    	                } else {
    	                    result += 'godina';
    	                }
    	                return result;
    	        }
    	    }

    	    hooks.defineLocale('bs', {
    	        months: 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    	        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[danas u] LT',
    	            nextDay: '[sutra u] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[u] [nedjelju] [u] LT';
    	                    case 3:
    	                        return '[u] [srijedu] [u] LT';
    	                    case 6:
    	                        return '[u] [subotu] [u] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[u] dddd [u] LT';
    	                }
    	            },
    	            lastDay: '[jučer u] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                    case 3:
    	                        return '[prošlu] dddd [u] LT';
    	                    case 6:
    	                        return '[prošle] [subote] [u] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[prošli] dddd [u] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: 'prije %s',
    	            s: 'par sekundi',
    	            ss: translate,
    	            m: translate,
    	            mm: translate,
    	            h: translate,
    	            hh: translate,
    	            d: 'dan',
    	            dd: translate,
    	            M: 'mjesec',
    	            MM: translate,
    	            y: 'godinu',
    	            yy: translate,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ca', {
    	        months: {
    	            standalone:
    	                'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split(
    	                    '_'
    	                ),
    	            format: "de gener_de febrer_de març_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split(
    	                '_'
    	            ),
    	            isFormat: /D[oD]?(\s)+MMMM/,
    	        },
    	        monthsShort:
    	            'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays:
    	            'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
    	        weekdaysMin: 'dg_dl_dt_dc_dj_dv_ds'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM [de] YYYY',
    	            ll: 'D MMM YYYY',
    	            LLL: 'D MMMM [de] YYYY [a les] H:mm',
    	            lll: 'D MMM YYYY, H:mm',
    	            LLLL: 'dddd D MMMM [de] YYYY [a les] H:mm',
    	            llll: 'ddd D MMM YYYY, H:mm',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return '[avui a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    	            },
    	            nextDay: function () {
    	                return '[demà a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    	            },
    	            nextWeek: function () {
    	                return 'dddd [a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    	            },
    	            lastDay: function () {
    	                return '[ahir a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    	            },
    	            lastWeek: function () {
    	                return (
    	                    '[el] dddd [passat a ' +
    	                    (this.hours() !== 1 ? 'les' : 'la') +
    	                    '] LT'
    	                );
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: "d'aquí %s",
    	            past: 'fa %s',
    	            s: 'uns segons',
    	            ss: '%d segons',
    	            m: 'un minut',
    	            mm: '%d minuts',
    	            h: 'una hora',
    	            hh: '%d hores',
    	            d: 'un dia',
    	            dd: '%d dies',
    	            M: 'un mes',
    	            MM: '%d mesos',
    	            y: 'un any',
    	            yy: '%d anys',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
    	        ordinal: function (number, period) {
    	            var output =
    	                number === 1
    	                    ? 'r'
    	                    : number === 2
    	                    ? 'n'
    	                    : number === 3
    	                    ? 'r'
    	                    : number === 4
    	                    ? 't'
    	                    : 'è';
    	            if (period === 'w' || period === 'W') {
    	                output = 'a';
    	            }
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$4 = {
    	            format: 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'ledna_února_března_dubna_května_června_července_srpna_září_října_listopadu_prosince'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_'),
    	        monthsParse$1 = [
    	            /^led/i,
    	            /^úno/i,
    	            /^bře/i,
    	            /^dub/i,
    	            /^kvě/i,
    	            /^(čvn|červen$|června)/i,
    	            /^(čvc|červenec|července)/i,
    	            /^srp/i,
    	            /^zář/i,
    	            /^říj/i,
    	            /^lis/i,
    	            /^pro/i,
    	        ],
    	        // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
    	        // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
    	        monthsRegex$2 =
    	            /^(leden|únor|březen|duben|květen|červenec|července|červen|června|srpen|září|říjen|listopad|prosinec|led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i;

    	    function plural$1(n) {
    	        return n > 1 && n < 5 && ~~(n / 10) !== 1;
    	    }
    	    function translate$1(number, withoutSuffix, key, isFuture) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 's': // a few seconds / in a few seconds / a few seconds ago
    	                return withoutSuffix || isFuture ? 'pár sekund' : 'pár sekundami';
    	            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$1(number) ? 'sekundy' : 'sekund');
    	                } else {
    	                    return result + 'sekundami';
    	                }
    	            case 'm': // a minute / in a minute / a minute ago
    	                return withoutSuffix ? 'minuta' : isFuture ? 'minutu' : 'minutou';
    	            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$1(number) ? 'minuty' : 'minut');
    	                } else {
    	                    return result + 'minutami';
    	                }
    	            case 'h': // an hour / in an hour / an hour ago
    	                return withoutSuffix ? 'hodina' : isFuture ? 'hodinu' : 'hodinou';
    	            case 'hh': // 9 hours / in 9 hours / 9 hours ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$1(number) ? 'hodiny' : 'hodin');
    	                } else {
    	                    return result + 'hodinami';
    	                }
    	            case 'd': // a day / in a day / a day ago
    	                return withoutSuffix || isFuture ? 'den' : 'dnem';
    	            case 'dd': // 9 days / in 9 days / 9 days ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$1(number) ? 'dny' : 'dní');
    	                } else {
    	                    return result + 'dny';
    	                }
    	            case 'M': // a month / in a month / a month ago
    	                return withoutSuffix || isFuture ? 'měsíc' : 'měsícem';
    	            case 'MM': // 9 months / in 9 months / 9 months ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$1(number) ? 'měsíce' : 'měsíců');
    	                } else {
    	                    return result + 'měsíci';
    	                }
    	            case 'y': // a year / in a year / a year ago
    	                return withoutSuffix || isFuture ? 'rok' : 'rokem';
    	            case 'yy': // 9 years / in 9 years / 9 years ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$1(number) ? 'roky' : 'let');
    	                } else {
    	                    return result + 'lety';
    	                }
    	        }
    	    }

    	    hooks.defineLocale('cs', {
    	        months: months$4,
    	        monthsShort: monthsShort,
    	        monthsRegex: monthsRegex$2,
    	        monthsShortRegex: monthsRegex$2,
    	        // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
    	        // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
    	        monthsStrictRegex:
    	            /^(leden|ledna|února|únor|březen|března|duben|dubna|květen|května|červenec|července|červen|června|srpen|srpna|září|říjen|října|listopadu|listopad|prosinec|prosince)/i,
    	        monthsShortStrictRegex:
    	            /^(led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i,
    	        monthsParse: monthsParse$1,
    	        longMonthsParse: monthsParse$1,
    	        shortMonthsParse: monthsParse$1,
    	        weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
    	        weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
    	        weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm',
    	            LLLL: 'dddd D. MMMM YYYY H:mm',
    	            l: 'D. M. YYYY',
    	        },
    	        calendar: {
    	            sameDay: '[dnes v] LT',
    	            nextDay: '[zítra v] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[v neděli v] LT';
    	                    case 1:
    	                    case 2:
    	                        return '[v] dddd [v] LT';
    	                    case 3:
    	                        return '[ve středu v] LT';
    	                    case 4:
    	                        return '[ve čtvrtek v] LT';
    	                    case 5:
    	                        return '[v pátek v] LT';
    	                    case 6:
    	                        return '[v sobotu v] LT';
    	                }
    	            },
    	            lastDay: '[včera v] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[minulou neděli v] LT';
    	                    case 1:
    	                    case 2:
    	                        return '[minulé] dddd [v] LT';
    	                    case 3:
    	                        return '[minulou středu v] LT';
    	                    case 4:
    	                    case 5:
    	                        return '[minulý] dddd [v] LT';
    	                    case 6:
    	                        return '[minulou sobotu v] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: 'před %s',
    	            s: translate$1,
    	            ss: translate$1,
    	            m: translate$1,
    	            mm: translate$1,
    	            h: translate$1,
    	            hh: translate$1,
    	            d: translate$1,
    	            dd: translate$1,
    	            M: translate$1,
    	            MM: translate$1,
    	            y: translate$1,
    	            yy: translate$1,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('cv', {
    	        months: 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split(
    	            '_'
    	        ),
    	        monthsShort: 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
    	        weekdays:
    	            'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
    	        weekdaysMin: 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD-MM-YYYY',
    	            LL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
    	            LLL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
    	            LLLL: 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Паян] LT [сехетре]',
    	            nextDay: '[Ыран] LT [сехетре]',
    	            lastDay: '[Ӗнер] LT [сехетре]',
    	            nextWeek: '[Ҫитес] dddd LT [сехетре]',
    	            lastWeek: '[Иртнӗ] dddd LT [сехетре]',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: function (output) {
    	                var affix = /сехет$/i.exec(output)
    	                    ? 'рен'
    	                    : /ҫул$/i.exec(output)
    	                    ? 'тан'
    	                    : 'ран';
    	                return output + affix;
    	            },
    	            past: '%s каялла',
    	            s: 'пӗр-ик ҫеккунт',
    	            ss: '%d ҫеккунт',
    	            m: 'пӗр минут',
    	            mm: '%d минут',
    	            h: 'пӗр сехет',
    	            hh: '%d сехет',
    	            d: 'пӗр кун',
    	            dd: '%d кун',
    	            M: 'пӗр уйӑх',
    	            MM: '%d уйӑх',
    	            y: 'пӗр ҫул',
    	            yy: '%d ҫул',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
    	        ordinal: '%d-мӗш',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('cy', {
    	        months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split(
    	            '_'
    	        ),
    	        weekdays:
    	            'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
    	        weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
    	        weekdaysParseExact: true,
    	        // time formats are the same as en-gb
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Heddiw am] LT',
    	            nextDay: '[Yfory am] LT',
    	            nextWeek: 'dddd [am] LT',
    	            lastDay: '[Ddoe am] LT',
    	            lastWeek: 'dddd [diwethaf am] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'mewn %s',
    	            past: '%s yn ôl',
    	            s: 'ychydig eiliadau',
    	            ss: '%d eiliad',
    	            m: 'munud',
    	            mm: '%d munud',
    	            h: 'awr',
    	            hh: '%d awr',
    	            d: 'diwrnod',
    	            dd: '%d diwrnod',
    	            M: 'mis',
    	            MM: '%d mis',
    	            y: 'blwyddyn',
    	            yy: '%d flynedd',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
    	        // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
    	        ordinal: function (number) {
    	            var b = number,
    	                output = '',
    	                lookup = [
    	                    '',
    	                    'af',
    	                    'il',
    	                    'ydd',
    	                    'ydd',
    	                    'ed',
    	                    'ed',
    	                    'ed',
    	                    'fed',
    	                    'fed',
    	                    'fed', // 1af to 10fed
    	                    'eg',
    	                    'fed',
    	                    'eg',
    	                    'eg',
    	                    'fed',
    	                    'eg',
    	                    'eg',
    	                    'fed',
    	                    'eg',
    	                    'fed', // 11eg to 20fed
    	                ];
    	            if (b > 20) {
    	                if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
    	                    output = 'fed'; // not 30ain, 70ain or 90ain
    	                } else {
    	                    output = 'ain';
    	                }
    	            } else if (b > 0) {
    	                output = lookup[b];
    	            }
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('da', {
    	        months: 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    	        weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
    	        weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
    	        weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY HH:mm',
    	            LLLL: 'dddd [d.] D. MMMM YYYY [kl.] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[i dag kl.] LT',
    	            nextDay: '[i morgen kl.] LT',
    	            nextWeek: 'på dddd [kl.] LT',
    	            lastDay: '[i går kl.] LT',
    	            lastWeek: '[i] dddd[s kl.] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'om %s',
    	            past: '%s siden',
    	            s: 'få sekunder',
    	            ss: '%d sekunder',
    	            m: 'et minut',
    	            mm: '%d minutter',
    	            h: 'en time',
    	            hh: '%d timer',
    	            d: 'en dag',
    	            dd: '%d dage',
    	            M: 'en måned',
    	            MM: '%d måneder',
    	            y: 'et år',
    	            yy: '%d år',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            m: ['eine Minute', 'einer Minute'],
    	            h: ['eine Stunde', 'einer Stunde'],
    	            d: ['ein Tag', 'einem Tag'],
    	            dd: [number + ' Tage', number + ' Tagen'],
    	            w: ['eine Woche', 'einer Woche'],
    	            M: ['ein Monat', 'einem Monat'],
    	            MM: [number + ' Monate', number + ' Monaten'],
    	            y: ['ein Jahr', 'einem Jahr'],
    	            yy: [number + ' Jahre', number + ' Jahren'],
    	        };
    	        return withoutSuffix ? format[key][0] : format[key][1];
    	    }

    	    hooks.defineLocale('de-at', {
    	        months: 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays:
    	            'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    	        weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D. MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[heute um] LT [Uhr]',
    	            sameElse: 'L',
    	            nextDay: '[morgen um] LT [Uhr]',
    	            nextWeek: 'dddd [um] LT [Uhr]',
    	            lastDay: '[gestern um] LT [Uhr]',
    	            lastWeek: '[letzten] dddd [um] LT [Uhr]',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: 'vor %s',
    	            s: 'ein paar Sekunden',
    	            ss: '%d Sekunden',
    	            m: processRelativeTime,
    	            mm: '%d Minuten',
    	            h: processRelativeTime,
    	            hh: '%d Stunden',
    	            d: processRelativeTime,
    	            dd: processRelativeTime,
    	            w: processRelativeTime,
    	            ww: '%d Wochen',
    	            M: processRelativeTime,
    	            MM: processRelativeTime,
    	            y: processRelativeTime,
    	            yy: processRelativeTime,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$1(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            m: ['eine Minute', 'einer Minute'],
    	            h: ['eine Stunde', 'einer Stunde'],
    	            d: ['ein Tag', 'einem Tag'],
    	            dd: [number + ' Tage', number + ' Tagen'],
    	            w: ['eine Woche', 'einer Woche'],
    	            M: ['ein Monat', 'einem Monat'],
    	            MM: [number + ' Monate', number + ' Monaten'],
    	            y: ['ein Jahr', 'einem Jahr'],
    	            yy: [number + ' Jahre', number + ' Jahren'],
    	        };
    	        return withoutSuffix ? format[key][0] : format[key][1];
    	    }

    	    hooks.defineLocale('de-ch', {
    	        months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays:
    	            'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    	        weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D. MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[heute um] LT [Uhr]',
    	            sameElse: 'L',
    	            nextDay: '[morgen um] LT [Uhr]',
    	            nextWeek: 'dddd [um] LT [Uhr]',
    	            lastDay: '[gestern um] LT [Uhr]',
    	            lastWeek: '[letzten] dddd [um] LT [Uhr]',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: 'vor %s',
    	            s: 'ein paar Sekunden',
    	            ss: '%d Sekunden',
    	            m: processRelativeTime$1,
    	            mm: '%d Minuten',
    	            h: processRelativeTime$1,
    	            hh: '%d Stunden',
    	            d: processRelativeTime$1,
    	            dd: processRelativeTime$1,
    	            w: processRelativeTime$1,
    	            ww: '%d Wochen',
    	            M: processRelativeTime$1,
    	            MM: processRelativeTime$1,
    	            y: processRelativeTime$1,
    	            yy: processRelativeTime$1,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$2(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            m: ['eine Minute', 'einer Minute'],
    	            h: ['eine Stunde', 'einer Stunde'],
    	            d: ['ein Tag', 'einem Tag'],
    	            dd: [number + ' Tage', number + ' Tagen'],
    	            w: ['eine Woche', 'einer Woche'],
    	            M: ['ein Monat', 'einem Monat'],
    	            MM: [number + ' Monate', number + ' Monaten'],
    	            y: ['ein Jahr', 'einem Jahr'],
    	            yy: [number + ' Jahre', number + ' Jahren'],
    	        };
    	        return withoutSuffix ? format[key][0] : format[key][1];
    	    }

    	    hooks.defineLocale('de', {
    	        months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays:
    	            'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    	        weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D. MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[heute um] LT [Uhr]',
    	            sameElse: 'L',
    	            nextDay: '[morgen um] LT [Uhr]',
    	            nextWeek: 'dddd [um] LT [Uhr]',
    	            lastDay: '[gestern um] LT [Uhr]',
    	            lastWeek: '[letzten] dddd [um] LT [Uhr]',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: 'vor %s',
    	            s: 'ein paar Sekunden',
    	            ss: '%d Sekunden',
    	            m: processRelativeTime$2,
    	            mm: '%d Minuten',
    	            h: processRelativeTime$2,
    	            hh: '%d Stunden',
    	            d: processRelativeTime$2,
    	            dd: processRelativeTime$2,
    	            w: processRelativeTime$2,
    	            ww: '%d Wochen',
    	            M: processRelativeTime$2,
    	            MM: processRelativeTime$2,
    	            y: processRelativeTime$2,
    	            yy: processRelativeTime$2,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$5 = [
    	            'ޖެނުއަރީ',
    	            'ފެބްރުއަރީ',
    	            'މާރިޗު',
    	            'އޭޕްރީލު',
    	            'މޭ',
    	            'ޖޫން',
    	            'ޖުލައި',
    	            'އޯގަސްޓު',
    	            'ސެޕްޓެމްބަރު',
    	            'އޮކްޓޯބަރު',
    	            'ނޮވެމްބަރު',
    	            'ޑިސެމްބަރު',
    	        ],
    	        weekdays = [
    	            'އާދިއްތަ',
    	            'ހޯމަ',
    	            'އަންގާރަ',
    	            'ބުދަ',
    	            'ބުރާސްފަތި',
    	            'ހުކުރު',
    	            'ހޮނިހިރު',
    	        ];

    	    hooks.defineLocale('dv', {
    	        months: months$5,
    	        monthsShort: months$5,
    	        weekdays: weekdays,
    	        weekdaysShort: weekdays,
    	        weekdaysMin: 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'D/M/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /މކ|މފ/,
    	        isPM: function (input) {
    	            return 'މފ' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'މކ';
    	            } else {
    	                return 'މފ';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[މިއަދު] LT',
    	            nextDay: '[މާދަމާ] LT',
    	            nextWeek: 'dddd LT',
    	            lastDay: '[އިއްޔެ] LT',
    	            lastWeek: '[ފާއިތުވި] dddd LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'ތެރޭގައި %s',
    	            past: 'ކުރިން %s',
    	            s: 'ސިކުންތުކޮޅެއް',
    	            ss: 'd% ސިކުންތު',
    	            m: 'މިނިޓެއް',
    	            mm: 'މިނިޓު %d',
    	            h: 'ގަޑިއިރެއް',
    	            hh: 'ގަޑިއިރު %d',
    	            d: 'ދުވަހެއް',
    	            dd: 'ދުވަސް %d',
    	            M: 'މަހެއް',
    	            MM: 'މަސް %d',
    	            y: 'އަހަރެއް',
    	            yy: 'އަހަރު %d',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string.replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 7, // Sunday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function isFunction$1(input) {
    	        return (
    	            (typeof Function !== 'undefined' && input instanceof Function) ||
    	            Object.prototype.toString.call(input) === '[object Function]'
    	        );
    	    }

    	    hooks.defineLocale('el', {
    	        monthsNominativeEl:
    	            'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split(
    	                '_'
    	            ),
    	        monthsGenitiveEl:
    	            'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split(
    	                '_'
    	            ),
    	        months: function (momentToFormat, format) {
    	            if (!momentToFormat) {
    	                return this._monthsNominativeEl;
    	            } else if (
    	                typeof format === 'string' &&
    	                /D/.test(format.substring(0, format.indexOf('MMMM')))
    	            ) {
    	                // if there is a day number before 'MMMM'
    	                return this._monthsGenitiveEl[momentToFormat.month()];
    	            } else {
    	                return this._monthsNominativeEl[momentToFormat.month()];
    	            }
    	        },
    	        monthsShort: 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
    	        weekdays: 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
    	        weekdaysMin: 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours > 11) {
    	                return isLower ? 'μμ' : 'ΜΜ';
    	            } else {
    	                return isLower ? 'πμ' : 'ΠΜ';
    	            }
    	        },
    	        isPM: function (input) {
    	            return (input + '').toLowerCase()[0] === 'μ';
    	        },
    	        meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY h:mm A',
    	            LLLL: 'dddd, D MMMM YYYY h:mm A',
    	        },
    	        calendarEl: {
    	            sameDay: '[Σήμερα {}] LT',
    	            nextDay: '[Αύριο {}] LT',
    	            nextWeek: 'dddd [{}] LT',
    	            lastDay: '[Χθες {}] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 6:
    	                        return '[το προηγούμενο] dddd [{}] LT';
    	                    default:
    	                        return '[την προηγούμενη] dddd [{}] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        calendar: function (key, mom) {
    	            var output = this._calendarEl[key],
    	                hours = mom && mom.hours();
    	            if (isFunction$1(output)) {
    	                output = output.apply(mom);
    	            }
    	            return output.replace('{}', hours % 12 === 1 ? 'στη' : 'στις');
    	        },
    	        relativeTime: {
    	            future: 'σε %s',
    	            past: '%s πριν',
    	            s: 'λίγα δευτερόλεπτα',
    	            ss: '%d δευτερόλεπτα',
    	            m: 'ένα λεπτό',
    	            mm: '%d λεπτά',
    	            h: 'μία ώρα',
    	            hh: '%d ώρες',
    	            d: 'μία μέρα',
    	            dd: '%d μέρες',
    	            M: 'ένας μήνας',
    	            MM: '%d μήνες',
    	            y: 'ένας χρόνος',
    	            yy: '%d χρόνια',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}η/,
    	        ordinal: '%dη',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4st is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-au', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY h:mm A',
    	            LLLL: 'dddd, D MMMM YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-ca', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'YYYY-MM-DD',
    	            LL: 'MMMM D, YYYY',
    	            LLL: 'MMMM D, YYYY h:mm A',
    	            LLLL: 'dddd, MMMM D, YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-gb', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-ie', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-il', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-in', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY h:mm A',
    	            LLLL: 'dddd, D MMMM YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 1st is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-nz', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY h:mm A',
    	            LLLL: 'dddd, D MMMM YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('en-sg', {
    	        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    	        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    	        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Today at] LT',
    	            nextDay: '[Tomorrow at] LT',
    	            nextWeek: 'dddd [at] LT',
    	            lastDay: '[Yesterday at] LT',
    	            lastWeek: '[Last] dddd [at] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'in %s',
    	            past: '%s ago',
    	            s: 'a few seconds',
    	            ss: '%d seconds',
    	            m: 'a minute',
    	            mm: '%d minutes',
    	            h: 'an hour',
    	            hh: '%d hours',
    	            d: 'a day',
    	            dd: '%d days',
    	            M: 'a month',
    	            MM: '%d months',
    	            y: 'a year',
    	            yy: '%d years',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('eo', {
    	        months: 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_feb_mart_apr_maj_jun_jul_aŭg_sept_okt_nov_dec'.split('_'),
    	        weekdays: 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
    	        weekdaysShort: 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
    	        weekdaysMin: 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: '[la] D[-an de] MMMM, YYYY',
    	            LLL: '[la] D[-an de] MMMM, YYYY HH:mm',
    	            LLLL: 'dddd[n], [la] D[-an de] MMMM, YYYY HH:mm',
    	            llll: 'ddd, [la] D[-an de] MMM, YYYY HH:mm',
    	        },
    	        meridiemParse: /[ap]\.t\.m/i,
    	        isPM: function (input) {
    	            return input.charAt(0).toLowerCase() === 'p';
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours > 11) {
    	                return isLower ? 'p.t.m.' : 'P.T.M.';
    	            } else {
    	                return isLower ? 'a.t.m.' : 'A.T.M.';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[Hodiaŭ je] LT',
    	            nextDay: '[Morgaŭ je] LT',
    	            nextWeek: 'dddd[n je] LT',
    	            lastDay: '[Hieraŭ je] LT',
    	            lastWeek: '[pasintan] dddd[n je] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'post %s',
    	            past: 'antaŭ %s',
    	            s: 'kelkaj sekundoj',
    	            ss: '%d sekundoj',
    	            m: 'unu minuto',
    	            mm: '%d minutoj',
    	            h: 'unu horo',
    	            hh: '%d horoj',
    	            d: 'unu tago', //ne 'diurno', ĉar estas uzita por proksimumo
    	            dd: '%d tagoj',
    	            M: 'unu monato',
    	            MM: '%d monatoj',
    	            y: 'unu jaro',
    	            yy: '%d jaroj',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}a/,
    	        ordinal: '%da',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortDot =
    	            'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split(
    	                '_'
    	            ),
    	        monthsShort$1 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    	        monthsParse$2 = [
    	            /^ene/i,
    	            /^feb/i,
    	            /^mar/i,
    	            /^abr/i,
    	            /^may/i,
    	            /^jun/i,
    	            /^jul/i,
    	            /^ago/i,
    	            /^sep/i,
    	            /^oct/i,
    	            /^nov/i,
    	            /^dic/i,
    	        ],
    	        monthsRegex$3 =
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    	    hooks.defineLocale('es-do', {
    	        months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortDot;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShort$1[m.month()];
    	            } else {
    	                return monthsShortDot[m.month()];
    	            }
    	        },
    	        monthsRegex: monthsRegex$3,
    	        monthsShortRegex: monthsRegex$3,
    	        monthsStrictRegex:
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    	        monthsShortStrictRegex:
    	            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    	        monthsParse: monthsParse$2,
    	        longMonthsParse: monthsParse$2,
    	        shortMonthsParse: monthsParse$2,
    	        weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    	        weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    	        weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY h:mm A',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextDay: function () {
    	                return '[mañana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextWeek: function () {
    	                return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastDay: function () {
    	                return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastWeek: function () {
    	                return (
    	                    '[el] dddd [pasado a la' +
    	                    (this.hours() !== 1 ? 's' : '') +
    	                    '] LT'
    	                );
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'en %s',
    	            past: 'hace %s',
    	            s: 'unos segundos',
    	            ss: '%d segundos',
    	            m: 'un minuto',
    	            mm: '%d minutos',
    	            h: 'una hora',
    	            hh: '%d horas',
    	            d: 'un día',
    	            dd: '%d días',
    	            w: 'una semana',
    	            ww: '%d semanas',
    	            M: 'un mes',
    	            MM: '%d meses',
    	            y: 'un año',
    	            yy: '%d años',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortDot$1 =
    	            'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split(
    	                '_'
    	            ),
    	        monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    	        monthsParse$3 = [
    	            /^ene/i,
    	            /^feb/i,
    	            /^mar/i,
    	            /^abr/i,
    	            /^may/i,
    	            /^jun/i,
    	            /^jul/i,
    	            /^ago/i,
    	            /^sep/i,
    	            /^oct/i,
    	            /^nov/i,
    	            /^dic/i,
    	        ],
    	        monthsRegex$4 =
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    	    hooks.defineLocale('es-mx', {
    	        months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortDot$1;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShort$2[m.month()];
    	            } else {
    	                return monthsShortDot$1[m.month()];
    	            }
    	        },
    	        monthsRegex: monthsRegex$4,
    	        monthsShortRegex: monthsRegex$4,
    	        monthsStrictRegex:
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    	        monthsShortStrictRegex:
    	            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    	        monthsParse: monthsParse$3,
    	        longMonthsParse: monthsParse$3,
    	        shortMonthsParse: monthsParse$3,
    	        weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    	        weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    	        weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY H:mm',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextDay: function () {
    	                return '[mañana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextWeek: function () {
    	                return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastDay: function () {
    	                return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastWeek: function () {
    	                return (
    	                    '[el] dddd [pasado a la' +
    	                    (this.hours() !== 1 ? 's' : '') +
    	                    '] LT'
    	                );
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'en %s',
    	            past: 'hace %s',
    	            s: 'unos segundos',
    	            ss: '%d segundos',
    	            m: 'un minuto',
    	            mm: '%d minutos',
    	            h: 'una hora',
    	            hh: '%d horas',
    	            d: 'un día',
    	            dd: '%d días',
    	            w: 'una semana',
    	            ww: '%d semanas',
    	            M: 'un mes',
    	            MM: '%d meses',
    	            y: 'un año',
    	            yy: '%d años',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	        invalidDate: 'Fecha inválida',
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortDot$2 =
    	            'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split(
    	                '_'
    	            ),
    	        monthsShort$3 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    	        monthsParse$4 = [
    	            /^ene/i,
    	            /^feb/i,
    	            /^mar/i,
    	            /^abr/i,
    	            /^may/i,
    	            /^jun/i,
    	            /^jul/i,
    	            /^ago/i,
    	            /^sep/i,
    	            /^oct/i,
    	            /^nov/i,
    	            /^dic/i,
    	        ],
    	        monthsRegex$5 =
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    	    hooks.defineLocale('es-us', {
    	        months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortDot$2;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShort$3[m.month()];
    	            } else {
    	                return monthsShortDot$2[m.month()];
    	            }
    	        },
    	        monthsRegex: monthsRegex$5,
    	        monthsShortRegex: monthsRegex$5,
    	        monthsStrictRegex:
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    	        monthsShortStrictRegex:
    	            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    	        monthsParse: monthsParse$4,
    	        longMonthsParse: monthsParse$4,
    	        shortMonthsParse: monthsParse$4,
    	        weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    	        weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    	        weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'MM/DD/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY h:mm A',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextDay: function () {
    	                return '[mañana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextWeek: function () {
    	                return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastDay: function () {
    	                return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastWeek: function () {
    	                return (
    	                    '[el] dddd [pasado a la' +
    	                    (this.hours() !== 1 ? 's' : '') +
    	                    '] LT'
    	                );
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'en %s',
    	            past: 'hace %s',
    	            s: 'unos segundos',
    	            ss: '%d segundos',
    	            m: 'un minuto',
    	            mm: '%d minutos',
    	            h: 'una hora',
    	            hh: '%d horas',
    	            d: 'un día',
    	            dd: '%d días',
    	            w: 'una semana',
    	            ww: '%d semanas',
    	            M: 'un mes',
    	            MM: '%d meses',
    	            y: 'un año',
    	            yy: '%d años',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortDot$3 =
    	            'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split(
    	                '_'
    	            ),
    	        monthsShort$4 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    	        monthsParse$5 = [
    	            /^ene/i,
    	            /^feb/i,
    	            /^mar/i,
    	            /^abr/i,
    	            /^may/i,
    	            /^jun/i,
    	            /^jul/i,
    	            /^ago/i,
    	            /^sep/i,
    	            /^oct/i,
    	            /^nov/i,
    	            /^dic/i,
    	        ],
    	        monthsRegex$6 =
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    	    hooks.defineLocale('es', {
    	        months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortDot$3;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShort$4[m.month()];
    	            } else {
    	                return monthsShortDot$3[m.month()];
    	            }
    	        },
    	        monthsRegex: monthsRegex$6,
    	        monthsShortRegex: monthsRegex$6,
    	        monthsStrictRegex:
    	            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    	        monthsShortStrictRegex:
    	            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    	        monthsParse: monthsParse$5,
    	        longMonthsParse: monthsParse$5,
    	        shortMonthsParse: monthsParse$5,
    	        weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    	        weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    	        weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY H:mm',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextDay: function () {
    	                return '[mañana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            nextWeek: function () {
    	                return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastDay: function () {
    	                return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    	            },
    	            lastWeek: function () {
    	                return (
    	                    '[el] dddd [pasado a la' +
    	                    (this.hours() !== 1 ? 's' : '') +
    	                    '] LT'
    	                );
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'en %s',
    	            past: 'hace %s',
    	            s: 'unos segundos',
    	            ss: '%d segundos',
    	            m: 'un minuto',
    	            mm: '%d minutos',
    	            h: 'una hora',
    	            hh: '%d horas',
    	            d: 'un día',
    	            dd: '%d días',
    	            w: 'una semana',
    	            ww: '%d semanas',
    	            M: 'un mes',
    	            MM: '%d meses',
    	            y: 'un año',
    	            yy: '%d años',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	        invalidDate: 'Fecha inválida',
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$3(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            s: ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
    	            ss: [number + 'sekundi', number + 'sekundit'],
    	            m: ['ühe minuti', 'üks minut'],
    	            mm: [number + ' minuti', number + ' minutit'],
    	            h: ['ühe tunni', 'tund aega', 'üks tund'],
    	            hh: [number + ' tunni', number + ' tundi'],
    	            d: ['ühe päeva', 'üks päev'],
    	            M: ['kuu aja', 'kuu aega', 'üks kuu'],
    	            MM: [number + ' kuu', number + ' kuud'],
    	            y: ['ühe aasta', 'aasta', 'üks aasta'],
    	            yy: [number + ' aasta', number + ' aastat'],
    	        };
    	        if (withoutSuffix) {
    	            return format[key][2] ? format[key][2] : format[key][1];
    	        }
    	        return isFuture ? format[key][0] : format[key][1];
    	    }

    	    hooks.defineLocale('et', {
    	        months: 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
    	        weekdays:
    	            'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'P_E_T_K_N_R_L'.split('_'),
    	        weekdaysMin: 'P_E_T_K_N_R_L'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Täna,] LT',
    	            nextDay: '[Homme,] LT',
    	            nextWeek: '[Järgmine] dddd LT',
    	            lastDay: '[Eile,] LT',
    	            lastWeek: '[Eelmine] dddd LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s pärast',
    	            past: '%s tagasi',
    	            s: processRelativeTime$3,
    	            ss: processRelativeTime$3,
    	            m: processRelativeTime$3,
    	            mm: processRelativeTime$3,
    	            h: processRelativeTime$3,
    	            hh: processRelativeTime$3,
    	            d: processRelativeTime$3,
    	            dd: '%d päeva',
    	            M: processRelativeTime$3,
    	            MM: processRelativeTime$3,
    	            y: processRelativeTime$3,
    	            yy: processRelativeTime$3,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('eu', {
    	        months: 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays:
    	            'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'ig._al._ar._az._og._ol._lr.'.split('_'),
    	        weekdaysMin: 'ig_al_ar_az_og_ol_lr'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: 'YYYY[ko] MMMM[ren] D[a]',
    	            LLL: 'YYYY[ko] MMMM[ren] D[a] HH:mm',
    	            LLLL: 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
    	            l: 'YYYY-M-D',
    	            ll: 'YYYY[ko] MMM D[a]',
    	            lll: 'YYYY[ko] MMM D[a] HH:mm',
    	            llll: 'ddd, YYYY[ko] MMM D[a] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[gaur] LT[etan]',
    	            nextDay: '[bihar] LT[etan]',
    	            nextWeek: 'dddd LT[etan]',
    	            lastDay: '[atzo] LT[etan]',
    	            lastWeek: '[aurreko] dddd LT[etan]',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s barru',
    	            past: 'duela %s',
    	            s: 'segundo batzuk',
    	            ss: '%d segundo',
    	            m: 'minutu bat',
    	            mm: '%d minutu',
    	            h: 'ordu bat',
    	            hh: '%d ordu',
    	            d: 'egun bat',
    	            dd: '%d egun',
    	            M: 'hilabete bat',
    	            MM: '%d hilabete',
    	            y: 'urte bat',
    	            yy: '%d urte',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$6 = {
    	            1: '۱',
    	            2: '۲',
    	            3: '۳',
    	            4: '۴',
    	            5: '۵',
    	            6: '۶',
    	            7: '۷',
    	            8: '۸',
    	            9: '۹',
    	            0: '۰',
    	        },
    	        numberMap$5 = {
    	            '۱': '1',
    	            '۲': '2',
    	            '۳': '3',
    	            '۴': '4',
    	            '۵': '5',
    	            '۶': '6',
    	            '۷': '7',
    	            '۸': '8',
    	            '۹': '9',
    	            '۰': '0',
    	        };

    	    hooks.defineLocale('fa', {
    	        months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split(
    	                '_'
    	            ),
    	        weekdays:
    	            'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split(
    	                '_'
    	            ),
    	        weekdaysShort:
    	            'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split(
    	                '_'
    	            ),
    	        weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /قبل از ظهر|بعد از ظهر/,
    	        isPM: function (input) {
    	            return /بعد از ظهر/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'قبل از ظهر';
    	            } else {
    	                return 'بعد از ظهر';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[امروز ساعت] LT',
    	            nextDay: '[فردا ساعت] LT',
    	            nextWeek: 'dddd [ساعت] LT',
    	            lastDay: '[دیروز ساعت] LT',
    	            lastWeek: 'dddd [پیش] [ساعت] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'در %s',
    	            past: '%s پیش',
    	            s: 'چند ثانیه',
    	            ss: '%d ثانیه',
    	            m: 'یک دقیقه',
    	            mm: '%d دقیقه',
    	            h: 'یک ساعت',
    	            hh: '%d ساعت',
    	            d: 'یک روز',
    	            dd: '%d روز',
    	            M: 'یک ماه',
    	            MM: '%d ماه',
    	            y: 'یک سال',
    	            yy: '%d سال',
    	        },
    	        preparse: function (string) {
    	            return string
    	                .replace(/[۰-۹]/g, function (match) {
    	                    return numberMap$5[match];
    	                })
    	                .replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string
    	                .replace(/\d/g, function (match) {
    	                    return symbolMap$6[match];
    	                })
    	                .replace(/,/g, '،');
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}م/,
    	        ordinal: '%dم',
    	        week: {
    	            dow: 6, // Saturday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var numbersPast =
    	            'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(
    	                ' '
    	            ),
    	        numbersFuture = [
    	            'nolla',
    	            'yhden',
    	            'kahden',
    	            'kolmen',
    	            'neljän',
    	            'viiden',
    	            'kuuden',
    	            numbersPast[7],
    	            numbersPast[8],
    	            numbersPast[9],
    	        ];
    	    function translate$2(number, withoutSuffix, key, isFuture) {
    	        var result = '';
    	        switch (key) {
    	            case 's':
    	                return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
    	            case 'ss':
    	                result = isFuture ? 'sekunnin' : 'sekuntia';
    	                break;
    	            case 'm':
    	                return isFuture ? 'minuutin' : 'minuutti';
    	            case 'mm':
    	                result = isFuture ? 'minuutin' : 'minuuttia';
    	                break;
    	            case 'h':
    	                return isFuture ? 'tunnin' : 'tunti';
    	            case 'hh':
    	                result = isFuture ? 'tunnin' : 'tuntia';
    	                break;
    	            case 'd':
    	                return isFuture ? 'päivän' : 'päivä';
    	            case 'dd':
    	                result = isFuture ? 'päivän' : 'päivää';
    	                break;
    	            case 'M':
    	                return isFuture ? 'kuukauden' : 'kuukausi';
    	            case 'MM':
    	                result = isFuture ? 'kuukauden' : 'kuukautta';
    	                break;
    	            case 'y':
    	                return isFuture ? 'vuoden' : 'vuosi';
    	            case 'yy':
    	                result = isFuture ? 'vuoden' : 'vuotta';
    	                break;
    	        }
    	        result = verbalNumber(number, isFuture) + ' ' + result;
    	        return result;
    	    }
    	    function verbalNumber(number, isFuture) {
    	        return number < 10
    	            ? isFuture
    	                ? numbersFuture[number]
    	                : numbersPast[number]
    	            : number;
    	    }

    	    hooks.defineLocale('fi', {
    	        months: 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split(
    	                '_'
    	            ),
    	        weekdays:
    	            'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
    	        weekdaysMin: 'su_ma_ti_ke_to_pe_la'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH.mm',
    	            LTS: 'HH.mm.ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'Do MMMM[ta] YYYY',
    	            LLL: 'Do MMMM[ta] YYYY, [klo] HH.mm',
    	            LLLL: 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
    	            l: 'D.M.YYYY',
    	            ll: 'Do MMM YYYY',
    	            lll: 'Do MMM YYYY, [klo] HH.mm',
    	            llll: 'ddd, Do MMM YYYY, [klo] HH.mm',
    	        },
    	        calendar: {
    	            sameDay: '[tänään] [klo] LT',
    	            nextDay: '[huomenna] [klo] LT',
    	            nextWeek: 'dddd [klo] LT',
    	            lastDay: '[eilen] [klo] LT',
    	            lastWeek: '[viime] dddd[na] [klo] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s päästä',
    	            past: '%s sitten',
    	            s: translate$2,
    	            ss: translate$2,
    	            m: translate$2,
    	            mm: translate$2,
    	            h: translate$2,
    	            hh: translate$2,
    	            d: translate$2,
    	            dd: translate$2,
    	            M: translate$2,
    	            MM: translate$2,
    	            y: translate$2,
    	            yy: translate$2,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('fil', {
    	        months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
    	        weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
    	        weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'MM/D/YYYY',
    	            LL: 'MMMM D, YYYY',
    	            LLL: 'MMMM D, YYYY HH:mm',
    	            LLLL: 'dddd, MMMM DD, YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: 'LT [ngayong araw]',
    	            nextDay: '[Bukas ng] LT',
    	            nextWeek: 'LT [sa susunod na] dddd',
    	            lastDay: 'LT [kahapon]',
    	            lastWeek: 'LT [noong nakaraang] dddd',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'sa loob ng %s',
    	            past: '%s ang nakalipas',
    	            s: 'ilang segundo',
    	            ss: '%d segundo',
    	            m: 'isang minuto',
    	            mm: '%d minuto',
    	            h: 'isang oras',
    	            hh: '%d oras',
    	            d: 'isang araw',
    	            dd: '%d araw',
    	            M: 'isang buwan',
    	            MM: '%d buwan',
    	            y: 'isang taon',
    	            yy: '%d taon',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}/,
    	        ordinal: function (number) {
    	            return number;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('fo', {
    	        months: 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
    	        weekdays:
    	            'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
    	        weekdaysMin: 'su_má_tý_mi_hó_fr_le'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D. MMMM, YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Í dag kl.] LT',
    	            nextDay: '[Í morgin kl.] LT',
    	            nextWeek: 'dddd [kl.] LT',
    	            lastDay: '[Í gjár kl.] LT',
    	            lastWeek: '[síðstu] dddd [kl] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'um %s',
    	            past: '%s síðani',
    	            s: 'fá sekund',
    	            ss: '%d sekundir',
    	            m: 'ein minuttur',
    	            mm: '%d minuttir',
    	            h: 'ein tími',
    	            hh: '%d tímar',
    	            d: 'ein dagur',
    	            dd: '%d dagar',
    	            M: 'ein mánaður',
    	            MM: '%d mánaðir',
    	            y: 'eitt ár',
    	            yy: '%d ár',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('fr-ca', {
    	        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    	        weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    	        weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Aujourd’hui à] LT',
    	            nextDay: '[Demain à] LT',
    	            nextWeek: 'dddd [à] LT',
    	            lastDay: '[Hier à] LT',
    	            lastWeek: 'dddd [dernier à] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dans %s',
    	            past: 'il y a %s',
    	            s: 'quelques secondes',
    	            ss: '%d secondes',
    	            m: 'une minute',
    	            mm: '%d minutes',
    	            h: 'une heure',
    	            hh: '%d heures',
    	            d: 'un jour',
    	            dd: '%d jours',
    	            M: 'un mois',
    	            MM: '%d mois',
    	            y: 'un an',
    	            yy: '%d ans',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                // Words with masculine grammatical gender: mois, trimestre, jour
    	                default:
    	                case 'M':
    	                case 'Q':
    	                case 'D':
    	                case 'DDD':
    	                case 'd':
    	                    return number + (number === 1 ? 'er' : 'e');

    	                // Words with feminine grammatical gender: semaine
    	                case 'w':
    	                case 'W':
    	                    return number + (number === 1 ? 're' : 'e');
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('fr-ch', {
    	        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    	        weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    	        weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Aujourd’hui à] LT',
    	            nextDay: '[Demain à] LT',
    	            nextWeek: 'dddd [à] LT',
    	            lastDay: '[Hier à] LT',
    	            lastWeek: 'dddd [dernier à] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dans %s',
    	            past: 'il y a %s',
    	            s: 'quelques secondes',
    	            ss: '%d secondes',
    	            m: 'une minute',
    	            mm: '%d minutes',
    	            h: 'une heure',
    	            hh: '%d heures',
    	            d: 'un jour',
    	            dd: '%d jours',
    	            M: 'un mois',
    	            MM: '%d mois',
    	            y: 'un an',
    	            yy: '%d ans',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                // Words with masculine grammatical gender: mois, trimestre, jour
    	                default:
    	                case 'M':
    	                case 'Q':
    	                case 'D':
    	                case 'DDD':
    	                case 'd':
    	                    return number + (number === 1 ? 'er' : 'e');

    	                // Words with feminine grammatical gender: semaine
    	                case 'w':
    	                case 'W':
    	                    return number + (number === 1 ? 're' : 'e');
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsStrictRegex$1 =
    	            /^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i,
    	        monthsShortStrictRegex$1 =
    	            /(janv\.?|févr\.?|mars|avr\.?|mai|juin|juil\.?|août|sept\.?|oct\.?|nov\.?|déc\.?)/i,
    	        monthsRegex$7 =
    	            /(janv\.?|févr\.?|mars|avr\.?|mai|juin|juil\.?|août|sept\.?|oct\.?|nov\.?|déc\.?|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i,
    	        monthsParse$6 = [
    	            /^janv/i,
    	            /^févr/i,
    	            /^mars/i,
    	            /^avr/i,
    	            /^mai/i,
    	            /^juin/i,
    	            /^juil/i,
    	            /^août/i,
    	            /^sept/i,
    	            /^oct/i,
    	            /^nov/i,
    	            /^déc/i,
    	        ];

    	    hooks.defineLocale('fr', {
    	        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split(
    	                '_'
    	            ),
    	        monthsRegex: monthsRegex$7,
    	        monthsShortRegex: monthsRegex$7,
    	        monthsStrictRegex: monthsStrictRegex$1,
    	        monthsShortStrictRegex: monthsShortStrictRegex$1,
    	        monthsParse: monthsParse$6,
    	        longMonthsParse: monthsParse$6,
    	        shortMonthsParse: monthsParse$6,
    	        weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    	        weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    	        weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Aujourd’hui à] LT',
    	            nextDay: '[Demain à] LT',
    	            nextWeek: 'dddd [à] LT',
    	            lastDay: '[Hier à] LT',
    	            lastWeek: 'dddd [dernier à] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dans %s',
    	            past: 'il y a %s',
    	            s: 'quelques secondes',
    	            ss: '%d secondes',
    	            m: 'une minute',
    	            mm: '%d minutes',
    	            h: 'une heure',
    	            hh: '%d heures',
    	            d: 'un jour',
    	            dd: '%d jours',
    	            w: 'une semaine',
    	            ww: '%d semaines',
    	            M: 'un mois',
    	            MM: '%d mois',
    	            y: 'un an',
    	            yy: '%d ans',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                // TODO: Return 'e' when day of month > 1. Move this case inside
    	                // block for masculine words below.
    	                // See https://github.com/moment/moment/issues/3375
    	                case 'D':
    	                    return number + (number === 1 ? 'er' : '');

    	                // Words with masculine grammatical gender: mois, trimestre, jour
    	                default:
    	                case 'M':
    	                case 'Q':
    	                case 'DDD':
    	                case 'd':
    	                    return number + (number === 1 ? 'er' : 'e');

    	                // Words with feminine grammatical gender: semaine
    	                case 'w':
    	                case 'W':
    	                    return number + (number === 1 ? 're' : 'e');
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortWithDots =
    	            'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_'),
    	        monthsShortWithoutDots =
    	            'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

    	    hooks.defineLocale('fy', {
    	        months: 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortWithDots;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShortWithoutDots[m.month()];
    	            } else {
    	                return monthsShortWithDots[m.month()];
    	            }
    	        },
    	        monthsParseExact: true,
    	        weekdays: 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'si._mo._ti._wo._to._fr._so.'.split('_'),
    	        weekdaysMin: 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD-MM-YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[hjoed om] LT',
    	            nextDay: '[moarn om] LT',
    	            nextWeek: 'dddd [om] LT',
    	            lastDay: '[juster om] LT',
    	            lastWeek: '[ôfrûne] dddd [om] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'oer %s',
    	            past: '%s lyn',
    	            s: 'in pear sekonden',
    	            ss: '%d sekonden',
    	            m: 'ien minút',
    	            mm: '%d minuten',
    	            h: 'ien oere',
    	            hh: '%d oeren',
    	            d: 'ien dei',
    	            dd: '%d dagen',
    	            M: 'ien moanne',
    	            MM: '%d moannen',
    	            y: 'ien jier',
    	            yy: '%d jierren',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    	        ordinal: function (number) {
    	            return (
    	                number +
    	                (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de')
    	            );
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$6 = [
    	            'Eanáir',
    	            'Feabhra',
    	            'Márta',
    	            'Aibreán',
    	            'Bealtaine',
    	            'Meitheamh',
    	            'Iúil',
    	            'Lúnasa',
    	            'Meán Fómhair',
    	            'Deireadh Fómhair',
    	            'Samhain',
    	            'Nollaig',
    	        ],
    	        monthsShort$5 = [
    	            'Ean',
    	            'Feabh',
    	            'Márt',
    	            'Aib',
    	            'Beal',
    	            'Meith',
    	            'Iúil',
    	            'Lún',
    	            'M.F.',
    	            'D.F.',
    	            'Samh',
    	            'Noll',
    	        ],
    	        weekdays$1 = [
    	            'Dé Domhnaigh',
    	            'Dé Luain',
    	            'Dé Máirt',
    	            'Dé Céadaoin',
    	            'Déardaoin',
    	            'Dé hAoine',
    	            'Dé Sathairn',
    	        ],
    	        weekdaysShort = ['Domh', 'Luan', 'Máirt', 'Céad', 'Déar', 'Aoine', 'Sath'],
    	        weekdaysMin = ['Do', 'Lu', 'Má', 'Cé', 'Dé', 'A', 'Sa'];

    	    hooks.defineLocale('ga', {
    	        months: months$6,
    	        monthsShort: monthsShort$5,
    	        monthsParseExact: true,
    	        weekdays: weekdays$1,
    	        weekdaysShort: weekdaysShort,
    	        weekdaysMin: weekdaysMin,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Inniu ag] LT',
    	            nextDay: '[Amárach ag] LT',
    	            nextWeek: 'dddd [ag] LT',
    	            lastDay: '[Inné ag] LT',
    	            lastWeek: 'dddd [seo caite] [ag] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'i %s',
    	            past: '%s ó shin',
    	            s: 'cúpla soicind',
    	            ss: '%d soicind',
    	            m: 'nóiméad',
    	            mm: '%d nóiméad',
    	            h: 'uair an chloig',
    	            hh: '%d uair an chloig',
    	            d: 'lá',
    	            dd: '%d lá',
    	            M: 'mí',
    	            MM: '%d míonna',
    	            y: 'bliain',
    	            yy: '%d bliain',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
    	        ordinal: function (number) {
    	            var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$7 = [
    	            'Am Faoilleach',
    	            'An Gearran',
    	            'Am Màrt',
    	            'An Giblean',
    	            'An Cèitean',
    	            'An t-Ògmhios',
    	            'An t-Iuchar',
    	            'An Lùnastal',
    	            'An t-Sultain',
    	            'An Dàmhair',
    	            'An t-Samhain',
    	            'An Dùbhlachd',
    	        ],
    	        monthsShort$6 = [
    	            'Faoi',
    	            'Gear',
    	            'Màrt',
    	            'Gibl',
    	            'Cèit',
    	            'Ògmh',
    	            'Iuch',
    	            'Lùn',
    	            'Sult',
    	            'Dàmh',
    	            'Samh',
    	            'Dùbh',
    	        ],
    	        weekdays$2 = [
    	            'Didòmhnaich',
    	            'Diluain',
    	            'Dimàirt',
    	            'Diciadain',
    	            'Diardaoin',
    	            'Dihaoine',
    	            'Disathairne',
    	        ],
    	        weekdaysShort$1 = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'],
    	        weekdaysMin$1 = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

    	    hooks.defineLocale('gd', {
    	        months: months$7,
    	        monthsShort: monthsShort$6,
    	        monthsParseExact: true,
    	        weekdays: weekdays$2,
    	        weekdaysShort: weekdaysShort$1,
    	        weekdaysMin: weekdaysMin$1,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[An-diugh aig] LT',
    	            nextDay: '[A-màireach aig] LT',
    	            nextWeek: 'dddd [aig] LT',
    	            lastDay: '[An-dè aig] LT',
    	            lastWeek: 'dddd [seo chaidh] [aig] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'ann an %s',
    	            past: 'bho chionn %s',
    	            s: 'beagan diogan',
    	            ss: '%d diogan',
    	            m: 'mionaid',
    	            mm: '%d mionaidean',
    	            h: 'uair',
    	            hh: '%d uairean',
    	            d: 'latha',
    	            dd: '%d latha',
    	            M: 'mìos',
    	            MM: '%d mìosan',
    	            y: 'bliadhna',
    	            yy: '%d bliadhna',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
    	        ordinal: function (number) {
    	            var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('gl', {
    	        months: 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
    	        weekdaysShort: 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
    	        weekdaysMin: 'do_lu_ma_mé_xo_ve_sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY H:mm',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return '[hoxe ' + (this.hours() !== 1 ? 'ás' : 'á') + '] LT';
    	            },
    	            nextDay: function () {
    	                return '[mañá ' + (this.hours() !== 1 ? 'ás' : 'á') + '] LT';
    	            },
    	            nextWeek: function () {
    	                return 'dddd [' + (this.hours() !== 1 ? 'ás' : 'a') + '] LT';
    	            },
    	            lastDay: function () {
    	                return '[onte ' + (this.hours() !== 1 ? 'á' : 'a') + '] LT';
    	            },
    	            lastWeek: function () {
    	                return (
    	                    '[o] dddd [pasado ' + (this.hours() !== 1 ? 'ás' : 'a') + '] LT'
    	                );
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: function (str) {
    	                if (str.indexOf('un') === 0) {
    	                    return 'n' + str;
    	                }
    	                return 'en ' + str;
    	            },
    	            past: 'hai %s',
    	            s: 'uns segundos',
    	            ss: '%d segundos',
    	            m: 'un minuto',
    	            mm: '%d minutos',
    	            h: 'unha hora',
    	            hh: '%d horas',
    	            d: 'un día',
    	            dd: '%d días',
    	            M: 'un mes',
    	            MM: '%d meses',
    	            y: 'un ano',
    	            yy: '%d anos',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$4(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            s: ['थोडया सॅकंडांनी', 'थोडे सॅकंड'],
    	            ss: [number + ' सॅकंडांनी', number + ' सॅकंड'],
    	            m: ['एका मिणटान', 'एक मिनूट'],
    	            mm: [number + ' मिणटांनी', number + ' मिणटां'],
    	            h: ['एका वरान', 'एक वर'],
    	            hh: [number + ' वरांनी', number + ' वरां'],
    	            d: ['एका दिसान', 'एक दीस'],
    	            dd: [number + ' दिसांनी', number + ' दीस'],
    	            M: ['एका म्हयन्यान', 'एक म्हयनो'],
    	            MM: [number + ' म्हयन्यानी', number + ' म्हयने'],
    	            y: ['एका वर्सान', 'एक वर्स'],
    	            yy: [number + ' वर्सांनी', number + ' वर्सां'],
    	        };
    	        return isFuture ? format[key][0] : format[key][1];
    	    }

    	    hooks.defineLocale('gom-deva', {
    	        months: {
    	            standalone:
    	                'जानेवारी_फेब्रुवारी_मार्च_एप्रील_मे_जून_जुलय_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split(
    	                    '_'
    	                ),
    	            format: 'जानेवारीच्या_फेब्रुवारीच्या_मार्चाच्या_एप्रीलाच्या_मेयाच्या_जूनाच्या_जुलयाच्या_ऑगस्टाच्या_सप्टेंबराच्या_ऑक्टोबराच्या_नोव्हेंबराच्या_डिसेंबराच्या'.split(
    	                '_'
    	            ),
    	            isFormat: /MMMM(\s)+D[oD]?/,
    	        },
    	        monthsShort:
    	            'जाने._फेब्रु._मार्च_एप्री._मे_जून_जुल._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'आयतार_सोमार_मंगळार_बुधवार_बिरेस्तार_सुक्रार_शेनवार'.split('_'),
    	        weekdaysShort: 'आयत._सोम._मंगळ._बुध._ब्रेस्त._सुक्र._शेन.'.split('_'),
    	        weekdaysMin: 'आ_सो_मं_बु_ब्रे_सु_शे'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'A h:mm [वाजतां]',
    	            LTS: 'A h:mm:ss [वाजतां]',
    	            L: 'DD-MM-YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY A h:mm [वाजतां]',
    	            LLLL: 'dddd, MMMM Do, YYYY, A h:mm [वाजतां]',
    	            llll: 'ddd, D MMM YYYY, A h:mm [वाजतां]',
    	        },
    	        calendar: {
    	            sameDay: '[आयज] LT',
    	            nextDay: '[फाल्यां] LT',
    	            nextWeek: '[फुडलो] dddd[,] LT',
    	            lastDay: '[काल] LT',
    	            lastWeek: '[फाटलो] dddd[,] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s',
    	            past: '%s आदीं',
    	            s: processRelativeTime$4,
    	            ss: processRelativeTime$4,
    	            m: processRelativeTime$4,
    	            mm: processRelativeTime$4,
    	            h: processRelativeTime$4,
    	            hh: processRelativeTime$4,
    	            d: processRelativeTime$4,
    	            dd: processRelativeTime$4,
    	            M: processRelativeTime$4,
    	            MM: processRelativeTime$4,
    	            y: processRelativeTime$4,
    	            yy: processRelativeTime$4,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(वेर)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                // the ordinal 'वेर' only applies to day of the month
    	                case 'D':
    	                    return number + 'वेर';
    	                default:
    	                case 'M':
    	                case 'Q':
    	                case 'DDD':
    	                case 'd':
    	                case 'w':
    	                case 'W':
    	                    return number;
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week
    	            doy: 3, // The week that contains Jan 4th is the first week of the year (7 + 0 - 4)
    	        },
    	        meridiemParse: /राती|सकाळीं|दनपारां|सांजे/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'राती') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'सकाळीं') {
    	                return hour;
    	            } else if (meridiem === 'दनपारां') {
    	                return hour > 12 ? hour : hour + 12;
    	            } else if (meridiem === 'सांजे') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'राती';
    	            } else if (hour < 12) {
    	                return 'सकाळीं';
    	            } else if (hour < 16) {
    	                return 'दनपारां';
    	            } else if (hour < 20) {
    	                return 'सांजे';
    	            } else {
    	                return 'राती';
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$5(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            s: ['thoddea sekondamni', 'thodde sekond'],
    	            ss: [number + ' sekondamni', number + ' sekond'],
    	            m: ['eka mintan', 'ek minut'],
    	            mm: [number + ' mintamni', number + ' mintam'],
    	            h: ['eka voran', 'ek vor'],
    	            hh: [number + ' voramni', number + ' voram'],
    	            d: ['eka disan', 'ek dis'],
    	            dd: [number + ' disamni', number + ' dis'],
    	            M: ['eka mhoinean', 'ek mhoino'],
    	            MM: [number + ' mhoineamni', number + ' mhoine'],
    	            y: ['eka vorsan', 'ek voros'],
    	            yy: [number + ' vorsamni', number + ' vorsam'],
    	        };
    	        return isFuture ? format[key][0] : format[key][1];
    	    }

    	    hooks.defineLocale('gom-latn', {
    	        months: {
    	            standalone:
    	                'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split(
    	                    '_'
    	                ),
    	            format: 'Janerachea_Febrerachea_Marsachea_Abrilachea_Maiachea_Junachea_Julaiachea_Agostachea_Setembrachea_Otubrachea_Novembrachea_Dezembrachea'.split(
    	                '_'
    	            ),
    	            isFormat: /MMMM(\s)+D[oD]?/,
    	        },
    	        monthsShort:
    	            'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays: "Aitar_Somar_Mongllar_Budhvar_Birestar_Sukrar_Son'var".split('_'),
    	        weekdaysShort: 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
    	        weekdaysMin: 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'A h:mm [vazta]',
    	            LTS: 'A h:mm:ss [vazta]',
    	            L: 'DD-MM-YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY A h:mm [vazta]',
    	            LLLL: 'dddd, MMMM Do, YYYY, A h:mm [vazta]',
    	            llll: 'ddd, D MMM YYYY, A h:mm [vazta]',
    	        },
    	        calendar: {
    	            sameDay: '[Aiz] LT',
    	            nextDay: '[Faleam] LT',
    	            nextWeek: '[Fuddlo] dddd[,] LT',
    	            lastDay: '[Kal] LT',
    	            lastWeek: '[Fattlo] dddd[,] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s',
    	            past: '%s adim',
    	            s: processRelativeTime$5,
    	            ss: processRelativeTime$5,
    	            m: processRelativeTime$5,
    	            mm: processRelativeTime$5,
    	            h: processRelativeTime$5,
    	            hh: processRelativeTime$5,
    	            d: processRelativeTime$5,
    	            dd: processRelativeTime$5,
    	            M: processRelativeTime$5,
    	            MM: processRelativeTime$5,
    	            y: processRelativeTime$5,
    	            yy: processRelativeTime$5,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(er)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                // the ordinal 'er' only applies to day of the month
    	                case 'D':
    	                    return number + 'er';
    	                default:
    	                case 'M':
    	                case 'Q':
    	                case 'DDD':
    	                case 'd':
    	                case 'w':
    	                case 'W':
    	                    return number;
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week
    	            doy: 3, // The week that contains Jan 4th is the first week of the year (7 + 0 - 4)
    	        },
    	        meridiemParse: /rati|sokallim|donparam|sanje/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'rati') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'sokallim') {
    	                return hour;
    	            } else if (meridiem === 'donparam') {
    	                return hour > 12 ? hour : hour + 12;
    	            } else if (meridiem === 'sanje') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'rati';
    	            } else if (hour < 12) {
    	                return 'sokallim';
    	            } else if (hour < 16) {
    	                return 'donparam';
    	            } else if (hour < 20) {
    	                return 'sanje';
    	            } else {
    	                return 'rati';
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$7 = {
    	            1: '૧',
    	            2: '૨',
    	            3: '૩',
    	            4: '૪',
    	            5: '૫',
    	            6: '૬',
    	            7: '૭',
    	            8: '૮',
    	            9: '૯',
    	            0: '૦',
    	        },
    	        numberMap$6 = {
    	            '૧': '1',
    	            '૨': '2',
    	            '૩': '3',
    	            '૪': '4',
    	            '૫': '5',
    	            '૬': '6',
    	            '૭': '7',
    	            '૮': '8',
    	            '૯': '9',
    	            '૦': '0',
    	        };

    	    hooks.defineLocale('gu', {
    	        months: 'જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ'.split('_'),
    	        weekdaysMin: 'ર_સો_મં_બુ_ગુ_શુ_શ'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm વાગ્યે',
    	            LTS: 'A h:mm:ss વાગ્યે',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm વાગ્યે',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm વાગ્યે',
    	        },
    	        calendar: {
    	            sameDay: '[આજ] LT',
    	            nextDay: '[કાલે] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[ગઇકાલે] LT',
    	            lastWeek: '[પાછલા] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s મા',
    	            past: '%s પહેલા',
    	            s: 'અમુક પળો',
    	            ss: '%d સેકંડ',
    	            m: 'એક મિનિટ',
    	            mm: '%d મિનિટ',
    	            h: 'એક કલાક',
    	            hh: '%d કલાક',
    	            d: 'એક દિવસ',
    	            dd: '%d દિવસ',
    	            M: 'એક મહિનો',
    	            MM: '%d મહિનો',
    	            y: 'એક વર્ષ',
    	            yy: '%d વર્ષ',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function (match) {
    	                return numberMap$6[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$7[match];
    	            });
    	        },
    	        // Gujarati notation for meridiems are quite fuzzy in practice. While there exists
    	        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Gujarati.
    	        meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'રાત') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'સવાર') {
    	                return hour;
    	            } else if (meridiem === 'બપોર') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else if (meridiem === 'સાંજ') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'રાત';
    	            } else if (hour < 10) {
    	                return 'સવાર';
    	            } else if (hour < 17) {
    	                return 'બપોર';
    	            } else if (hour < 20) {
    	                return 'સાંજ';
    	            } else {
    	                return 'રાત';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('he', {
    	        months: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
    	        weekdays: 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
    	        weekdaysShort: 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
    	        weekdaysMin: 'א_ב_ג_ד_ה_ו_ש'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [ב]MMMM YYYY',
    	            LLL: 'D [ב]MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D [ב]MMMM YYYY HH:mm',
    	            l: 'D/M/YYYY',
    	            ll: 'D MMM YYYY',
    	            lll: 'D MMM YYYY HH:mm',
    	            llll: 'ddd, D MMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[היום ב־]LT',
    	            nextDay: '[מחר ב־]LT',
    	            nextWeek: 'dddd [בשעה] LT',
    	            lastDay: '[אתמול ב־]LT',
    	            lastWeek: '[ביום] dddd [האחרון בשעה] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'בעוד %s',
    	            past: 'לפני %s',
    	            s: 'מספר שניות',
    	            ss: '%d שניות',
    	            m: 'דקה',
    	            mm: '%d דקות',
    	            h: 'שעה',
    	            hh: function (number) {
    	                if (number === 2) {
    	                    return 'שעתיים';
    	                }
    	                return number + ' שעות';
    	            },
    	            d: 'יום',
    	            dd: function (number) {
    	                if (number === 2) {
    	                    return 'יומיים';
    	                }
    	                return number + ' ימים';
    	            },
    	            M: 'חודש',
    	            MM: function (number) {
    	                if (number === 2) {
    	                    return 'חודשיים';
    	                }
    	                return number + ' חודשים';
    	            },
    	            y: 'שנה',
    	            yy: function (number) {
    	                if (number === 2) {
    	                    return 'שנתיים';
    	                } else if (number % 10 === 0 && number !== 10) {
    	                    return number + ' שנה';
    	                }
    	                return number + ' שנים';
    	            },
    	        },
    	        meridiemParse:
    	            /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
    	        isPM: function (input) {
    	            return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 5) {
    	                return 'לפנות בוקר';
    	            } else if (hour < 10) {
    	                return 'בבוקר';
    	            } else if (hour < 12) {
    	                return isLower ? 'לפנה"צ' : 'לפני הצהריים';
    	            } else if (hour < 18) {
    	                return isLower ? 'אחה"צ' : 'אחרי הצהריים';
    	            } else {
    	                return 'בערב';
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$8 = {
    	            1: '१',
    	            2: '२',
    	            3: '३',
    	            4: '४',
    	            5: '५',
    	            6: '६',
    	            7: '७',
    	            8: '८',
    	            9: '९',
    	            0: '०',
    	        },
    	        numberMap$7 = {
    	            '१': '1',
    	            '२': '2',
    	            '३': '3',
    	            '४': '4',
    	            '५': '5',
    	            '६': '6',
    	            '७': '7',
    	            '८': '8',
    	            '९': '9',
    	            '०': '0',
    	        },
    	        monthsParse$7 = [
    	            /^जन/i,
    	            /^फ़र|फर/i,
    	            /^मार्च/i,
    	            /^अप्रै/i,
    	            /^मई/i,
    	            /^जून/i,
    	            /^जुल/i,
    	            /^अग/i,
    	            /^सितं|सित/i,
    	            /^अक्टू/i,
    	            /^नव|नवं/i,
    	            /^दिसं|दिस/i,
    	        ],
    	        shortMonthsParse = [
    	            /^जन/i,
    	            /^फ़र/i,
    	            /^मार्च/i,
    	            /^अप्रै/i,
    	            /^मई/i,
    	            /^जून/i,
    	            /^जुल/i,
    	            /^अग/i,
    	            /^सित/i,
    	            /^अक्टू/i,
    	            /^नव/i,
    	            /^दिस/i,
    	        ];

    	    hooks.defineLocale('hi', {
    	        months: {
    	            format: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'जनवरी_फरवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितंबर_अक्टूबर_नवंबर_दिसंबर'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort:
    	            'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
    	        weekdays: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    	        weekdaysShort: 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
    	        weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm बजे',
    	            LTS: 'A h:mm:ss बजे',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm बजे',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm बजे',
    	        },

    	        monthsParse: monthsParse$7,
    	        longMonthsParse: monthsParse$7,
    	        shortMonthsParse: shortMonthsParse,

    	        monthsRegex:
    	            /^(जनवरी|जन\.?|फ़रवरी|फरवरी|फ़र\.?|मार्च?|अप्रैल|अप्रै\.?|मई?|जून?|जुलाई|जुल\.?|अगस्त|अग\.?|सितम्बर|सितंबर|सित\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर|नव\.?|दिसम्बर|दिसंबर|दिस\.?)/i,

    	        monthsShortRegex:
    	            /^(जनवरी|जन\.?|फ़रवरी|फरवरी|फ़र\.?|मार्च?|अप्रैल|अप्रै\.?|मई?|जून?|जुलाई|जुल\.?|अगस्त|अग\.?|सितम्बर|सितंबर|सित\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर|नव\.?|दिसम्बर|दिसंबर|दिस\.?)/i,

    	        monthsStrictRegex:
    	            /^(जनवरी?|फ़रवरी|फरवरी?|मार्च?|अप्रैल?|मई?|जून?|जुलाई?|अगस्त?|सितम्बर|सितंबर|सित?\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर?|दिसम्बर|दिसंबर?)/i,

    	        monthsShortStrictRegex:
    	            /^(जन\.?|फ़र\.?|मार्च?|अप्रै\.?|मई?|जून?|जुल\.?|अग\.?|सित\.?|अक्टू\.?|नव\.?|दिस\.?)/i,

    	        calendar: {
    	            sameDay: '[आज] LT',
    	            nextDay: '[कल] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[कल] LT',
    	            lastWeek: '[पिछले] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s में',
    	            past: '%s पहले',
    	            s: 'कुछ ही क्षण',
    	            ss: '%d सेकंड',
    	            m: 'एक मिनट',
    	            mm: '%d मिनट',
    	            h: 'एक घंटा',
    	            hh: '%d घंटे',
    	            d: 'एक दिन',
    	            dd: '%d दिन',
    	            M: 'एक महीने',
    	            MM: '%d महीने',
    	            y: 'एक वर्ष',
    	            yy: '%d वर्ष',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[१२३४५६७८९०]/g, function (match) {
    	                return numberMap$7[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$8[match];
    	            });
    	        },
    	        // Hindi notation for meridiems are quite fuzzy in practice. While there exists
    	        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
    	        meridiemParse: /रात|सुबह|दोपहर|शाम/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'रात') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'सुबह') {
    	                return hour;
    	            } else if (meridiem === 'दोपहर') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else if (meridiem === 'शाम') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'रात';
    	            } else if (hour < 10) {
    	                return 'सुबह';
    	            } else if (hour < 17) {
    	                return 'दोपहर';
    	            } else if (hour < 20) {
    	                return 'शाम';
    	            } else {
    	                return 'रात';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function translate$3(number, withoutSuffix, key) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 'ss':
    	                if (number === 1) {
    	                    result += 'sekunda';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'sekunde';
    	                } else {
    	                    result += 'sekundi';
    	                }
    	                return result;
    	            case 'm':
    	                return withoutSuffix ? 'jedna minuta' : 'jedne minute';
    	            case 'mm':
    	                if (number === 1) {
    	                    result += 'minuta';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'minute';
    	                } else {
    	                    result += 'minuta';
    	                }
    	                return result;
    	            case 'h':
    	                return withoutSuffix ? 'jedan sat' : 'jednog sata';
    	            case 'hh':
    	                if (number === 1) {
    	                    result += 'sat';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'sata';
    	                } else {
    	                    result += 'sati';
    	                }
    	                return result;
    	            case 'dd':
    	                if (number === 1) {
    	                    result += 'dan';
    	                } else {
    	                    result += 'dana';
    	                }
    	                return result;
    	            case 'MM':
    	                if (number === 1) {
    	                    result += 'mjesec';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'mjeseca';
    	                } else {
    	                    result += 'mjeseci';
    	                }
    	                return result;
    	            case 'yy':
    	                if (number === 1) {
    	                    result += 'godina';
    	                } else if (number === 2 || number === 3 || number === 4) {
    	                    result += 'godine';
    	                } else {
    	                    result += 'godina';
    	                }
    	                return result;
    	        }
    	    }

    	    hooks.defineLocale('hr', {
    	        months: {
    	            format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort:
    	            'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    	        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'Do MMMM YYYY',
    	            LLL: 'Do MMMM YYYY H:mm',
    	            LLLL: 'dddd, Do MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[danas u] LT',
    	            nextDay: '[sutra u] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[u] [nedjelju] [u] LT';
    	                    case 3:
    	                        return '[u] [srijedu] [u] LT';
    	                    case 6:
    	                        return '[u] [subotu] [u] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[u] dddd [u] LT';
    	                }
    	            },
    	            lastDay: '[jučer u] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[prošlu] [nedjelju] [u] LT';
    	                    case 3:
    	                        return '[prošlu] [srijedu] [u] LT';
    	                    case 6:
    	                        return '[prošle] [subote] [u] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[prošli] dddd [u] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: 'prije %s',
    	            s: 'par sekundi',
    	            ss: translate$3,
    	            m: translate$3,
    	            mm: translate$3,
    	            h: translate$3,
    	            hh: translate$3,
    	            d: 'dan',
    	            dd: translate$3,
    	            M: 'mjesec',
    	            MM: translate$3,
    	            y: 'godinu',
    	            yy: translate$3,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var weekEndings =
    	        'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
    	    function translate$4(number, withoutSuffix, key, isFuture) {
    	        var num = number;
    	        switch (key) {
    	            case 's':
    	                return isFuture || withoutSuffix
    	                    ? 'néhány másodperc'
    	                    : 'néhány másodperce';
    	            case 'ss':
    	                return num + (isFuture || withoutSuffix)
    	                    ? ' másodperc'
    	                    : ' másodperce';
    	            case 'm':
    	                return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
    	            case 'mm':
    	                return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
    	            case 'h':
    	                return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
    	            case 'hh':
    	                return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
    	            case 'd':
    	                return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
    	            case 'dd':
    	                return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
    	            case 'M':
    	                return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
    	            case 'MM':
    	                return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
    	            case 'y':
    	                return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
    	            case 'yy':
    	                return num + (isFuture || withoutSuffix ? ' év' : ' éve');
    	        }
    	        return '';
    	    }
    	    function week(isFuture) {
    	        return (
    	            (isFuture ? '' : '[múlt] ') +
    	            '[' +
    	            weekEndings[this.day()] +
    	            '] LT[-kor]'
    	        );
    	    }

    	    hooks.defineLocale('hu', {
    	        months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._márc._ápr._máj._jún._júl._aug._szept._okt._nov._dec.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
    	        weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
    	        weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'YYYY.MM.DD.',
    	            LL: 'YYYY. MMMM D.',
    	            LLL: 'YYYY. MMMM D. H:mm',
    	            LLLL: 'YYYY. MMMM D., dddd H:mm',
    	        },
    	        meridiemParse: /de|du/i,
    	        isPM: function (input) {
    	            return input.charAt(1).toLowerCase() === 'u';
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 12) {
    	                return isLower === true ? 'de' : 'DE';
    	            } else {
    	                return isLower === true ? 'du' : 'DU';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[ma] LT[-kor]',
    	            nextDay: '[holnap] LT[-kor]',
    	            nextWeek: function () {
    	                return week.call(this, true);
    	            },
    	            lastDay: '[tegnap] LT[-kor]',
    	            lastWeek: function () {
    	                return week.call(this, false);
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s múlva',
    	            past: '%s',
    	            s: translate$4,
    	            ss: translate$4,
    	            m: translate$4,
    	            mm: translate$4,
    	            h: translate$4,
    	            hh: translate$4,
    	            d: translate$4,
    	            dd: translate$4,
    	            M: translate$4,
    	            MM: translate$4,
    	            y: translate$4,
    	            yy: translate$4,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('hy-am', {
    	        months: {
    	            format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort: 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
    	        weekdays:
    	            'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
    	        weekdaysMin: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY թ.',
    	            LLL: 'D MMMM YYYY թ., HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY թ., HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[այսօր] LT',
    	            nextDay: '[վաղը] LT',
    	            lastDay: '[երեկ] LT',
    	            nextWeek: function () {
    	                return 'dddd [օրը ժամը] LT';
    	            },
    	            lastWeek: function () {
    	                return '[անցած] dddd [օրը ժամը] LT';
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s հետո',
    	            past: '%s առաջ',
    	            s: 'մի քանի վայրկյան',
    	            ss: '%d վայրկյան',
    	            m: 'րոպե',
    	            mm: '%d րոպե',
    	            h: 'ժամ',
    	            hh: '%d ժամ',
    	            d: 'օր',
    	            dd: '%d օր',
    	            M: 'ամիս',
    	            MM: '%d ամիս',
    	            y: 'տարի',
    	            yy: '%d տարի',
    	        },
    	        meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
    	        isPM: function (input) {
    	            return /^(ցերեկվա|երեկոյան)$/.test(input);
    	        },
    	        meridiem: function (hour) {
    	            if (hour < 4) {
    	                return 'գիշերվա';
    	            } else if (hour < 12) {
    	                return 'առավոտվա';
    	            } else if (hour < 17) {
    	                return 'ցերեկվա';
    	            } else {
    	                return 'երեկոյան';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'DDD':
    	                case 'w':
    	                case 'W':
    	                case 'DDDo':
    	                    if (number === 1) {
    	                        return number + '-ին';
    	                    }
    	                    return number + '-րդ';
    	                default:
    	                    return number;
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('id', {
    	        months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des'.split('_'),
    	        weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
    	        weekdaysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
    	        weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH.mm',
    	            LTS: 'HH.mm.ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY [pukul] HH.mm',
    	            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
    	        },
    	        meridiemParse: /pagi|siang|sore|malam/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'pagi') {
    	                return hour;
    	            } else if (meridiem === 'siang') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === 'sore' || meridiem === 'malam') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 11) {
    	                return 'pagi';
    	            } else if (hours < 15) {
    	                return 'siang';
    	            } else if (hours < 19) {
    	                return 'sore';
    	            } else {
    	                return 'malam';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[Hari ini pukul] LT',
    	            nextDay: '[Besok pukul] LT',
    	            nextWeek: 'dddd [pukul] LT',
    	            lastDay: '[Kemarin pukul] LT',
    	            lastWeek: 'dddd [lalu pukul] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dalam %s',
    	            past: '%s yang lalu',
    	            s: 'beberapa detik',
    	            ss: '%d detik',
    	            m: 'semenit',
    	            mm: '%d menit',
    	            h: 'sejam',
    	            hh: '%d jam',
    	            d: 'sehari',
    	            dd: '%d hari',
    	            M: 'sebulan',
    	            MM: '%d bulan',
    	            y: 'setahun',
    	            yy: '%d tahun',
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function plural$2(n) {
    	        if (n % 100 === 11) {
    	            return true;
    	        } else if (n % 10 === 1) {
    	            return false;
    	        }
    	        return true;
    	    }
    	    function translate$5(number, withoutSuffix, key, isFuture) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 's':
    	                return withoutSuffix || isFuture
    	                    ? 'nokkrar sekúndur'
    	                    : 'nokkrum sekúndum';
    	            case 'ss':
    	                if (plural$2(number)) {
    	                    return (
    	                        result +
    	                        (withoutSuffix || isFuture ? 'sekúndur' : 'sekúndum')
    	                    );
    	                }
    	                return result + 'sekúnda';
    	            case 'm':
    	                return withoutSuffix ? 'mínúta' : 'mínútu';
    	            case 'mm':
    	                if (plural$2(number)) {
    	                    return (
    	                        result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum')
    	                    );
    	                } else if (withoutSuffix) {
    	                    return result + 'mínúta';
    	                }
    	                return result + 'mínútu';
    	            case 'hh':
    	                if (plural$2(number)) {
    	                    return (
    	                        result +
    	                        (withoutSuffix || isFuture
    	                            ? 'klukkustundir'
    	                            : 'klukkustundum')
    	                    );
    	                }
    	                return result + 'klukkustund';
    	            case 'd':
    	                if (withoutSuffix) {
    	                    return 'dagur';
    	                }
    	                return isFuture ? 'dag' : 'degi';
    	            case 'dd':
    	                if (plural$2(number)) {
    	                    if (withoutSuffix) {
    	                        return result + 'dagar';
    	                    }
    	                    return result + (isFuture ? 'daga' : 'dögum');
    	                } else if (withoutSuffix) {
    	                    return result + 'dagur';
    	                }
    	                return result + (isFuture ? 'dag' : 'degi');
    	            case 'M':
    	                if (withoutSuffix) {
    	                    return 'mánuður';
    	                }
    	                return isFuture ? 'mánuð' : 'mánuði';
    	            case 'MM':
    	                if (plural$2(number)) {
    	                    if (withoutSuffix) {
    	                        return result + 'mánuðir';
    	                    }
    	                    return result + (isFuture ? 'mánuði' : 'mánuðum');
    	                } else if (withoutSuffix) {
    	                    return result + 'mánuður';
    	                }
    	                return result + (isFuture ? 'mánuð' : 'mánuði');
    	            case 'y':
    	                return withoutSuffix || isFuture ? 'ár' : 'ári';
    	            case 'yy':
    	                if (plural$2(number)) {
    	                    return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
    	                }
    	                return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
    	        }
    	    }

    	    hooks.defineLocale('is', {
    	        months: 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
    	        weekdays:
    	            'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
    	        weekdaysMin: 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY [kl.] H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY [kl.] H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[í dag kl.] LT',
    	            nextDay: '[á morgun kl.] LT',
    	            nextWeek: 'dddd [kl.] LT',
    	            lastDay: '[í gær kl.] LT',
    	            lastWeek: '[síðasta] dddd [kl.] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'eftir %s',
    	            past: 'fyrir %s síðan',
    	            s: translate$5,
    	            ss: translate$5,
    	            m: translate$5,
    	            mm: translate$5,
    	            h: 'klukkustund',
    	            hh: translate$5,
    	            d: translate$5,
    	            dd: translate$5,
    	            M: translate$5,
    	            MM: translate$5,
    	            y: translate$5,
    	            yy: translate$5,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('it-ch', {
    	        months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split(
    	            '_'
    	        ),
    	        monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
    	        weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
    	        weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Oggi alle] LT',
    	            nextDay: '[Domani alle] LT',
    	            nextWeek: 'dddd [alle] LT',
    	            lastDay: '[Ieri alle] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[la scorsa] dddd [alle] LT';
    	                    default:
    	                        return '[lo scorso] dddd [alle] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: function (s) {
    	                return (/^[0-9].+$/.test(s) ? 'tra' : 'in') + ' ' + s;
    	            },
    	            past: '%s fa',
    	            s: 'alcuni secondi',
    	            ss: '%d secondi',
    	            m: 'un minuto',
    	            mm: '%d minuti',
    	            h: "un'ora",
    	            hh: '%d ore',
    	            d: 'un giorno',
    	            dd: '%d giorni',
    	            M: 'un mese',
    	            MM: '%d mesi',
    	            y: 'un anno',
    	            yy: '%d anni',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('it', {
    	        months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split(
    	            '_'
    	        ),
    	        monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
    	        weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
    	        weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: function () {
    	                return (
    	                    '[Oggi a' +
    	                    (this.hours() > 1 ? 'lle ' : this.hours() === 0 ? ' ' : "ll'") +
    	                    ']LT'
    	                );
    	            },
    	            nextDay: function () {
    	                return (
    	                    '[Domani a' +
    	                    (this.hours() > 1 ? 'lle ' : this.hours() === 0 ? ' ' : "ll'") +
    	                    ']LT'
    	                );
    	            },
    	            nextWeek: function () {
    	                return (
    	                    'dddd [a' +
    	                    (this.hours() > 1 ? 'lle ' : this.hours() === 0 ? ' ' : "ll'") +
    	                    ']LT'
    	                );
    	            },
    	            lastDay: function () {
    	                return (
    	                    '[Ieri a' +
    	                    (this.hours() > 1 ? 'lle ' : this.hours() === 0 ? ' ' : "ll'") +
    	                    ']LT'
    	                );
    	            },
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return (
    	                            '[La scorsa] dddd [a' +
    	                            (this.hours() > 1
    	                                ? 'lle '
    	                                : this.hours() === 0
    	                                ? ' '
    	                                : "ll'") +
    	                            ']LT'
    	                        );
    	                    default:
    	                        return (
    	                            '[Lo scorso] dddd [a' +
    	                            (this.hours() > 1
    	                                ? 'lle '
    	                                : this.hours() === 0
    	                                ? ' '
    	                                : "ll'") +
    	                            ']LT'
    	                        );
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'tra %s',
    	            past: '%s fa',
    	            s: 'alcuni secondi',
    	            ss: '%d secondi',
    	            m: 'un minuto',
    	            mm: '%d minuti',
    	            h: "un'ora",
    	            hh: '%d ore',
    	            d: 'un giorno',
    	            dd: '%d giorni',
    	            w: 'una settimana',
    	            ww: '%d settimane',
    	            M: 'un mese',
    	            MM: '%d mesi',
    	            y: 'un anno',
    	            yy: '%d anni',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ja', {
    	        eras: [
    	            {
    	                since: '2019-05-01',
    	                offset: 1,
    	                name: '令和',
    	                narrow: '㋿',
    	                abbr: 'R',
    	            },
    	            {
    	                since: '1989-01-08',
    	                until: '2019-04-30',
    	                offset: 1,
    	                name: '平成',
    	                narrow: '㍻',
    	                abbr: 'H',
    	            },
    	            {
    	                since: '1926-12-25',
    	                until: '1989-01-07',
    	                offset: 1,
    	                name: '昭和',
    	                narrow: '㍼',
    	                abbr: 'S',
    	            },
    	            {
    	                since: '1912-07-30',
    	                until: '1926-12-24',
    	                offset: 1,
    	                name: '大正',
    	                narrow: '㍽',
    	                abbr: 'T',
    	            },
    	            {
    	                since: '1873-01-01',
    	                until: '1912-07-29',
    	                offset: 6,
    	                name: '明治',
    	                narrow: '㍾',
    	                abbr: 'M',
    	            },
    	            {
    	                since: '0001-01-01',
    	                until: '1873-12-31',
    	                offset: 1,
    	                name: '西暦',
    	                narrow: 'AD',
    	                abbr: 'AD',
    	            },
    	            {
    	                since: '0000-12-31',
    	                until: -Infinity,
    	                offset: 1,
    	                name: '紀元前',
    	                narrow: 'BC',
    	                abbr: 'BC',
    	            },
    	        ],
    	        eraYearOrdinalRegex: /(元|\d+)年/,
    	        eraYearOrdinalParse: function (input, match) {
    	            return match[1] === '元' ? 1 : parseInt(match[1] || input, 10);
    	        },
    	        months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    	        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    	            '_'
    	        ),
    	        weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
    	        weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
    	        weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY/MM/DD',
    	            LL: 'YYYY年M月D日',
    	            LLL: 'YYYY年M月D日 HH:mm',
    	            LLLL: 'YYYY年M月D日 dddd HH:mm',
    	            l: 'YYYY/MM/DD',
    	            ll: 'YYYY年M月D日',
    	            lll: 'YYYY年M月D日 HH:mm',
    	            llll: 'YYYY年M月D日(ddd) HH:mm',
    	        },
    	        meridiemParse: /午前|午後/i,
    	        isPM: function (input) {
    	            return input === '午後';
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return '午前';
    	            } else {
    	                return '午後';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[今日] LT',
    	            nextDay: '[明日] LT',
    	            nextWeek: function (now) {
    	                if (now.week() !== this.week()) {
    	                    return '[来週]dddd LT';
    	                } else {
    	                    return 'dddd LT';
    	                }
    	            },
    	            lastDay: '[昨日] LT',
    	            lastWeek: function (now) {
    	                if (this.week() !== now.week()) {
    	                    return '[先週]dddd LT';
    	                } else {
    	                    return 'dddd LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}日/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'y':
    	                    return number === 1 ? '元年' : number + '年';
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '日';
    	                default:
    	                    return number;
    	            }
    	        },
    	        relativeTime: {
    	            future: '%s後',
    	            past: '%s前',
    	            s: '数秒',
    	            ss: '%d秒',
    	            m: '1分',
    	            mm: '%d分',
    	            h: '1時間',
    	            hh: '%d時間',
    	            d: '1日',
    	            dd: '%d日',
    	            M: '1ヶ月',
    	            MM: '%dヶ月',
    	            y: '1年',
    	            yy: '%d年',
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('jv', {
    	        months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
    	        weekdays: 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
    	        weekdaysShort: 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
    	        weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH.mm',
    	            LTS: 'HH.mm.ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY [pukul] HH.mm',
    	            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
    	        },
    	        meridiemParse: /enjing|siyang|sonten|ndalu/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'enjing') {
    	                return hour;
    	            } else if (meridiem === 'siyang') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 11) {
    	                return 'enjing';
    	            } else if (hours < 15) {
    	                return 'siyang';
    	            } else if (hours < 19) {
    	                return 'sonten';
    	            } else {
    	                return 'ndalu';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[Dinten puniko pukul] LT',
    	            nextDay: '[Mbenjang pukul] LT',
    	            nextWeek: 'dddd [pukul] LT',
    	            lastDay: '[Kala wingi pukul] LT',
    	            lastWeek: 'dddd [kepengker pukul] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'wonten ing %s',
    	            past: '%s ingkang kepengker',
    	            s: 'sawetawis detik',
    	            ss: '%d detik',
    	            m: 'setunggal menit',
    	            mm: '%d menit',
    	            h: 'setunggal jam',
    	            hh: '%d jam',
    	            d: 'sedinten',
    	            dd: '%d dinten',
    	            M: 'sewulan',
    	            MM: '%d wulan',
    	            y: 'setaun',
    	            yy: '%d taun',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ka', {
    	        months: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split(
    	            '_'
    	        ),
    	        monthsShort: 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
    	        weekdays: {
    	            standalone:
    	                'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split(
    	                    '_'
    	                ),
    	            format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split(
    	                '_'
    	            ),
    	            isFormat: /(წინა|შემდეგ)/,
    	        },
    	        weekdaysShort: 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
    	        weekdaysMin: 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[დღეს] LT[-ზე]',
    	            nextDay: '[ხვალ] LT[-ზე]',
    	            lastDay: '[გუშინ] LT[-ზე]',
    	            nextWeek: '[შემდეგ] dddd LT[-ზე]',
    	            lastWeek: '[წინა] dddd LT-ზე',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: function (s) {
    	                return s.replace(
    	                    /(წამ|წუთ|საათ|წელ|დღ|თვ)(ი|ე)/,
    	                    function ($0, $1, $2) {
    	                        return $2 === 'ი' ? $1 + 'ში' : $1 + $2 + 'ში';
    	                    }
    	                );
    	            },
    	            past: function (s) {
    	                if (/(წამი|წუთი|საათი|დღე|თვე)/.test(s)) {
    	                    return s.replace(/(ი|ე)$/, 'ის წინ');
    	                }
    	                if (/წელი/.test(s)) {
    	                    return s.replace(/წელი$/, 'წლის წინ');
    	                }
    	                return s;
    	            },
    	            s: 'რამდენიმე წამი',
    	            ss: '%d წამი',
    	            m: 'წუთი',
    	            mm: '%d წუთი',
    	            h: 'საათი',
    	            hh: '%d საათი',
    	            d: 'დღე',
    	            dd: '%d დღე',
    	            M: 'თვე',
    	            MM: '%d თვე',
    	            y: 'წელი',
    	            yy: '%d წელი',
    	        },
    	        dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
    	        ordinal: function (number) {
    	            if (number === 0) {
    	                return number;
    	            }
    	            if (number === 1) {
    	                return number + '-ლი';
    	            }
    	            if (
    	                number < 20 ||
    	                (number <= 100 && number % 20 === 0) ||
    	                number % 100 === 0
    	            ) {
    	                return 'მე-' + number;
    	            }
    	            return number + '-ე';
    	        },
    	        week: {
    	            dow: 1,
    	            doy: 7,
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var suffixes$1 = {
    	        0: '-ші',
    	        1: '-ші',
    	        2: '-ші',
    	        3: '-ші',
    	        4: '-ші',
    	        5: '-ші',
    	        6: '-шы',
    	        7: '-ші',
    	        8: '-ші',
    	        9: '-шы',
    	        10: '-шы',
    	        20: '-шы',
    	        30: '-шы',
    	        40: '-шы',
    	        50: '-ші',
    	        60: '-шы',
    	        70: '-ші',
    	        80: '-ші',
    	        90: '-шы',
    	        100: '-ші',
    	    };

    	    hooks.defineLocale('kk', {
    	        months: 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split(
    	            '_'
    	        ),
    	        monthsShort: 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
    	        weekdays: 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
    	        weekdaysMin: 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Бүгін сағат] LT',
    	            nextDay: '[Ертең сағат] LT',
    	            nextWeek: 'dddd [сағат] LT',
    	            lastDay: '[Кеше сағат] LT',
    	            lastWeek: '[Өткен аптаның] dddd [сағат] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s ішінде',
    	            past: '%s бұрын',
    	            s: 'бірнеше секунд',
    	            ss: '%d секунд',
    	            m: 'бір минут',
    	            mm: '%d минут',
    	            h: 'бір сағат',
    	            hh: '%d сағат',
    	            d: 'бір күн',
    	            dd: '%d күн',
    	            M: 'бір ай',
    	            MM: '%d ай',
    	            y: 'бір жыл',
    	            yy: '%d жыл',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
    	        ordinal: function (number) {
    	            var a = number % 10,
    	                b = number >= 100 ? 100 : null;
    	            return number + (suffixes$1[number] || suffixes$1[a] || suffixes$1[b]);
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$9 = {
    	            1: '១',
    	            2: '២',
    	            3: '៣',
    	            4: '៤',
    	            5: '៥',
    	            6: '៦',
    	            7: '៧',
    	            8: '៨',
    	            9: '៩',
    	            0: '០',
    	        },
    	        numberMap$8 = {
    	            '១': '1',
    	            '២': '2',
    	            '៣': '3',
    	            '៤': '4',
    	            '៥': '5',
    	            '៦': '6',
    	            '៧': '7',
    	            '៨': '8',
    	            '៩': '9',
    	            '០': '0',
    	        };

    	    hooks.defineLocale('km', {
    	        months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split(
    	                '_'
    	            ),
    	        weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    	        weekdaysShort: 'អា_ច_អ_ព_ព្រ_សុ_ស'.split('_'),
    	        weekdaysMin: 'អា_ច_អ_ព_ព្រ_សុ_ស'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ព្រឹក|ល្ងាច/,
    	        isPM: function (input) {
    	            return input === 'ល្ងាច';
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ព្រឹក';
    	            } else {
    	                return 'ល្ងាច';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
    	            nextDay: '[ស្អែក ម៉ោង] LT',
    	            nextWeek: 'dddd [ម៉ោង] LT',
    	            lastDay: '[ម្សិលមិញ ម៉ោង] LT',
    	            lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%sទៀត',
    	            past: '%sមុន',
    	            s: 'ប៉ុន្មានវិនាទី',
    	            ss: '%d វិនាទី',
    	            m: 'មួយនាទី',
    	            mm: '%d នាទី',
    	            h: 'មួយម៉ោង',
    	            hh: '%d ម៉ោង',
    	            d: 'មួយថ្ងៃ',
    	            dd: '%d ថ្ងៃ',
    	            M: 'មួយខែ',
    	            MM: '%d ខែ',
    	            y: 'មួយឆ្នាំ',
    	            yy: '%d ឆ្នាំ',
    	        },
    	        dayOfMonthOrdinalParse: /ទី\d{1,2}/,
    	        ordinal: 'ទី%d',
    	        preparse: function (string) {
    	            return string.replace(/[១២៣៤៥៦៧៨៩០]/g, function (match) {
    	                return numberMap$8[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$9[match];
    	            });
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$a = {
    	            1: '೧',
    	            2: '೨',
    	            3: '೩',
    	            4: '೪',
    	            5: '೫',
    	            6: '೬',
    	            7: '೭',
    	            8: '೮',
    	            9: '೯',
    	            0: '೦',
    	        },
    	        numberMap$9 = {
    	            '೧': '1',
    	            '೨': '2',
    	            '೩': '3',
    	            '೪': '4',
    	            '೫': '5',
    	            '೬': '6',
    	            '೭': '7',
    	            '೮': '8',
    	            '೯': '9',
    	            '೦': '0',
    	        };

    	    hooks.defineLocale('kn', {
    	        months: 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂ_ಅಕ್ಟೋ_ನವೆಂ_ಡಿಸೆಂ'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
    	        weekdaysMin: 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm',
    	            LTS: 'A h:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm',
    	        },
    	        calendar: {
    	            sameDay: '[ಇಂದು] LT',
    	            nextDay: '[ನಾಳೆ] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[ನಿನ್ನೆ] LT',
    	            lastWeek: '[ಕೊನೆಯ] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s ನಂತರ',
    	            past: '%s ಹಿಂದೆ',
    	            s: 'ಕೆಲವು ಕ್ಷಣಗಳು',
    	            ss: '%d ಸೆಕೆಂಡುಗಳು',
    	            m: 'ಒಂದು ನಿಮಿಷ',
    	            mm: '%d ನಿಮಿಷ',
    	            h: 'ಒಂದು ಗಂಟೆ',
    	            hh: '%d ಗಂಟೆ',
    	            d: 'ಒಂದು ದಿನ',
    	            dd: '%d ದಿನ',
    	            M: 'ಒಂದು ತಿಂಗಳು',
    	            MM: '%d ತಿಂಗಳು',
    	            y: 'ಒಂದು ವರ್ಷ',
    	            yy: '%d ವರ್ಷ',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (match) {
    	                return numberMap$9[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$a[match];
    	            });
    	        },
    	        meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'ರಾತ್ರಿ') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'ಬೆಳಿಗ್ಗೆ') {
    	                return hour;
    	            } else if (meridiem === 'ಮಧ್ಯಾಹ್ನ') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else if (meridiem === 'ಸಂಜೆ') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'ರಾತ್ರಿ';
    	            } else if (hour < 10) {
    	                return 'ಬೆಳಿಗ್ಗೆ';
    	            } else if (hour < 17) {
    	                return 'ಮಧ್ಯಾಹ್ನ';
    	            } else if (hour < 20) {
    	                return 'ಸಂಜೆ';
    	            } else {
    	                return 'ರಾತ್ರಿ';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
    	        ordinal: function (number) {
    	            return number + 'ನೇ';
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ko', {
    	        months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    	        monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split(
    	            '_'
    	        ),
    	        weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    	        weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
    	        weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm',
    	            LTS: 'A h:mm:ss',
    	            L: 'YYYY.MM.DD.',
    	            LL: 'YYYY년 MMMM D일',
    	            LLL: 'YYYY년 MMMM D일 A h:mm',
    	            LLLL: 'YYYY년 MMMM D일 dddd A h:mm',
    	            l: 'YYYY.MM.DD.',
    	            ll: 'YYYY년 MMMM D일',
    	            lll: 'YYYY년 MMMM D일 A h:mm',
    	            llll: 'YYYY년 MMMM D일 dddd A h:mm',
    	        },
    	        calendar: {
    	            sameDay: '오늘 LT',
    	            nextDay: '내일 LT',
    	            nextWeek: 'dddd LT',
    	            lastDay: '어제 LT',
    	            lastWeek: '지난주 dddd LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s 후',
    	            past: '%s 전',
    	            s: '몇 초',
    	            ss: '%d초',
    	            m: '1분',
    	            mm: '%d분',
    	            h: '한 시간',
    	            hh: '%d시간',
    	            d: '하루',
    	            dd: '%d일',
    	            M: '한 달',
    	            MM: '%d달',
    	            y: '일 년',
    	            yy: '%d년',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '일';
    	                case 'M':
    	                    return number + '월';
    	                case 'w':
    	                case 'W':
    	                    return number + '주';
    	                default:
    	                    return number;
    	            }
    	        },
    	        meridiemParse: /오전|오후/,
    	        isPM: function (token) {
    	            return token === '오후';
    	        },
    	        meridiem: function (hour, minute, isUpper) {
    	            return hour < 12 ? '오전' : '오후';
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$b = {
    	            1: '١',
    	            2: '٢',
    	            3: '٣',
    	            4: '٤',
    	            5: '٥',
    	            6: '٦',
    	            7: '٧',
    	            8: '٨',
    	            9: '٩',
    	            0: '٠',
    	        },
    	        numberMap$a = {
    	            '١': '1',
    	            '٢': '2',
    	            '٣': '3',
    	            '٤': '4',
    	            '٥': '5',
    	            '٦': '6',
    	            '٧': '7',
    	            '٨': '8',
    	            '٩': '9',
    	            '٠': '0',
    	        },
    	        months$8 = [
    	            'کانونی دووەم',
    	            'شوبات',
    	            'ئازار',
    	            'نیسان',
    	            'ئایار',
    	            'حوزەیران',
    	            'تەمموز',
    	            'ئاب',
    	            'ئەیلوول',
    	            'تشرینی یەكەم',
    	            'تشرینی دووەم',
    	            'كانونی یەکەم',
    	        ];

    	    hooks.defineLocale('ku', {
    	        months: months$8,
    	        monthsShort: months$8,
    	        weekdays:
    	            'یه‌كشه‌ممه‌_دووشه‌ممه‌_سێشه‌ممه‌_چوارشه‌ممه‌_پێنجشه‌ممه‌_هه‌ینی_شه‌ممه‌'.split(
    	                '_'
    	            ),
    	        weekdaysShort:
    	            'یه‌كشه‌م_دووشه‌م_سێشه‌م_چوارشه‌م_پێنجشه‌م_هه‌ینی_شه‌ممه‌'.split('_'),
    	        weekdaysMin: 'ی_د_س_چ_پ_ه_ش'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ئێواره‌|به‌یانی/,
    	        isPM: function (input) {
    	            return /ئێواره‌/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'به‌یانی';
    	            } else {
    	                return 'ئێواره‌';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[ئه‌مرۆ كاتژمێر] LT',
    	            nextDay: '[به‌یانی كاتژمێر] LT',
    	            nextWeek: 'dddd [كاتژمێر] LT',
    	            lastDay: '[دوێنێ كاتژمێر] LT',
    	            lastWeek: 'dddd [كاتژمێر] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'له‌ %s',
    	            past: '%s',
    	            s: 'چه‌ند چركه‌یه‌ك',
    	            ss: 'چركه‌ %d',
    	            m: 'یه‌ك خوله‌ك',
    	            mm: '%d خوله‌ك',
    	            h: 'یه‌ك كاتژمێر',
    	            hh: '%d كاتژمێر',
    	            d: 'یه‌ك ڕۆژ',
    	            dd: '%d ڕۆژ',
    	            M: 'یه‌ك مانگ',
    	            MM: '%d مانگ',
    	            y: 'یه‌ك ساڵ',
    	            yy: '%d ساڵ',
    	        },
    	        preparse: function (string) {
    	            return string
    	                .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
    	                    return numberMap$a[match];
    	                })
    	                .replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string
    	                .replace(/\d/g, function (match) {
    	                    return symbolMap$b[match];
    	                })
    	                .replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 6, // Saturday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var suffixes$2 = {
    	        0: '-чү',
    	        1: '-чи',
    	        2: '-чи',
    	        3: '-чү',
    	        4: '-чү',
    	        5: '-чи',
    	        6: '-чы',
    	        7: '-чи',
    	        8: '-чи',
    	        9: '-чу',
    	        10: '-чу',
    	        20: '-чы',
    	        30: '-чу',
    	        40: '-чы',
    	        50: '-чү',
    	        60: '-чы',
    	        70: '-чи',
    	        80: '-чи',
    	        90: '-чу',
    	        100: '-чү',
    	    };

    	    hooks.defineLocale('ky', {
    	        months: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split(
    	            '_'
    	        ),
    	        monthsShort: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split(
    	            '_'
    	        ),
    	        weekdays: 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
    	        weekdaysMin: 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Бүгүн саат] LT',
    	            nextDay: '[Эртең саат] LT',
    	            nextWeek: 'dddd [саат] LT',
    	            lastDay: '[Кечээ саат] LT',
    	            lastWeek: '[Өткөн аптанын] dddd [күнү] [саат] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s ичинде',
    	            past: '%s мурун',
    	            s: 'бирнече секунд',
    	            ss: '%d секунд',
    	            m: 'бир мүнөт',
    	            mm: '%d мүнөт',
    	            h: 'бир саат',
    	            hh: '%d саат',
    	            d: 'бир күн',
    	            dd: '%d күн',
    	            M: 'бир ай',
    	            MM: '%d ай',
    	            y: 'бир жыл',
    	            yy: '%d жыл',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
    	        ordinal: function (number) {
    	            var a = number % 10,
    	                b = number >= 100 ? 100 : null;
    	            return number + (suffixes$2[number] || suffixes$2[a] || suffixes$2[b]);
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$6(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            m: ['eng Minutt', 'enger Minutt'],
    	            h: ['eng Stonn', 'enger Stonn'],
    	            d: ['een Dag', 'engem Dag'],
    	            M: ['ee Mount', 'engem Mount'],
    	            y: ['ee Joer', 'engem Joer'],
    	        };
    	        return withoutSuffix ? format[key][0] : format[key][1];
    	    }
    	    function processFutureTime(string) {
    	        var number = string.substr(0, string.indexOf(' '));
    	        if (eifelerRegelAppliesToNumber(number)) {
    	            return 'a ' + string;
    	        }
    	        return 'an ' + string;
    	    }
    	    function processPastTime(string) {
    	        var number = string.substr(0, string.indexOf(' '));
    	        if (eifelerRegelAppliesToNumber(number)) {
    	            return 'viru ' + string;
    	        }
    	        return 'virun ' + string;
    	    }
    	    /**
    	     * Returns true if the word before the given number loses the '-n' ending.
    	     * e.g. 'an 10 Deeg' but 'a 5 Deeg'
    	     *
    	     * @param number {integer}
    	     * @returns {boolean}
    	     */
    	    function eifelerRegelAppliesToNumber(number) {
    	        number = parseInt(number, 10);
    	        if (isNaN(number)) {
    	            return false;
    	        }
    	        if (number < 0) {
    	            // Negative Number --> always true
    	            return true;
    	        } else if (number < 10) {
    	            // Only 1 digit
    	            if (4 <= number && number <= 7) {
    	                return true;
    	            }
    	            return false;
    	        } else if (number < 100) {
    	            // 2 digits
    	            var lastDigit = number % 10,
    	                firstDigit = number / 10;
    	            if (lastDigit === 0) {
    	                return eifelerRegelAppliesToNumber(firstDigit);
    	            }
    	            return eifelerRegelAppliesToNumber(lastDigit);
    	        } else if (number < 10000) {
    	            // 3 or 4 digits --> recursively check first digit
    	            while (number >= 10) {
    	                number = number / 10;
    	            }
    	            return eifelerRegelAppliesToNumber(number);
    	        } else {
    	            // Anything larger than 4 digits: recursively check first n-3 digits
    	            number = number / 1000;
    	            return eifelerRegelAppliesToNumber(number);
    	        }
    	    }

    	    hooks.defineLocale('lb', {
    	        months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays:
    	            'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
    	        weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm [Auer]',
    	            LTS: 'H:mm:ss [Auer]',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm [Auer]',
    	            LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]',
    	        },
    	        calendar: {
    	            sameDay: '[Haut um] LT',
    	            sameElse: 'L',
    	            nextDay: '[Muer um] LT',
    	            nextWeek: 'dddd [um] LT',
    	            lastDay: '[Gëschter um] LT',
    	            lastWeek: function () {
    	                // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
    	                switch (this.day()) {
    	                    case 2:
    	                    case 4:
    	                        return '[Leschten] dddd [um] LT';
    	                    default:
    	                        return '[Leschte] dddd [um] LT';
    	                }
    	            },
    	        },
    	        relativeTime: {
    	            future: processFutureTime,
    	            past: processPastTime,
    	            s: 'e puer Sekonnen',
    	            ss: '%d Sekonnen',
    	            m: processRelativeTime$6,
    	            mm: '%d Minutten',
    	            h: processRelativeTime$6,
    	            hh: '%d Stonnen',
    	            d: processRelativeTime$6,
    	            dd: '%d Deeg',
    	            M: processRelativeTime$6,
    	            MM: '%d Méint',
    	            y: processRelativeTime$6,
    	            yy: '%d Joer',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('lo', {
    	        months: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split(
    	                '_'
    	            ),
    	        weekdays: 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
    	        weekdaysShort: 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
    	        weekdaysMin: 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'ວັນdddd D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
    	        isPM: function (input) {
    	            return input === 'ຕອນແລງ';
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ຕອນເຊົ້າ';
    	            } else {
    	                return 'ຕອນແລງ';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[ມື້ນີ້ເວລາ] LT',
    	            nextDay: '[ມື້ອື່ນເວລາ] LT',
    	            nextWeek: '[ວັນ]dddd[ໜ້າເວລາ] LT',
    	            lastDay: '[ມື້ວານນີ້ເວລາ] LT',
    	            lastWeek: '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'ອີກ %s',
    	            past: '%sຜ່ານມາ',
    	            s: 'ບໍ່ເທົ່າໃດວິນາທີ',
    	            ss: '%d ວິນາທີ',
    	            m: '1 ນາທີ',
    	            mm: '%d ນາທີ',
    	            h: '1 ຊົ່ວໂມງ',
    	            hh: '%d ຊົ່ວໂມງ',
    	            d: '1 ມື້',
    	            dd: '%d ມື້',
    	            M: '1 ເດືອນ',
    	            MM: '%d ເດືອນ',
    	            y: '1 ປີ',
    	            yy: '%d ປີ',
    	        },
    	        dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
    	        ordinal: function (number) {
    	            return 'ທີ່' + number;
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var units = {
    	        ss: 'sekundė_sekundžių_sekundes',
    	        m: 'minutė_minutės_minutę',
    	        mm: 'minutės_minučių_minutes',
    	        h: 'valanda_valandos_valandą',
    	        hh: 'valandos_valandų_valandas',
    	        d: 'diena_dienos_dieną',
    	        dd: 'dienos_dienų_dienas',
    	        M: 'mėnuo_mėnesio_mėnesį',
    	        MM: 'mėnesiai_mėnesių_mėnesius',
    	        y: 'metai_metų_metus',
    	        yy: 'metai_metų_metus',
    	    };
    	    function translateSeconds(number, withoutSuffix, key, isFuture) {
    	        if (withoutSuffix) {
    	            return 'kelios sekundės';
    	        } else {
    	            return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
    	        }
    	    }
    	    function translateSingular(number, withoutSuffix, key, isFuture) {
    	        return withoutSuffix
    	            ? forms(key)[0]
    	            : isFuture
    	            ? forms(key)[1]
    	            : forms(key)[2];
    	    }
    	    function special(number) {
    	        return number % 10 === 0 || (number > 10 && number < 20);
    	    }
    	    function forms(key) {
    	        return units[key].split('_');
    	    }
    	    function translate$6(number, withoutSuffix, key, isFuture) {
    	        var result = number + ' ';
    	        if (number === 1) {
    	            return (
    	                result + translateSingular(number, withoutSuffix, key[0], isFuture)
    	            );
    	        } else if (withoutSuffix) {
    	            return result + (special(number) ? forms(key)[1] : forms(key)[0]);
    	        } else {
    	            if (isFuture) {
    	                return result + forms(key)[1];
    	            } else {
    	                return result + (special(number) ? forms(key)[1] : forms(key)[2]);
    	            }
    	        }
    	    }
    	    hooks.defineLocale('lt', {
    	        months: {
    	            format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split(
    	                    '_'
    	                ),
    	            isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/,
    	        },
    	        monthsShort: 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
    	        weekdays: {
    	            format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split(
    	                    '_'
    	                ),
    	            isFormat: /dddd HH:mm/,
    	        },
    	        weekdaysShort: 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
    	        weekdaysMin: 'S_P_A_T_K_Pn_Š'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: 'YYYY [m.] MMMM D [d.]',
    	            LLL: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
    	            LLLL: 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
    	            l: 'YYYY-MM-DD',
    	            ll: 'YYYY [m.] MMMM D [d.]',
    	            lll: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
    	            llll: 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]',
    	        },
    	        calendar: {
    	            sameDay: '[Šiandien] LT',
    	            nextDay: '[Rytoj] LT',
    	            nextWeek: 'dddd LT',
    	            lastDay: '[Vakar] LT',
    	            lastWeek: '[Praėjusį] dddd LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'po %s',
    	            past: 'prieš %s',
    	            s: translateSeconds,
    	            ss: translate$6,
    	            m: translateSingular,
    	            mm: translate$6,
    	            h: translateSingular,
    	            hh: translate$6,
    	            d: translateSingular,
    	            dd: translate$6,
    	            M: translateSingular,
    	            MM: translate$6,
    	            y: translateSingular,
    	            yy: translate$6,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-oji/,
    	        ordinal: function (number) {
    	            return number + '-oji';
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var units$1 = {
    	        ss: 'sekundes_sekundēm_sekunde_sekundes'.split('_'),
    	        m: 'minūtes_minūtēm_minūte_minūtes'.split('_'),
    	        mm: 'minūtes_minūtēm_minūte_minūtes'.split('_'),
    	        h: 'stundas_stundām_stunda_stundas'.split('_'),
    	        hh: 'stundas_stundām_stunda_stundas'.split('_'),
    	        d: 'dienas_dienām_diena_dienas'.split('_'),
    	        dd: 'dienas_dienām_diena_dienas'.split('_'),
    	        M: 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
    	        MM: 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
    	        y: 'gada_gadiem_gads_gadi'.split('_'),
    	        yy: 'gada_gadiem_gads_gadi'.split('_'),
    	    };
    	    /**
    	     * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
    	     */
    	    function format$1(forms, number, withoutSuffix) {
    	        if (withoutSuffix) {
    	            // E.g. "21 minūte", "3 minūtes".
    	            return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
    	        } else {
    	            // E.g. "21 minūtes" as in "pēc 21 minūtes".
    	            // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
    	            return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
    	        }
    	    }
    	    function relativeTimeWithPlural$1(number, withoutSuffix, key) {
    	        return number + ' ' + format$1(units$1[key], number, withoutSuffix);
    	    }
    	    function relativeTimeWithSingular(number, withoutSuffix, key) {
    	        return format$1(units$1[key], number, withoutSuffix);
    	    }
    	    function relativeSeconds(number, withoutSuffix) {
    	        return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
    	    }

    	    hooks.defineLocale('lv', {
    	        months: 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
    	        weekdays:
    	            'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Sv_P_O_T_C_Pk_S'.split('_'),
    	        weekdaysMin: 'Sv_P_O_T_C_Pk_S'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY.',
    	            LL: 'YYYY. [gada] D. MMMM',
    	            LLL: 'YYYY. [gada] D. MMMM, HH:mm',
    	            LLLL: 'YYYY. [gada] D. MMMM, dddd, HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Šodien pulksten] LT',
    	            nextDay: '[Rīt pulksten] LT',
    	            nextWeek: 'dddd [pulksten] LT',
    	            lastDay: '[Vakar pulksten] LT',
    	            lastWeek: '[Pagājušā] dddd [pulksten] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'pēc %s',
    	            past: 'pirms %s',
    	            s: relativeSeconds,
    	            ss: relativeTimeWithPlural$1,
    	            m: relativeTimeWithSingular,
    	            mm: relativeTimeWithPlural$1,
    	            h: relativeTimeWithSingular,
    	            hh: relativeTimeWithPlural$1,
    	            d: relativeTimeWithSingular,
    	            dd: relativeTimeWithPlural$1,
    	            M: relativeTimeWithSingular,
    	            MM: relativeTimeWithPlural$1,
    	            y: relativeTimeWithSingular,
    	            yy: relativeTimeWithPlural$1,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var translator = {
    	        words: {
    	            //Different grammatical cases
    	            ss: ['sekund', 'sekunda', 'sekundi'],
    	            m: ['jedan minut', 'jednog minuta'],
    	            mm: ['minut', 'minuta', 'minuta'],
    	            h: ['jedan sat', 'jednog sata'],
    	            hh: ['sat', 'sata', 'sati'],
    	            dd: ['dan', 'dana', 'dana'],
    	            MM: ['mjesec', 'mjeseca', 'mjeseci'],
    	            yy: ['godina', 'godine', 'godina'],
    	        },
    	        correctGrammaticalCase: function (number, wordKey) {
    	            return number === 1
    	                ? wordKey[0]
    	                : number >= 2 && number <= 4
    	                ? wordKey[1]
    	                : wordKey[2];
    	        },
    	        translate: function (number, withoutSuffix, key) {
    	            var wordKey = translator.words[key];
    	            if (key.length === 1) {
    	                return withoutSuffix ? wordKey[0] : wordKey[1];
    	            } else {
    	                return (
    	                    number +
    	                    ' ' +
    	                    translator.correctGrammaticalCase(number, wordKey)
    	                );
    	            }
    	        },
    	    };

    	    hooks.defineLocale('me', {
    	        months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    	        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[danas u] LT',
    	            nextDay: '[sjutra u] LT',

    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[u] [nedjelju] [u] LT';
    	                    case 3:
    	                        return '[u] [srijedu] [u] LT';
    	                    case 6:
    	                        return '[u] [subotu] [u] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[u] dddd [u] LT';
    	                }
    	            },
    	            lastDay: '[juče u] LT',
    	            lastWeek: function () {
    	                var lastWeekDays = [
    	                    '[prošle] [nedjelje] [u] LT',
    	                    '[prošlog] [ponedjeljka] [u] LT',
    	                    '[prošlog] [utorka] [u] LT',
    	                    '[prošle] [srijede] [u] LT',
    	                    '[prošlog] [četvrtka] [u] LT',
    	                    '[prošlog] [petka] [u] LT',
    	                    '[prošle] [subote] [u] LT',
    	                ];
    	                return lastWeekDays[this.day()];
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: 'prije %s',
    	            s: 'nekoliko sekundi',
    	            ss: translator.translate,
    	            m: translator.translate,
    	            mm: translator.translate,
    	            h: translator.translate,
    	            hh: translator.translate,
    	            d: 'dan',
    	            dd: translator.translate,
    	            M: 'mjesec',
    	            MM: translator.translate,
    	            y: 'godinu',
    	            yy: translator.translate,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('mi', {
    	        months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split(
    	                '_'
    	            ),
    	        monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    	        monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    	        monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    	        monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
    	        weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
    	        weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
    	        weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY [i] HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY [i] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[i teie mahana, i] LT',
    	            nextDay: '[apopo i] LT',
    	            nextWeek: 'dddd [i] LT',
    	            lastDay: '[inanahi i] LT',
    	            lastWeek: 'dddd [whakamutunga i] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'i roto i %s',
    	            past: '%s i mua',
    	            s: 'te hēkona ruarua',
    	            ss: '%d hēkona',
    	            m: 'he meneti',
    	            mm: '%d meneti',
    	            h: 'te haora',
    	            hh: '%d haora',
    	            d: 'he ra',
    	            dd: '%d ra',
    	            M: 'he marama',
    	            MM: '%d marama',
    	            y: 'he tau',
    	            yy: '%d tau',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('mk', {
    	        months: 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split(
    	            '_'
    	        ),
    	        monthsShort: 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
    	        weekdays: 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
    	        weekdaysMin: 'нe_пo_вт_ср_че_пе_сa'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'D.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY H:mm',
    	            LLLL: 'dddd, D MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Денес во] LT',
    	            nextDay: '[Утре во] LT',
    	            nextWeek: '[Во] dddd [во] LT',
    	            lastDay: '[Вчера во] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                    case 3:
    	                    case 6:
    	                        return '[Изминатата] dddd [во] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[Изминатиот] dddd [во] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'за %s',
    	            past: 'пред %s',
    	            s: 'неколку секунди',
    	            ss: '%d секунди',
    	            m: 'една минута',
    	            mm: '%d минути',
    	            h: 'еден час',
    	            hh: '%d часа',
    	            d: 'еден ден',
    	            dd: '%d дена',
    	            M: 'еден месец',
    	            MM: '%d месеци',
    	            y: 'една година',
    	            yy: '%d години',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
    	        ordinal: function (number) {
    	            var lastDigit = number % 10,
    	                last2Digits = number % 100;
    	            if (number === 0) {
    	                return number + '-ев';
    	            } else if (last2Digits === 0) {
    	                return number + '-ен';
    	            } else if (last2Digits > 10 && last2Digits < 20) {
    	                return number + '-ти';
    	            } else if (lastDigit === 1) {
    	                return number + '-ви';
    	            } else if (lastDigit === 2) {
    	                return number + '-ри';
    	            } else if (lastDigit === 7 || lastDigit === 8) {
    	                return number + '-ми';
    	            } else {
    	                return number + '-ти';
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ml', {
    	        months: 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays:
    	            'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
    	        weekdaysMin: 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm -നു',
    	            LTS: 'A h:mm:ss -നു',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm -നു',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm -നു',
    	        },
    	        calendar: {
    	            sameDay: '[ഇന്ന്] LT',
    	            nextDay: '[നാളെ] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[ഇന്നലെ] LT',
    	            lastWeek: '[കഴിഞ്ഞ] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s കഴിഞ്ഞ്',
    	            past: '%s മുൻപ്',
    	            s: 'അൽപ നിമിഷങ്ങൾ',
    	            ss: '%d സെക്കൻഡ്',
    	            m: 'ഒരു മിനിറ്റ്',
    	            mm: '%d മിനിറ്റ്',
    	            h: 'ഒരു മണിക്കൂർ',
    	            hh: '%d മണിക്കൂർ',
    	            d: 'ഒരു ദിവസം',
    	            dd: '%d ദിവസം',
    	            M: 'ഒരു മാസം',
    	            MM: '%d മാസം',
    	            y: 'ഒരു വർഷം',
    	            yy: '%d വർഷം',
    	        },
    	        meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (
    	                (meridiem === 'രാത്രി' && hour >= 4) ||
    	                meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
    	                meridiem === 'വൈകുന്നേരം'
    	            ) {
    	                return hour + 12;
    	            } else {
    	                return hour;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'രാത്രി';
    	            } else if (hour < 12) {
    	                return 'രാവിലെ';
    	            } else if (hour < 17) {
    	                return 'ഉച്ച കഴിഞ്ഞ്';
    	            } else if (hour < 20) {
    	                return 'വൈകുന്നേരം';
    	            } else {
    	                return 'രാത്രി';
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function translate$7(number, withoutSuffix, key, isFuture) {
    	        switch (key) {
    	            case 's':
    	                return withoutSuffix ? 'хэдхэн секунд' : 'хэдхэн секундын';
    	            case 'ss':
    	                return number + (withoutSuffix ? ' секунд' : ' секундын');
    	            case 'm':
    	            case 'mm':
    	                return number + (withoutSuffix ? ' минут' : ' минутын');
    	            case 'h':
    	            case 'hh':
    	                return number + (withoutSuffix ? ' цаг' : ' цагийн');
    	            case 'd':
    	            case 'dd':
    	                return number + (withoutSuffix ? ' өдөр' : ' өдрийн');
    	            case 'M':
    	            case 'MM':
    	                return number + (withoutSuffix ? ' сар' : ' сарын');
    	            case 'y':
    	            case 'yy':
    	                return number + (withoutSuffix ? ' жил' : ' жилийн');
    	            default:
    	                return number;
    	        }
    	    }

    	    hooks.defineLocale('mn', {
    	        months: 'Нэгдүгээр сар_Хоёрдугаар сар_Гуравдугаар сар_Дөрөвдүгээр сар_Тавдугаар сар_Зургадугаар сар_Долдугаар сар_Наймдугаар сар_Есдүгээр сар_Аравдугаар сар_Арван нэгдүгээр сар_Арван хоёрдугаар сар'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            '1 сар_2 сар_3 сар_4 сар_5 сар_6 сар_7 сар_8 сар_9 сар_10 сар_11 сар_12 сар'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба'.split('_'),
    	        weekdaysShort: 'Ням_Дав_Мяг_Лха_Пүр_Баа_Бям'.split('_'),
    	        weekdaysMin: 'Ня_Да_Мя_Лх_Пү_Ба_Бя'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: 'YYYY оны MMMMын D',
    	            LLL: 'YYYY оны MMMMын D HH:mm',
    	            LLLL: 'dddd, YYYY оны MMMMын D HH:mm',
    	        },
    	        meridiemParse: /ҮӨ|ҮХ/i,
    	        isPM: function (input) {
    	            return input === 'ҮХ';
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ҮӨ';
    	            } else {
    	                return 'ҮХ';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[Өнөөдөр] LT',
    	            nextDay: '[Маргааш] LT',
    	            nextWeek: '[Ирэх] dddd LT',
    	            lastDay: '[Өчигдөр] LT',
    	            lastWeek: '[Өнгөрсөн] dddd LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s дараа',
    	            past: '%s өмнө',
    	            s: translate$7,
    	            ss: translate$7,
    	            m: translate$7,
    	            mm: translate$7,
    	            h: translate$7,
    	            hh: translate$7,
    	            d: translate$7,
    	            dd: translate$7,
    	            M: translate$7,
    	            MM: translate$7,
    	            y: translate$7,
    	            yy: translate$7,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2} өдөр/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + ' өдөр';
    	                default:
    	                    return number;
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$c = {
    	            1: '१',
    	            2: '२',
    	            3: '३',
    	            4: '४',
    	            5: '५',
    	            6: '६',
    	            7: '७',
    	            8: '८',
    	            9: '९',
    	            0: '०',
    	        },
    	        numberMap$b = {
    	            '१': '1',
    	            '२': '2',
    	            '३': '3',
    	            '४': '4',
    	            '५': '5',
    	            '६': '6',
    	            '७': '7',
    	            '८': '8',
    	            '९': '9',
    	            '०': '0',
    	        };

    	    function relativeTimeMr(number, withoutSuffix, string, isFuture) {
    	        var output = '';
    	        if (withoutSuffix) {
    	            switch (string) {
    	                case 's':
    	                    output = 'काही सेकंद';
    	                    break;
    	                case 'ss':
    	                    output = '%d सेकंद';
    	                    break;
    	                case 'm':
    	                    output = 'एक मिनिट';
    	                    break;
    	                case 'mm':
    	                    output = '%d मिनिटे';
    	                    break;
    	                case 'h':
    	                    output = 'एक तास';
    	                    break;
    	                case 'hh':
    	                    output = '%d तास';
    	                    break;
    	                case 'd':
    	                    output = 'एक दिवस';
    	                    break;
    	                case 'dd':
    	                    output = '%d दिवस';
    	                    break;
    	                case 'M':
    	                    output = 'एक महिना';
    	                    break;
    	                case 'MM':
    	                    output = '%d महिने';
    	                    break;
    	                case 'y':
    	                    output = 'एक वर्ष';
    	                    break;
    	                case 'yy':
    	                    output = '%d वर्षे';
    	                    break;
    	            }
    	        } else {
    	            switch (string) {
    	                case 's':
    	                    output = 'काही सेकंदां';
    	                    break;
    	                case 'ss':
    	                    output = '%d सेकंदां';
    	                    break;
    	                case 'm':
    	                    output = 'एका मिनिटा';
    	                    break;
    	                case 'mm':
    	                    output = '%d मिनिटां';
    	                    break;
    	                case 'h':
    	                    output = 'एका तासा';
    	                    break;
    	                case 'hh':
    	                    output = '%d तासां';
    	                    break;
    	                case 'd':
    	                    output = 'एका दिवसा';
    	                    break;
    	                case 'dd':
    	                    output = '%d दिवसां';
    	                    break;
    	                case 'M':
    	                    output = 'एका महिन्या';
    	                    break;
    	                case 'MM':
    	                    output = '%d महिन्यां';
    	                    break;
    	                case 'y':
    	                    output = 'एका वर्षा';
    	                    break;
    	                case 'yy':
    	                    output = '%d वर्षां';
    	                    break;
    	            }
    	        }
    	        return output.replace(/%d/i, number);
    	    }

    	    hooks.defineLocale('mr', {
    	        months: 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    	        weekdaysShort: 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
    	        weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm वाजता',
    	            LTS: 'A h:mm:ss वाजता',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm वाजता',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm वाजता',
    	        },
    	        calendar: {
    	            sameDay: '[आज] LT',
    	            nextDay: '[उद्या] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[काल] LT',
    	            lastWeek: '[मागील] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%sमध्ये',
    	            past: '%sपूर्वी',
    	            s: relativeTimeMr,
    	            ss: relativeTimeMr,
    	            m: relativeTimeMr,
    	            mm: relativeTimeMr,
    	            h: relativeTimeMr,
    	            hh: relativeTimeMr,
    	            d: relativeTimeMr,
    	            dd: relativeTimeMr,
    	            M: relativeTimeMr,
    	            MM: relativeTimeMr,
    	            y: relativeTimeMr,
    	            yy: relativeTimeMr,
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[१२३४५६७८९०]/g, function (match) {
    	                return numberMap$b[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$c[match];
    	            });
    	        },
    	        meridiemParse: /पहाटे|सकाळी|दुपारी|सायंकाळी|रात्री/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'पहाटे' || meridiem === 'सकाळी') {
    	                return hour;
    	            } else if (
    	                meridiem === 'दुपारी' ||
    	                meridiem === 'सायंकाळी' ||
    	                meridiem === 'रात्री'
    	            ) {
    	                return hour >= 12 ? hour : hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour >= 0 && hour < 6) {
    	                return 'पहाटे';
    	            } else if (hour < 12) {
    	                return 'सकाळी';
    	            } else if (hour < 17) {
    	                return 'दुपारी';
    	            } else if (hour < 20) {
    	                return 'सायंकाळी';
    	            } else {
    	                return 'रात्री';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ms-my', {
    	        months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
    	        weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    	        weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    	        weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH.mm',
    	            LTS: 'HH.mm.ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY [pukul] HH.mm',
    	            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
    	        },
    	        meridiemParse: /pagi|tengahari|petang|malam/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'pagi') {
    	                return hour;
    	            } else if (meridiem === 'tengahari') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === 'petang' || meridiem === 'malam') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 11) {
    	                return 'pagi';
    	            } else if (hours < 15) {
    	                return 'tengahari';
    	            } else if (hours < 19) {
    	                return 'petang';
    	            } else {
    	                return 'malam';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[Hari ini pukul] LT',
    	            nextDay: '[Esok pukul] LT',
    	            nextWeek: 'dddd [pukul] LT',
    	            lastDay: '[Kelmarin pukul] LT',
    	            lastWeek: 'dddd [lepas pukul] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dalam %s',
    	            past: '%s yang lepas',
    	            s: 'beberapa saat',
    	            ss: '%d saat',
    	            m: 'seminit',
    	            mm: '%d minit',
    	            h: 'sejam',
    	            hh: '%d jam',
    	            d: 'sehari',
    	            dd: '%d hari',
    	            M: 'sebulan',
    	            MM: '%d bulan',
    	            y: 'setahun',
    	            yy: '%d tahun',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ms', {
    	        months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
    	        weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    	        weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    	        weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH.mm',
    	            LTS: 'HH.mm.ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY [pukul] HH.mm',
    	            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
    	        },
    	        meridiemParse: /pagi|tengahari|petang|malam/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'pagi') {
    	                return hour;
    	            } else if (meridiem === 'tengahari') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === 'petang' || meridiem === 'malam') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 11) {
    	                return 'pagi';
    	            } else if (hours < 15) {
    	                return 'tengahari';
    	            } else if (hours < 19) {
    	                return 'petang';
    	            } else {
    	                return 'malam';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[Hari ini pukul] LT',
    	            nextDay: '[Esok pukul] LT',
    	            nextWeek: 'dddd [pukul] LT',
    	            lastDay: '[Kelmarin pukul] LT',
    	            lastWeek: 'dddd [lepas pukul] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dalam %s',
    	            past: '%s yang lepas',
    	            s: 'beberapa saat',
    	            ss: '%d saat',
    	            m: 'seminit',
    	            mm: '%d minit',
    	            h: 'sejam',
    	            hh: '%d jam',
    	            d: 'sehari',
    	            dd: '%d hari',
    	            M: 'sebulan',
    	            MM: '%d bulan',
    	            y: 'setahun',
    	            yy: '%d tahun',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('mt', {
    	        months: 'Jannar_Frar_Marzu_April_Mejju_Ġunju_Lulju_Awwissu_Settembru_Ottubru_Novembru_Diċembru'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Fra_Mar_Apr_Mej_Ġun_Lul_Aww_Set_Ott_Nov_Diċ'.split('_'),
    	        weekdays:
    	            'Il-Ħadd_It-Tnejn_It-Tlieta_L-Erbgħa_Il-Ħamis_Il-Ġimgħa_Is-Sibt'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Ħad_Tne_Tli_Erb_Ħam_Ġim_Sib'.split('_'),
    	        weekdaysMin: 'Ħa_Tn_Tl_Er_Ħa_Ġi_Si'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Illum fil-]LT',
    	            nextDay: '[Għada fil-]LT',
    	            nextWeek: 'dddd [fil-]LT',
    	            lastDay: '[Il-bieraħ fil-]LT',
    	            lastWeek: 'dddd [li għadda] [fil-]LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'f’ %s',
    	            past: '%s ilu',
    	            s: 'ftit sekondi',
    	            ss: '%d sekondi',
    	            m: 'minuta',
    	            mm: '%d minuti',
    	            h: 'siegħa',
    	            hh: '%d siegħat',
    	            d: 'ġurnata',
    	            dd: '%d ġranet',
    	            M: 'xahar',
    	            MM: '%d xhur',
    	            y: 'sena',
    	            yy: '%d sni',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$d = {
    	            1: '၁',
    	            2: '၂',
    	            3: '၃',
    	            4: '၄',
    	            5: '၅',
    	            6: '၆',
    	            7: '၇',
    	            8: '၈',
    	            9: '၉',
    	            0: '၀',
    	        },
    	        numberMap$c = {
    	            '၁': '1',
    	            '၂': '2',
    	            '၃': '3',
    	            '၄': '4',
    	            '၅': '5',
    	            '၆': '6',
    	            '၇': '7',
    	            '၈': '8',
    	            '၉': '9',
    	            '၀': '0',
    	        };

    	    hooks.defineLocale('my', {
    	        months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split(
    	            '_'
    	        ),
    	        monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
    	        weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
    	        weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[ယနေ.] LT [မှာ]',
    	            nextDay: '[မနက်ဖြန်] LT [မှာ]',
    	            nextWeek: 'dddd LT [မှာ]',
    	            lastDay: '[မနေ.က] LT [မှာ]',
    	            lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'လာမည့် %s မှာ',
    	            past: 'လွန်ခဲ့သော %s က',
    	            s: 'စက္ကန်.အနည်းငယ်',
    	            ss: '%d စက္ကန့်',
    	            m: 'တစ်မိနစ်',
    	            mm: '%d မိနစ်',
    	            h: 'တစ်နာရီ',
    	            hh: '%d နာရီ',
    	            d: 'တစ်ရက်',
    	            dd: '%d ရက်',
    	            M: 'တစ်လ',
    	            MM: '%d လ',
    	            y: 'တစ်နှစ်',
    	            yy: '%d နှစ်',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
    	                return numberMap$c[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$d[match];
    	            });
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('nb', {
    	        months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
    	        weekdaysShort: 'sø._ma._ti._on._to._fr._lø.'.split('_'),
    	        weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY [kl.] HH:mm',
    	            LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[i dag kl.] LT',
    	            nextDay: '[i morgen kl.] LT',
    	            nextWeek: 'dddd [kl.] LT',
    	            lastDay: '[i går kl.] LT',
    	            lastWeek: '[forrige] dddd [kl.] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'om %s',
    	            past: '%s siden',
    	            s: 'noen sekunder',
    	            ss: '%d sekunder',
    	            m: 'ett minutt',
    	            mm: '%d minutter',
    	            h: 'en time',
    	            hh: '%d timer',
    	            d: 'en dag',
    	            dd: '%d dager',
    	            w: 'en uke',
    	            ww: '%d uker',
    	            M: 'en måned',
    	            MM: '%d måneder',
    	            y: 'ett år',
    	            yy: '%d år',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$e = {
    	            1: '१',
    	            2: '२',
    	            3: '३',
    	            4: '४',
    	            5: '५',
    	            6: '६',
    	            7: '७',
    	            8: '८',
    	            9: '९',
    	            0: '०',
    	        },
    	        numberMap$d = {
    	            '१': '1',
    	            '२': '2',
    	            '३': '3',
    	            '४': '4',
    	            '५': '5',
    	            '६': '6',
    	            '७': '7',
    	            '८': '8',
    	            '९': '9',
    	            '०': '0',
    	        };

    	    hooks.defineLocale('ne', {
    	        months: 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
    	        weekdaysMin: 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'Aको h:mm बजे',
    	            LTS: 'Aको h:mm:ss बजे',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, Aको h:mm बजे',
    	            LLLL: 'dddd, D MMMM YYYY, Aको h:mm बजे',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[१२३४५६७८९०]/g, function (match) {
    	                return numberMap$d[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$e[match];
    	            });
    	        },
    	        meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'राति') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'बिहान') {
    	                return hour;
    	            } else if (meridiem === 'दिउँसो') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else if (meridiem === 'साँझ') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 3) {
    	                return 'राति';
    	            } else if (hour < 12) {
    	                return 'बिहान';
    	            } else if (hour < 16) {
    	                return 'दिउँसो';
    	            } else if (hour < 20) {
    	                return 'साँझ';
    	            } else {
    	                return 'राति';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[आज] LT',
    	            nextDay: '[भोलि] LT',
    	            nextWeek: '[आउँदो] dddd[,] LT',
    	            lastDay: '[हिजो] LT',
    	            lastWeek: '[गएको] dddd[,] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%sमा',
    	            past: '%s अगाडि',
    	            s: 'केही क्षण',
    	            ss: '%d सेकेण्ड',
    	            m: 'एक मिनेट',
    	            mm: '%d मिनेट',
    	            h: 'एक घण्टा',
    	            hh: '%d घण्टा',
    	            d: 'एक दिन',
    	            dd: '%d दिन',
    	            M: 'एक महिना',
    	            MM: '%d महिना',
    	            y: 'एक बर्ष',
    	            yy: '%d बर्ष',
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortWithDots$1 =
    	            'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
    	        monthsShortWithoutDots$1 =
    	            'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    	        monthsParse$8 = [
    	            /^jan/i,
    	            /^feb/i,
    	            /^maart|mrt.?$/i,
    	            /^apr/i,
    	            /^mei$/i,
    	            /^jun[i.]?$/i,
    	            /^jul[i.]?$/i,
    	            /^aug/i,
    	            /^sep/i,
    	            /^okt/i,
    	            /^nov/i,
    	            /^dec/i,
    	        ],
    	        monthsRegex$8 =
    	            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    	    hooks.defineLocale('nl-be', {
    	        months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortWithDots$1;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShortWithoutDots$1[m.month()];
    	            } else {
    	                return monthsShortWithDots$1[m.month()];
    	            }
    	        },

    	        monthsRegex: monthsRegex$8,
    	        monthsShortRegex: monthsRegex$8,
    	        monthsStrictRegex:
    	            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
    	        monthsShortStrictRegex:
    	            /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

    	        monthsParse: monthsParse$8,
    	        longMonthsParse: monthsParse$8,
    	        shortMonthsParse: monthsParse$8,

    	        weekdays:
    	            'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    	        weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
    	        weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[vandaag om] LT',
    	            nextDay: '[morgen om] LT',
    	            nextWeek: 'dddd [om] LT',
    	            lastDay: '[gisteren om] LT',
    	            lastWeek: '[afgelopen] dddd [om] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'over %s',
    	            past: '%s geleden',
    	            s: 'een paar seconden',
    	            ss: '%d seconden',
    	            m: 'één minuut',
    	            mm: '%d minuten',
    	            h: 'één uur',
    	            hh: '%d uur',
    	            d: 'één dag',
    	            dd: '%d dagen',
    	            M: 'één maand',
    	            MM: '%d maanden',
    	            y: 'één jaar',
    	            yy: '%d jaar',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    	        ordinal: function (number) {
    	            return (
    	                number +
    	                (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de')
    	            );
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsShortWithDots$2 =
    	            'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
    	        monthsShortWithoutDots$2 =
    	            'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    	        monthsParse$9 = [
    	            /^jan/i,
    	            /^feb/i,
    	            /^maart|mrt.?$/i,
    	            /^apr/i,
    	            /^mei$/i,
    	            /^jun[i.]?$/i,
    	            /^jul[i.]?$/i,
    	            /^aug/i,
    	            /^sep/i,
    	            /^okt/i,
    	            /^nov/i,
    	            /^dec/i,
    	        ],
    	        monthsRegex$9 =
    	            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    	    hooks.defineLocale('nl', {
    	        months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split(
    	            '_'
    	        ),
    	        monthsShort: function (m, format) {
    	            if (!m) {
    	                return monthsShortWithDots$2;
    	            } else if (/-MMM-/.test(format)) {
    	                return monthsShortWithoutDots$2[m.month()];
    	            } else {
    	                return monthsShortWithDots$2[m.month()];
    	            }
    	        },

    	        monthsRegex: monthsRegex$9,
    	        monthsShortRegex: monthsRegex$9,
    	        monthsStrictRegex:
    	            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
    	        monthsShortStrictRegex:
    	            /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

    	        monthsParse: monthsParse$9,
    	        longMonthsParse: monthsParse$9,
    	        shortMonthsParse: monthsParse$9,

    	        weekdays:
    	            'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    	        weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
    	        weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD-MM-YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[vandaag om] LT',
    	            nextDay: '[morgen om] LT',
    	            nextWeek: 'dddd [om] LT',
    	            lastDay: '[gisteren om] LT',
    	            lastWeek: '[afgelopen] dddd [om] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'over %s',
    	            past: '%s geleden',
    	            s: 'een paar seconden',
    	            ss: '%d seconden',
    	            m: 'één minuut',
    	            mm: '%d minuten',
    	            h: 'één uur',
    	            hh: '%d uur',
    	            d: 'één dag',
    	            dd: '%d dagen',
    	            w: 'één week',
    	            ww: '%d weken',
    	            M: 'één maand',
    	            MM: '%d maanden',
    	            y: 'één jaar',
    	            yy: '%d jaar',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    	        ordinal: function (number) {
    	            return (
    	                number +
    	                (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de')
    	            );
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('nn', {
    	        months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays: 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
    	        weekdaysShort: 'su._må._ty._on._to._fr._lau.'.split('_'),
    	        weekdaysMin: 'su_må_ty_on_to_fr_la'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY [kl.] H:mm',
    	            LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[I dag klokka] LT',
    	            nextDay: '[I morgon klokka] LT',
    	            nextWeek: 'dddd [klokka] LT',
    	            lastDay: '[I går klokka] LT',
    	            lastWeek: '[Føregåande] dddd [klokka] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'om %s',
    	            past: '%s sidan',
    	            s: 'nokre sekund',
    	            ss: '%d sekund',
    	            m: 'eit minutt',
    	            mm: '%d minutt',
    	            h: 'ein time',
    	            hh: '%d timar',
    	            d: 'ein dag',
    	            dd: '%d dagar',
    	            w: 'ei veke',
    	            ww: '%d veker',
    	            M: 'ein månad',
    	            MM: '%d månader',
    	            y: 'eit år',
    	            yy: '%d år',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('oc-lnc', {
    	        months: {
    	            standalone:
    	                'genièr_febrièr_març_abril_mai_junh_julhet_agost_setembre_octòbre_novembre_decembre'.split(
    	                    '_'
    	                ),
    	            format: "de genièr_de febrièr_de març_d'abril_de mai_de junh_de julhet_d'agost_de setembre_d'octòbre_de novembre_de decembre".split(
    	                '_'
    	            ),
    	            isFormat: /D[oD]?(\s)+MMMM/,
    	        },
    	        monthsShort:
    	            'gen._febr._març_abr._mai_junh_julh._ago._set._oct._nov._dec.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'dimenge_diluns_dimars_dimècres_dijòus_divendres_dissabte'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'dg._dl._dm._dc._dj._dv._ds.'.split('_'),
    	        weekdaysMin: 'dg_dl_dm_dc_dj_dv_ds'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM [de] YYYY',
    	            ll: 'D MMM YYYY',
    	            LLL: 'D MMMM [de] YYYY [a] H:mm',
    	            lll: 'D MMM YYYY, H:mm',
    	            LLLL: 'dddd D MMMM [de] YYYY [a] H:mm',
    	            llll: 'ddd D MMM YYYY, H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[uèi a] LT',
    	            nextDay: '[deman a] LT',
    	            nextWeek: 'dddd [a] LT',
    	            lastDay: '[ièr a] LT',
    	            lastWeek: 'dddd [passat a] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: "d'aquí %s",
    	            past: 'fa %s',
    	            s: 'unas segondas',
    	            ss: '%d segondas',
    	            m: 'una minuta',
    	            mm: '%d minutas',
    	            h: 'una ora',
    	            hh: '%d oras',
    	            d: 'un jorn',
    	            dd: '%d jorns',
    	            M: 'un mes',
    	            MM: '%d meses',
    	            y: 'un an',
    	            yy: '%d ans',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
    	        ordinal: function (number, period) {
    	            var output =
    	                number === 1
    	                    ? 'r'
    	                    : number === 2
    	                    ? 'n'
    	                    : number === 3
    	                    ? 'r'
    	                    : number === 4
    	                    ? 't'
    	                    : 'è';
    	            if (period === 'w' || period === 'W') {
    	                output = 'a';
    	            }
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4,
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$f = {
    	            1: '੧',
    	            2: '੨',
    	            3: '੩',
    	            4: '੪',
    	            5: '੫',
    	            6: '੬',
    	            7: '੭',
    	            8: '੮',
    	            9: '੯',
    	            0: '੦',
    	        },
    	        numberMap$e = {
    	            '੧': '1',
    	            '੨': '2',
    	            '੩': '3',
    	            '੪': '4',
    	            '੫': '5',
    	            '੬': '6',
    	            '੭': '7',
    	            '੮': '8',
    	            '੯': '9',
    	            '੦': '0',
    	        };

    	    hooks.defineLocale('pa-in', {
    	        // There are months name as per Nanakshahi Calendar but they are not used as rigidly in modern Punjabi.
    	        months: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split(
    	                '_'
    	            ),
    	        weekdays: 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
    	        weekdaysMin: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm ਵਜੇ',
    	            LTS: 'A h:mm:ss ਵਜੇ',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm ਵਜੇ',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm ਵਜੇ',
    	        },
    	        calendar: {
    	            sameDay: '[ਅਜ] LT',
    	            nextDay: '[ਕਲ] LT',
    	            nextWeek: '[ਅਗਲਾ] dddd, LT',
    	            lastDay: '[ਕਲ] LT',
    	            lastWeek: '[ਪਿਛਲੇ] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s ਵਿੱਚ',
    	            past: '%s ਪਿਛਲੇ',
    	            s: 'ਕੁਝ ਸਕਿੰਟ',
    	            ss: '%d ਸਕਿੰਟ',
    	            m: 'ਇਕ ਮਿੰਟ',
    	            mm: '%d ਮਿੰਟ',
    	            h: 'ਇੱਕ ਘੰਟਾ',
    	            hh: '%d ਘੰਟੇ',
    	            d: 'ਇੱਕ ਦਿਨ',
    	            dd: '%d ਦਿਨ',
    	            M: 'ਇੱਕ ਮਹੀਨਾ',
    	            MM: '%d ਮਹੀਨੇ',
    	            y: 'ਇੱਕ ਸਾਲ',
    	            yy: '%d ਸਾਲ',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
    	                return numberMap$e[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$f[match];
    	            });
    	        },
    	        // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
    	        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
    	        meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'ਰਾਤ') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'ਸਵੇਰ') {
    	                return hour;
    	            } else if (meridiem === 'ਦੁਪਹਿਰ') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else if (meridiem === 'ਸ਼ਾਮ') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'ਰਾਤ';
    	            } else if (hour < 10) {
    	                return 'ਸਵੇਰ';
    	            } else if (hour < 17) {
    	                return 'ਦੁਪਹਿਰ';
    	            } else if (hour < 20) {
    	                return 'ਸ਼ਾਮ';
    	            } else {
    	                return 'ਰਾਤ';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var monthsNominative =
    	            'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split(
    	                '_'
    	            ),
    	        monthsSubjective =
    	            'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split(
    	                '_'
    	            ),
    	        monthsParse$a = [
    	            /^sty/i,
    	            /^lut/i,
    	            /^mar/i,
    	            /^kwi/i,
    	            /^maj/i,
    	            /^cze/i,
    	            /^lip/i,
    	            /^sie/i,
    	            /^wrz/i,
    	            /^paź/i,
    	            /^lis/i,
    	            /^gru/i,
    	        ];
    	    function plural$3(n) {
    	        return n % 10 < 5 && n % 10 > 1 && ~~(n / 10) % 10 !== 1;
    	    }
    	    function translate$8(number, withoutSuffix, key) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 'ss':
    	                return result + (plural$3(number) ? 'sekundy' : 'sekund');
    	            case 'm':
    	                return withoutSuffix ? 'minuta' : 'minutę';
    	            case 'mm':
    	                return result + (plural$3(number) ? 'minuty' : 'minut');
    	            case 'h':
    	                return withoutSuffix ? 'godzina' : 'godzinę';
    	            case 'hh':
    	                return result + (plural$3(number) ? 'godziny' : 'godzin');
    	            case 'ww':
    	                return result + (plural$3(number) ? 'tygodnie' : 'tygodni');
    	            case 'MM':
    	                return result + (plural$3(number) ? 'miesiące' : 'miesięcy');
    	            case 'yy':
    	                return result + (plural$3(number) ? 'lata' : 'lat');
    	        }
    	    }

    	    hooks.defineLocale('pl', {
    	        months: function (momentToFormat, format) {
    	            if (!momentToFormat) {
    	                return monthsNominative;
    	            } else if (/D MMMM/.test(format)) {
    	                return monthsSubjective[momentToFormat.month()];
    	            } else {
    	                return monthsNominative[momentToFormat.month()];
    	            }
    	        },
    	        monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    	        monthsParse: monthsParse$a,
    	        longMonthsParse: monthsParse$a,
    	        shortMonthsParse: monthsParse$a,
    	        weekdays:
    	            'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
    	        weekdaysShort: 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
    	        weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Dziś o] LT',
    	            nextDay: '[Jutro o] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[W niedzielę o] LT';

    	                    case 2:
    	                        return '[We wtorek o] LT';

    	                    case 3:
    	                        return '[W środę o] LT';

    	                    case 6:
    	                        return '[W sobotę o] LT';

    	                    default:
    	                        return '[W] dddd [o] LT';
    	                }
    	            },
    	            lastDay: '[Wczoraj o] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[W zeszłą niedzielę o] LT';
    	                    case 3:
    	                        return '[W zeszłą środę o] LT';
    	                    case 6:
    	                        return '[W zeszłą sobotę o] LT';
    	                    default:
    	                        return '[W zeszły] dddd [o] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: '%s temu',
    	            s: 'kilka sekund',
    	            ss: translate$8,
    	            m: translate$8,
    	            mm: translate$8,
    	            h: translate$8,
    	            hh: translate$8,
    	            d: '1 dzień',
    	            dd: '%d dni',
    	            w: 'tydzień',
    	            ww: translate$8,
    	            M: 'miesiąc',
    	            MM: translate$8,
    	            y: 'rok',
    	            yy: translate$8,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('pt-br', {
    	        months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
    	        weekdays:
    	            'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
    	        weekdaysMin: 'do_2ª_3ª_4ª_5ª_6ª_sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Hoje às] LT',
    	            nextDay: '[Amanhã às] LT',
    	            nextWeek: 'dddd [às] LT',
    	            lastDay: '[Ontem às] LT',
    	            lastWeek: function () {
    	                return this.day() === 0 || this.day() === 6
    	                    ? '[Último] dddd [às] LT' // Saturday + Sunday
    	                    : '[Última] dddd [às] LT'; // Monday - Friday
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'em %s',
    	            past: 'há %s',
    	            s: 'poucos segundos',
    	            ss: '%d segundos',
    	            m: 'um minuto',
    	            mm: '%d minutos',
    	            h: 'uma hora',
    	            hh: '%d horas',
    	            d: 'um dia',
    	            dd: '%d dias',
    	            M: 'um mês',
    	            MM: '%d meses',
    	            y: 'um ano',
    	            yy: '%d anos',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        invalidDate: 'Data inválida',
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('pt', {
    	        months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
    	        weekdays:
    	            'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    	        weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D [de] MMMM [de] YYYY',
    	            LLL: 'D [de] MMMM [de] YYYY HH:mm',
    	            LLLL: 'dddd, D [de] MMMM [de] YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Hoje às] LT',
    	            nextDay: '[Amanhã às] LT',
    	            nextWeek: 'dddd [às] LT',
    	            lastDay: '[Ontem às] LT',
    	            lastWeek: function () {
    	                return this.day() === 0 || this.day() === 6
    	                    ? '[Último] dddd [às] LT' // Saturday + Sunday
    	                    : '[Última] dddd [às] LT'; // Monday - Friday
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'em %s',
    	            past: 'há %s',
    	            s: 'segundos',
    	            ss: '%d segundos',
    	            m: 'um minuto',
    	            mm: '%d minutos',
    	            h: 'uma hora',
    	            hh: '%d horas',
    	            d: 'um dia',
    	            dd: '%d dias',
    	            w: 'uma semana',
    	            ww: '%d semanas',
    	            M: 'um mês',
    	            MM: '%d meses',
    	            y: 'um ano',
    	            yy: '%d anos',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}º/,
    	        ordinal: '%dº',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function relativeTimeWithPlural$2(number, withoutSuffix, key) {
    	        var format = {
    	                ss: 'secunde',
    	                mm: 'minute',
    	                hh: 'ore',
    	                dd: 'zile',
    	                ww: 'săptămâni',
    	                MM: 'luni',
    	                yy: 'ani',
    	            },
    	            separator = ' ';
    	        if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
    	            separator = ' de ';
    	        }
    	        return number + separator + format[key];
    	    }

    	    hooks.defineLocale('ro', {
    	        months: 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ian._feb._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
    	        weekdaysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
    	        weekdaysMin: 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY H:mm',
    	            LLLL: 'dddd, D MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[azi la] LT',
    	            nextDay: '[mâine la] LT',
    	            nextWeek: 'dddd [la] LT',
    	            lastDay: '[ieri la] LT',
    	            lastWeek: '[fosta] dddd [la] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'peste %s',
    	            past: '%s în urmă',
    	            s: 'câteva secunde',
    	            ss: relativeTimeWithPlural$2,
    	            m: 'un minut',
    	            mm: relativeTimeWithPlural$2,
    	            h: 'o oră',
    	            hh: relativeTimeWithPlural$2,
    	            d: 'o zi',
    	            dd: relativeTimeWithPlural$2,
    	            w: 'o săptămână',
    	            ww: relativeTimeWithPlural$2,
    	            M: 'o lună',
    	            MM: relativeTimeWithPlural$2,
    	            y: 'un an',
    	            yy: relativeTimeWithPlural$2,
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function plural$4(word, num) {
    	        var forms = word.split('_');
    	        return num % 10 === 1 && num % 100 !== 11
    	            ? forms[0]
    	            : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    	            ? forms[1]
    	            : forms[2];
    	    }
    	    function relativeTimeWithPlural$3(number, withoutSuffix, key) {
    	        var format = {
    	            ss: withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
    	            mm: withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
    	            hh: 'час_часа_часов',
    	            dd: 'день_дня_дней',
    	            ww: 'неделя_недели_недель',
    	            MM: 'месяц_месяца_месяцев',
    	            yy: 'год_года_лет',
    	        };
    	        if (key === 'm') {
    	            return withoutSuffix ? 'минута' : 'минуту';
    	        } else {
    	            return number + ' ' + plural$4(format[key], +number);
    	        }
    	    }
    	    var monthsParse$b = [
    	        /^янв/i,
    	        /^фев/i,
    	        /^мар/i,
    	        /^апр/i,
    	        /^ма[йя]/i,
    	        /^июн/i,
    	        /^июл/i,
    	        /^авг/i,
    	        /^сен/i,
    	        /^окт/i,
    	        /^ноя/i,
    	        /^дек/i,
    	    ];

    	    // http://new.gramota.ru/spravka/rules/139-prop : § 103
    	    // Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
    	    // CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
    	    hooks.defineLocale('ru', {
    	        months: {
    	            format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort: {
    	            // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку?
    	            format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split(
    	                    '_'
    	                ),
    	        },
    	        weekdays: {
    	            standalone:
    	                'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split(
    	                    '_'
    	                ),
    	            format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split(
    	                '_'
    	            ),
    	            isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?] ?dddd/,
    	        },
    	        weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    	        weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    	        monthsParse: monthsParse$b,
    	        longMonthsParse: monthsParse$b,
    	        shortMonthsParse: monthsParse$b,

    	        // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
    	        monthsRegex:
    	            /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    	        // копия предыдущего
    	        monthsShortRegex:
    	            /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    	        // полные названия с падежами
    	        monthsStrictRegex:
    	            /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

    	        // Выражение, которое соответствует только сокращённым формам
    	        monthsShortStrictRegex:
    	            /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY г.',
    	            LLL: 'D MMMM YYYY г., H:mm',
    	            LLLL: 'dddd, D MMMM YYYY г., H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Сегодня, в] LT',
    	            nextDay: '[Завтра, в] LT',
    	            lastDay: '[Вчера, в] LT',
    	            nextWeek: function (now) {
    	                if (now.week() !== this.week()) {
    	                    switch (this.day()) {
    	                        case 0:
    	                            return '[В следующее] dddd, [в] LT';
    	                        case 1:
    	                        case 2:
    	                        case 4:
    	                            return '[В следующий] dddd, [в] LT';
    	                        case 3:
    	                        case 5:
    	                        case 6:
    	                            return '[В следующую] dddd, [в] LT';
    	                    }
    	                } else {
    	                    if (this.day() === 2) {
    	                        return '[Во] dddd, [в] LT';
    	                    } else {
    	                        return '[В] dddd, [в] LT';
    	                    }
    	                }
    	            },
    	            lastWeek: function (now) {
    	                if (now.week() !== this.week()) {
    	                    switch (this.day()) {
    	                        case 0:
    	                            return '[В прошлое] dddd, [в] LT';
    	                        case 1:
    	                        case 2:
    	                        case 4:
    	                            return '[В прошлый] dddd, [в] LT';
    	                        case 3:
    	                        case 5:
    	                        case 6:
    	                            return '[В прошлую] dddd, [в] LT';
    	                    }
    	                } else {
    	                    if (this.day() === 2) {
    	                        return '[Во] dddd, [в] LT';
    	                    } else {
    	                        return '[В] dddd, [в] LT';
    	                    }
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'через %s',
    	            past: '%s назад',
    	            s: 'несколько секунд',
    	            ss: relativeTimeWithPlural$3,
    	            m: relativeTimeWithPlural$3,
    	            mm: relativeTimeWithPlural$3,
    	            h: 'час',
    	            hh: relativeTimeWithPlural$3,
    	            d: 'день',
    	            dd: relativeTimeWithPlural$3,
    	            w: 'неделя',
    	            ww: relativeTimeWithPlural$3,
    	            M: 'месяц',
    	            MM: relativeTimeWithPlural$3,
    	            y: 'год',
    	            yy: relativeTimeWithPlural$3,
    	        },
    	        meridiemParse: /ночи|утра|дня|вечера/i,
    	        isPM: function (input) {
    	            return /^(дня|вечера)$/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'ночи';
    	            } else if (hour < 12) {
    	                return 'утра';
    	            } else if (hour < 17) {
    	                return 'дня';
    	            } else {
    	                return 'вечера';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'M':
    	                case 'd':
    	                case 'DDD':
    	                    return number + '-й';
    	                case 'D':
    	                    return number + '-го';
    	                case 'w':
    	                case 'W':
    	                    return number + '-я';
    	                default:
    	                    return number;
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$9 = [
    	            'جنوري',
    	            'فيبروري',
    	            'مارچ',
    	            'اپريل',
    	            'مئي',
    	            'جون',
    	            'جولاءِ',
    	            'آگسٽ',
    	            'سيپٽمبر',
    	            'آڪٽوبر',
    	            'نومبر',
    	            'ڊسمبر',
    	        ],
    	        days$1 = ['آچر', 'سومر', 'اڱارو', 'اربع', 'خميس', 'جمع', 'ڇنڇر'];

    	    hooks.defineLocale('sd', {
    	        months: months$9,
    	        monthsShort: months$9,
    	        weekdays: days$1,
    	        weekdaysShort: days$1,
    	        weekdaysMin: days$1,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd، D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /صبح|شام/,
    	        isPM: function (input) {
    	            return 'شام' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'صبح';
    	            }
    	            return 'شام';
    	        },
    	        calendar: {
    	            sameDay: '[اڄ] LT',
    	            nextDay: '[سڀاڻي] LT',
    	            nextWeek: 'dddd [اڳين هفتي تي] LT',
    	            lastDay: '[ڪالهه] LT',
    	            lastWeek: '[گزريل هفتي] dddd [تي] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s پوء',
    	            past: '%s اڳ',
    	            s: 'چند سيڪنڊ',
    	            ss: '%d سيڪنڊ',
    	            m: 'هڪ منٽ',
    	            mm: '%d منٽ',
    	            h: 'هڪ ڪلاڪ',
    	            hh: '%d ڪلاڪ',
    	            d: 'هڪ ڏينهن',
    	            dd: '%d ڏينهن',
    	            M: 'هڪ مهينو',
    	            MM: '%d مهينا',
    	            y: 'هڪ سال',
    	            yy: '%d سال',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string.replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('se', {
    	        months: 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
    	        weekdays:
    	            'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
    	        weekdaysMin: 's_v_m_g_d_b_L'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'MMMM D. [b.] YYYY',
    	            LLL: 'MMMM D. [b.] YYYY [ti.] HH:mm',
    	            LLLL: 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[otne ti] LT',
    	            nextDay: '[ihttin ti] LT',
    	            nextWeek: 'dddd [ti] LT',
    	            lastDay: '[ikte ti] LT',
    	            lastWeek: '[ovddit] dddd [ti] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s geažes',
    	            past: 'maŋit %s',
    	            s: 'moadde sekunddat',
    	            ss: '%d sekunddat',
    	            m: 'okta minuhta',
    	            mm: '%d minuhtat',
    	            h: 'okta diimmu',
    	            hh: '%d diimmut',
    	            d: 'okta beaivi',
    	            dd: '%d beaivvit',
    	            M: 'okta mánnu',
    	            MM: '%d mánut',
    	            y: 'okta jahki',
    	            yy: '%d jagit',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    /*jshint -W100*/
    	    hooks.defineLocale('si', {
    	        months: 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split(
    	            '_'
    	        ),
    	        monthsShort: 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split(
    	            '_'
    	        ),
    	        weekdays:
    	            'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
    	        weekdaysMin: 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'a h:mm',
    	            LTS: 'a h:mm:ss',
    	            L: 'YYYY/MM/DD',
    	            LL: 'YYYY MMMM D',
    	            LLL: 'YYYY MMMM D, a h:mm',
    	            LLLL: 'YYYY MMMM D [වැනි] dddd, a h:mm:ss',
    	        },
    	        calendar: {
    	            sameDay: '[අද] LT[ට]',
    	            nextDay: '[හෙට] LT[ට]',
    	            nextWeek: 'dddd LT[ට]',
    	            lastDay: '[ඊයේ] LT[ට]',
    	            lastWeek: '[පසුගිය] dddd LT[ට]',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%sකින්',
    	            past: '%sකට පෙර',
    	            s: 'තත්පර කිහිපය',
    	            ss: 'තත්පර %d',
    	            m: 'මිනිත්තුව',
    	            mm: 'මිනිත්තු %d',
    	            h: 'පැය',
    	            hh: 'පැය %d',
    	            d: 'දිනය',
    	            dd: 'දින %d',
    	            M: 'මාසය',
    	            MM: 'මාස %d',
    	            y: 'වසර',
    	            yy: 'වසර %d',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
    	        ordinal: function (number) {
    	            return number + ' වැනි';
    	        },
    	        meridiemParse: /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
    	        isPM: function (input) {
    	            return input === 'ප.ව.' || input === 'පස් වරු';
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours > 11) {
    	                return isLower ? 'ප.ව.' : 'පස් වරු';
    	            } else {
    	                return isLower ? 'පෙ.ව.' : 'පෙර වරු';
    	            }
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$a =
    	            'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split(
    	                '_'
    	            ),
    	        monthsShort$7 = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
    	    function plural$5(n) {
    	        return n > 1 && n < 5;
    	    }
    	    function translate$9(number, withoutSuffix, key, isFuture) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 's': // a few seconds / in a few seconds / a few seconds ago
    	                return withoutSuffix || isFuture ? 'pár sekúnd' : 'pár sekundami';
    	            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$5(number) ? 'sekundy' : 'sekúnd');
    	                } else {
    	                    return result + 'sekundami';
    	                }
    	            case 'm': // a minute / in a minute / a minute ago
    	                return withoutSuffix ? 'minúta' : isFuture ? 'minútu' : 'minútou';
    	            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$5(number) ? 'minúty' : 'minút');
    	                } else {
    	                    return result + 'minútami';
    	                }
    	            case 'h': // an hour / in an hour / an hour ago
    	                return withoutSuffix ? 'hodina' : isFuture ? 'hodinu' : 'hodinou';
    	            case 'hh': // 9 hours / in 9 hours / 9 hours ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$5(number) ? 'hodiny' : 'hodín');
    	                } else {
    	                    return result + 'hodinami';
    	                }
    	            case 'd': // a day / in a day / a day ago
    	                return withoutSuffix || isFuture ? 'deň' : 'dňom';
    	            case 'dd': // 9 days / in 9 days / 9 days ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$5(number) ? 'dni' : 'dní');
    	                } else {
    	                    return result + 'dňami';
    	                }
    	            case 'M': // a month / in a month / a month ago
    	                return withoutSuffix || isFuture ? 'mesiac' : 'mesiacom';
    	            case 'MM': // 9 months / in 9 months / 9 months ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$5(number) ? 'mesiace' : 'mesiacov');
    	                } else {
    	                    return result + 'mesiacmi';
    	                }
    	            case 'y': // a year / in a year / a year ago
    	                return withoutSuffix || isFuture ? 'rok' : 'rokom';
    	            case 'yy': // 9 years / in 9 years / 9 years ago
    	                if (withoutSuffix || isFuture) {
    	                    return result + (plural$5(number) ? 'roky' : 'rokov');
    	                } else {
    	                    return result + 'rokmi';
    	                }
    	        }
    	    }

    	    hooks.defineLocale('sk', {
    	        months: months$a,
    	        monthsShort: monthsShort$7,
    	        weekdays: 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
    	        weekdaysShort: 'ne_po_ut_st_št_pi_so'.split('_'),
    	        weekdaysMin: 'ne_po_ut_st_št_pi_so'.split('_'),
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm',
    	            LLLL: 'dddd D. MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[dnes o] LT',
    	            nextDay: '[zajtra o] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[v nedeľu o] LT';
    	                    case 1:
    	                    case 2:
    	                        return '[v] dddd [o] LT';
    	                    case 3:
    	                        return '[v stredu o] LT';
    	                    case 4:
    	                        return '[vo štvrtok o] LT';
    	                    case 5:
    	                        return '[v piatok o] LT';
    	                    case 6:
    	                        return '[v sobotu o] LT';
    	                }
    	            },
    	            lastDay: '[včera o] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[minulú nedeľu o] LT';
    	                    case 1:
    	                    case 2:
    	                        return '[minulý] dddd [o] LT';
    	                    case 3:
    	                        return '[minulú stredu o] LT';
    	                    case 4:
    	                    case 5:
    	                        return '[minulý] dddd [o] LT';
    	                    case 6:
    	                        return '[minulú sobotu o] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: 'pred %s',
    	            s: translate$9,
    	            ss: translate$9,
    	            m: translate$9,
    	            mm: translate$9,
    	            h: translate$9,
    	            hh: translate$9,
    	            d: translate$9,
    	            dd: translate$9,
    	            M: translate$9,
    	            MM: translate$9,
    	            y: translate$9,
    	            yy: translate$9,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function processRelativeTime$7(number, withoutSuffix, key, isFuture) {
    	        var result = number + ' ';
    	        switch (key) {
    	            case 's':
    	                return withoutSuffix || isFuture
    	                    ? 'nekaj sekund'
    	                    : 'nekaj sekundami';
    	            case 'ss':
    	                if (number === 1) {
    	                    result += withoutSuffix ? 'sekundo' : 'sekundi';
    	                } else if (number === 2) {
    	                    result += withoutSuffix || isFuture ? 'sekundi' : 'sekundah';
    	                } else if (number < 5) {
    	                    result += withoutSuffix || isFuture ? 'sekunde' : 'sekundah';
    	                } else {
    	                    result += 'sekund';
    	                }
    	                return result;
    	            case 'm':
    	                return withoutSuffix ? 'ena minuta' : 'eno minuto';
    	            case 'mm':
    	                if (number === 1) {
    	                    result += withoutSuffix ? 'minuta' : 'minuto';
    	                } else if (number === 2) {
    	                    result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
    	                } else if (number < 5) {
    	                    result += withoutSuffix || isFuture ? 'minute' : 'minutami';
    	                } else {
    	                    result += withoutSuffix || isFuture ? 'minut' : 'minutami';
    	                }
    	                return result;
    	            case 'h':
    	                return withoutSuffix ? 'ena ura' : 'eno uro';
    	            case 'hh':
    	                if (number === 1) {
    	                    result += withoutSuffix ? 'ura' : 'uro';
    	                } else if (number === 2) {
    	                    result += withoutSuffix || isFuture ? 'uri' : 'urama';
    	                } else if (number < 5) {
    	                    result += withoutSuffix || isFuture ? 'ure' : 'urami';
    	                } else {
    	                    result += withoutSuffix || isFuture ? 'ur' : 'urami';
    	                }
    	                return result;
    	            case 'd':
    	                return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
    	            case 'dd':
    	                if (number === 1) {
    	                    result += withoutSuffix || isFuture ? 'dan' : 'dnem';
    	                } else if (number === 2) {
    	                    result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
    	                } else {
    	                    result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
    	                }
    	                return result;
    	            case 'M':
    	                return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
    	            case 'MM':
    	                if (number === 1) {
    	                    result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
    	                } else if (number === 2) {
    	                    result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
    	                } else if (number < 5) {
    	                    result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
    	                } else {
    	                    result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
    	                }
    	                return result;
    	            case 'y':
    	                return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
    	            case 'yy':
    	                if (number === 1) {
    	                    result += withoutSuffix || isFuture ? 'leto' : 'letom';
    	                } else if (number === 2) {
    	                    result += withoutSuffix || isFuture ? 'leti' : 'letoma';
    	                } else if (number < 5) {
    	                    result += withoutSuffix || isFuture ? 'leta' : 'leti';
    	                } else {
    	                    result += withoutSuffix || isFuture ? 'let' : 'leti';
    	                }
    	                return result;
    	        }
    	    }

    	    hooks.defineLocale('sl', {
    	        months: 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
    	        weekdaysShort: 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
    	        weekdaysMin: 'ne_po_to_sr_če_pe_so'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD. MM. YYYY',
    	            LL: 'D. MMMM YYYY',
    	            LLL: 'D. MMMM YYYY H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[danes ob] LT',
    	            nextDay: '[jutri ob] LT',

    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[v] [nedeljo] [ob] LT';
    	                    case 3:
    	                        return '[v] [sredo] [ob] LT';
    	                    case 6:
    	                        return '[v] [soboto] [ob] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[v] dddd [ob] LT';
    	                }
    	            },
    	            lastDay: '[včeraj ob] LT',
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[prejšnjo] [nedeljo] [ob] LT';
    	                    case 3:
    	                        return '[prejšnjo] [sredo] [ob] LT';
    	                    case 6:
    	                        return '[prejšnjo] [soboto] [ob] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[prejšnji] dddd [ob] LT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'čez %s',
    	            past: 'pred %s',
    	            s: processRelativeTime$7,
    	            ss: processRelativeTime$7,
    	            m: processRelativeTime$7,
    	            mm: processRelativeTime$7,
    	            h: processRelativeTime$7,
    	            hh: processRelativeTime$7,
    	            d: processRelativeTime$7,
    	            dd: processRelativeTime$7,
    	            M: processRelativeTime$7,
    	            MM: processRelativeTime$7,
    	            y: processRelativeTime$7,
    	            yy: processRelativeTime$7,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('sq', {
    	        months: 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
    	        weekdays: 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
    	        weekdaysMin: 'D_H_Ma_Më_E_P_Sh'.split('_'),
    	        weekdaysParseExact: true,
    	        meridiemParse: /PD|MD/,
    	        isPM: function (input) {
    	            return input.charAt(0) === 'M';
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            return hours < 12 ? 'PD' : 'MD';
    	        },
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Sot në] LT',
    	            nextDay: '[Nesër në] LT',
    	            nextWeek: 'dddd [në] LT',
    	            lastDay: '[Dje në] LT',
    	            lastWeek: 'dddd [e kaluar në] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'në %s',
    	            past: '%s më parë',
    	            s: 'disa sekonda',
    	            ss: '%d sekonda',
    	            m: 'një minutë',
    	            mm: '%d minuta',
    	            h: 'një orë',
    	            hh: '%d orë',
    	            d: 'një ditë',
    	            dd: '%d ditë',
    	            M: 'një muaj',
    	            MM: '%d muaj',
    	            y: 'një vit',
    	            yy: '%d vite',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var translator$1 = {
    	        words: {
    	            //Different grammatical cases
    	            ss: ['секунда', 'секунде', 'секунди'],
    	            m: ['један минут', 'једног минута'],
    	            mm: ['минут', 'минута', 'минута'],
    	            h: ['један сат', 'једног сата'],
    	            hh: ['сат', 'сата', 'сати'],
    	            d: ['један дан', 'једног дана'],
    	            dd: ['дан', 'дана', 'дана'],
    	            M: ['један месец', 'једног месеца'],
    	            MM: ['месец', 'месеца', 'месеци'],
    	            y: ['једну годину', 'једне године'],
    	            yy: ['годину', 'године', 'година'],
    	        },
    	        correctGrammaticalCase: function (number, wordKey) {
    	            if (
    	                number % 10 >= 1 &&
    	                number % 10 <= 4 &&
    	                (number % 100 < 10 || number % 100 >= 20)
    	            ) {
    	                return number % 10 === 1 ? wordKey[0] : wordKey[1];
    	            }
    	            return wordKey[2];
    	        },
    	        translate: function (number, withoutSuffix, key, isFuture) {
    	            var wordKey = translator$1.words[key],
    	                word;

    	            if (key.length === 1) {
    	                // Nominativ
    	                if (key === 'y' && withoutSuffix) return 'једна година';
    	                return isFuture || withoutSuffix ? wordKey[0] : wordKey[1];
    	            }

    	            word = translator$1.correctGrammaticalCase(number, wordKey);
    	            // Nominativ
    	            if (key === 'yy' && withoutSuffix && word === 'годину') {
    	                return number + ' година';
    	            }

    	            return number + ' ' + word;
    	        },
    	    };

    	    hooks.defineLocale('sr-cyrl', {
    	        months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
    	        weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
    	        weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'D. M. YYYY.',
    	            LL: 'D. MMMM YYYY.',
    	            LLL: 'D. MMMM YYYY. H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY. H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[данас у] LT',
    	            nextDay: '[сутра у] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[у] [недељу] [у] LT';
    	                    case 3:
    	                        return '[у] [среду] [у] LT';
    	                    case 6:
    	                        return '[у] [суботу] [у] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[у] dddd [у] LT';
    	                }
    	            },
    	            lastDay: '[јуче у] LT',
    	            lastWeek: function () {
    	                var lastWeekDays = [
    	                    '[прошле] [недеље] [у] LT',
    	                    '[прошлог] [понедељка] [у] LT',
    	                    '[прошлог] [уторка] [у] LT',
    	                    '[прошле] [среде] [у] LT',
    	                    '[прошлог] [четвртка] [у] LT',
    	                    '[прошлог] [петка] [у] LT',
    	                    '[прошле] [суботе] [у] LT',
    	                ];
    	                return lastWeekDays[this.day()];
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'за %s',
    	            past: 'пре %s',
    	            s: 'неколико секунди',
    	            ss: translator$1.translate,
    	            m: translator$1.translate,
    	            mm: translator$1.translate,
    	            h: translator$1.translate,
    	            hh: translator$1.translate,
    	            d: translator$1.translate,
    	            dd: translator$1.translate,
    	            M: translator$1.translate,
    	            MM: translator$1.translate,
    	            y: translator$1.translate,
    	            yy: translator$1.translate,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 1st is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var translator$2 = {
    	        words: {
    	            //Different grammatical cases
    	            ss: ['sekunda', 'sekunde', 'sekundi'],
    	            m: ['jedan minut', 'jednog minuta'],
    	            mm: ['minut', 'minuta', 'minuta'],
    	            h: ['jedan sat', 'jednog sata'],
    	            hh: ['sat', 'sata', 'sati'],
    	            d: ['jedan dan', 'jednog dana'],
    	            dd: ['dan', 'dana', 'dana'],
    	            M: ['jedan mesec', 'jednog meseca'],
    	            MM: ['mesec', 'meseca', 'meseci'],
    	            y: ['jednu godinu', 'jedne godine'],
    	            yy: ['godinu', 'godine', 'godina'],
    	        },
    	        correctGrammaticalCase: function (number, wordKey) {
    	            if (
    	                number % 10 >= 1 &&
    	                number % 10 <= 4 &&
    	                (number % 100 < 10 || number % 100 >= 20)
    	            ) {
    	                return number % 10 === 1 ? wordKey[0] : wordKey[1];
    	            }
    	            return wordKey[2];
    	        },
    	        translate: function (number, withoutSuffix, key, isFuture) {
    	            var wordKey = translator$2.words[key],
    	                word;

    	            if (key.length === 1) {
    	                // Nominativ
    	                if (key === 'y' && withoutSuffix) return 'jedna godina';
    	                return isFuture || withoutSuffix ? wordKey[0] : wordKey[1];
    	            }

    	            word = translator$2.correctGrammaticalCase(number, wordKey);
    	            // Nominativ
    	            if (key === 'yy' && withoutSuffix && word === 'godinu') {
    	                return number + ' godina';
    	            }

    	            return number + ' ' + word;
    	        },
    	    };

    	    hooks.defineLocale('sr', {
    	        months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
    	        monthsParseExact: true,
    	        weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
    	        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'D. M. YYYY.',
    	            LL: 'D. MMMM YYYY.',
    	            LLL: 'D. MMMM YYYY. H:mm',
    	            LLLL: 'dddd, D. MMMM YYYY. H:mm',
    	        },
    	        calendar: {
    	            sameDay: '[danas u] LT',
    	            nextDay: '[sutra u] LT',
    	            nextWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                        return '[u] [nedelju] [u] LT';
    	                    case 3:
    	                        return '[u] [sredu] [u] LT';
    	                    case 6:
    	                        return '[u] [subotu] [u] LT';
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                    case 5:
    	                        return '[u] dddd [u] LT';
    	                }
    	            },
    	            lastDay: '[juče u] LT',
    	            lastWeek: function () {
    	                var lastWeekDays = [
    	                    '[prošle] [nedelje] [u] LT',
    	                    '[prošlog] [ponedeljka] [u] LT',
    	                    '[prošlog] [utorka] [u] LT',
    	                    '[prošle] [srede] [u] LT',
    	                    '[prošlog] [četvrtka] [u] LT',
    	                    '[prošlog] [petka] [u] LT',
    	                    '[prošle] [subote] [u] LT',
    	                ];
    	                return lastWeekDays[this.day()];
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'za %s',
    	            past: 'pre %s',
    	            s: 'nekoliko sekundi',
    	            ss: translator$2.translate,
    	            m: translator$2.translate,
    	            mm: translator$2.translate,
    	            h: translator$2.translate,
    	            hh: translator$2.translate,
    	            d: translator$2.translate,
    	            dd: translator$2.translate,
    	            M: translator$2.translate,
    	            MM: translator$2.translate,
    	            y: translator$2.translate,
    	            yy: translator$2.translate,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ss', {
    	        months: "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split(
    	            '_'
    	        ),
    	        monthsShort: 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
    	        weekdays:
    	            'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
    	        weekdaysMin: 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY h:mm A',
    	            LLLL: 'dddd, D MMMM YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: '[Namuhla nga] LT',
    	            nextDay: '[Kusasa nga] LT',
    	            nextWeek: 'dddd [nga] LT',
    	            lastDay: '[Itolo nga] LT',
    	            lastWeek: 'dddd [leliphelile] [nga] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'nga %s',
    	            past: 'wenteka nga %s',
    	            s: 'emizuzwana lomcane',
    	            ss: '%d mzuzwana',
    	            m: 'umzuzu',
    	            mm: '%d emizuzu',
    	            h: 'lihora',
    	            hh: '%d emahora',
    	            d: 'lilanga',
    	            dd: '%d emalanga',
    	            M: 'inyanga',
    	            MM: '%d tinyanga',
    	            y: 'umnyaka',
    	            yy: '%d iminyaka',
    	        },
    	        meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 11) {
    	                return 'ekuseni';
    	            } else if (hours < 15) {
    	                return 'emini';
    	            } else if (hours < 19) {
    	                return 'entsambama';
    	            } else {
    	                return 'ebusuku';
    	            }
    	        },
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'ekuseni') {
    	                return hour;
    	            } else if (meridiem === 'emini') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
    	                if (hour === 0) {
    	                    return 0;
    	                }
    	                return hour + 12;
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}/,
    	        ordinal: '%d',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('sv', {
    	        months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split(
    	            '_'
    	        ),
    	        monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    	        weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
    	        weekdaysShort: 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
    	        weekdaysMin: 'sö_må_ti_on_to_fr_lö'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY [kl.] HH:mm',
    	            LLLL: 'dddd D MMMM YYYY [kl.] HH:mm',
    	            lll: 'D MMM YYYY HH:mm',
    	            llll: 'ddd D MMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Idag] LT',
    	            nextDay: '[Imorgon] LT',
    	            lastDay: '[Igår] LT',
    	            nextWeek: '[På] dddd LT',
    	            lastWeek: '[I] dddd[s] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'om %s',
    	            past: 'för %s sedan',
    	            s: 'några sekunder',
    	            ss: '%d sekunder',
    	            m: 'en minut',
    	            mm: '%d minuter',
    	            h: 'en timme',
    	            hh: '%d timmar',
    	            d: 'en dag',
    	            dd: '%d dagar',
    	            M: 'en månad',
    	            MM: '%d månader',
    	            y: 'ett år',
    	            yy: '%d år',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(\:e|\:a)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? ':e'
    	                        : b === 1
    	                        ? ':a'
    	                        : b === 2
    	                        ? ':a'
    	                        : b === 3
    	                        ? ':e'
    	                        : ':e';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('sw', {
    	        months: 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
    	        weekdays:
    	            'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
    	        weekdaysMin: 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'hh:mm A',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[leo saa] LT',
    	            nextDay: '[kesho saa] LT',
    	            nextWeek: '[wiki ijayo] dddd [saat] LT',
    	            lastDay: '[jana] LT',
    	            lastWeek: '[wiki iliyopita] dddd [saat] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s baadaye',
    	            past: 'tokea %s',
    	            s: 'hivi punde',
    	            ss: 'sekunde %d',
    	            m: 'dakika moja',
    	            mm: 'dakika %d',
    	            h: 'saa limoja',
    	            hh: 'masaa %d',
    	            d: 'siku moja',
    	            dd: 'siku %d',
    	            M: 'mwezi mmoja',
    	            MM: 'miezi %d',
    	            y: 'mwaka mmoja',
    	            yy: 'miaka %d',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var symbolMap$g = {
    	            1: '௧',
    	            2: '௨',
    	            3: '௩',
    	            4: '௪',
    	            5: '௫',
    	            6: '௬',
    	            7: '௭',
    	            8: '௮',
    	            9: '௯',
    	            0: '௦',
    	        },
    	        numberMap$f = {
    	            '௧': '1',
    	            '௨': '2',
    	            '௩': '3',
    	            '௪': '4',
    	            '௫': '5',
    	            '௬': '6',
    	            '௭': '7',
    	            '௮': '8',
    	            '௯': '9',
    	            '௦': '0',
    	        };

    	    hooks.defineLocale('ta', {
    	        months: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split(
    	                '_'
    	            ),
    	        weekdays:
    	            'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split(
    	            '_'
    	        ),
    	        weekdaysMin: 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY, HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[இன்று] LT',
    	            nextDay: '[நாளை] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[நேற்று] LT',
    	            lastWeek: '[கடந்த வாரம்] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s இல்',
    	            past: '%s முன்',
    	            s: 'ஒரு சில விநாடிகள்',
    	            ss: '%d விநாடிகள்',
    	            m: 'ஒரு நிமிடம்',
    	            mm: '%d நிமிடங்கள்',
    	            h: 'ஒரு மணி நேரம்',
    	            hh: '%d மணி நேரம்',
    	            d: 'ஒரு நாள்',
    	            dd: '%d நாட்கள்',
    	            M: 'ஒரு மாதம்',
    	            MM: '%d மாதங்கள்',
    	            y: 'ஒரு வருடம்',
    	            yy: '%d ஆண்டுகள்',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}வது/,
    	        ordinal: function (number) {
    	            return number + 'வது';
    	        },
    	        preparse: function (string) {
    	            return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
    	                return numberMap$f[match];
    	            });
    	        },
    	        postformat: function (string) {
    	            return string.replace(/\d/g, function (match) {
    	                return symbolMap$g[match];
    	            });
    	        },
    	        // refer http://ta.wikipedia.org/s/1er1
    	        meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 2) {
    	                return ' யாமம்';
    	            } else if (hour < 6) {
    	                return ' வைகறை'; // வைகறை
    	            } else if (hour < 10) {
    	                return ' காலை'; // காலை
    	            } else if (hour < 14) {
    	                return ' நண்பகல்'; // நண்பகல்
    	            } else if (hour < 18) {
    	                return ' எற்பாடு'; // எற்பாடு
    	            } else if (hour < 22) {
    	                return ' மாலை'; // மாலை
    	            } else {
    	                return ' யாமம்';
    	            }
    	        },
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'யாமம்') {
    	                return hour < 2 ? hour : hour + 12;
    	            } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
    	                return hour;
    	            } else if (meridiem === 'நண்பகல்') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else {
    	                return hour + 12;
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('te', {
    	        months: 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జులై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జులై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays:
    	            'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
    	        weekdaysMin: 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
    	        longDateFormat: {
    	            LT: 'A h:mm',
    	            LTS: 'A h:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY, A h:mm',
    	            LLLL: 'dddd, D MMMM YYYY, A h:mm',
    	        },
    	        calendar: {
    	            sameDay: '[నేడు] LT',
    	            nextDay: '[రేపు] LT',
    	            nextWeek: 'dddd, LT',
    	            lastDay: '[నిన్న] LT',
    	            lastWeek: '[గత] dddd, LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s లో',
    	            past: '%s క్రితం',
    	            s: 'కొన్ని క్షణాలు',
    	            ss: '%d సెకన్లు',
    	            m: 'ఒక నిమిషం',
    	            mm: '%d నిమిషాలు',
    	            h: 'ఒక గంట',
    	            hh: '%d గంటలు',
    	            d: 'ఒక రోజు',
    	            dd: '%d రోజులు',
    	            M: 'ఒక నెల',
    	            MM: '%d నెలలు',
    	            y: 'ఒక సంవత్సరం',
    	            yy: '%d సంవత్సరాలు',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}వ/,
    	        ordinal: '%dవ',
    	        meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'రాత్రి') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'ఉదయం') {
    	                return hour;
    	            } else if (meridiem === 'మధ్యాహ్నం') {
    	                return hour >= 10 ? hour : hour + 12;
    	            } else if (meridiem === 'సాయంత్రం') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'రాత్రి';
    	            } else if (hour < 10) {
    	                return 'ఉదయం';
    	            } else if (hour < 17) {
    	                return 'మధ్యాహ్నం';
    	            } else if (hour < 20) {
    	                return 'సాయంత్రం';
    	            } else {
    	                return 'రాత్రి';
    	            }
    	        },
    	        week: {
    	            dow: 0, // Sunday is the first day of the week.
    	            doy: 6, // The week that contains Jan 6th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('tet', {
    	        months: 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juñu_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    	        weekdays: 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu'.split('_'),
    	        weekdaysShort: 'Dom_Seg_Ters_Kua_Kint_Sest_Sab'.split('_'),
    	        weekdaysMin: 'Do_Seg_Te_Ku_Ki_Ses_Sa'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Ohin iha] LT',
    	            nextDay: '[Aban iha] LT',
    	            nextWeek: 'dddd [iha] LT',
    	            lastDay: '[Horiseik iha] LT',
    	            lastWeek: 'dddd [semana kotuk] [iha] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'iha %s',
    	            past: '%s liuba',
    	            s: 'segundu balun',
    	            ss: 'segundu %d',
    	            m: 'minutu ida',
    	            mm: 'minutu %d',
    	            h: 'oras ida',
    	            hh: 'oras %d',
    	            d: 'loron ida',
    	            dd: 'loron %d',
    	            M: 'fulan ida',
    	            MM: 'fulan %d',
    	            y: 'tinan ida',
    	            yy: 'tinan %d',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var suffixes$3 = {
    	        0: '-ум',
    	        1: '-ум',
    	        2: '-юм',
    	        3: '-юм',
    	        4: '-ум',
    	        5: '-ум',
    	        6: '-ум',
    	        7: '-ум',
    	        8: '-ум',
    	        9: '-ум',
    	        10: '-ум',
    	        12: '-ум',
    	        13: '-ум',
    	        20: '-ум',
    	        30: '-юм',
    	        40: '-ум',
    	        50: '-ум',
    	        60: '-ум',
    	        70: '-ум',
    	        80: '-ум',
    	        90: '-ум',
    	        100: '-ум',
    	    };

    	    hooks.defineLocale('tg', {
    	        months: {
    	            format: 'январи_феврали_марти_апрели_майи_июни_июли_августи_сентябри_октябри_ноябри_декабри'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
    	        weekdays: 'якшанбе_душанбе_сешанбе_чоршанбе_панҷшанбе_ҷумъа_шанбе'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'яшб_дшб_сшб_чшб_пшб_ҷум_шнб'.split('_'),
    	        weekdaysMin: 'яш_дш_сш_чш_пш_ҷм_шб'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Имрӯз соати] LT',
    	            nextDay: '[Фардо соати] LT',
    	            lastDay: '[Дирӯз соати] LT',
    	            nextWeek: 'dddd[и] [ҳафтаи оянда соати] LT',
    	            lastWeek: 'dddd[и] [ҳафтаи гузашта соати] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'баъди %s',
    	            past: '%s пеш',
    	            s: 'якчанд сония',
    	            m: 'як дақиқа',
    	            mm: '%d дақиқа',
    	            h: 'як соат',
    	            hh: '%d соат',
    	            d: 'як рӯз',
    	            dd: '%d рӯз',
    	            M: 'як моҳ',
    	            MM: '%d моҳ',
    	            y: 'як сол',
    	            yy: '%d сол',
    	        },
    	        meridiemParse: /шаб|субҳ|рӯз|бегоҳ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === 'шаб') {
    	                return hour < 4 ? hour : hour + 12;
    	            } else if (meridiem === 'субҳ') {
    	                return hour;
    	            } else if (meridiem === 'рӯз') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === 'бегоҳ') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'шаб';
    	            } else if (hour < 11) {
    	                return 'субҳ';
    	            } else if (hour < 16) {
    	                return 'рӯз';
    	            } else if (hour < 19) {
    	                return 'бегоҳ';
    	            } else {
    	                return 'шаб';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(ум|юм)/,
    	        ordinal: function (number) {
    	            var a = number % 10,
    	                b = number >= 100 ? 100 : null;
    	            return number + (suffixes$3[number] || suffixes$3[a] || suffixes$3[b]);
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 1th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('th', {
    	        months: 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
    	        weekdaysShort: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
    	        weekdaysMin: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'H:mm',
    	            LTS: 'H:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY เวลา H:mm',
    	            LLLL: 'วันddddที่ D MMMM YYYY เวลา H:mm',
    	        },
    	        meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
    	        isPM: function (input) {
    	            return input === 'หลังเที่ยง';
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'ก่อนเที่ยง';
    	            } else {
    	                return 'หลังเที่ยง';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[วันนี้ เวลา] LT',
    	            nextDay: '[พรุ่งนี้ เวลา] LT',
    	            nextWeek: 'dddd[หน้า เวลา] LT',
    	            lastDay: '[เมื่อวานนี้ เวลา] LT',
    	            lastWeek: '[วัน]dddd[ที่แล้ว เวลา] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'อีก %s',
    	            past: '%sที่แล้ว',
    	            s: 'ไม่กี่วินาที',
    	            ss: '%d วินาที',
    	            m: '1 นาที',
    	            mm: '%d นาที',
    	            h: '1 ชั่วโมง',
    	            hh: '%d ชั่วโมง',
    	            d: '1 วัน',
    	            dd: '%d วัน',
    	            w: '1 สัปดาห์',
    	            ww: '%d สัปดาห์',
    	            M: '1 เดือน',
    	            MM: '%d เดือน',
    	            y: '1 ปี',
    	            yy: '%d ปี',
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var suffixes$4 = {
    	        1: "'inji",
    	        5: "'inji",
    	        8: "'inji",
    	        70: "'inji",
    	        80: "'inji",
    	        2: "'nji",
    	        7: "'nji",
    	        20: "'nji",
    	        50: "'nji",
    	        3: "'ünji",
    	        4: "'ünji",
    	        100: "'ünji",
    	        6: "'njy",
    	        9: "'unjy",
    	        10: "'unjy",
    	        30: "'unjy",
    	        60: "'ynjy",
    	        90: "'ynjy",
    	    };

    	    hooks.defineLocale('tk', {
    	        months: 'Ýanwar_Fewral_Mart_Aprel_Maý_Iýun_Iýul_Awgust_Sentýabr_Oktýabr_Noýabr_Dekabr'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Ýan_Few_Mar_Apr_Maý_Iýn_Iýl_Awg_Sen_Okt_Noý_Dek'.split('_'),
    	        weekdays: 'Ýekşenbe_Duşenbe_Sişenbe_Çarşenbe_Penşenbe_Anna_Şenbe'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Ýek_Duş_Siş_Çar_Pen_Ann_Şen'.split('_'),
    	        weekdaysMin: 'Ýk_Dş_Sş_Çr_Pn_An_Şn'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[bugün sagat] LT',
    	            nextDay: '[ertir sagat] LT',
    	            nextWeek: '[indiki] dddd [sagat] LT',
    	            lastDay: '[düýn] LT',
    	            lastWeek: '[geçen] dddd [sagat] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s soň',
    	            past: '%s öň',
    	            s: 'birnäçe sekunt',
    	            m: 'bir minut',
    	            mm: '%d minut',
    	            h: 'bir sagat',
    	            hh: '%d sagat',
    	            d: 'bir gün',
    	            dd: '%d gün',
    	            M: 'bir aý',
    	            MM: '%d aý',
    	            y: 'bir ýyl',
    	            yy: '%d ýyl',
    	        },
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'Do':
    	                case 'DD':
    	                    return number;
    	                default:
    	                    if (number === 0) {
    	                        // special case for zero
    	                        return number + "'unjy";
    	                    }
    	                    var a = number % 10,
    	                        b = (number % 100) - a,
    	                        c = number >= 100 ? 100 : null;
    	                    return number + (suffixes$4[a] || suffixes$4[b] || suffixes$4[c]);
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('tl-ph', {
    	        months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
    	        weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
    	        weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'MM/D/YYYY',
    	            LL: 'MMMM D, YYYY',
    	            LLL: 'MMMM D, YYYY HH:mm',
    	            LLLL: 'dddd, MMMM DD, YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: 'LT [ngayong araw]',
    	            nextDay: '[Bukas ng] LT',
    	            nextWeek: 'LT [sa susunod na] dddd',
    	            lastDay: 'LT [kahapon]',
    	            lastWeek: 'LT [noong nakaraang] dddd',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'sa loob ng %s',
    	            past: '%s ang nakalipas',
    	            s: 'ilang segundo',
    	            ss: '%d segundo',
    	            m: 'isang minuto',
    	            mm: '%d minuto',
    	            h: 'isang oras',
    	            hh: '%d oras',
    	            d: 'isang araw',
    	            dd: '%d araw',
    	            M: 'isang buwan',
    	            MM: '%d buwan',
    	            y: 'isang taon',
    	            yy: '%d taon',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}/,
    	        ordinal: function (number) {
    	            return number;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

    	    function translateFuture(output) {
    	        var time = output;
    	        time =
    	            output.indexOf('jaj') !== -1
    	                ? time.slice(0, -3) + 'leS'
    	                : output.indexOf('jar') !== -1
    	                ? time.slice(0, -3) + 'waQ'
    	                : output.indexOf('DIS') !== -1
    	                ? time.slice(0, -3) + 'nem'
    	                : time + ' pIq';
    	        return time;
    	    }

    	    function translatePast(output) {
    	        var time = output;
    	        time =
    	            output.indexOf('jaj') !== -1
    	                ? time.slice(0, -3) + 'Hu’'
    	                : output.indexOf('jar') !== -1
    	                ? time.slice(0, -3) + 'wen'
    	                : output.indexOf('DIS') !== -1
    	                ? time.slice(0, -3) + 'ben'
    	                : time + ' ret';
    	        return time;
    	    }

    	    function translate$a(number, withoutSuffix, string, isFuture) {
    	        var numberNoun = numberAsNoun(number);
    	        switch (string) {
    	            case 'ss':
    	                return numberNoun + ' lup';
    	            case 'mm':
    	                return numberNoun + ' tup';
    	            case 'hh':
    	                return numberNoun + ' rep';
    	            case 'dd':
    	                return numberNoun + ' jaj';
    	            case 'MM':
    	                return numberNoun + ' jar';
    	            case 'yy':
    	                return numberNoun + ' DIS';
    	        }
    	    }

    	    function numberAsNoun(number) {
    	        var hundred = Math.floor((number % 1000) / 100),
    	            ten = Math.floor((number % 100) / 10),
    	            one = number % 10,
    	            word = '';
    	        if (hundred > 0) {
    	            word += numbersNouns[hundred] + 'vatlh';
    	        }
    	        if (ten > 0) {
    	            word += (word !== '' ? ' ' : '') + numbersNouns[ten] + 'maH';
    	        }
    	        if (one > 0) {
    	            word += (word !== '' ? ' ' : '') + numbersNouns[one];
    	        }
    	        return word === '' ? 'pagh' : word;
    	    }

    	    hooks.defineLocale('tlh', {
    	        months: 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split(
    	            '_'
    	        ),
    	        weekdaysShort:
    	            'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    	        weekdaysMin:
    	            'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[DaHjaj] LT',
    	            nextDay: '[wa’leS] LT',
    	            nextWeek: 'LLL',
    	            lastDay: '[wa’Hu’] LT',
    	            lastWeek: 'LLL',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: translateFuture,
    	            past: translatePast,
    	            s: 'puS lup',
    	            ss: translate$a,
    	            m: 'wa’ tup',
    	            mm: translate$a,
    	            h: 'wa’ rep',
    	            hh: translate$a,
    	            d: 'wa’ jaj',
    	            dd: translate$a,
    	            M: 'wa’ jar',
    	            MM: translate$a,
    	            y: 'wa’ DIS',
    	            yy: translate$a,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var suffixes$5 = {
    	        1: "'inci",
    	        5: "'inci",
    	        8: "'inci",
    	        70: "'inci",
    	        80: "'inci",
    	        2: "'nci",
    	        7: "'nci",
    	        20: "'nci",
    	        50: "'nci",
    	        3: "'üncü",
    	        4: "'üncü",
    	        100: "'üncü",
    	        6: "'ncı",
    	        9: "'uncu",
    	        10: "'uncu",
    	        30: "'uncu",
    	        60: "'ıncı",
    	        90: "'ıncı",
    	    };

    	    hooks.defineLocale('tr', {
    	        months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
    	        weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'Paz_Pzt_Sal_Çar_Per_Cum_Cmt'.split('_'),
    	        weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 12) {
    	                return isLower ? 'öö' : 'ÖÖ';
    	            } else {
    	                return isLower ? 'ös' : 'ÖS';
    	            }
    	        },
    	        meridiemParse: /öö|ÖÖ|ös|ÖS/,
    	        isPM: function (input) {
    	            return input === 'ös' || input === 'ÖS';
    	        },
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[bugün saat] LT',
    	            nextDay: '[yarın saat] LT',
    	            nextWeek: '[gelecek] dddd [saat] LT',
    	            lastDay: '[dün] LT',
    	            lastWeek: '[geçen] dddd [saat] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s sonra',
    	            past: '%s önce',
    	            s: 'birkaç saniye',
    	            ss: '%d saniye',
    	            m: 'bir dakika',
    	            mm: '%d dakika',
    	            h: 'bir saat',
    	            hh: '%d saat',
    	            d: 'bir gün',
    	            dd: '%d gün',
    	            w: 'bir hafta',
    	            ww: '%d hafta',
    	            M: 'bir ay',
    	            MM: '%d ay',
    	            y: 'bir yıl',
    	            yy: '%d yıl',
    	        },
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'Do':
    	                case 'DD':
    	                    return number;
    	                default:
    	                    if (number === 0) {
    	                        // special case for zero
    	                        return number + "'ıncı";
    	                    }
    	                    var a = number % 10,
    	                        b = (number % 100) - a,
    	                        c = number >= 100 ? 100 : null;
    	                    return number + (suffixes$5[a] || suffixes$5[b] || suffixes$5[c]);
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    // After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
    	    // This is currently too difficult (maybe even impossible) to add.
    	    hooks.defineLocale('tzl', {
    	        months: 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
    	        weekdays: 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
    	        weekdaysShort: 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
    	        weekdaysMin: 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH.mm',
    	            LTS: 'HH.mm.ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D. MMMM [dallas] YYYY',
    	            LLL: 'D. MMMM [dallas] YYYY HH.mm',
    	            LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm',
    	        },
    	        meridiemParse: /d\'o|d\'a/i,
    	        isPM: function (input) {
    	            return "d'o" === input.toLowerCase();
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours > 11) {
    	                return isLower ? "d'o" : "D'O";
    	            } else {
    	                return isLower ? "d'a" : "D'A";
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[oxhi à] LT',
    	            nextDay: '[demà à] LT',
    	            nextWeek: 'dddd [à] LT',
    	            lastDay: '[ieiri à] LT',
    	            lastWeek: '[sür el] dddd [lasteu à] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'osprei %s',
    	            past: 'ja%s',
    	            s: processRelativeTime$8,
    	            ss: processRelativeTime$8,
    	            m: processRelativeTime$8,
    	            mm: processRelativeTime$8,
    	            h: processRelativeTime$8,
    	            hh: processRelativeTime$8,
    	            d: processRelativeTime$8,
    	            dd: processRelativeTime$8,
    	            M: processRelativeTime$8,
    	            MM: processRelativeTime$8,
    	            y: processRelativeTime$8,
    	            yy: processRelativeTime$8,
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}\./,
    	        ordinal: '%d.',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    function processRelativeTime$8(number, withoutSuffix, key, isFuture) {
    	        var format = {
    	            s: ['viensas secunds', "'iensas secunds"],
    	            ss: [number + ' secunds', '' + number + ' secunds'],
    	            m: ["'n míut", "'iens míut"],
    	            mm: [number + ' míuts', '' + number + ' míuts'],
    	            h: ["'n þora", "'iensa þora"],
    	            hh: [number + ' þoras', '' + number + ' þoras'],
    	            d: ["'n ziua", "'iensa ziua"],
    	            dd: [number + ' ziuas', '' + number + ' ziuas'],
    	            M: ["'n mes", "'iens mes"],
    	            MM: [number + ' mesen', '' + number + ' mesen'],
    	            y: ["'n ar", "'iens ar"],
    	            yy: [number + ' ars', '' + number + ' ars'],
    	        };
    	        return isFuture
    	            ? format[key][0]
    	            : withoutSuffix
    	            ? format[key][0]
    	            : format[key][1];
    	    }

    	    //! moment.js locale configuration

    	    hooks.defineLocale('tzm-latn', {
    	        months: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split(
    	                '_'
    	            ),
    	        weekdays: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    	        weekdaysShort: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    	        weekdaysMin: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[asdkh g] LT',
    	            nextDay: '[aska g] LT',
    	            nextWeek: 'dddd [g] LT',
    	            lastDay: '[assant g] LT',
    	            lastWeek: 'dddd [g] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'dadkh s yan %s',
    	            past: 'yan %s',
    	            s: 'imik',
    	            ss: '%d imik',
    	            m: 'minuḍ',
    	            mm: '%d minuḍ',
    	            h: 'saɛa',
    	            hh: '%d tassaɛin',
    	            d: 'ass',
    	            dd: '%d ossan',
    	            M: 'ayowr',
    	            MM: '%d iyyirn',
    	            y: 'asgas',
    	            yy: '%d isgasn',
    	        },
    	        week: {
    	            dow: 6, // Saturday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('tzm', {
    	        months: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split(
    	                '_'
    	            ),
    	        weekdays: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    	        weekdaysShort: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    	        weekdaysMin: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
    	            nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
    	            nextWeek: 'dddd [ⴴ] LT',
    	            lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
    	            lastWeek: 'dddd [ⴴ] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
    	            past: 'ⵢⴰⵏ %s',
    	            s: 'ⵉⵎⵉⴽ',
    	            ss: '%d ⵉⵎⵉⴽ',
    	            m: 'ⵎⵉⵏⵓⴺ',
    	            mm: '%d ⵎⵉⵏⵓⴺ',
    	            h: 'ⵙⴰⵄⴰ',
    	            hh: '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
    	            d: 'ⴰⵙⵙ',
    	            dd: '%d oⵙⵙⴰⵏ',
    	            M: 'ⴰⵢoⵓⵔ',
    	            MM: '%d ⵉⵢⵢⵉⵔⵏ',
    	            y: 'ⴰⵙⴳⴰⵙ',
    	            yy: '%d ⵉⵙⴳⴰⵙⵏ',
    	        },
    	        week: {
    	            dow: 6, // Saturday is the first day of the week.
    	            doy: 12, // The week that contains Jan 12th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('ug-cn', {
    	        months: 'يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر'.split(
    	                '_'
    	            ),
    	        weekdays: 'يەكشەنبە_دۈشەنبە_سەيشەنبە_چارشەنبە_پەيشەنبە_جۈمە_شەنبە'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'يە_دۈ_سە_چا_پە_جۈ_شە'.split('_'),
    	        weekdaysMin: 'يە_دۈ_سە_چا_پە_جۈ_شە'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY-MM-DD',
    	            LL: 'YYYY-يىلىM-ئاينىڭD-كۈنى',
    	            LLL: 'YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
    	            LLLL: 'dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
    	        },
    	        meridiemParse: /يېرىم كېچە|سەھەر|چۈشتىن بۇرۇن|چۈش|چۈشتىن كېيىن|كەچ/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (
    	                meridiem === 'يېرىم كېچە' ||
    	                meridiem === 'سەھەر' ||
    	                meridiem === 'چۈشتىن بۇرۇن'
    	            ) {
    	                return hour;
    	            } else if (meridiem === 'چۈشتىن كېيىن' || meridiem === 'كەچ') {
    	                return hour + 12;
    	            } else {
    	                return hour >= 11 ? hour : hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            var hm = hour * 100 + minute;
    	            if (hm < 600) {
    	                return 'يېرىم كېچە';
    	            } else if (hm < 900) {
    	                return 'سەھەر';
    	            } else if (hm < 1130) {
    	                return 'چۈشتىن بۇرۇن';
    	            } else if (hm < 1230) {
    	                return 'چۈش';
    	            } else if (hm < 1800) {
    	                return 'چۈشتىن كېيىن';
    	            } else {
    	                return 'كەچ';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[بۈگۈن سائەت] LT',
    	            nextDay: '[ئەتە سائەت] LT',
    	            nextWeek: '[كېلەركى] dddd [سائەت] LT',
    	            lastDay: '[تۆنۈگۈن] LT',
    	            lastWeek: '[ئالدىنقى] dddd [سائەت] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s كېيىن',
    	            past: '%s بۇرۇن',
    	            s: 'نەچچە سېكونت',
    	            ss: '%d سېكونت',
    	            m: 'بىر مىنۇت',
    	            mm: '%d مىنۇت',
    	            h: 'بىر سائەت',
    	            hh: '%d سائەت',
    	            d: 'بىر كۈن',
    	            dd: '%d كۈن',
    	            M: 'بىر ئاي',
    	            MM: '%d ئاي',
    	            y: 'بىر يىل',
    	            yy: '%d يىل',
    	        },

    	        dayOfMonthOrdinalParse: /\d{1,2}(-كۈنى|-ئاي|-ھەپتە)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '-كۈنى';
    	                case 'w':
    	                case 'W':
    	                    return number + '-ھەپتە';
    	                default:
    	                    return number;
    	            }
    	        },
    	        preparse: function (string) {
    	            return string.replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string.replace(/,/g, '،');
    	        },
    	        week: {
    	            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 1st is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    function plural$6(word, num) {
    	        var forms = word.split('_');
    	        return num % 10 === 1 && num % 100 !== 11
    	            ? forms[0]
    	            : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    	            ? forms[1]
    	            : forms[2];
    	    }
    	    function relativeTimeWithPlural$4(number, withoutSuffix, key) {
    	        var format = {
    	            ss: withoutSuffix ? 'секунда_секунди_секунд' : 'секунду_секунди_секунд',
    	            mm: withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
    	            hh: withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
    	            dd: 'день_дні_днів',
    	            MM: 'місяць_місяці_місяців',
    	            yy: 'рік_роки_років',
    	        };
    	        if (key === 'm') {
    	            return withoutSuffix ? 'хвилина' : 'хвилину';
    	        } else if (key === 'h') {
    	            return withoutSuffix ? 'година' : 'годину';
    	        } else {
    	            return number + ' ' + plural$6(format[key], +number);
    	        }
    	    }
    	    function weekdaysCaseReplace(m, format) {
    	        var weekdays = {
    	                nominative:
    	                    'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split(
    	                        '_'
    	                    ),
    	                accusative:
    	                    'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split(
    	                        '_'
    	                    ),
    	                genitive:
    	                    'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split(
    	                        '_'
    	                    ),
    	            },
    	            nounCase;

    	        if (m === true) {
    	            return weekdays['nominative']
    	                .slice(1, 7)
    	                .concat(weekdays['nominative'].slice(0, 1));
    	        }
    	        if (!m) {
    	            return weekdays['nominative'];
    	        }

    	        nounCase = /(\[[ВвУу]\]) ?dddd/.test(format)
    	            ? 'accusative'
    	            : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(format)
    	            ? 'genitive'
    	            : 'nominative';
    	        return weekdays[nounCase][m.day()];
    	    }
    	    function processHoursFunction(str) {
    	        return function () {
    	            return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
    	        };
    	    }

    	    hooks.defineLocale('uk', {
    	        months: {
    	            format: 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split(
    	                '_'
    	            ),
    	            standalone:
    	                'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split(
    	                    '_'
    	                ),
    	        },
    	        monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split(
    	            '_'
    	        ),
    	        weekdays: weekdaysCaseReplace,
    	        weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    	        weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD.MM.YYYY',
    	            LL: 'D MMMM YYYY р.',
    	            LLL: 'D MMMM YYYY р., HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY р., HH:mm',
    	        },
    	        calendar: {
    	            sameDay: processHoursFunction('[Сьогодні '),
    	            nextDay: processHoursFunction('[Завтра '),
    	            lastDay: processHoursFunction('[Вчора '),
    	            nextWeek: processHoursFunction('[У] dddd ['),
    	            lastWeek: function () {
    	                switch (this.day()) {
    	                    case 0:
    	                    case 3:
    	                    case 5:
    	                    case 6:
    	                        return processHoursFunction('[Минулої] dddd [').call(this);
    	                    case 1:
    	                    case 2:
    	                    case 4:
    	                        return processHoursFunction('[Минулого] dddd [').call(this);
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'за %s',
    	            past: '%s тому',
    	            s: 'декілька секунд',
    	            ss: relativeTimeWithPlural$4,
    	            m: relativeTimeWithPlural$4,
    	            mm: relativeTimeWithPlural$4,
    	            h: 'годину',
    	            hh: relativeTimeWithPlural$4,
    	            d: 'день',
    	            dd: relativeTimeWithPlural$4,
    	            M: 'місяць',
    	            MM: relativeTimeWithPlural$4,
    	            y: 'рік',
    	            yy: relativeTimeWithPlural$4,
    	        },
    	        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
    	        meridiemParse: /ночі|ранку|дня|вечора/,
    	        isPM: function (input) {
    	            return /^(дня|вечора)$/.test(input);
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 4) {
    	                return 'ночі';
    	            } else if (hour < 12) {
    	                return 'ранку';
    	            } else if (hour < 17) {
    	                return 'дня';
    	            } else {
    	                return 'вечора';
    	            }
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'M':
    	                case 'd':
    	                case 'DDD':
    	                case 'w':
    	                case 'W':
    	                    return number + '-й';
    	                case 'D':
    	                    return number + '-го';
    	                default:
    	                    return number;
    	            }
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    var months$b = [
    	            'جنوری',
    	            'فروری',
    	            'مارچ',
    	            'اپریل',
    	            'مئی',
    	            'جون',
    	            'جولائی',
    	            'اگست',
    	            'ستمبر',
    	            'اکتوبر',
    	            'نومبر',
    	            'دسمبر',
    	        ],
    	        days$2 = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

    	    hooks.defineLocale('ur', {
    	        months: months$b,
    	        monthsShort: months$b,
    	        weekdays: days$2,
    	        weekdaysShort: days$2,
    	        weekdaysMin: days$2,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd، D MMMM YYYY HH:mm',
    	        },
    	        meridiemParse: /صبح|شام/,
    	        isPM: function (input) {
    	            return 'شام' === input;
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            if (hour < 12) {
    	                return 'صبح';
    	            }
    	            return 'شام';
    	        },
    	        calendar: {
    	            sameDay: '[آج بوقت] LT',
    	            nextDay: '[کل بوقت] LT',
    	            nextWeek: 'dddd [بوقت] LT',
    	            lastDay: '[گذشتہ روز بوقت] LT',
    	            lastWeek: '[گذشتہ] dddd [بوقت] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s بعد',
    	            past: '%s قبل',
    	            s: 'چند سیکنڈ',
    	            ss: '%d سیکنڈ',
    	            m: 'ایک منٹ',
    	            mm: '%d منٹ',
    	            h: 'ایک گھنٹہ',
    	            hh: '%d گھنٹے',
    	            d: 'ایک دن',
    	            dd: '%d دن',
    	            M: 'ایک ماہ',
    	            MM: '%d ماہ',
    	            y: 'ایک سال',
    	            yy: '%d سال',
    	        },
    	        preparse: function (string) {
    	            return string.replace(/،/g, ',');
    	        },
    	        postformat: function (string) {
    	            return string.replace(/,/g, '،');
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('uz-latn', {
    	        months: 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
    	        weekdays:
    	            'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
    	        weekdaysMin: 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'D MMMM YYYY, dddd HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Bugun soat] LT [da]',
    	            nextDay: '[Ertaga] LT [da]',
    	            nextWeek: 'dddd [kuni soat] LT [da]',
    	            lastDay: '[Kecha soat] LT [da]',
    	            lastWeek: "[O'tgan] dddd [kuni soat] LT [da]",
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'Yaqin %s ichida',
    	            past: 'Bir necha %s oldin',
    	            s: 'soniya',
    	            ss: '%d soniya',
    	            m: 'bir daqiqa',
    	            mm: '%d daqiqa',
    	            h: 'bir soat',
    	            hh: '%d soat',
    	            d: 'bir kun',
    	            dd: '%d kun',
    	            M: 'bir oy',
    	            MM: '%d oy',
    	            y: 'bir yil',
    	            yy: '%d yil',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 7th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('uz', {
    	        months: 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split(
    	            '_'
    	        ),
    	        monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
    	        weekdays: 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
    	        weekdaysShort: 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
    	        weekdaysMin: 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'D MMMM YYYY, dddd HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Бугун соат] LT [да]',
    	            nextDay: '[Эртага] LT [да]',
    	            nextWeek: 'dddd [куни соат] LT [да]',
    	            lastDay: '[Кеча соат] LT [да]',
    	            lastWeek: '[Утган] dddd [куни соат] LT [да]',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'Якин %s ичида',
    	            past: 'Бир неча %s олдин',
    	            s: 'фурсат',
    	            ss: '%d фурсат',
    	            m: 'бир дакика',
    	            mm: '%d дакика',
    	            h: 'бир соат',
    	            hh: '%d соат',
    	            d: 'бир кун',
    	            dd: '%d кун',
    	            M: 'бир ой',
    	            MM: '%d ой',
    	            y: 'бир йил',
    	            yy: '%d йил',
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 7, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('vi', {
    	        months: 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'Thg 01_Thg 02_Thg 03_Thg 04_Thg 05_Thg 06_Thg 07_Thg 08_Thg 09_Thg 10_Thg 11_Thg 12'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split(
    	            '_'
    	        ),
    	        weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    	        weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    	        weekdaysParseExact: true,
    	        meridiemParse: /sa|ch/i,
    	        isPM: function (input) {
    	            return /^ch$/i.test(input);
    	        },
    	        meridiem: function (hours, minutes, isLower) {
    	            if (hours < 12) {
    	                return isLower ? 'sa' : 'SA';
    	            } else {
    	                return isLower ? 'ch' : 'CH';
    	            }
    	        },
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM [năm] YYYY',
    	            LLL: 'D MMMM [năm] YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
    	            l: 'DD/M/YYYY',
    	            ll: 'D MMM YYYY',
    	            lll: 'D MMM YYYY HH:mm',
    	            llll: 'ddd, D MMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[Hôm nay lúc] LT',
    	            nextDay: '[Ngày mai lúc] LT',
    	            nextWeek: 'dddd [tuần tới lúc] LT',
    	            lastDay: '[Hôm qua lúc] LT',
    	            lastWeek: 'dddd [tuần trước lúc] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: '%s tới',
    	            past: '%s trước',
    	            s: 'vài giây',
    	            ss: '%d giây',
    	            m: 'một phút',
    	            mm: '%d phút',
    	            h: 'một giờ',
    	            hh: '%d giờ',
    	            d: 'một ngày',
    	            dd: '%d ngày',
    	            w: 'một tuần',
    	            ww: '%d tuần',
    	            M: 'một tháng',
    	            MM: '%d tháng',
    	            y: 'một năm',
    	            yy: '%d năm',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}/,
    	        ordinal: function (number) {
    	            return number;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('x-pseudo', {
    	        months: 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split(
    	            '_'
    	        ),
    	        monthsShort:
    	            'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split(
    	                '_'
    	            ),
    	        monthsParseExact: true,
    	        weekdays:
    	            'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split(
    	                '_'
    	            ),
    	        weekdaysShort: 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
    	        weekdaysMin: 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
    	        weekdaysParseExact: true,
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY HH:mm',
    	            LLLL: 'dddd, D MMMM YYYY HH:mm',
    	        },
    	        calendar: {
    	            sameDay: '[T~ódá~ý át] LT',
    	            nextDay: '[T~ómó~rró~w át] LT',
    	            nextWeek: 'dddd [át] LT',
    	            lastDay: '[Ý~ést~érdá~ý át] LT',
    	            lastWeek: '[L~ást] dddd [át] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'í~ñ %s',
    	            past: '%s á~gó',
    	            s: 'á ~féw ~sécó~ñds',
    	            ss: '%d s~écóñ~ds',
    	            m: 'á ~míñ~úté',
    	            mm: '%d m~íñú~tés',
    	            h: 'á~ñ hó~úr',
    	            hh: '%d h~óúrs',
    	            d: 'á ~dáý',
    	            dd: '%d d~áýs',
    	            M: 'á ~móñ~th',
    	            MM: '%d m~óñt~hs',
    	            y: 'á ~ýéár',
    	            yy: '%d ý~éárs',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    	        ordinal: function (number) {
    	            var b = number % 10,
    	                output =
    	                    ~~((number % 100) / 10) === 1
    	                        ? 'th'
    	                        : b === 1
    	                        ? 'st'
    	                        : b === 2
    	                        ? 'nd'
    	                        : b === 3
    	                        ? 'rd'
    	                        : 'th';
    	            return number + output;
    	        },
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('yo', {
    	        months: 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split(
    	            '_'
    	        ),
    	        monthsShort: 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
    	        weekdays: 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
    	        weekdaysShort: 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
    	        weekdaysMin: 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
    	        longDateFormat: {
    	            LT: 'h:mm A',
    	            LTS: 'h:mm:ss A',
    	            L: 'DD/MM/YYYY',
    	            LL: 'D MMMM YYYY',
    	            LLL: 'D MMMM YYYY h:mm A',
    	            LLLL: 'dddd, D MMMM YYYY h:mm A',
    	        },
    	        calendar: {
    	            sameDay: '[Ònì ni] LT',
    	            nextDay: '[Ọ̀la ni] LT',
    	            nextWeek: "dddd [Ọsẹ̀ tón'bọ] [ni] LT",
    	            lastDay: '[Àna ni] LT',
    	            lastWeek: 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
    	            sameElse: 'L',
    	        },
    	        relativeTime: {
    	            future: 'ní %s',
    	            past: '%s kọjá',
    	            s: 'ìsẹjú aayá die',
    	            ss: 'aayá %d',
    	            m: 'ìsẹjú kan',
    	            mm: 'ìsẹjú %d',
    	            h: 'wákati kan',
    	            hh: 'wákati %d',
    	            d: 'ọjọ́ kan',
    	            dd: 'ọjọ́ %d',
    	            M: 'osù kan',
    	            MM: 'osù %d',
    	            y: 'ọdún kan',
    	            yy: 'ọdún %d',
    	        },
    	        dayOfMonthOrdinalParse: /ọjọ́\s\d{1,2}/,
    	        ordinal: 'ọjọ́ %d',
    	        week: {
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('zh-cn', {
    	        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    	            '_'
    	        ),
    	        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    	            '_'
    	        ),
    	        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    	        weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    	        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY/MM/DD',
    	            LL: 'YYYY年M月D日',
    	            LLL: 'YYYY年M月D日Ah点mm分',
    	            LLLL: 'YYYY年M月D日ddddAh点mm分',
    	            l: 'YYYY/M/D',
    	            ll: 'YYYY年M月D日',
    	            lll: 'YYYY年M月D日 HH:mm',
    	            llll: 'YYYY年M月D日dddd HH:mm',
    	        },
    	        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
    	                return hour;
    	            } else if (meridiem === '下午' || meridiem === '晚上') {
    	                return hour + 12;
    	            } else {
    	                // '中午'
    	                return hour >= 11 ? hour : hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            var hm = hour * 100 + minute;
    	            if (hm < 600) {
    	                return '凌晨';
    	            } else if (hm < 900) {
    	                return '早上';
    	            } else if (hm < 1130) {
    	                return '上午';
    	            } else if (hm < 1230) {
    	                return '中午';
    	            } else if (hm < 1800) {
    	                return '下午';
    	            } else {
    	                return '晚上';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[今天]LT',
    	            nextDay: '[明天]LT',
    	            nextWeek: function (now) {
    	                if (now.week() !== this.week()) {
    	                    return '[下]dddLT';
    	                } else {
    	                    return '[本]dddLT';
    	                }
    	            },
    	            lastDay: '[昨天]LT',
    	            lastWeek: function (now) {
    	                if (this.week() !== now.week()) {
    	                    return '[上]dddLT';
    	                } else {
    	                    return '[本]dddLT';
    	                }
    	            },
    	            sameElse: 'L',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '日';
    	                case 'M':
    	                    return number + '月';
    	                case 'w':
    	                case 'W':
    	                    return number + '周';
    	                default:
    	                    return number;
    	            }
    	        },
    	        relativeTime: {
    	            future: '%s后',
    	            past: '%s前',
    	            s: '几秒',
    	            ss: '%d 秒',
    	            m: '1 分钟',
    	            mm: '%d 分钟',
    	            h: '1 小时',
    	            hh: '%d 小时',
    	            d: '1 天',
    	            dd: '%d 天',
    	            w: '1 周',
    	            ww: '%d 周',
    	            M: '1 个月',
    	            MM: '%d 个月',
    	            y: '1 年',
    	            yy: '%d 年',
    	        },
    	        week: {
    	            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    	            dow: 1, // Monday is the first day of the week.
    	            doy: 4, // The week that contains Jan 4th is the first week of the year.
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('zh-hk', {
    	        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    	            '_'
    	        ),
    	        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    	            '_'
    	        ),
    	        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    	        weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    	        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY/MM/DD',
    	            LL: 'YYYY年M月D日',
    	            LLL: 'YYYY年M月D日 HH:mm',
    	            LLLL: 'YYYY年M月D日dddd HH:mm',
    	            l: 'YYYY/M/D',
    	            ll: 'YYYY年M月D日',
    	            lll: 'YYYY年M月D日 HH:mm',
    	            llll: 'YYYY年M月D日dddd HH:mm',
    	        },
    	        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
    	                return hour;
    	            } else if (meridiem === '中午') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === '下午' || meridiem === '晚上') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            var hm = hour * 100 + minute;
    	            if (hm < 600) {
    	                return '凌晨';
    	            } else if (hm < 900) {
    	                return '早上';
    	            } else if (hm < 1200) {
    	                return '上午';
    	            } else if (hm === 1200) {
    	                return '中午';
    	            } else if (hm < 1800) {
    	                return '下午';
    	            } else {
    	                return '晚上';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[今天]LT',
    	            nextDay: '[明天]LT',
    	            nextWeek: '[下]ddddLT',
    	            lastDay: '[昨天]LT',
    	            lastWeek: '[上]ddddLT',
    	            sameElse: 'L',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '日';
    	                case 'M':
    	                    return number + '月';
    	                case 'w':
    	                case 'W':
    	                    return number + '週';
    	                default:
    	                    return number;
    	            }
    	        },
    	        relativeTime: {
    	            future: '%s後',
    	            past: '%s前',
    	            s: '幾秒',
    	            ss: '%d 秒',
    	            m: '1 分鐘',
    	            mm: '%d 分鐘',
    	            h: '1 小時',
    	            hh: '%d 小時',
    	            d: '1 天',
    	            dd: '%d 天',
    	            M: '1 個月',
    	            MM: '%d 個月',
    	            y: '1 年',
    	            yy: '%d 年',
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('zh-mo', {
    	        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    	            '_'
    	        ),
    	        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    	            '_'
    	        ),
    	        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    	        weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    	        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'DD/MM/YYYY',
    	            LL: 'YYYY年M月D日',
    	            LLL: 'YYYY年M月D日 HH:mm',
    	            LLLL: 'YYYY年M月D日dddd HH:mm',
    	            l: 'D/M/YYYY',
    	            ll: 'YYYY年M月D日',
    	            lll: 'YYYY年M月D日 HH:mm',
    	            llll: 'YYYY年M月D日dddd HH:mm',
    	        },
    	        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
    	                return hour;
    	            } else if (meridiem === '中午') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === '下午' || meridiem === '晚上') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            var hm = hour * 100 + minute;
    	            if (hm < 600) {
    	                return '凌晨';
    	            } else if (hm < 900) {
    	                return '早上';
    	            } else if (hm < 1130) {
    	                return '上午';
    	            } else if (hm < 1230) {
    	                return '中午';
    	            } else if (hm < 1800) {
    	                return '下午';
    	            } else {
    	                return '晚上';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[今天] LT',
    	            nextDay: '[明天] LT',
    	            nextWeek: '[下]dddd LT',
    	            lastDay: '[昨天] LT',
    	            lastWeek: '[上]dddd LT',
    	            sameElse: 'L',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '日';
    	                case 'M':
    	                    return number + '月';
    	                case 'w':
    	                case 'W':
    	                    return number + '週';
    	                default:
    	                    return number;
    	            }
    	        },
    	        relativeTime: {
    	            future: '%s內',
    	            past: '%s前',
    	            s: '幾秒',
    	            ss: '%d 秒',
    	            m: '1 分鐘',
    	            mm: '%d 分鐘',
    	            h: '1 小時',
    	            hh: '%d 小時',
    	            d: '1 天',
    	            dd: '%d 天',
    	            M: '1 個月',
    	            MM: '%d 個月',
    	            y: '1 年',
    	            yy: '%d 年',
    	        },
    	    });

    	    //! moment.js locale configuration

    	    hooks.defineLocale('zh-tw', {
    	        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    	            '_'
    	        ),
    	        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    	            '_'
    	        ),
    	        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    	        weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    	        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    	        longDateFormat: {
    	            LT: 'HH:mm',
    	            LTS: 'HH:mm:ss',
    	            L: 'YYYY/MM/DD',
    	            LL: 'YYYY年M月D日',
    	            LLL: 'YYYY年M月D日 HH:mm',
    	            LLLL: 'YYYY年M月D日dddd HH:mm',
    	            l: 'YYYY/M/D',
    	            ll: 'YYYY年M月D日',
    	            lll: 'YYYY年M月D日 HH:mm',
    	            llll: 'YYYY年M月D日dddd HH:mm',
    	        },
    	        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    	        meridiemHour: function (hour, meridiem) {
    	            if (hour === 12) {
    	                hour = 0;
    	            }
    	            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
    	                return hour;
    	            } else if (meridiem === '中午') {
    	                return hour >= 11 ? hour : hour + 12;
    	            } else if (meridiem === '下午' || meridiem === '晚上') {
    	                return hour + 12;
    	            }
    	        },
    	        meridiem: function (hour, minute, isLower) {
    	            var hm = hour * 100 + minute;
    	            if (hm < 600) {
    	                return '凌晨';
    	            } else if (hm < 900) {
    	                return '早上';
    	            } else if (hm < 1130) {
    	                return '上午';
    	            } else if (hm < 1230) {
    	                return '中午';
    	            } else if (hm < 1800) {
    	                return '下午';
    	            } else {
    	                return '晚上';
    	            }
    	        },
    	        calendar: {
    	            sameDay: '[今天] LT',
    	            nextDay: '[明天] LT',
    	            nextWeek: '[下]dddd LT',
    	            lastDay: '[昨天] LT',
    	            lastWeek: '[上]dddd LT',
    	            sameElse: 'L',
    	        },
    	        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    	        ordinal: function (number, period) {
    	            switch (period) {
    	                case 'd':
    	                case 'D':
    	                case 'DDD':
    	                    return number + '日';
    	                case 'M':
    	                    return number + '月';
    	                case 'w':
    	                case 'W':
    	                    return number + '週';
    	                default:
    	                    return number;
    	            }
    	        },
    	        relativeTime: {
    	            future: '%s後',
    	            past: '%s前',
    	            s: '幾秒',
    	            ss: '%d 秒',
    	            m: '1 分鐘',
    	            mm: '%d 分鐘',
    	            h: '1 小時',
    	            hh: '%d 小時',
    	            d: '1 天',
    	            dd: '%d 天',
    	            M: '1 個月',
    	            MM: '%d 個月',
    	            y: '1 年',
    	            yy: '%d 年',
    	        },
    	    });

    	    hooks.locale('en');

    	    return hooks;

    	})));
    } (momentWithLocales));

    var moment = momentWithLocalesExports;

    const host = "localhost";
    const protocol = "http";
    const port = "9000";
    const serverhost = protocol + "://" + host + ":" + port;
    const ismainmenu = writable(true);
    const issubmenu = writable(true);
    const isLogin = writable(false);

    const isLogincookie = async () => {
      let url = serverhost + "/api/user/logincookie";
      let data = await axios$1({
        method: "post",
        url: url,
        withCredentials: true,
      });
      isLogin.set(true);
      if (!data.data) {
        location.href = "#/account/signin";
        isLogin.set(false);
      }
    };

    const logOut = async () => {
      let url = serverhost + "/api/user/logout";
      await axios$1({ method: "post", url: url, withCredentials: true });
      isLogin.set(false);
      location.href = "#/";
      location.reload();
    };

    /* src/routes/admin/sitelist/Sitelist.svelte generated by Svelte v3.55.1 */
    const file$b = "src/routes/admin/sitelist/Sitelist.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import axios from "axios";   import moment from "moment/min/moment-with-locales";    import { serverhost }
    function create_catch_block$1(ctx) {
    	const block = { c: noop$1, m: noop$1, p: noop$1, d: noop$1 };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>   import axios from \\\"axios\\\";   import moment from \\\"moment/min/moment-with-locales\\\";    import { serverhost }",
    		ctx
    	});

    	return block;
    }

    // (34:23)    <div class="box">     <div class="w675px">       <div class="text-right">         <input type="button" value="N E W" on:click={() => newitem()}
    function create_then_block$1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let input;
    	let t0;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t2;
    	let th1;
    	let t4;
    	let th2;
    	let t6;
    	let th3;
    	let t8;
    	let th4;
    	let t10;
    	let th5;
    	let t12;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "chk";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "id";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "name";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "domain";
    			t8 = space();
    			th4 = element("th");
    			th4.textContent = "boardpath";
    			t10 = space();
    			th5 = element("th");
    			th5.textContent = "createdate";
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "button");
    			input.value = "N E W";
    			attr_dev(input, "class", "svelte-ja5frq");
    			add_location(input, file$b, 37, 8, 850);
    			attr_dev(div0, "class", "text-right svelte-ja5frq");
    			add_location(div0, file$b, 36, 6, 817);
    			add_location(th0, file$b, 43, 14, 1045);
    			add_location(th1, file$b, 44, 14, 1072);
    			add_location(th2, file$b, 45, 14, 1098);
    			add_location(th3, file$b, 46, 14, 1126);
    			add_location(th4, file$b, 47, 14, 1156);
    			add_location(th5, file$b, 48, 14, 1189);
    			add_location(tr, file$b, 42, 12, 1026);
    			add_location(thead, file$b, 41, 10, 1006);
    			add_location(tbody, file$b, 51, 10, 1256);
    			attr_dev(table, "class", "table table-striped table-hover svelte-ja5frq");
    			add_location(table, file$b, 40, 8, 948);
    			add_location(div1, file$b, 39, 6, 934);
    			attr_dev(div2, "class", "w675px svelte-ja5frq");
    			add_location(div2, file$b, 35, 4, 790);
    			attr_dev(div3, "class", "box svelte-ja5frq");
    			add_location(div3, file$b, 34, 2, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, input);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t2);
    			append_dev(tr, th1);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    			append_dev(tr, t10);
    			append_dev(tr, th5);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, moment*/ 1) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(34:23)    <div class=\\\"box\\\">     <div class=\\\"w675px\\\">       <div class=\\\"text-right\\\">         <input type=\\\"button\\\" value=\\\"N E W\\\" on:click={() => newitem()}",
    		ctx
    	});

    	return block;
    }

    // (53:12) {#each data as item}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let input;
    	let t0;
    	let td1;
    	let t1_value = /*item*/ ctx[5].id + "";
    	let t1;
    	let t2;
    	let td2;
    	let t3_value = /*item*/ ctx[5].name + "";
    	let t3;
    	let t4;
    	let td3;
    	let t5_value = /*item*/ ctx[5].domain + "";
    	let t5;
    	let t6;
    	let td4;
    	let t7_value = /*item*/ ctx[5].boardpath + "";
    	let t7;
    	let t8;
    	let td5;

    	let t9_value = (/*item*/ ctx[5].createdate
    	? moment(/*item*/ ctx[5].createdate).format("YYYY-MM-DD HH:mm:ss")
    	: "createdate") + "";

    	let t9;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			input = element("input");
    			t0 = space();
    			td1 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td5 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$b, 54, 20, 1336);
    			add_location(td0, file$b, 54, 16, 1332);
    			add_location(td1, file$b, 55, 16, 1383);
    			add_location(td2, file$b, 56, 16, 1418);
    			add_location(td3, file$b, 57, 16, 1455);
    			add_location(td4, file$b, 58, 16, 1494);
    			add_location(td5, file$b, 59, 16, 1536);
    			add_location(tr, file$b, 53, 14, 1311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, input);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td5);
    			append_dev(td5, t9);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t1_value !== (t1_value = /*item*/ ctx[5].id + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*data*/ 1 && t3_value !== (t3_value = /*item*/ ctx[5].name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*data*/ 1 && t5_value !== (t5_value = /*item*/ ctx[5].domain + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*data*/ 1 && t7_value !== (t7_value = /*item*/ ctx[5].boardpath + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*data*/ 1 && t9_value !== (t9_value = (/*item*/ ctx[5].createdate
    			? moment(/*item*/ ctx[5].createdate).format("YYYY-MM-DD HH:mm:ss")
    			: "createdate") + "")) set_data_dev(t9, t9_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(53:12) {#each data as item}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import axios from "axios";   import moment from "moment/min/moment-with-locales";    import { serverhost }
    function create_pending_block$1(ctx) {
    	const block = { c: noop$1, m: noop$1, p: noop$1, d: noop$1 };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(1:0) <script>   import axios from \\\"axios\\\";   import moment from \\\"moment/min/moment-with-locales\\\";    import { serverhost }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 0
    	};

    	handle_promise(promise = /*data*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*data*/ 1 && promise !== (promise = /*data*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sitelist', slots, []);
    	moment.locale("ko");
    	let size = 100;
    	let page = 0;

    	const newitem = () => {
    		const windowWidth = 500;
    		const windowHeight = 500;
    		window.open("/#/admin/sitelist/new", "newsite", "width=" + windowWidth + ",height=" + windowHeight + ",top=" + (screen.availHeight - windowHeight) / 2 + ",left=" + (screen.availWidth - windowWidth) / 2);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sitelist> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => newitem();

    	$$self.$capture_state = () => ({
    		axios: axios$1,
    		moment,
    		serverhost,
    		size,
    		page,
    		newitem,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('page' in $$props) $$invalidate(4, page = $$props.page);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, data = axios$1({
    		method: "get",
    		url: serverhost + "/api/sitelist/list",
    		params: { size, page }
    	}).then(res => res.data));

    	return [data, newitem, click_handler];
    }

    class Sitelist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sitelist",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/routes/menu/Submenuitem.svelte generated by Svelte v3.55.1 */

    const file$a = "src/routes/menu/Submenuitem.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(/*name*/ ctx[0]);
    			attr_dev(a, "href", /*link*/ ctx[1]);
    			attr_dev(a, "class", "svelte-1o3o6ud");
    			add_location(a, file$a, 5, 22, 80);
    			attr_dev(div, "class", "menuitem svelte-1o3o6ud");
    			add_location(div, file$a, 5, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);

    			if (dirty & /*link*/ 2) {
    				attr_dev(a, "href", /*link*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Submenuitem', slots, []);
    	let { name } = $$props;
    	let { link } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Submenuitem> was created without expected prop 'name'");
    		}

    		if (link === undefined && !('link' in $$props || $$self.$$.bound[$$self.$$.props['link']])) {
    			console.warn("<Submenuitem> was created without expected prop 'link'");
    		}
    	});

    	const writable_props = ['name', 'link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Submenuitem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({ name, link });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, link];
    }

    class Submenuitem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { name: 0, link: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Submenuitem",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get name() {
    		throw new Error("<Submenuitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Submenuitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<Submenuitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Submenuitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/menu/Submenu.svelte generated by Svelte v3.55.1 */
    const file$9 = "src/routes/menu/Submenu.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:4) {#each menulist as menu}
    function create_each_block$5(ctx) {
    	let submenuitem;
    	let current;

    	submenuitem = new Submenuitem({
    			props: {
    				name: /*menu*/ ctx[1].name,
    				link: /*menu*/ ctx[1].link
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(submenuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(submenuitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const submenuitem_changes = {};
    			if (dirty & /*menulist*/ 1) submenuitem_changes.name = /*menu*/ ctx[1].name;
    			if (dirty & /*menulist*/ 1) submenuitem_changes.link = /*menu*/ ctx[1].link;
    			submenuitem.$set(submenuitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(submenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(submenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(submenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(9:4) {#each menulist as menu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let each_value = /*menulist*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "menu svelte-10pot8r");
    			add_location(div0, file$9, 7, 2, 117);
    			attr_dev(div1, "class", "w675px svelte-10pot8r");
    			add_location(div1, file$9, 6, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menulist*/ 1) {
    				each_value = /*menulist*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Submenu', slots, []);
    	let { menulist } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (menulist === undefined && !('menulist' in $$props || $$self.$$.bound[$$self.$$.props['menulist']])) {
    			console.warn("<Submenu> was created without expected prop 'menulist'");
    		}
    	});

    	const writable_props = ['menulist'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Submenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menulist' in $$props) $$invalidate(0, menulist = $$props.menulist);
    	};

    	$$self.$capture_state = () => ({ Submenuitem, menulist });

    	$$self.$inject_state = $$props => {
    		if ('menulist' in $$props) $$invalidate(0, menulist = $$props.menulist);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menulist];
    }

    class Submenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { menulist: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Submenu",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get menulist() {
    		throw new Error("<Submenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menulist(value) {
    		throw new Error("<Submenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/admin/sitelist/Newsitelist.svelte generated by Svelte v3.55.1 */
    const file$8 = "src/routes/admin/sitelist/Newsitelist.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (44:6) {#each items as item}
    function create_each_block$4(ctx) {
    	let div;
    	let label;
    	let t0_value = /*item*/ ctx[5].toUpperCase() + "";
    	let t0;
    	let t1;
    	let input;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "class", "inputlabel svelte-qigm4n");
    			add_location(label, file$8, 45, 10, 1065);
    			attr_dev(input, "id", /*item*/ ctx[5]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-qigm4n");
    			add_location(input, file$8, 46, 10, 1130);
    			attr_dev(div, "class", "d-flex justify-content-center mb-3");
    			add_location(div, file$8, 44, 8, 1006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);
    			append_dev(div, input);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(44:6) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let form;
    	let t2;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "New Site";
    			t1 = space();
    			form = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Register";
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$8, 35, 6, 826);
    			attr_dev(div0, "class", "mb-5");
    			add_location(div0, file$8, 34, 4, 801);
    			attr_dev(button, "class", "svelte-qigm4n");
    			add_location(button, file$8, 50, 8, 1254);
    			attr_dev(div1, "class", "d-flex justify-content-center mt-5");
    			add_location(div1, file$8, 49, 6, 1197);
    			add_location(form, file$8, 37, 4, 879);
    			attr_dev(div2, "class", "m-4");
    			add_location(div2, file$8, 33, 2, 779);
    			add_location(div3, file$8, 32, 0, 771);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div2, t1);
    			append_dev(div2, form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*submit_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(form, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $issubmenu;
    	let $ismainmenu;
    	validate_store(issubmenu, 'issubmenu');
    	component_subscribe($$self, issubmenu, $$value => $$invalidate(3, $issubmenu = $$value));
    	validate_store(ismainmenu, 'ismainmenu');
    	component_subscribe($$self, ismainmenu, $$value => $$invalidate(4, $ismainmenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Newsitelist', slots, []);
    	const items = ["site", "domain", "path", "memo"];

    	onMount(() => {
    		set_store_value(ismainmenu, $ismainmenu = false, $ismainmenu);
    		set_store_value(issubmenu, $issubmenu = false, $issubmenu);
    		isLogincookie();
    	});

    	const newsite = async e => {
    		let data = {
    			id: 1,
    			name: e.target.site.value,
    			domain: e.target.domain.value,
    			boardpath: e.target.path.value,
    			createdate: new Date(),
    			memo: e.target.memo.value
    		};

    		let url = serverhost + "/api/sitelist/list/new";

    		await axios$1({
    			method: "post",
    			url,
    			data: JSON.stringify(data),
    			headers: { "Content-Type": "application/json" }
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Newsitelist> was created with unknown prop '${key}'`);
    	});

    	const submit_handler = e => {
    		window.close();
    		newsite(e);
    	};

    	$$self.$capture_state = () => ({
    		axios: axios$1,
    		onMount,
    		ismainmenu,
    		issubmenu,
    		serverhost,
    		isLogincookie,
    		items,
    		newsite,
    		$issubmenu,
    		$ismainmenu
    	});

    	return [items, newsite, submit_handler];
    }

    class Newsitelist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Newsitelist",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/routes/admin/Admin.svelte generated by Svelte v3.55.1 */
    const file$7 = "src/routes/admin/Admin.svelte";

    // (30:2) {#if $issubmenu}
    function create_if_block$2(ctx) {
    	let div;
    	let submenu;
    	let current;

    	submenu = new Submenu({
    			props: { menulist: /*menulist*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(submenu.$$.fragment);
    			attr_dev(div, "class", "menu svelte-klh1e");
    			add_location(div, file$7, 30, 4, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(submenu, div, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(submenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(submenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(submenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(30:2) {#if $issubmenu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let routes_1;
    	let current;
    	let if_block = /*$issubmenu*/ ctx[0] && create_if_block$2(ctx);

    	routes_1 = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			create_component(routes_1.$$.fragment);
    			add_location(div0, file$7, 35, 2, 871);
    			add_location(div1, file$7, 28, 0, 772);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(routes_1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$issubmenu*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$issubmenu*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(routes_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(routes_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(routes_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $issubmenu;
    	validate_store(issubmenu, 'issubmenu');
    	component_subscribe($$self, issubmenu, $$value => $$invalidate(0, $issubmenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Admin', slots, []);

    	onMount(() => {
    		isLogincookie();
    	});

    	const routes = {
    		"/admin/sitelist": Sitelist,
    		"/admin/sitelist/new": Newsitelist,
    		"/admin": Sitelist
    	};

    	const menulist = [
    		{
    			name: "SITELIST",
    			link: "#/admin/sitelist"
    		},
    		{
    			name: "SITELIST",
    			link: "#/admin/sitelist"
    		},
    		{
    			name: "SITELIST",
    			link: "#/admin/sitelist"
    		},
    		{
    			name: "SITELIST",
    			link: "#/admin/sitelist"
    		},
    		{
    			name: "SITELIST",
    			link: "#/admin/sitelist"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Admin> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Sitelist,
    		Routes: Router,
    		Submenu,
    		Newsitelist,
    		issubmenu,
    		isLogincookie,
    		onMount,
    		routes,
    		menulist,
    		$issubmenu
    	});

    	return [$issubmenu, routes, menulist];
    }

    class Admin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Admin",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/routes/main/Mainitem.svelte generated by Svelte v3.55.1 */
    const file$6 = "src/routes/main/Mainitem.svelte";

    function create_fragment$6(ctx) {
    	let table;
    	let tr;
    	let td0;
    	let img;
    	let img_src_value;
    	let t0;
    	let td1;
    	let div0;
    	let span0;
    	let t1_value = /*item*/ ctx[0].sitename + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3;
    	let div1;
    	let a;
    	let span1;
    	let t4_value = /*item*/ ctx[0].boardtitle + "";
    	let t4;
    	let a_href_value;
    	let t5;
    	let p1;
    	let t6;
    	let div2;
    	let span2;
    	let t7;
    	let t8_value = moment(/*item*/ ctx[0].createdate).format("YYYY-MM-DD HH:mm:ss") + "";
    	let t8;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			img = element("img");
    			t0 = space();
    			td1 = element("td");
    			div0 = element("div");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = space();
    			div1 = element("div");
    			a = element("a");
    			span1 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			p1 = element("p");
    			t6 = space();
    			div2 = element("div");
    			span2 = element("span");
    			t7 = text("생성날자 : ");
    			t8 = text(t8_value);
    			attr_dev(img, "referrerpolicy", "no-referrer");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[0].boardthumnail)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "onerror", "this.src='./images/notimg.png';");
    			attr_dev(img, "class", "svelte-1ezhixw");
    			add_location(img, file$6, 10, 7, 241);
    			attr_dev(td0, "class", "thumnail svelte-1ezhixw");
    			add_location(td0, file$6, 9, 4, 213);
    			attr_dev(span0, "class", "label svelte-1ezhixw");
    			add_location(span0, file$6, 13, 11, 391);
    			add_location(div0, file$6, 13, 6, 386);
    			add_location(p0, file$6, 14, 6, 448);
    			attr_dev(span1, "class", "title svelte-1ezhixw");
    			add_location(span1, file$6, 15, 60, 514);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[0].sitedomain + /*item*/ ctx[0].boarddetailpath);
    			attr_dev(a, "class", "svelte-1ezhixw");
    			add_location(a, file$6, 15, 11, 465);
    			add_location(div1, file$6, 15, 6, 460);
    			add_location(p1, file$6, 16, 6, 575);
    			attr_dev(span2, "class", "date svelte-1ezhixw");
    			add_location(span2, file$6, 18, 8, 601);
    			add_location(div2, file$6, 17, 6, 587);
    			attr_dev(td1, "class", "context svelte-1ezhixw");
    			add_location(td1, file$6, 12, 4, 359);
    			attr_dev(tr, "class", "svelte-1ezhixw");
    			add_location(tr, file$6, 8, 2, 204);
    			attr_dev(table, "class", "svelte-1ezhixw");
    			add_location(table, file$6, 7, 0, 194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, img);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(td1, t2);
    			append_dev(td1, p0);
    			append_dev(td1, t3);
    			append_dev(td1, div1);
    			append_dev(div1, a);
    			append_dev(a, span1);
    			append_dev(span1, t4);
    			append_dev(td1, t5);
    			append_dev(td1, p1);
    			append_dev(td1, t6);
    			append_dev(td1, div2);
    			append_dev(div2, span2);
    			append_dev(span2, t7);
    			append_dev(span2, t8);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[0].boardthumnail)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && t1_value !== (t1_value = /*item*/ ctx[0].sitename + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*item*/ 1 && t4_value !== (t4_value = /*item*/ ctx[0].boardtitle + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*item*/ 1 && a_href_value !== (a_href_value = /*item*/ ctx[0].sitedomain + /*item*/ ctx[0].boarddetailpath)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*item*/ 1 && t8_value !== (t8_value = moment(/*item*/ ctx[0].createdate).format("YYYY-MM-DD HH:mm:ss") + "")) set_data_dev(t8, t8_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mainitem', slots, []);
    	let { item } = $$props;
    	moment.locale("ko");
    	item.createdate[1] = item.createdate[1] - 1; //날짜 한달 차이  api서버 자바스크립 차이 교정

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console.warn("<Mainitem> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mainitem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ item, moment });

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item];
    }

    class Mainitem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mainitem",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get item() {
    		throw new Error("<Mainitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Mainitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/main/Main.svelte generated by Svelte v3.55.1 */
    const file$5 = "src/routes/main/Main.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import Mainitem from "./Mainitem.svelte";   import axios from "axios";   import { serverhost, isLogincookie }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop$1,
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import Mainitem from \\\"./Mainitem.svelte\\\";   import axios from \\\"axios\\\";   import { serverhost, isLogincookie }",
    		ctx
    	});

    	return block;
    }

    // (18:0) {:then data}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*data*/ ctx[0].data;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0].data;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(18:0) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (19:2) {#each data.data as item}
    function create_each_block$3(ctx) {
    	let div1;
    	let div0;
    	let mainitem;
    	let t;
    	let current;

    	mainitem = new Mainitem({
    			props: { item: /*item*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(mainitem.$$.fragment);
    			t = space();
    			add_location(div0, file$5, 20, 6, 498);
    			attr_dev(div1, "class", "box svelte-1ngfda4");
    			add_location(div1, file$5, 19, 4, 474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(mainitem, div0, null);
    			append_dev(div1, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mainitem_changes = {};
    			if (dirty & /*data*/ 1) mainitem_changes.item = /*item*/ ctx[4];
    			mainitem.$set(mainitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(mainitem);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(19:2) {#each data.data as item}",
    		ctx
    	});

    	return block;
    }

    // (16:13)    <div>Loding</div> {:then data}
    function create_pending_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loding";
    			add_location(div, file$5, 16, 2, 411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(16:13)    <div>Loding</div> {:then data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*data*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*data*/ 1 && promise !== (promise = /*data*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let size;
    	let page;
    	let api;
    	let data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);

    	onMount(() => {
    		isLogincookie();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Mainitem,
    		axios: axios$1,
    		serverhost,
    		isLogincookie,
    		onMount,
    		page,
    		size,
    		api,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(1, page = $$props.page);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('api' in $$props) $$invalidate(3, api = $$props.api);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*api, size, page*/ 14) {
    			$$invalidate(0, data = axios$1({
    				method: "get",
    				url: api,
    				params: { size, page }
    			}));
    		}
    	};

    	$$invalidate(2, size = 200);
    	$$invalidate(1, page = 0);
    	$$invalidate(3, api = serverhost + "/api/alttuel/list");
    	return [data, page, size, api];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/routes/menu/Mainmenuitem.svelte generated by Svelte v3.55.1 */

    const file$4 = "src/routes/menu/Mainmenuitem.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(/*name*/ ctx[0]);
    			attr_dev(a, "href", /*link*/ ctx[1]);
    			attr_dev(a, "class", "svelte-1jvkeru");
    			add_location(a, file$4, 5, 22, 80);
    			attr_dev(div, "class", "menuitem svelte-1jvkeru");
    			add_location(div, file$4, 5, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);

    			if (dirty & /*link*/ 2) {
    				attr_dev(a, "href", /*link*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mainmenuitem', slots, []);
    	let { name } = $$props;
    	let { link } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Mainmenuitem> was created without expected prop 'name'");
    		}

    		if (link === undefined && !('link' in $$props || $$self.$$.bound[$$self.$$.props['link']])) {
    			console.warn("<Mainmenuitem> was created without expected prop 'link'");
    		}
    	});

    	const writable_props = ['name', 'link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mainmenuitem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({ name, link });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, link];
    }

    class Mainmenuitem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, link: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mainmenuitem",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get name() {
    		throw new Error("<Mainmenuitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Mainmenuitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<Mainmenuitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Mainmenuitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/menu/Mainmenu.svelte generated by Svelte v3.55.1 */
    const file$3 = "src/routes/menu/Mainmenu.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (18:4) {#each menulist as menu}
    function create_each_block$2(ctx) {
    	let mainmenuitem;
    	let current;

    	mainmenuitem = new Mainmenuitem({
    			props: {
    				name: /*menu*/ ctx[3].name,
    				link: /*menu*/ ctx[3].link
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainmenuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenuitem, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:4) {#each menulist as menu}",
    		ctx
    	});

    	return block;
    }

    // (30:4) {:else}
    function create_else_block(ctx) {
    	let mainmenuitem0;
    	let t;
    	let mainmenuitem1;
    	let current;

    	mainmenuitem0 = new Mainmenuitem({
    			props: { name: "LOGIN", link: "#/account/signin" },
    			$$inline: true
    		});

    	mainmenuitem1 = new Mainmenuitem({
    			props: { name: "SIGNUP", link: "#/account/signUp" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainmenuitem0.$$.fragment);
    			t = space();
    			create_component(mainmenuitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenuitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(mainmenuitem1, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenuitem0.$$.fragment, local);
    			transition_in(mainmenuitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenuitem0.$$.fragment, local);
    			transition_out(mainmenuitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenuitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(mainmenuitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(30:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if $isLogin === true}
    function create_if_block$1(ctx) {
    	let mainmenuitem0;
    	let t;
    	let div;
    	let mainmenuitem1;
    	let current;
    	let mounted;
    	let dispose;

    	mainmenuitem0 = new Mainmenuitem({
    			props: { name: "ADMIN", link: "#/admin" },
    			$$inline: true
    		});

    	mainmenuitem1 = new Mainmenuitem({
    			props: { name: "LOGOUT", link: "#/" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainmenuitem0.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(mainmenuitem1.$$.fragment);
    			add_location(div, file$3, 22, 6, 575);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenuitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(mainmenuitem1, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", prevent_default(/*click_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenuitem0.$$.fragment, local);
    			transition_in(mainmenuitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenuitem0.$$.fragment, local);
    			transition_out(mainmenuitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenuitem0, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_component(mainmenuitem1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(21:4) {#if $isLogin === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*menulist*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isLogin*/ ctx[0] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if_block.c();
    			t1 = space();
    			div0 = element("div");
    			add_location(div0, file$3, 33, 4, 869);
    			attr_dev(div1, "class", "menu svelte-1bdbclv");
    			add_location(div1, file$3, 16, 2, 373);
    			attr_dev(div2, "class", "w650px svelte-1bdbclv");
    			add_location(div2, file$3, 15, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menulist*/ 2) {
    				each_value = /*menulist*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $isLogin;
    	validate_store(isLogin, 'isLogin');
    	component_subscribe($$self, isLogin, $$value => $$invalidate(0, $isLogin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mainmenu', slots, []);

    	onMount(() => {
    		isLogincookie();
    	});

    	const menulist = [
    		{ name: "MAIN", link: "#/" },
    		{ name: "TEST", link: "link" },
    		{ name: "TEST", link: "link" }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mainmenu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		logOut();
    	};

    	$$self.$capture_state = () => ({
    		Mainmenuitem,
    		isLogincookie,
    		logOut,
    		isLogin,
    		onMount,
    		menulist,
    		$isLogin
    	});

    	return [$isLogin, menulist, click_handler];
    }

    class Mainmenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mainmenu",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/routes/account/Signup.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file$2 = "src/routes/account/Signup.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (41:6) {#each items as item}
    function create_each_block$1(ctx) {
    	let div;
    	let label;
    	let t0_value = /*item*/ ctx[3].toUpperCase() + "";
    	let t0;
    	let t1;
    	let input;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "class", "inputlabel svelte-xgeg0c");
    			add_location(label, file$2, 42, 10, 1203);
    			attr_dev(input, "id", /*item*/ ctx[3]);

    			attr_dev(input, "type", /*item*/ ctx[3] === "pwd1" || /*item*/ ctx[3] === "pwd2"
    			? "password"
    			: "text");

    			attr_dev(input, "class", "svelte-xgeg0c");
    			add_location(input, file$2, 43, 10, 1268);
    			attr_dev(div, "class", "d-flex justify-content-center mb-3");
    			add_location(div, file$2, 41, 8, 1144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);
    			append_dev(div, input);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(41:6) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div2;
    	let form;
    	let div0;
    	let h1;
    	let t1;
    	let t2;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			form = element("form");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "- SIGN UP -";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "SignUp";
    			attr_dev(h1, "class", "letterspacing-03em svelte-xgeg0c");
    			add_location(h1, file$2, 38, 8, 1047);
    			attr_dev(div0, "class", "d-flex justify-content-center mb-5");
    			add_location(div0, file$2, 37, 6, 990);
    			attr_dev(button, "class", "svelte-xgeg0c");
    			add_location(button, file$2, 47, 8, 1444);
    			attr_dev(div1, "class", "d-flex justify-content-center mt-5");
    			add_location(div1, file$2, 46, 6, 1387);
    			attr_dev(form, "action", "submit");
    			add_location(form, file$2, 36, 4, 913);
    			attr_dev(div2, "class", "w800px svelte-xgeg0c");
    			add_location(div2, file$2, 35, 2, 888);
    			attr_dev(div3, "class", "main svelte-xgeg0c");
    			add_location(div3, file$2, 34, 0, 867);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, form);
    			append_dev(form, div0);
    			append_dev(div0, h1);
    			append_dev(form, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(form, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	const items = ["id", "email", "pwd1", "pwd2"];

    	const newaccount = async e => {
    		let pwd1 = e.target.pwd1.value;
    		let pwd2 = e.target.pwd2.value;

    		if (pwd1 === pwd2) {
    			let url = serverhost + "/api/user/new";

    			let data = {
    				id: 0,
    				userid: e.target.id.value,
    				userpassword: pwd1,
    				useremail: e.target.email.value,
    				authority: 9
    			};

    			let res = await axios$1({
    				method: "post",
    				url,
    				data,
    				withCredentials: true
    			});

    			console.log(res);
    			isLogin.set(true);
    			location.href = "#/";
    		} else {
    			alert("비밀번호가 일치 하지않습니다.");
    			document.getElementById("pwd1").value = "";
    			document.getElementById("pwd2").value = "";
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	const submit_handler = e => newaccount(e);

    	$$self.$capture_state = () => ({
    		axios: axios$1,
    		serverhost,
    		isLogin,
    		items,
    		newaccount
    	});

    	return [items, newaccount, submit_handler];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/routes/account/SignIn.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/routes/account/SignIn.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (33:6) {#each items as item}
    function create_each_block(ctx) {
    	let div;
    	let label;
    	let t0_value = /*item*/ ctx[3].toUpperCase() + "";
    	let t0;
    	let t1;
    	let input;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "class", "inputlabel svelte-19ekewa");
    			add_location(label, file$1, 34, 10, 969);
    			attr_dev(input, "id", /*item*/ ctx[3]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-19ekewa");
    			add_location(input, file$1, 35, 10, 1034);
    			attr_dev(div, "class", "d-flex justify-content-center mb-3");
    			add_location(div, file$1, 33, 8, 910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);
    			append_dev(div, input);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(33:6) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let form;
    	let div0;
    	let h1;
    	let t1;
    	let t2;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			form = element("form");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "- SIGN UP -";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "SignUp";
    			attr_dev(h1, "class", "letterspacing-03em svelte-19ekewa");
    			add_location(h1, file$1, 30, 8, 813);
    			attr_dev(div0, "class", "d-flex justify-content-center mb-5");
    			add_location(div0, file$1, 29, 6, 756);
    			attr_dev(button, "class", "svelte-19ekewa");
    			add_location(button, file$1, 39, 8, 1158);
    			attr_dev(div1, "class", "d-flex justify-content-center mt-5");
    			add_location(div1, file$1, 38, 6, 1101);
    			attr_dev(form, "action", "submit");
    			add_location(form, file$1, 28, 4, 684);
    			attr_dev(div2, "class", "w800px svelte-19ekewa");
    			add_location(div2, file$1, 27, 2, 659);
    			attr_dev(div3, "class", "main svelte-19ekewa");
    			add_location(div3, file$1, 26, 0, 638);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, form);
    			append_dev(form, div0);
    			append_dev(div0, h1);
    			append_dev(form, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(form, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SignIn', slots, []);
    	const items = ["id", "pwd1"];

    	const login = async e => {
    		let userid = e.target.id.value;
    		let userpassword = e.target.pwd1.value;
    		let url = serverhost + "/api/user/login";

    		let data = await axios$1({
    			method: "post",
    			url,
    			params: { userid, userpassword },
    			withCredentials: true
    		});

    		if (data.data) {
    			localStorage.setItem("login", "true");
    			location.href = "/";
    		} else {
    			alert("계정 및 비밀번호가 맞지 않습니다");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SignIn> was created with unknown prop '${key}'`);
    	});

    	const submit_handler = e => login(e);
    	$$self.$capture_state = () => ({ axios: axios$1, onMount, serverhost, items, login });
    	return [items, login, submit_handler];
    }

    class SignIn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SignIn",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */
    const file = "src/App.svelte";

    // (22:2) {#if $ismainmenu}
    function create_if_block(ctx) {
    	let div;
    	let mainmenu;
    	let current;
    	mainmenu = new Mainmenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(mainmenu.$$.fragment);
    			attr_dev(div, "class", "box menu svelte-124g5r8");
    			add_location(div, file, 22, 4, 624);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(mainmenu, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(mainmenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:2) {#if $ismainmenu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let routes_1;
    	let current;
    	let if_block = /*$ismainmenu*/ ctx[0] && create_if_block(ctx);

    	routes_1 = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			create_component(routes_1.$$.fragment);
    			add_location(div0, file, 26, 2, 687);
    			add_location(div1, file, 20, 0, 594);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(routes_1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$ismainmenu*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*$ismainmenu*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(routes_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(routes_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(routes_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $ismainmenu;
    	validate_store(ismainmenu, 'ismainmenu');
    	component_subscribe($$self, ismainmenu, $$value => $$invalidate(0, $ismainmenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		"/": Main,
    		"/admin": Admin,
    		"/admin/:": Admin,
    		"/admin/sitelist/:": Admin,
    		"/account/signup": Signup,
    		"/account/signin": SignIn
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Routes: Router,
    		Admin,
    		Main,
    		Mainmenu,
    		Signup,
    		SignIn,
    		ismainmenu,
    		routes,
    		$ismainmenu
    	});

    	return [$ismainmenu, routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
