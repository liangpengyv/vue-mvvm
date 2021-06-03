function MyVue(options) {
    this.$el = document.querySelector(options.el)
    this.$data = options.data

    this.init()
}

MyVue.prototype = {
    init() {
        this.proxyData(this)
        observe(this.$data)
        new Compile(this)
    },
    proxyData(vm) {
        Object.keys(vm.$data).forEach(key => {
            Object.defineProperty(vm, key, {
                get: function proxyGetter() {
                    return vm.$data[key]
                },
                set: function proxySetter(value) {
                    vm.$data[key] = value
                }
            })
        })
    }
}