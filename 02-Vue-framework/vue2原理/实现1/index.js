class MVVM {
    constructor(options) {
        // 一上来 先把可用的东西挂载在实例上
        console.log('先把可用的东西挂载在实例上', options.data)
        this.$el = options.el;
        this.$data = options.data;
        console.log(this.$data)
        // 如果有要编译的模板我就开始编译
        if (this.$el) {
            // 用数据和元素进行编译
            new Compile(this.$el, this);
            // 将数据代理到实例上直接操作实例即可，不需要通过vm.$data来进行操作
            this.proxyData(this.$data);

            // 数据劫持 就是把对想的所有属性 改成get和set方法
            new Observer(this.$data);
        }
    }
    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newValue) {
                    data[key] = newValue
                }
            })
        })
    }
}