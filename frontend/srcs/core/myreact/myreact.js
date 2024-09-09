
import debounceFrame from "./debounceFrame.js";

function MyReact () {
    const options = {
        currentStateKey : 0,
        renderCount: 0,
        states : {},
        effects : {},
        callbacks: {},
        refs : {},
        root : null,
        rootComponent : null
    }

    function useState(initState, key = null) {
        const stateKey = key || options.currentStateKey++;
        if (!(stateKey in options.states)) {
            options.states[stateKey] = initState;
        }
        const state = options.states[stateKey];
        const setState = (newState) => {
            const nextState = typeof newState === 'function'
            ? newState(options.states[stateKey])
            : newState;
            if (Object.is(options.states[stateKey], nextState)) {
                return;
            }
            options.states[stateKey] = nextState;
            _render();
        };
        return [state, setState];
    }
    function useEffect (callback, dependencies , key = null) {
        const { states, effects} = options;
        const stateKey = key || options.currentStateKey++;
        const oldDependencies = states[stateKey];

        let isChanged = true;
        if (oldDependencies && dependencies) {
            isChanged = dependencies.some(
                (dep, i) => !Object.is(dep, oldDependencies[i])
            );
        }
        if (isChanged) {
            if (effects[stateKey]?.cleanup) {
                effects[stateKey].cleanup();
            }

            const newcleanup = callback;
            effects[stateKey] = {
                cleanup : typeof newcleanup === 'function' ? newcleanup : null,
                deps : dependencies,
            }
            states[stateKey] = dependencies;
        }
    }
    function useRef(initialValue = null, key = null) {
        const stateKey = key || options.currentStateKey++;
        if (!(stateKey in options.refs)) {
            options.refs[stateKey] = { current: initialValue };
        }
        return options.refs[stateKey];
    }
    function useCallback(callback, dependencies, key = null) {
        const stateKey = key || options.currentStateKey++;
        const oldDependencies = options.states[stateKey];
        const hasChanged = !oldDependencies || dependencies.some(
            (dep, i) => !Object.is(dep, oldDependencies[i])
        );
        if (hasChanged) {
            options.callbacks[stateKey] = callback;
            options.states[stateKey] = dependencies;
        }

        return options.callbacks[stateKey];
    }
    const _render = debounceFrame(()=>{
        const {root, rootComponent, effects} = options;
        if (!root || !rootComponent) return ;
        root.innerHTML = rootComponent();
        options.currentStateKey = 0;
        options.renderCount+=1;

        for (let key in effects){
            effects[key].cleanup?.();
        }
        options.effects = {};
        options.callbacks = {};
    });
    function render (root, rootComponent) {
        options.root = root ;
        options.rootComponent = rootComponent;
        options.currentStateKey = 0;
        _render();
    }
  
    return { useState, useEffect, render , _render, useCallback ,useRef };
}
  
 export const { useState, useEffect , render, _render, useCallback ,useRef } = MyReact();