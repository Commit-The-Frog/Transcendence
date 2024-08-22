import { Atom } from "./atom.js";
import { useState, useEffect, _render } from "../myreact/myreact.js";
import {Selector} from "./selector.js"

function MyRecoil() {
    const atomRegistry = new Map();

    function atom(config) {
        const {key, default : defaultValue} = config;

        if (atomRegistry.has(key)) {
            throw new Error(`Atom with key "${key}" already exists. `);
        }
        const newAtom = new Atom(config);
        atomRegistry.set(key, newAtom);
        return newAtom;
    }

    function selector(config) {
        const {key, get, set} = config;
        if (atomRegistry.has(key)) {
            throw new Error(`Selector with key "${key}" already exists.`);
        }
        const newSelector = new Selector({key, get, set});
        atomRegistry.set(key, newSelector);
        return newSelector;
    }

    function getRecoilValue(recoilValue) {
        if (recoilValue instanceof Atom) {
            return recoilValue.get();
        } else if (recoilValue instanceof Selector) {
            return recoilValue.evaluate(getRecoilValue);
        } else {
            throw new Error(`Invalid Recoil value`);
        }
    }
    function useRecoilValue(recoilValue, key = null) {
        const [state, setState] = useState(() => getRecoilValue(recoilValue), key);
        
        useEffect(()=>{
            if (recoilValue instanceof Atom) {
                const unsubscribe = recoilValue.subscribe((newValue) => {
                    setState(newValue);
                });
                setState(()=>getRecoilValue(recoilValue));
                return () => unsubscribe();
            } else if (recoilValue instanceof Selector) {
                const unsubscribeFunctions = [];
                recoilValue.dependencies.forEach(dependency => {
                   const depUnsubscribe = recoilValue.subscribe(dependency, getRecoilValue);
                   unsubscribeFunctions.push(depUnsubscribe);
                });
                setState(recoilValue.evaluate(getRecoilValue));
                
                return () => {
                    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
                }
            }
        },[recoilValue],key + 'effects');
    
        return state;
    }
    
    function useSetRecoilState(recoilValue) {
        if (recoilValue instanceof Atom) {
            return (newValue) => {
                recoilValue.set(newValue)
                _render();
            };
        } else if (recoilValue instanceof Selector && typeof recoilValue.set === 'function') {
            return newValue => recoilValue.setValue({set: (atom, value) => atom.set(value), get: getRecoilValue}, newValue);
        } else {
            throw new Error ("useSetRecoilState can only be used with atoms or writable selectors");
        }
    }
    
    function useRecoilState(recoilValue, key = null) {
        const state = useRecoilValue(recoilValue, key);
        const setRecoilState = useSetRecoilState(recoilValue);
        return [state, setRecoilState];
    }
    return {atom, selector, useRecoilState, getRecoilValue, useRecoilValue};
}


export const {atom, selector, useRecoilState, getRecoilValue, useRecoilValue} = MyRecoil();