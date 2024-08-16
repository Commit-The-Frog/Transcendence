class Selector {
    constructor ({key, get, set = null}) {
        this.key = key;
        this.get = get;
        this.set = set;
        this.dependencies = new Set();
    }
    evaluate(getFunction) {
        if (this.cache !== null) {
            return this.cache;
        }
        this.cache = this.get({get : getFunction});
        return this.cache;
    }
    clearCache() {
        this.cache = null;
    }
    setValue ({set, get}, newValue) {
        if (this.set) {
            this.set({set, get}, newValue);
            this.clearCache();
        } else {
            throw new Error(`Selector ${this.key} does not have a set function`);
        }
    }
    subscribe(dependency, getFunction) {
        if (this.dependencies.has(dependency))
            return ;

        this.dependencies.add(dependency);

        dependency.subscribe(()=>{
            this.clearCache();
            this.evaluate(getFunction);
        })

        return () => {
            this.dependencies.delete(dependency);
        }
    }
}

export {Selector};