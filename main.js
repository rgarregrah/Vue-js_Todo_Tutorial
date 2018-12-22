// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = "todos-vuejs-demo";
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach(function(todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

const app = new Vue({
  el: "#app",
  data: {
    todos: [],
    options: [
      { value: -1, label: "すべて" },
      { value: 0, label: "作業中" },
      { value: 1, label: "完了" }
    ],
    current: -1
  },
  methods: {
    // ToDo 追加の処理
    doAdd: function(event, value) {
      // refで名前を付けておいた要素を参照
      var comment = this.$refs.comment;
      //  入力がなければなにもしない
      if (!comment.value.length) {
        return;
      }
      //{ID,コメント,状態}というオブジェクトをtodosリストへpush
      //stateはデフォルト0(=作業中)
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      });
      //フォームを空に
      comment.value = "";
    },
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1;
    },
    doRemove: function(item) {
      var index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    }
  },
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos);
      },
      deep: true
    }
  },
  created() {
    this.todos = todoStorage.fetch();
  },
  computed: {
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label });
      }, {});
    },
    computedTodos: function() {
      return this.todos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state;
      }, this);
    }
  }
});
