// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  'ecmaFeatures': {
    // lambda表达式
    'arrowFunctions': true,
    // 解构赋值
    'destructuring': true,
    // class
    'classes': true,
    // http://es6.ruanyifeng.com/#docs/function#函数参数的默认值
    'defaultParams': true,
    // 块级作用域，允许使用let const
    'blockBindings': true,
    // 允许使用模块，模块内默认严格模式
    'modules': true,
    // 允许字面量定义对象时，用表达式做属性名
    // http://es6.ruanyifeng.com/#docs/object#属性名表达式
    'objectLiteralComputedProperties': true,
    // 允许对象字面量方法名简写
    /*var o = {
        method() {
          return 'Hello!';
        }
     };

     等同于

     var o = {
       method: function() {
         return 'Hello!';
       }
     };
    */
    'objectLiteralShorthandMethods': true,
    /*
      对象字面量属性名简写
      var foo = 'bar';
      var baz = {foo};
      baz // {foo: 'bar'}

      // 等同于
      var baz = {foo: foo};
    */
    'objectLiteralShorthandProperties': true,
    // http://es6.ruanyifeng.com/#docs/function#rest参数
    'restParams': true,
    // http://es6.ruanyifeng.com/#docs/function#扩展运算符
    'spread': true,
    // http://es6.ruanyifeng.com/#docs/iterator#for---of循环
    'forOf': true,
    // http://es6.ruanyifeng.com/#docs/generator
    'generators': true,
    // http://es6.ruanyifeng.com/#docs/string#模板字符串
    'templateStrings': true,
    'superInFunctions': true,
    // http://es6.ruanyifeng.com/#docs/object#对象的扩展运算符
    'experimentalObjectRestSpread': true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
    'array-bracket-spacing': [2, 'never'],
    // if while function 后面的{必须与if在同一行，java风格。
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
    // 驼峰命名格式
    'camelcase': 2,
    //  行尾不加分号
    'semi': [2, 'never'],
    //函数定义时，function关键字后面的小括号前是否需要加空格
    // 'space-before-function-paren': [2, 'always'],
    //  缩进使用4空格
    'indent': ['error', 4],
    //  使用单引号
    'quotes': [2, 'single', 'avoid-escape'],
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
