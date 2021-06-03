function defineReactive(data, key, value) {
    // 递归遍历所有子属性
    observe(value)

    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return value
        },
        set: function reactiveSetter(newValue) {
            if (value === newValue) {
                return
            }
            value = newValue
            dep.notify()
        }
    })
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return
    }
    Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key])
    })
}

function Dep() {
    this.subs = []
}

Dep.prototype = {
    addSub(sub) {
        this.subs.push(sub)
    },
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null