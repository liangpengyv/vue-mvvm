function Compile(vm) {
    this.vm = vm
    this.el = vm.$el
    this.fragment = null

    this.init()
}

Compile.prototype = {
    init() {
        this.fragment = this.nodeToFragment(this.el)
        this.compileNode(this.fragment)
        this.el.appendChild(this.fragment)
    },

    nodeToFragment(el) {
        const fragment = document.createDocumentFragment()
        let child = el.firstChild
        while (child) {
            fragment.appendChild(child)
            child = el.firstChild
        }
        return fragment
    },
    compileNode(fragment) {
        let childNodes = fragment.childNodes
        const childNodesArray = [...childNodes]
        childNodesArray.forEach(node => {

            if (this.isElementNode(node)) {
                this.compile(node)
            }

            let reg = /\{\{(.*)\}\}/
            let text = node.textContent
            if (reg.test(text)) {
                let prop = reg.exec(text)[1]
                this.compileText(node, prop)
            }

            if (node.childNodes && node.childNodes.length) {
                this.compileNode(node)
            }
        })
    },
    compile(node) {
        let nodeAttrs = node.attributes
        const nodeAttrsArray = [...nodeAttrs]
        nodeAttrsArray.forEach(attr => {
            let name = attr.name
            if (this.isDirective(name)) {
                let value = attr.value
                if (name === 'v-model') {
                    this.compileModel(node, value)
                }
            }
        })
    },
    compileModel(node, prop) {
        let val = this.vm.$data[prop]
        this.updateModel(node, val)

        new Watcher(this.vm, prop, value => {
            this.updateModel(node, value)
        })

        node.addEventListener('input', event => {
            let newValue = event.target.value
            if (val === newValue) {
                return
            }
            this.vm.$data[prop] = newValue
        })
    },
    compileText(node, prop) {
        let text = this.vm.$data[prop]
        this.updateView(node, text)

        new Watcher(this.vm, prop, value => {
            this.updateView(node, value)
        })
    },

    updateModel(node, value) {
        node.value = typeof value === 'undefined' ? '' : value
    },
    updateView(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },

    isDirective(attr) {
        return attr.indexOf('v-') !== -1
    },
    isElementNode(node) {
        return node.nodeType === 1
    },
    isTextNode(node) {
        return node.nodeType === 3
    },
}