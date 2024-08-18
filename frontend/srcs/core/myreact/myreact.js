
import debounceFrame from "./debounceFrame.js";

function MyReact () {
    const options = {
        currentStateKey : 0,
        renderCount: 0,
        states : {},
        effects : {},
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
            if (Object.is(options.states[stateKey], newState)) {
                return;
            }
            options.states[stateKey] = newState;
            _render();
        };
        return [state, setState];
    }
    // function useState (initState) {
    //     const {currentStateKey : key, states} = options;
    //     if (states.length === key) states.push(initState);
    //     const state = states[key];
    //     const setState = (newState) => {
    //         if (Object.is(states[key], newState)) {
    //             return ;
    //         }
    //         states[key] = newState;
    //         console.log(states);
    //         _render();
    //     }
    //     options.currentStateKey += 1;
    //     return [state, setState];
    // }
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

            const newcleanup = callback();
            effects[stateKey] = {
                cleanup : typeof newcleanup === 'function' ? newcleanup : null,
                deps : dependencies,
            }
            states[stateKey] = dependencies;
        }
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
        options.effects = [];
    });
    function render (root, rootComponent) {
        options.root = root ;
        options.rootComponent = rootComponent;
        options.currentStateKey = 0;
        _render();
    }
  
    return { useState, useEffect, render , _render };
}
  
 export const { useState, useEffect , render, _render } = MyReact();