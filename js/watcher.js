function Watcher(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb

    this.value = this.get()
}

Watcher.prototype = {
    update() {
        const value = this.vm.$data[this.exp]
        const oldValue = this.value
        if (value !== oldValue) {
            this.value = value
            this.cb(value)
        }
    },
    get() {
        Dep.target = this
        const value = this.vm.$data[this.exp]
        Dep.target = null
        return value
    }
}