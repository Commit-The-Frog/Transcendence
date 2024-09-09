class Atom {
    constructor ({key, default : defaultValue}) {
        this.key = key;
        this.default = defaultValue;
        this.value = defaultValue;
        this.subscribers = new Set();
    }
    set (newValue) {
        this.value = newValue;
        this.notify();
    }
    get() {
        return this.value;
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.value));
    }

}
export { Atom };